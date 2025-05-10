import { EFSMSParseResult, PDUField, EFSMSHeader, PDUParseResult } from "@shared/schema";
import { hexToBytes, bytesToHex, parsePDU } from "./pduUtils";

// Status byte values
const STATUS_FREE = 0x00;
const STATUS_RECEIVED_READ = 0x01;
const STATUS_RECEIVED_UNREAD = 0x03;
const STATUS_STORED_SENT = 0x05;
const STATUS_STORED_UNSENT = 0x07;

/**
 * Parse EF_SMS data (SIM card SMS storage format)
 */
export function parseEFSMS(hexData: string, recordNum: number = 1): EFSMSParseResult {
  // Remove any whitespace
  hexData = hexData.replace(/\s/g, '');
  
  // Convert to bytes array
  const bytes = hexToBytes(hexData);
  
  // Initialize results
  const fields: PDUField[] = [];
  const structureBreakdown = {
    bytes: [] as string[],
    descriptions: [] as string[],
    colors: [] as string[],
    tooltips: [] as string[]
  };
  
  // Standard EF_SMS record size is typically 176 bytes
  // It has a 1-byte status + up to 175 bytes of PDU (TPDU)
  if (bytes.length < 2) {
    throw new Error("EF_SMS data too short (minimum 2 bytes required)");
  }
  
  // Parse status byte
  const status = bytes[0];
  let statusDescription = "";
  let messageType = "";
  
  switch (status) {
    case STATUS_FREE:
      statusDescription = "Free (unused) record";
      messageType = "Empty";
      break;
    case STATUS_RECEIVED_READ:
      statusDescription = "Received and read";
      messageType = "SMS-DELIVER (read)";
      break;
    case STATUS_RECEIVED_UNREAD:
      statusDescription = "Received and unread";
      messageType = "SMS-DELIVER (unread)";
      break;
    case STATUS_STORED_SENT:
      statusDescription = "Stored sent message";
      messageType = "SMS-SUBMIT (sent)";
      break;
    case STATUS_STORED_UNSENT:
      statusDescription = "Stored unsent message";
      messageType = "SMS-SUBMIT (unsent)";
      break;
    default:
      statusDescription = `Unknown status: 0x${status.toString(16).padStart(2, '0')}`;
      messageType = "Unknown";
  }
  
  fields.push({
    name: "Status",
    value: `0x${status.toString(16).padStart(2, '0')}`,
    description: statusDescription,
    offset: 0,
    length: 1,
    rawBytes: bytesToHex([status])
  });
  
  structureBreakdown.bytes.push(bytesToHex([status]));
  structureBreakdown.descriptions.push("Status");
  structureBreakdown.colors.push("primary");
  structureBreakdown.tooltips.push(`Status: ${statusDescription}`);
  
  // Initialize header
  const header: EFSMSHeader = {
    status: `0x${status.toString(16).padStart(2, '0')}`,
    statusDescription,
    messageType,
    recordNumber: recordNum,
    recordSize: bytes.length,
    smsType: messageType.includes("DELIVER") ? "SMS-DELIVER" : "SMS-SUBMIT"
  };
  
  // If it's an empty record, return early
  if (status === STATUS_FREE) {
    return {
      header,
      properties: fields,
      structureBreakdown
    };
  }
  
  // TPDU (Transport Protocol Data Unit) starts at byte 1
  // First byte is SMSC address length
  const smscLength = bytes[1];
  fields.push({
    name: "SMSC Length",
    value: smscLength.toString(),
    description: "Length of the SMSC information in octets",
    offset: 1,
    length: 1,
    rawBytes: bytesToHex([smscLength])
  });
  
  structureBreakdown.bytes.push(bytesToHex([smscLength]));
  structureBreakdown.descriptions.push("SMSC Length");
  structureBreakdown.colors.push("secondary");
  structureBreakdown.tooltips.push(`SMSC Information Length (${smscLength} octets)`);
  
  // The rest is a standard SMS PDU
  let pduData: PDUParseResult | undefined;
  let message = "";
  
  try {
    // Extract the PDU part (everything from byte 1 onwards)
    const pduString = bytesToHex(bytes.slice(1));
    
    // Determine if it's an SMS-DELIVER or SMS-SUBMIT based on the status byte
    const pduType = messageType.includes("DELIVER") ? "sms-deliver" : "sms-submit";
    
    // Parse the PDU
    pduData = parsePDU(pduString, pduType);
    message = pduData.message;
    
    // Add the PDU fields to our fields array, but adjust the offsets by adding 1
    for (const prop of pduData.properties) {
      if (prop.offset !== undefined && prop.length !== undefined) {
        fields.push({
          ...prop,
          offset: prop.offset + 1, // Adjust for the status byte
        });
      } else {
        fields.push(prop);
      }
    }
    
    // Add PDU structure breakdown to our structure breakdown
    for (let i = 0; i < pduData.structureBreakdown.bytes.length; i++) {
      structureBreakdown.bytes.push(pduData.structureBreakdown.bytes[i]);
      structureBreakdown.descriptions.push(pduData.structureBreakdown.descriptions[i]);
      structureBreakdown.colors.push(pduData.structureBreakdown.colors[i]);
      structureBreakdown.tooltips.push(pduData.structureBreakdown.tooltips[i]);
    }
  } catch (error) {
    // If PDU parsing fails, continue with the EF_SMS parsing 
    console.error("Failed to parse embedded PDU:", error);
    
    // Add remaining bytes as raw data
    const remainingBytes = bytes.slice(2);
    for (let i = 0; i < remainingBytes.length; i++) {
      structureBreakdown.bytes.push(bytesToHex([remainingBytes[i]]));
      structureBreakdown.descriptions.push("PDU Data");
      structureBreakdown.colors.push("muted");
      structureBreakdown.tooltips.push(`Raw PDU data byte ${i + 2}`);
    }
    
    fields.push({
      name: "PDU Data",
      value: bytesToHex(remainingBytes),
      description: "Raw PDU data (parsing failed)",
      offset: 2,
      length: remainingBytes.length,
      rawBytes: bytesToHex(remainingBytes)
    });
  }
  
  return {
    header,
    pdu: pduData,
    message,
    properties: fields,
    structureBreakdown
  };
}

/**
 * Example EF_SMS data for testing
 */
export const exampleEfSmsPdus = {
  "unread-message": "03001901059144371300006018402151311063A7F79B9D066181C6687CB6890BB4C0699DF723A",
  "read-message": "01001901059143276500006018402151311063A7F79B9D066181C6687CB6890BB4C0699DF723A",
  "stored-sent": "05000791447728190000000100001751205172230A4254747A0E4ACF4161703A4ED3CBF23C",
  "empty-record": "000000000000000000000000000000000000000000000000000000000000000000"
};