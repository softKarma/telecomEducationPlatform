import { SMPPParseResult, PDUField, SMPPHeader } from "@shared/schema";
import { hexToBytes, bytesToHex } from "./pduUtils";

// SMPP command IDs
const COMMAND_IDS: Record<number, string> = {
  0x00000001: "bind_receiver",
  0x00000002: "bind_transmitter", 
  0x00000003: "query_sm",
  0x00000004: "submit_sm",
  0x00000005: "deliver_sm",
  0x00000006: "unbind",
  0x00000007: "replace_sm",
  0x00000008: "cancel_sm",
  0x00000009: "bind_transceiver",
  0x00000015: "enquire_link",
  0x80000001: "bind_receiver_resp",
  0x80000002: "bind_transmitter_resp",
  0x80000003: "query_sm_resp",
  0x80000004: "submit_sm_resp",
  0x80000005: "deliver_sm_resp",
  0x80000006: "unbind_resp",
  0x80000007: "replace_sm_resp",
  0x80000008: "cancel_sm_resp",
  0x80000009: "bind_transceiver_resp",
  0x80000015: "enquire_link_resp"
};

// SMPP command status codes
const COMMAND_STATUS: Record<number, string> = {
  0x00000000: "ESME_ROK (No Error)",
  0x00000001: "ESME_RINVMSGLEN (Message Length is invalid)",
  0x00000002: "ESME_RINVCMDLEN (Command Length is invalid)",
  0x00000003: "ESME_RINVCMDID (Invalid Command ID)",
  0x00000004: "ESME_RINVBNDSTS (Incorrect BIND Status for given command)",
  0x00000005: "ESME_RALYBND (ESME Already in Bound State)",
  0x00000008: "ESME_RSYSERR (System Error)",
  0x0000000A: "ESME_RINVSRCADR (Invalid Source Address)",
  0x0000000B: "ESME_RINVDSTADR (Invalid Destination Address)",
  0x0000000D: "ESME_RINVSYSID (Invalid System ID)",
  0x0000000E: "ESME_RCANCELFAIL (Cancel SM Failed)",
  0x00000011: "ESME_RINVSCHED (Invalid Scheduled Delivery Time)",
  0x00000013: "ESME_RMSGQFUL (Message Queue Full)",
  0x00000069: "ESME_RTHROTTLED (Throttling error)",
  0x000000C3: "ESME_RQUERYFAIL (Query_SM request failed)"
};

// TLV Tag definitions
const TLV_TAGS: Record<number, string> = {
  0x0005: "dest_addr_subunit",
  0x0006: "dest_network_type",
  0x0007: "dest_bearer_type",
  0x0008: "dest_telematics_id",
  0x000D: "source_addr_subunit",
  0x000E: "source_network_type",
  0x000F: "source_bearer_type",
  0x0010: "source_telematics_id",
  0x0017: "qos_time_to_live",
  0x0019: "payload_type",
  0x001D: "receipted_message_id",
  0x001E: "message_payload",
  0x0030: "ms_msg_wait_facilities",
  0x0201: "privacy_indicator",
  0x0202: "source_subaddress",
  0x0203: "dest_subaddress",
  0x0204: "user_message_reference",
  0x0205: "user_response_code",
  0x020A: "source_port",
  0x020B: "destination_port",
  0x020C: "sar_msg_ref_num",
  0x020D: "language_indicator",
  0x020E: "sar_total_segments",
  0x020F: "sar_segment_seqnum",
  0x0210: "sc_interface_version",
  0x0422: "callback_num_pres_ind",
  0x0423: "callback_num_atag",
  0x0424: "number_of_messages",
  0x0425: "callback_num",
  0x0426: "dpf_result",
  0x0427: "set_dpf",
  0x0428: "ms_availability_status",
  0x0429: "network_error_code",
  0x042A: "message_payload",
  0x042B: "delivery_failure_reason",
  0x042C: "more_messages_to_send",
  0x042D: "message_state",
  0x042F: "congestion_state",
  0x0430: "ussd_service_op",
  0x0501: "broadcast_channel_indicator",
  0x0502: "broadcast_content_type",
  0x0503: "broadcast_content_type_info",
  0x0504: "broadcast_message_class",
  0x0505: "broadcast_rep_num",
  0x0506: "broadcast_frequency_interval",
  0x0507: "broadcast_area_identifier",
  0x0508: "broadcast_error_status",
  0x0509: "broadcast_area_success",
  0x050A: "broadcast_end_time",
  0x050B: "broadcast_service_group",
  0x050C: "billing_identification",
  0x050D: "source_network_id",
  0x050E: "dest_network_id",
  0x050F: "source_node_id",
  0x0510: "dest_node_id",
  0x0511: "dest_addr_np_resolution",
  0x0512: "dest_addr_np_information",
  0x0513: "dest_addr_np_country",
  0x0514: "display_time",
  0x0515: "sms_signal",
  0x0516: "ms_validity",
  0x0517: "alert_on_message_delivery",
  0x0518: "its_reply_type",
  0x0519: "its_session_info"
};

