import { SATParseResult, PDUField, SATHeader } from "@shared/schema";
import { hexToBytes, bytesToHex } from "./pduUtils";

// SIM Application Toolkit tag values (as defined in ETSI TS 101 267 and 3GPP TS 31.111)
const TAG_COMMAND_DETAILS = 0x01;
const TAG_DEVICE_IDENTITIES = 0x02;
const TAG_RESULT = 0x03;
const TAG_DURATION = 0x04;
const TAG_ALPHA_IDENTIFIER = 0x05;
const TAG_ADDRESS = 0x06;
const TAG_CAPABILITY_CONFIGURATION_PARAMETERS = 0x07;
const TAG_SUBADDRESS = 0x08;
const TAG_SS_STRING = 0x09;
const TAG_USSD_STRING = 0x0A;
const TAG_SMS_TPDU = 0x0B;
const TAG_CELL_BROADCAST_PAGE = 0x0C;
const TAG_TEXT_STRING = 0x0D;
const TAG_TONE = 0x0E;
const TAG_ITEM = 0x0F;
const TAG_ITEM_IDENTIFIER = 0x10;
const TAG_RESPONSE_LENGTH = 0x11;
const TAG_FILE_LIST = 0x12;
const TAG_LOCATION_INFORMATION = 0x13;
const TAG_IMEI = 0x14;
const TAG_HELP_REQUEST = 0x15;
const TAG_NETWORK_MEASUREMENT_RESULTS = 0x16;
const TAG_DEFAULT_TEXT = 0x17;
const TAG_MENU_ITEMS_NEXT_ACTION_INDICATOR = 0x18;
const TAG_EVENT_LIST = 0x19;
const TAG_CAUSE = 0x1A;
const TAG_LOCATION_STATUS = 0x1B;
const TAG_TIMER_IDENTIFIER = 0x24;
const TAG_BROWSER_IDENTITY = 0x30;
const TAG_URL = 0x31;
const TAG_BEARER = 0x32;
const TAG_PROVISIONING_REFERENCE_FILE = 0x33;
const TAG_BROWSER_TERMINATION_CAUSE = 0x34;
const TAG_BEARER_DESCRIPTION = 0x35;
const TAG_CHANNEL_DATA = 0x36;
const TAG_CARD_READER_STATUS = 0x37;
const TAG_CARD_ATR = 0x38;
const TAG_ICON_IDENTIFIER = 0x1E;
const TAG_ITEM_ICON_IDENTIFIER = 0x1F;
const TAG_LANGUAGE = 0x2D;

// Proactive SIM command types (as defined in 3GPP TS 31.111 and ETSI TS 102 223)
const commandTypes: Record<number, string> = {
  // Command Types (numeric values can vary between specifications)
  0x01: "REFRESH",
  0x02: "MORE TIME",
  0x03: "POLL INTERVAL",
  0x04: "POLLING OFF",
  0x05: "SET UP EVENT LIST",
  0x06: "SET UP CALL",
  0x07: "SEND SS",
  0x08: "SEND USSD",
  0x09: "SEND SHORT MESSAGE",
  0x0A: "SEND DTMF",
  0x0B: "LAUNCH BROWSER",
  0x0C: "PLAY TONE",
  0x0D: "DISPLAY TEXT",
  0x0E: "GET INKEY",
  0x0F: "GET INPUT",
  0x1A: "LANGUAGE NOTIFICATION",
  0x1B: "OPEN CHANNEL",
  0x1C: "CLOSE CHANNEL",
  0x1D: "RECEIVE DATA",
  0x1E: "SEND DATA",
  0x1F: "GET CHANNEL STATUS",
  0x20: "SERVICE SEARCH",
  0x29: "ACTIVATE",
  0x2A: "CONTACTLESS STATE CHANGED",
  0x2B: "COMMAND CONTAINER"
};

