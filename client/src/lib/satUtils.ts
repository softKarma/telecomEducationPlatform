import { SATParseResult, PDUField, SATHeader } from "@shared/schema";
import { hexToBytes, bytesToHex } from "./pduUtils";

// SIM Application Toolkit tag values (as defined in ETSI TS 101 267)
const TAG_COMMAND_DETAILS = 0x01;
const TAG_DEVICE_IDENTITIES = 0x02;
const TAG_RESULT = 0x03;
const TAG_DURATION = 0x04;
const TAG_ALPHA_IDENTIFIER = 0x05;
const TAG_ADDRESS = 0x06;
const TAG_TEXT_STRING = 0x0D;
const TAG_TONE = 0x0E;
const TAG_ITEM = 0x0F;
const TAG_ITEM_IDENTIFIER = 0x10;
const TAG_RESPONSE_LENGTH = 0x11;
const TAG_FILE_LIST = 0x12;
const TAG_MENU_ITEMS_NEXT_ACTION_INDICATOR = 0x18;
const TAG_EVENT_LIST = 0x19;
const TAG_SMS_TPDU = 0x8B;

// Proactive SIM command types
const commandTypes: Record<number, string> = {
  0x01: "REFRESH",
  0x02: "MORE TIME",
  0x03: "POLL INTERVAL",
  0x04: "POLLING OFF",
  0x05: "SET UP EVENT LIST",
  0x10: "SET UP CALL",
  0x11: "SEND SS",
  0x12: "SEND USSD",
  0x13: "SEND SMS",
  0x14: "SEND DTMF",
  0x15: "LAUNCH BROWSER",
  0x20: "PLAY TONE",
  0x21: "DISPLAY TEXT",
  0x22: "GET INKEY",
  0x23: "GET INPUT",
  0x24: "SELECT ITEM",
  0x25: "SET UP MENU"
};

// Device identities
const deviceIdentities: Record<number, string> = {
  0x01: "Keypad",
  0x02: "Display",
  0x03: "Earpiece",
  0x81: "UICC",
  0x82: "Terminal",
  0x83: "Network"
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
          
          header.commandType = commandTypes[typeValue] || `UNKNOWN (${typeValue.toString(16)})`;
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
        const alphaText = decodeGSMAlphabet(tagData);
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
          
          // Decode based on data coding scheme
          if (dcs === 0x04) {
            // 8-bit data, treat as ASCII
            decodedText = textData.map(b => String.fromCharCode(b)).join('');
          } else if (dcs === 0x08) {
            // UCS2 (16-bit) encoding
            decodedText = "";
            for (let i = 0; i < textData.length; i += 2) {
              if (i + 1 < textData.length) {
                const charCode = (textData[i] << 8) | textData[i + 1];
                decodedText += String.fromCharCode(charCode);
              }
            }
          } else {
            // Default to GSM 7-bit
            decodedText = decodeGSMAlphabet(textData);
          }
          
          commandText = decodedText;
          
          fields.push({
            name: "Text String",
            value: decodedText,
            description: `Text (DCS: 0x${dcs.toString(16)}): "${decodedText}"`,
            offset: offset - 2,
            length: length + 2,
            rawBytes: bytesToHex([tag, length, ...tagData])
          });
        }
        break;
        
      case TAG_SMS_TPDU:
        fields.push({
          name: "SMS TPDU",
          value: bytesToHex(tagData),
          description: "SMS message to be sent",
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
 * Example SIM Application Toolkit PDUs
 */
export const exampleSatPdus = {
  "display-text": "D0288103012180820281028D1A04546869732069732061207465737420746578742E2020202020",
  "select-menu": "D03881030125008202818285096D61696E206D656E75860204F1860304F28604054C6F63616C860605536574757087050104000016180402",
  "send-sms": "D0268103011380820281838B1904098156050005F0240A00F5A76173746520636865636B",
  "setup-call": "D036810301108082028183050A43616C6C696E672E2E2E860608912143658709910600150005F06024069362537396332C371",
};