// Data coding schemes
const DATA_CODING_SCHEMES: Record<number, string> = {
  0x00: "SMSC Default Alphabet",
  0x01: "IA5 (CCITT T.50)/ASCII (ANSI X3.4)",
  0x02: "Octet unspecified (8-bit binary)",
  0x03: "Latin 1 (ISO-8859-1)",
  0x04: "Octet unspecified (8-bit binary)",
  0x05: "JIS (X 0208-1990)",
  0x06: "Cyrillic (ISO-8859-5)",
  0x07: "Latin/Hebrew (ISO-8859-8)",
  0x08: "UCS2 (ISO/IEC-10646)",
  0x09: "Pictogram Encoding",
  0x0A: "ISO-2022-JP (Music Codes)",
  0x0D: "Extended Kanji JIS (X 0212-1990)",
  0x0E: "KS C 5601",
  0x0F: "GSM MWI control"
};

/**
 * Parses an SMPP PDU
 */
export function parseSMPP(pduString: string): SMPPParseResult {
  // Remove any whitespace
  pduString = pduString.replace(/\s/g, '');
  
  // Convert to bytes array
  const bytes = hexToBytes(pduString);
  
  // Initialize result
  const fields: PDUField[] = [];
  let offset = 0;
  
  // Initial structure breakdown
  const structureBreakdown = {
    bytes: [] as string[],
    descriptions: [] as string[],
    colors: [] as string[],
    tooltips: [] as string[]
  };
  
  // Check if PDU is long enough to contain header (at least 16 bytes)
  if (bytes.length < 16) {
    throw new Error("SMPP PDU too short (minimum 16 bytes for header)");
  }
  
  // Parse command length (4 bytes, big-endian)
  const commandLength = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  fields.push({
    name: "Command Length",
    value: commandLength.toString(),
    description: `PDU length: ${commandLength} bytes`,
    offset: 0,
    length: 4,
    rawBytes: bytesToHex(bytes.slice(0, 4))
  });
  
  for (let i = 0; i < 4; i++) {
    structureBreakdown.bytes.push(bytesToHex([bytes[i]]));
    structureBreakdown.descriptions.push("Command Length");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Command Length byte ${i+1}`);
  }
  
  // Parse command ID (4 bytes, big-endian)
  const commandId = (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7];
  const commandName = COMMAND_IDS[commandId] || `Unknown (0x${commandId.toString(16).padStart(8, '0')})`;
  fields.push({
    name: "Command ID",
    value: `0x${commandId.toString(16).padStart(8, '0')}`,
    description: `Command: ${commandName}`,
    offset: 4,
    length: 4,
    rawBytes: bytesToHex(bytes.slice(4, 8))
  });
  
  for (let i = 4; i < 8; i++) {
    structureBreakdown.bytes.push(bytesToHex([bytes[i]]));
    structureBreakdown.descriptions.push("Command ID");
    structureBreakdown.colors.push("secondary");
    structureBreakdown.tooltips.push(`Command ID byte ${i-3}: ${commandName}`);
  }
  
  // Parse command status (4 bytes, big-endian)
  const commandStatus = (bytes[8] << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11];
  const statusText = COMMAND_STATUS[commandStatus] || `Unknown (0x${commandStatus.toString(16).padStart(8, '0')})`;
  fields.push({
    name: "Command Status",
    value: `0x${commandStatus.toString(16).padStart(8, '0')}`,
    description: `Status: ${statusText}`,
    offset: 8,
    length: 4,
    rawBytes: bytesToHex(bytes.slice(8, 12))
  });
  
  for (let i = 8; i < 12; i++) {
    structureBreakdown.bytes.push(bytesToHex([bytes[i]]));
    structureBreakdown.descriptions.push("Command Status");
    structureBreakdown.colors.push("accent");
    structureBreakdown.tooltips.push(`Command Status byte ${i-7}: ${statusText}`);
  }
  
  // Parse sequence number (4 bytes, big-endian)
  const sequenceNumber = (bytes[12] << 24) | (bytes[13] << 16) | (bytes[14] << 8) | bytes[15];
  fields.push({
    name: "Sequence Number",
    value: sequenceNumber.toString(),
    description: `Sequence number: ${sequenceNumber}`,
    offset: 12,
    length: 4,
    rawBytes: bytesToHex(bytes.slice(12, 16))
  });
  
  for (let i = 12; i < 16; i++) {
    structureBreakdown.bytes.push(bytesToHex([bytes[i]]));
    structureBreakdown.descriptions.push("Sequence Number");
    structureBreakdown.colors.push("muted");
    structureBreakdown.tooltips.push(`Sequence Number byte ${i-11}`);
  }
  
  // Initialize header
  const header: SMPPHeader = {
    commandId: `0x${commandId.toString(16).padStart(8, '0')}`,
    commandStatus: statusText,
    sequenceNumber: sequenceNumber,
    commandLength: commandLength,
    commandName: commandName
  };
  
  offset = 16; // Move past the header
  
  // Parse the body based on command type
  let sourceAddr = "";
  let destAddr = "";
  let serviceType = "";
  let messageContent = "";
  
  // Parse body based on command type
  if (commandName === "submit_sm" || commandName === "deliver_sm") {
    // Service Type (C-String)
    const serviceTypeBytes = [];
    while (offset < bytes.length && bytes[offset] !== 0) {
      serviceTypeBytes.push(bytes[offset++]);
    }
    offset++; // Skip null terminator
    
    serviceType = serviceTypeBytes.map(b => String.fromCharCode(b)).join('');
    fields.push({
      name: "Service Type",
      value: serviceType,
      description: `Service type: ${serviceType || "Default"}`,
      offset: 16,
      length: serviceTypeBytes.length + 1,
      rawBytes: bytesToHex([...serviceTypeBytes, 0])
    });
    
    for (const byte of serviceTypeBytes) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push("Service Type");
      structureBreakdown.colors.push("destructive");
      structureBreakdown.tooltips.push(`Service Type: ${serviceType}`);
    }
    structureBreakdown.bytes.push(bytesToHex([0]));
    structureBreakdown.descriptions.push("Null Terminator");
    structureBreakdown.colors.push("destructive");
    structureBreakdown.tooltips.push("Null Terminator");
    
    // Source Address TON
    const sourceTon = bytes[offset++];
    fields.push({
      name: "Source TON",
      value: sourceTon.toString(),
      description: `Source Type of Number: ${getTonDescription(sourceTon)}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([sourceTon])
    });
    
    structureBreakdown.bytes.push(bytesToHex([sourceTon]));
    structureBreakdown.descriptions.push("Source TON");
    structureBreakdown.colors.push("destructive");
    structureBreakdown.tooltips.push(`Source Type of Number: ${getTonDescription(sourceTon)}`);
    
    // Source Address NPI
    const sourceNpi = bytes[offset++];
    fields.push({
      name: "Source NPI",
      value: sourceNpi.toString(),
      description: `Source Numbering Plan Indicator: ${getNpiDescription(sourceNpi)}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([sourceNpi])
    });
    
    structureBreakdown.bytes.push(bytesToHex([sourceNpi]));
    structureBreakdown.descriptions.push("Source NPI");
    structureBreakdown.colors.push("destructive");
    structureBreakdown.tooltips.push(`Source NPI: ${getNpiDescription(sourceNpi)}`);
    
    // Source Address (C-String)
    const sourceAddrBytes = [];
    while (offset < bytes.length && bytes[offset] !== 0) {
      sourceAddrBytes.push(bytes[offset++]);
    }
    offset++; // Skip null terminator
    
    sourceAddr = sourceAddrBytes.map(b => String.fromCharCode(b)).join('');
    fields.push({
      name: "Source Address",
      value: sourceAddr,
      description: `Source address: ${sourceAddr}`,
      offset: offset - sourceAddrBytes.length - 1,
      length: sourceAddrBytes.length + 1,
      rawBytes: bytesToHex([...sourceAddrBytes, 0])
    });
    
    for (const byte of sourceAddrBytes) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push("Source Address");
      structureBreakdown.colors.push("destructive");
      structureBreakdown.tooltips.push(`Source Address: ${sourceAddr}`);
    }
    structureBreakdown.bytes.push(bytesToHex([0]));
    structureBreakdown.descriptions.push("Null Terminator");
    structureBreakdown.colors.push("destructive");
    structureBreakdown.tooltips.push("Null Terminator");
    
    // Destination Address TON
    const destTon = bytes[offset++];
    fields.push({
      name: "Destination TON",
      value: destTon.toString(),
      description: `Destination Type of Number: ${getTonDescription(destTon)}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([destTon])
    });
    
    structureBreakdown.bytes.push(bytesToHex([destTon]));
    structureBreakdown.descriptions.push("Destination TON");
    structureBreakdown.colors.push("secondary");
    structureBreakdown.tooltips.push(`Destination TON: ${getTonDescription(destTon)}`);
    
    // Destination Address NPI
    const destNpi = bytes[offset++];
    fields.push({
      name: "Destination NPI",
      value: destNpi.toString(),
      description: `Destination Numbering Plan Indicator: ${getNpiDescription(destNpi)}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([destNpi])
    });
    
    structureBreakdown.bytes.push(bytesToHex([destNpi]));
    structureBreakdown.descriptions.push("Destination NPI");
    structureBreakdown.colors.push("secondary");
    structureBreakdown.tooltips.push(`Destination NPI: ${getNpiDescription(destNpi)}`);
    
    // Destination Address (C-String)
    const destAddrBytes = [];
    while (offset < bytes.length && bytes[offset] !== 0) {
      destAddrBytes.push(bytes[offset++]);
    }
    offset++; // Skip null terminator
    
    destAddr = destAddrBytes.map(b => String.fromCharCode(b)).join('');
    fields.push({
      name: "Destination Address",
      value: destAddr,
      description: `Destination address: ${destAddr}`,
      offset: offset - destAddrBytes.length - 1,
      length: destAddrBytes.length + 1,
      rawBytes: bytesToHex([...destAddrBytes, 0])
    });
    
    for (const byte of destAddrBytes) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push("Destination Address");
      structureBreakdown.colors.push("secondary");
      structureBreakdown.tooltips.push(`Destination Address: ${destAddr}`);
    }
    structureBreakdown.bytes.push(bytesToHex([0]));
    structureBreakdown.descriptions.push("Null Terminator");
    structureBreakdown.colors.push("secondary");
    structureBreakdown.tooltips.push("Null Terminator");
    
    // ESM Class
    const esmClass = bytes[offset++];
    fields.push({
      name: "ESM Class",
      value: esmClass.toString(16).padStart(2, '0'),
      description: getEsmClassDescription(esmClass),
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([esmClass])
    });
    
    structureBreakdown.bytes.push(bytesToHex([esmClass]));
    structureBreakdown.descriptions.push("ESM Class");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`ESM Class: ${getEsmClassDescription(esmClass)}`);
    
    // Protocol ID
    const protocolId = bytes[offset++];
    fields.push({
      name: "Protocol ID",
      value: protocolId.toString(),
      description: `Protocol ID: ${protocolId}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([protocolId])
    });
    
    structureBreakdown.bytes.push(bytesToHex([protocolId]));
    structureBreakdown.descriptions.push("Protocol ID");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Protocol ID: ${protocolId}`);
    
    // Priority Flag
    const priority = bytes[offset++];
    fields.push({
      name: "Priority Flag",
      value: priority.toString(),
      description: `Priority: ${priority} (${getPriorityDescription(priority)})`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([priority])
    });
    
    structureBreakdown.bytes.push(bytesToHex([priority]));
    structureBreakdown.descriptions.push("Priority Flag");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Priority: ${getPriorityDescription(priority)}`);
    
    // Schedule Delivery Time (C-Octet String)
    const scheduleBytes = [];
    while (offset < bytes.length && bytes[offset] !== 0) {
      scheduleBytes.push(bytes[offset++]);
    }
    offset++; // Skip null terminator
    
    const scheduleTime = scheduleBytes.map(b => String.fromCharCode(b)).join('');
    fields.push({
      name: "Schedule Delivery Time",
      value: scheduleTime || "Immediate",
      description: `Schedule delivery time: ${scheduleTime || "Immediate delivery"}`,
      offset: offset - scheduleBytes.length - 1,
      length: scheduleBytes.length + 1,
      rawBytes: bytesToHex([...scheduleBytes, 0])
    });
    
    for (const byte of scheduleBytes) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push("Schedule Delivery Time");
      structureBreakdown.colors.push("accent");
      structureBreakdown.tooltips.push(`Schedule Time: ${scheduleTime || "Immediate"}`);
    }
    structureBreakdown.bytes.push(bytesToHex([0]));
    structureBreakdown.descriptions.push("Null Terminator");
    structureBreakdown.colors.push("accent");
    structureBreakdown.tooltips.push("Null Terminator");
    
    // Validity Period (C-Octet String)
    const validityBytes = [];
    while (offset < bytes.length && bytes[offset] !== 0) {
      validityBytes.push(bytes[offset++]);
    }
    offset++; // Skip null terminator
    
    const validityPeriod = validityBytes.map(b => String.fromCharCode(b)).join('');
    fields.push({
      name: "Validity Period",
      value: validityPeriod || "Default",
      description: `Validity period: ${validityPeriod || "SMSC default"}`,
      offset: offset - validityBytes.length - 1,
      length: validityBytes.length + 1,
      rawBytes: bytesToHex([...validityBytes, 0])
    });
    
    for (const byte of validityBytes) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push("Validity Period");
      structureBreakdown.colors.push("accent");
      structureBreakdown.tooltips.push(`Validity Period: ${validityPeriod || "Default"}`);
    }
    structureBreakdown.bytes.push(bytesToHex([0]));
    structureBreakdown.descriptions.push("Null Terminator");
    structureBreakdown.colors.push("accent");
    structureBreakdown.tooltips.push("Null Terminator");
    
    // Registered Delivery
    const registeredDelivery = bytes[offset++];
    fields.push({
      name: "Registered Delivery",
      value: registeredDelivery.toString(16).padStart(2, '0'),
      description: getRegisteredDeliveryDescription(registeredDelivery),
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([registeredDelivery])
    });
    
    structureBreakdown.bytes.push(bytesToHex([registeredDelivery]));
    structureBreakdown.descriptions.push("Registered Delivery");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Registered Delivery: ${getRegisteredDeliveryDescription(registeredDelivery)}`);
    
    // Replace If Present Flag
    const replaceIfPresent = bytes[offset++];
    fields.push({
      name: "Replace If Present Flag",
      value: replaceIfPresent.toString(),
      description: `Replace if present: ${replaceIfPresent ? "Yes" : "No"}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([replaceIfPresent])
    });
    
    structureBreakdown.bytes.push(bytesToHex([replaceIfPresent]));
    structureBreakdown.descriptions.push("Replace If Present");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Replace If Present: ${replaceIfPresent ? "Yes" : "No"}`);
    
    // Data Coding
    const dataCoding = bytes[offset++];
    const datacodingDesc = DATA_CODING_SCHEMES[dataCoding] || `Unknown (${dataCoding})`;
    fields.push({
      name: "Data Coding",
      value: dataCoding.toString(16).padStart(2, '0'),
      description: `Data coding: ${datacodingDesc}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([dataCoding])
    });
    
    structureBreakdown.bytes.push(bytesToHex([dataCoding]));
    structureBreakdown.descriptions.push("Data Coding");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Data Coding: ${datacodingDesc}`);
    
    // SM Default Message ID
    const defaultMsgId = bytes[offset++];
    fields.push({
      name: "SM Default Message ID",
      value: defaultMsgId.toString(),
      description: `Default message ID: ${defaultMsgId}`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([defaultMsgId])
    });
    
    structureBreakdown.bytes.push(bytesToHex([defaultMsgId]));
    structureBreakdown.descriptions.push("Default Message ID");
    structureBreakdown.colors.push("primary");
    structureBreakdown.tooltips.push(`Default Message ID: ${defaultMsgId}`);
    
    // SM Length
    const smLength = bytes[offset++];
    fields.push({
      name: "SM Length",
      value: smLength.toString(),
      description: `Short message length: ${smLength} bytes`,
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([smLength])
    });
    
    structureBreakdown.bytes.push(bytesToHex([smLength]));
    structureBreakdown.descriptions.push("SM Length");
    structureBreakdown.colors.push("destructive");
    structureBreakdown.tooltips.push(`Short Message Length: ${smLength} bytes`);
    
    // Short Message
    if (smLength > 0) {
      const messageBytes = bytes.slice(offset, offset + smLength);
      offset += smLength;
      
      // Decode message based on data coding
      if (dataCoding === 0x00 || dataCoding === 0x01) {
        // ASCII or default
        messageContent = messageBytes.map(b => String.fromCharCode(b)).join('');
      } else if (dataCoding === 0x08) {
        // UCS2
        messageContent = "";
        for (let i = 0; i < messageBytes.length; i += 2) {
          if (i + 1 < messageBytes.length) {
            const charCode = (messageBytes[i] << 8) | messageBytes[i + 1];
            messageContent += String.fromCharCode(charCode);
          }
        }
      } else {
        // Just show hex for other encodings
        messageContent = bytesToHex(messageBytes);
      }
      
      fields.push({
        name: "Short Message",
        value: messageContent,
        description: `Message: "${messageContent}"`,
        offset: offset - smLength,
        length: smLength,
        rawBytes: bytesToHex(messageBytes)
      });
      
      for (const byte of messageBytes) {
        structureBreakdown.bytes.push(bytesToHex([byte]));
        structureBreakdown.descriptions.push("Short Message");
        structureBreakdown.colors.push("destructive");
        structureBreakdown.tooltips.push(`Message Content (${datacodingDesc})`);
      }
    }
    
    // Parse optional TLV parameters
    while (offset < bytes.length && offset < commandLength) {
      // Tag (2 bytes)
      const tag = (bytes[offset] << 8) | bytes[offset + 1];
      offset += 2;
      
      // Length (2 bytes)
      const length = (bytes[offset] << 8) | bytes[offset + 1];
      offset += 2;
      
      // Value (variable length)
      const value = bytes.slice(offset, offset + length);
      offset += length;
      
      const tagName = TLV_TAGS[tag] || `Unknown tag (0x${tag.toString(16).padStart(4, '0')})`;
      
      fields.push({
        name: `TLV: ${tagName}`,
        value: bytesToHex(value),
        description: `Optional parameter ${tagName}, length: ${length} bytes`,
        offset: offset - length - 4,
        length: length + 4,
        rawBytes: bytesToHex([...bytes.slice(offset - length - 4, offset - length), ...value])
      });
      
      // Add TLV to structure breakdown
      structureBreakdown.bytes.push(bytesToHex([(tag >> 8) & 0xFF]));
      structureBreakdown.bytes.push(bytesToHex([tag & 0xFF]));
      structureBreakdown.descriptions.push("TLV Tag");
      structureBreakdown.descriptions.push("TLV Tag");
      structureBreakdown.colors.push("muted", "muted");
      structureBreakdown.tooltips.push(`TLV Tag: ${tagName}`, `TLV Tag: ${tagName}`);
      
      structureBreakdown.bytes.push(bytesToHex([(length >> 8) & 0xFF]));
      structureBreakdown.bytes.push(bytesToHex([length & 0xFF]));
      structureBreakdown.descriptions.push("TLV Length");
      structureBreakdown.descriptions.push("TLV Length");
      structureBreakdown.colors.push("muted", "muted");
      structureBreakdown.tooltips.push(`TLV Length: ${length}`, `TLV Length: ${length}`);
      
      for (const byte of value) {
        structureBreakdown.bytes.push(bytesToHex([byte]));
        structureBreakdown.descriptions.push("TLV Value");
        structureBreakdown.colors.push("muted");
        structureBreakdown.tooltips.push(`TLV Value for ${tagName}`);
      }
    }
  }
  
  return {
    header,
    messageContent,
    sourceAddr,
    destAddr,
    servicetype: serviceType,
    properties: fields,
    structureBreakdown
  };
}

// Helper functions for SMPP field descriptions

function getTonDescription(ton: number): string {
  const types: Record<number, string> = {
    0: "Unknown",
    1: "International",
    2: "National",
    3: "Network Specific",
    4: "Subscriber Number",
    5: "Alphanumeric",
    6: "Abbreviated"
  };
  return types[ton] || `Unknown (${ton})`;
}

function getNpiDescription(npi: number): string {
  const plans: Record<number, string> = {
    0: "Unknown",
    1: "ISDN/telephone numbering (E.164/E.163)",
    3: "Data numbering (X.121)",
    4: "Telex numbering (F.69)",
    6: "Land Mobile (E.212)",
    8: "National numbering",
    9: "Private numbering",
    10: "ERMES numbering",
    14: "Internet (IP)",
    18: "WAP Client Id"
  };
  return plans[npi] || `Unknown (${npi})`;
}

function getEsmClassDescription(esmClass: number): string {
  let result = "ESM Class: ";
  
  // Message Type (bits 1-0)
  const messageType = esmClass & 0x03;
  if (messageType === 0) result += "Default message type";
  else if (messageType === 1) result += "MC-specific message";
  else if (messageType === 2) result += "ESME-specific message";
  else if (messageType === 3) result += "Reserved message type";
  
  // Messaging Mode (bits 3-2)
  const messagingMode = (esmClass >> 2) & 0x03;
  if (messagingMode === 0) result += ", Default SMSC mode";
  else if (messagingMode === 1) result += ", Datagram mode";
  else if (messagingMode === 2) result += ", Forward mode";
  else if (messagingMode === 3) result += ", Store and forward mode";
  
  // Message features (bits 7-4)
  if (esmClass & 0x40) result += ", UDH Indicator";
  if (esmClass & 0x80) result += ", Reply Path";
  
  return result;
}

function getPriorityDescription(priority: number): string {
  const levels: Record<number, string> = {
    0: "Lowest Priority",
    1: "Low Priority",
    2: "Normal Priority",
    3: "High Priority",
    4: "Highest Priority"
  };
  return levels[priority] || `Priority Level ${priority}`;
}

function getRegisteredDeliveryDescription(regDelivery: number): string {
  let result = "";
  
  // Receipt bits (bits 1-0)
  const receiptType = regDelivery & 0x03;
  if (receiptType === 0) result = "No receipt requested";
  else if (receiptType === 1) result = "SME delivery receipt requested";
  else if (receiptType === 2) result = "SME delivery acknowledgment requested";
  else if (receiptType === 3) result = "Both delivery receipt and acknowledge requested";
  
  // SME originated acknowledgment (bits 3-2)
  const smeAck = (regDelivery >> 2) & 0x03;
  if (smeAck === 1) result += ", SME Manual/User Ack requested";
  else if (smeAck === 2) result += ", SME Auto Ack requested";
  
  // Intermediate notification (bit 4)
  if (regDelivery & 0x10) result += ", Intermediate notification requested";
  
  return result;
}

/**
 * Example SMPP PDUs
 */
export const exampleSmppPdus = {
  "submit_sm": "0000003B00000004000000000000000100010101313233343536373839000101013132333435363738390000000000000000040548656C6C6F",
  "deliver_sm": "0000004000000005000000000000000100010101393839373635343332310001010139393837363534333231000000000000000000074D657373616765",
  "bind_transmitter": "0000002B00000002000000000000000174657374696E670074657374696E6700000034000000",
  "enquire_link": "00000010000000150000000000000001"
};