// Alternative command type values commonly seen in the wild
// These are added separately to avoid duplicates in the Record type
function getCommandType(typeValue: number): string {
  // Check standard values first
  if (commandTypes[typeValue]) {
    return commandTypes[typeValue];
  }
  
  // Check alternative values - these vary by specification
  switch (typeValue) {
    // Main alternative command values
    case 0x10: return "SET UP CALL";       // Also seen as 0x06
    case 0x11: return "SEND SS";           // Also seen as 0x07
    case 0x12: return "SEND USSD";         // Also seen as 0x08
    case 0x13: return "SEND SHORT MESSAGE"; // Also seen as 0x09
    case 0x14: return "SET UP IDLE MODE TEXT";
    case 0x15: return "PERFORM CARD APDU";
    case 0x16: return "POWER OFF CARD";
    case 0x17: return "POWER ON CARD";
    case 0x18: return "GET READER STATUS";
    case 0x19: return "RUN AT COMMAND";
    
    // SIM Application Toolkit spec values
    case 0x21: return "DISPLAY TEXT";      // Also seen as 0x0D
    case 0x22: return "GET INKEY";         // Also seen as 0x0E
    case 0x23: return "GET INPUT";         // Also seen as 0x0F
    case 0x24: return "SELECT ITEM";       // Also seen as 0x10
    case 0x25: return "SET UP MENU";       // Also seen as 0x11
    case 0x26: return "SUBMIT MULTIMEDIA MESSAGE";
    case 0x27: return "DISPLAY MULTIMEDIA MESSAGE";
    case 0x28: return "SET MULTIMEDIA MESSAGE";
    
    // Default for unknown command types
    default: return `UNKNOWN (${typeValue.toString(16)})`;
  }
};

// Device identities (as defined in 3GPP TS 31.111 and ETSI TS 102 223)
const deviceIdentities: Record<number, string> = {
  0x01: "Keypad",
  0x02: "Display",
  0x03: "Earpiece",
  0x10: "Additional Card Reader 0",
  0x11: "Additional Card Reader 1",
  0x12: "Additional Card Reader 2",
  0x13: "Additional Card Reader 3",
  0x14: "Additional Card Reader 4",
  0x15: "Additional Card Reader 5",
  0x16: "Additional Card Reader 6",
  0x17: "Additional Card Reader 7",
  0x21: "Channel 1",
  0x22: "Channel 2",
  0x23: "Channel 3",
  0x24: "Channel 4",
  0x25: "Channel 5",
  0x26: "Channel 6",
  0x27: "Channel 7",
  0x28: "Channel 8",
  0x29: "Channel 9",
  0x2A: "Channel 10",
  0x2B: "Channel 11",
  0x2C: "Channel 12",
  0x2D: "Channel 13",
  0x2E: "Channel 14",
  0x2F: "Channel 15",
  0x30: "Channel 16",
  0x40: "Remote entity 1",
  0x41: "Remote entity 2",
  0x42: "Remote entity 3",
  0x43: "Remote entity 4",
  0x44: "Remote entity 5",
  0x45: "Remote entity 6",
  0x46: "Remote entity 7",
  0x60: "UICC/USIM Local Connection",
  0x70: "Local UICC",
  0x71: "Local Terminal",
  0x81: "UICC",
  0x82: "Terminal",
  0x83: "Network",
  0x90: "Baseband",
  0x91: "EUICC",
  0x92: "Companion Terminal",
  0x93: "Application Terminal"
};

/**
 * Parse SIM Application Toolkit command
 */
export function parseSAT(pduString: string): SATParseResult {
  // Remove any whitespace
  pduString = pduString.replace(/\s/g, '');
  
  // Convert to bytes array
  const bytes = hexToBytes(pduString);
  
  // Initialize result
  const fields: PDUField[] = [];
  let offset = 0;
  
  // Check if this is a proactive SIM command (first byte should be 0xD0)
  const proactiveCommand = bytes[0] === 0xD0;
  
  if (!proactiveCommand) {
    throw new Error("Not a proactive SIM command (expected 0xD0 as first byte)");
  }
  
  fields.push({
    name: "Proactive SIM Command Tag",
    value: bytesToHex([bytes[0]]),
    description: "Indicates this is a proactive SIM command",
    offset: 0,
    length: 1,
    rawBytes: bytesToHex([bytes[0]])
  });
  
  offset++; // Move past the proactive command tag
  
  // Get command length
  const cmdLength = bytes[offset++];
  fields.push({
    name: "Command Length",
    value: cmdLength.toString(),
    description: `Length of the command data: ${cmdLength} bytes`,
    offset: 1,
    length: 1,
    rawBytes: bytesToHex([cmdLength])
  });
  
  // Initialize the header
  const header: SATHeader = {
    commandType: "UNKNOWN",
    commandQualifier: "00",
    deviceIdentities: {
      source: "UICC",
      destination: "Terminal"
    },
    proactiveCommand: proactiveCommand
  };
  
  // Initialize the result structure
  const structureBreakdown = {
    bytes: [bytesToHex([bytes[0]]), bytesToHex([cmdLength])],
    descriptions: ["Proactive Command Tag", "Command Length"],
    colors: ["primary", "primary"],
    tooltips: ["Proactive SIM Command Tag (D0)", `Command Length: ${cmdLength} bytes`]
  };
  
  let commandDetails = "";
  let commandText = "";
  
  // Parse the command data
  while (offset < bytes.length) {
    const tag = bytes[offset++];
    const length = bytes[offset++];
    const tagData = bytes.slice(offset, offset + length);
    
    // Add tag and length to structure breakdown
    structureBreakdown.bytes.push(bytesToHex([tag]));
    structureBreakdown.bytes.push(bytesToHex([length]));
    structureBreakdown.descriptions.push("Tag");
    structureBreakdown.descriptions.push("Length");
    structureBreakdown.colors.push("secondary", "secondary");
    structureBreakdown.tooltips.push(`Tag: ${tag.toString(16).padStart(2, '0')}`, `Length: ${length} bytes`);
    
    // Process the tag data according to tag type
    switch (tag) {
      case TAG_COMMAND_DETAILS:
        if (length >= 3) {
          const commandNumber = tagData[0];
          const typeValue = tagData[1];
          const qualifier = tagData[2];
          
          // Use our enhanced command type function
          header.commandType = getCommandType(typeValue);
          header.commandQualifier = qualifier.toString(16).padStart(2, '0');
          
          commandDetails = `Command: ${header.commandType}, Qualifier: 0x${header.commandQualifier}`;
          
          fields.push({
            name: "Command Details",
            value: bytesToHex(tagData),
            description: `Command Number: ${commandNumber}, Type: ${header.commandType}, Qualifier: 0x${header.commandQualifier}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_DEVICE_IDENTITIES:
        if (length >= 2) {
          const sourceDevice = tagData[0];
          const destinationDevice = tagData[1];
          
          header.deviceIdentities.source = deviceIdentities[sourceDevice] || `Unknown (${sourceDevice.toString(16)})`;
          header.deviceIdentities.destination = deviceIdentities[destinationDevice] || `Unknown (${destinationDevice.toString(16)})`;
          
          fields.push({
            name: "Device Identities",
            value: bytesToHex(tagData),
            description: `Source: ${header.deviceIdentities.source}, Destination: ${header.deviceIdentities.destination}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_ALPHA_IDENTIFIER:
        let alphaText = "";
        
        // Try to decode based on first byte (DCS indicator might be present)
        if (tagData.length > 0 && tagData[0] === 0x04) {
          // If first byte is 0x04, it's an 8-bit encoded string
          alphaText = tagData.slice(1).map(b => String.fromCharCode(b)).join('');
        } else {
          // Default to GSM 7-bit
          alphaText = decodeGSMAlphabet(tagData);
        }
        
        commandText = alphaText;
        
        fields.push({
          name: "Alpha Identifier",
          value: alphaText,
          description: "Text to be displayed to the user",
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      case TAG_TEXT_STRING:
        if (length > 0) {
          const dcs = tagData[0]; // Data coding scheme
          const textData = tagData.slice(1);
          let decodedText = "";
          let dcsDescription = "";
          
          // Decode based on data coding scheme
          if (dcs === 0x00) {
            // GSM 7-bit default alphabet
            decodedText = decodeGSMAlphabet(textData);
            dcsDescription = "GSM 7-bit default alphabet";
          } else if (dcs === 0x04) {
            // 8-bit data, treat as ASCII
            decodedText = textData.map(b => String.fromCharCode(b)).join('');
            dcsDescription = "8-bit data (ASCII)";
          } else if (dcs === 0x08) {
            // UCS2 (16-bit) encoding
            decodedText = "";
            for (let i = 0; i < textData.length; i += 2) {
              if (i + 1 < textData.length) {
                const charCode = (textData[i] << 8) | textData[i + 1];
                decodedText += String.fromCharCode(charCode);
              }
            }
            dcsDescription = "UCS2 (16-bit Unicode)";
          } else {
            // Unknown DCS, try to guess based on content
            if (textData.every(b => b >= 0x20 && b <= 0x7F)) {
              // Printable ASCII
              decodedText = textData.map(b => String.fromCharCode(b)).join('');
              dcsDescription = "Unknown DCS, treated as ASCII";
            } else {
              // Default to GSM 7-bit
              decodedText = decodeGSMAlphabet(textData);
              dcsDescription = "Unknown DCS, treated as GSM 7-bit";
            }
          }
          
          commandText = decodedText;
          
          fields.push({
            name: "Text String",
            value: decodedText,
            description: `Text (DCS: 0x${dcs.toString(16)}, ${dcsDescription}): "${decodedText}"`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_SMS_TPDU:
      case TAG_CELL_BROADCAST_PAGE:
        fields.push({
          name: tag === TAG_SMS_TPDU ? "SMS TPDU" : "Cell Broadcast Page",
          value: bytesToHex(tagData),
          description: tag === TAG_SMS_TPDU ? "SMS message to be sent" : "Cell broadcast message",
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      case TAG_ADDRESS:
        let addressValue = "Unknown";
        if (length > 0) {
          const ton = (tagData[0] >> 4) & 0x07; // Type of number
          const npi = tagData[0] & 0x0F; // Numbering plan identification
          const addressData = tagData.slice(1);
          
          // For TON/NPI details, use proper TON/NPI mapping
          const tonDesc = ["Unknown", "International", "National", "Network specific", "Subscriber", "Alphanumeric", "Abbreviated", "Reserved"][ton] || "Reserved";
          const npiDesc = ["Unknown", "ISDN/Telephony", "Data", "Telex", "National", "Private", "ERMES", "Reserved"][npi] || "Reserved";
          
          addressValue = bytesToHex(addressData);
          
          fields.push({
            name: "Address",
            value: addressValue,
            description: `Address: TON=${tonDesc}, NPI=${npiDesc}, Address=${addressValue}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        } else {
          fields.push({
            name: "Address",
            value: "Empty",
            description: "Empty address field",
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_SS_STRING:
        fields.push({
          name: "SS String",
          value: bytesToHex(tagData),
          description: "Supplementary Service string",
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      case TAG_USSD_STRING:
        fields.push({
          name: "USSD String",
          value: bytesToHex(tagData),
          description: "Unstructured Supplementary Service Data string",
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      case TAG_DURATION:
        if (length >= 2) {
          const timeUnit = tagData[0];
          const timeInterval = tagData[1];
          
          const unitDesc = ["Minutes", "Seconds", "Tenths of seconds", "Reserved"][timeUnit] || "Unknown";
          
          fields.push({
            name: "Duration",
            value: `${timeInterval} ${unitDesc}`,
            description: `Duration: ${timeInterval} ${unitDesc.toLowerCase()}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        } else {
          fields.push({
            name: "Duration",
            value: bytesToHex(tagData),
            description: "Invalid duration format",
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_ITEM:
        if (length >= 2) {
          const identifier = tagData[0];
          const itemText = decodeGSMAlphabet(tagData.slice(1));
          
          fields.push({
            name: "Menu Item",
            value: itemText,
            description: `Item ID: ${identifier}, Text: "${itemText}"`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        } else {
          fields.push({
            name: "Menu Item",
            value: bytesToHex(tagData),
            description: "Invalid menu item format",
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_ITEM_IDENTIFIER:
        if (length === 1) {
          fields.push({
            name: "Item Identifier",
            value: tagData[0].toString(),
            description: `Selected item identifier: ${tagData[0]}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        } else {
          fields.push({
            name: "Item Identifier",
            value: bytesToHex(tagData),
            description: "Invalid item identifier format",
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_TONE:
        if (length === 1) {
          const tones = [
            "Dial tone", "Called subscriber busy", "Congestion", "Radio path acknowledge",
            "Radio path not available / Call dropped", "Error / Special info", "Call waiting tone",
            "Ringing tone", "General beep", "Positive acknowledgement tone",
            "Negative acknowledgement tone"
          ];
          const toneDesc = tagData[0] < tones.length ? tones[tagData[0]] : `Unknown tone (${tagData[0]})`;
          
          fields.push({
            name: "Tone",
            value: toneDesc,
            description: `Tone to be played: ${toneDesc}`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        } else {
          fields.push({
            name: "Tone",
            value: bytesToHex(tagData),
            description: "Invalid tone format",
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_URL:
        // Try to decode as ASCII
        const url = tagData.map(b => String.fromCharCode(b)).join('');
        
        fields.push({
          name: "URL",
          value: url,
          description: `Browser URL: ${url}`,
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      case TAG_EVENT_LIST:
        const events = [
          "MT call", "Call connected", "Call disconnected", "Location status", 
          "User activity", "Idle screen available", "Card reader status",
          "Language selection", "Browser termination", "Data available", 
          "Channel status", "Access Technology Change", "Display parameters changed",
          "Local connection", "Network Search Mode Change", "Browsing status",
          "Frames Information Change"
        ];
        
        const eventsList = tagData.map(eventId => {
          return eventId < events.length ? events[eventId] : `Unknown event (${eventId})`;
        }).join(", ");
        
        fields.push({
          name: "Event List",
          value: bytesToHex(tagData),
          description: `Events: ${eventsList}`,
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
        break;
        
      default:
        fields.push({
          name: `Tag 0x${tag.toString(16).padStart(2, '0')}`,
          value: bytesToHex(tagData),
          description: `Data for tag 0x${tag.toString(16).padStart(2, '0')}`,
          offset: offset - 2,
          length: length + 2,
          rawBytes: bytesToHex([tag, length, ...tagData])
        });
    }
    
    // Add tag data to structure breakdown
    for (const byte of tagData) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push(`Tag Data (0x${tag.toString(16).padStart(2, '0')})`);
      structureBreakdown.colors.push("accent");
      structureBreakdown.tooltips.push(`Data for tag 0x${tag.toString(16).padStart(2, '0')}`);
    }
    
    // Move offset
    offset += length;
  }
  
  return {
    header,
    command: header.commandType,
    commandDetails,
    properties: fields,
    structureBreakdown
  };
}

/**
 * Simple decoder for GSM 7-bit default alphabet
 * Note: This is a simplified version - a full implementation would handle the complete GSM alphabet
 */
function decodeGSMAlphabet(data: number[]): string {
  // Simplified GSM 7-bit alphabet mapping
  const gsm7BitAlphabet = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ\x1bÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
  
  let result = "";
  for (const byte of data) {
    if (byte < 128) {
      result += gsm7BitAlphabet[byte] || '?';
    } else {
      result += '?';
    }
  }
  return result;
}

/**
 * Example SIM Application Toolkit PDUs - based on 3GPP TS 31.111 and ETSI TS 102 223 specifications
 * 
 * Each example is a real-world representation of a SIM Application Toolkit command 
 * as it would appear in a mobile device communication with the SIM card.
 */
export const exampleSatPdus = {
  // Basic commands
  "display-text": "D0288103012180820281028D1A04546869732069732061207465737420746578742E2020202020",
  "select-menu": "D03881030125008202818285096D61696E206D656E75860204F1860304F28604054C6F63616C860605536574757087050104000016180402",
  "send-sms": "D0268103011380820281838B1904098156050005F0240A00F5A76173746520636865636B",
  "setup-call": "D036810301108082028183050A43616C6C696E672E2E2E860608912143658709910600150005F06024069362537396332C371",
  
  // Additional commands
  "get-input": "D0388103012380820281028D0B04456E7465722050494E3A8F0101CD020200C50112C60101C7020118C8020118DA0101DB0101DC01019000",
  "get-inkey": "D0248103012280820281028D0804507265737320598F0104CD029000C501019000",
  "play-tone": "D01A8103010C80820281038D04045761697414055F01019000",
  "refresh": "D01281030101820281831206A0000000871002FF009000",
  "setup-event-list": "D0128103010580820281831901079000",
  "launch-browser": "D02E8103011580820281033101687474703A2F2F7777772E6578616D706C652E636F6D2F8D05045669657789020100",
  "provide-local-info": "D01081030112820282828F020001",
  "set-idle-text": "D01681030114820282828D0A084D792049646C6520546578749000",
  
  // Menu commands
  "setup-menu-with-icons": "D05081030125008202818285096D61696E206D656E758F01018602013186030132860401338605013486060135860701368609013887070101020304051E0701010203040518060102030405",
  "select-item-with-icons": "D04881030124008202818285096974656D206D656E758F0101860201318602023286020333860204348602053587050101020304051E0601010203040518050102030405",
  
  // Advanced commands
  "open-channel": "D0358103031B008202818335070206012400003583350E800001010101118282050202030404290101391004800001010101118282050202030405",
  "send-data": "D0168103031E0082028183360B040102030405060708090A",
  "receive-data": "D0128103031D0082028183370704010099",
  "close-channel": "D00E8103031C008202818338019000"
};