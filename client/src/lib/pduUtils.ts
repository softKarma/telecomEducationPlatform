import { PDUParseResult, PDUEncodeResult, PDUField, PDUHeader } from "@shared/schema";

// GSM 7-bit default alphabet
const gsm7BitAlphabet: Record<number, string> = {
  0x00: "@", 0x01: "£", 0x02: "$", 0x03: "¥", 0x04: "è", 0x05: "é", 0x06: "ù", 0x07: "ì",
  0x08: "ò", 0x09: "Ç", 0x0A: "\n", 0x0B: "Ø", 0x0C: "ø", 0x0D: "\r", 0x0E: "Å", 0x0F: "å",
  0x10: "Δ", 0x11: "_", 0x12: "Φ", 0x13: "Γ", 0x14: "Λ", 0x15: "Ω", 0x16: "Π", 0x17: "Ψ",
  0x18: "Σ", 0x19: "Θ", 0x1A: "Ξ", 0x1B: "\u001B", 0x1C: "Æ", 0x1D: "æ", 0x1E: "ß", 0x1F: "É",
  0x20: " ", 0x21: "!", 0x22: "\"", 0x23: "#", 0x24: "¤", 0x25: "%", 0x26: "&", 0x27: "'",
  0x28: "(", 0x29: ")", 0x2A: "*", 0x2B: "+", 0x2C: ",", 0x2D: "-", 0x2E: ".", 0x2F: "/",
  0x30: "0", 0x31: "1", 0x32: "2", 0x33: "3", 0x34: "4", 0x35: "5", 0x36: "6", 0x37: "7",
  0x38: "8", 0x39: "9", 0x3A: ":", 0x3B: ";", 0x3C: "<", 0x3D: "=", 0x3E: ">", 0x3F: "?",
  0x40: "¡", 0x41: "A", 0x42: "B", 0x43: "C", 0x44: "D", 0x45: "E", 0x46: "F", 0x47: "G",
  0x48: "H", 0x49: "I", 0x4A: "J", 0x4B: "K", 0x4C: "L", 0x4D: "M", 0x4E: "N", 0x4F: "O",
  0x50: "P", 0x51: "Q", 0x52: "R", 0x53: "S", 0x54: "T", 0x55: "U", 0x56: "V", 0x57: "W",
  0x58: "X", 0x59: "Y", 0x5A: "Z", 0x5B: "Ä", 0x5C: "Ö", 0x5D: "Ñ", 0x5E: "Ü", 0x5F: "§",
  0x60: "¿", 0x61: "a", 0x62: "b", 0x63: "c", 0x64: "d", 0x65: "e", 0x66: "f", 0x67: "g",
  0x68: "h", 0x69: "i", 0x6A: "j", 0x6B: "k", 0x6C: "l", 0x6D: "m", 0x6E: "n", 0x6F: "o",
  0x70: "p", 0x71: "q", 0x72: "r", 0x73: "s", 0x74: "t", 0x75: "u", 0x76: "v", 0x77: "w",
  0x78: "x", 0x79: "y", 0x7A: "z", 0x7B: "ä", 0x7C: "ö", 0x7D: "ñ", 0x7E: "ü", 0x7F: "à"
};

// GSM 7-bit extension table (used after escape character 0x1B)
const gsm7BitExtension: Record<number, string> = {
  0x0A: "\f", 0x14: "^", 0x28: "{", 0x29: "}", 0x2F: "\\", 0x3C: "[", 0x3D: "~", 0x3E: "]",
  0x40: "|", 0x65: "€"
};

// Utility function to convert hex string to bytes array
export function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  }
  return bytes;
}

// Utility function to convert bytes array to hex string
export function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Swap nibbles in a byte
export function swapNibbles(byte: number): number {
  return ((byte & 0x0F) << 4) | ((byte & 0xF0) >> 4);
}

// Convert semi-octets to phone number string
export function semiOctetsToNumber(bytes: number[]): string {
  let number = '';
  for (let i = 0; i < bytes.length; i++) {
    const swapped = swapNibbles(bytes[i]);
    const digit1 = swapped & 0x0F;
    const digit2 = (swapped & 0xF0) >> 4;
    
    if (digit1 !== 0x0F) number += digit1.toString(16);
    if (digit2 !== 0x0F) number += digit2.toString(16);
  }
  return number;
}

// Convert phone number to semi-octets
export function numberToSemiOctets(number: string): number[] {
  // Remove any non-digit characters
  number = number.replace(/\D/g, '');
  
  // Add trailing F if odd length
  if (number.length % 2 !== 0) {
    number += 'F';
  }
  
  const bytes: number[] = [];
  for (let i = 0; i < number.length; i += 2) {
    const digit1 = parseInt(number[i], 16);
    const digit2 = parseInt(number[i + 1], 16);
    bytes.push(((digit2 << 4) | digit1) & 0xFF);
  }
  
  return bytes;
}

// Parse address from bytes
export function parseAddress(length: number, typeOfAddress: number, addressData: number[]): string {
  let numberType = '';
  
  // Check Type-of-Address
  const ton = (typeOfAddress & 0x70) >> 4;
  if (ton === 0) numberType = 'Unknown';
  else if (ton === 1) numberType = 'International';
  else if (ton === 2) numberType = 'National';
  else if (ton === 3) numberType = 'Network specific';
  else if (ton === 4) numberType = 'Subscriber number';
  else if (ton === 5) numberType = 'Alphanumeric';
  else if (ton === 6) numberType = 'Abbreviated';
  
  let phoneNumber = '';
  
  if (ton === 5) {
    // Alphanumeric address
    phoneNumber = parse7BitCharacters(addressData, length * 4 / 7);
  } else {
    // Normal phone number
    phoneNumber = semiOctetsToNumber(addressData);
    
    // Add + for international format
    if (ton === 1) {
      phoneNumber = '+' + phoneNumber;
    }
  }
  
  return phoneNumber;
}

// Decode 7-bit GSM characters
export function parse7BitCharacters(data: number[], length: number): string {
  let result = '';
  let shift = 0;
  let prevSeptet = 0;
  let escapeNext = false;
  
  for (let i = 0; i < Math.ceil(length * 7 / 8); i++) {
    // Get current byte
    const currentByte = i < data.length ? data[i] : 0;
    
    // Extract 7-bit character from the current byte
    let septet = ((currentByte << shift) | prevSeptet) & 0x7F;
    
    // Save remainder for next iteration
    prevSeptet = currentByte >> (7 - shift);
    
    // Increment shift by 1 (modulo 7)
    shift = (shift + 1) % 7;
    
    // Decode the character
    if (result.length < length) {
      if (escapeNext) {
        result += gsm7BitExtension[septet] || '?';
        escapeNext = false;
      } else if (septet === 0x1B) {
        escapeNext = true;
      } else {
        result += gsm7BitAlphabet[septet] || '?';
      }
    }
    
    // For every 7 shifts, we've extracted 8 characters, so we need to process one more byte
    if (shift === 0 && i + 1 < Math.ceil(length * 7 / 8)) {
      // Get current byte
      const nextByte = data[i + 1];
      
      // Extract 7-bit character from the next byte
      septet = nextByte & 0x7F;
      
      // Save remainder for next iteration
      prevSeptet = nextByte >> 7;
      
      // Decode the character
      if (result.length < length) {
        if (escapeNext) {
          result += gsm7BitExtension[septet] || '?';
          escapeNext = false;
        } else if (septet === 0x1B) {
          escapeNext = true;
        } else {
          result += gsm7BitAlphabet[septet] || '?';
        }
      }
      
      i++;
    }
  }
  
  return result;
}

// Encode text to 7-bit GSM characters
export function encode7BitCharacters(text: string): number[] {
  const septets: number[] = [];
  
  // Convert text to GSM 7-bit characters
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Find character in main table
    let found = false;
    for (const [code, value] of Object.entries(gsm7BitAlphabet)) {
      if (value === char) {
        septets.push(parseInt(code, 10));
        found = true;
        break;
      }
    }
    
    // If not found, check extension table
    if (!found) {
      for (const [code, value] of Object.entries(gsm7BitExtension)) {
        if (value === char) {
          septets.push(0x1B); // Escape character
          septets.push(parseInt(code, 10));
          found = true;
          break;
        }
      }
    }
    
    // If still not found, use ? character
    if (!found) {
      septets.push(0x3F); // ?
    }
  }
  
  // Convert septets to octets
  const octets: number[] = [];
  let shift = 0;
  let octet = 0;
  
  for (let i = 0; i < septets.length; i++) {
    octet |= (septets[i] & 0x7F) << shift;
    
    if (shift >= 1) {
      octets.push(octet & 0xFF);
      octet = septets[i] >> (8 - shift);
    }
    
    shift = (shift + 7) % 8;
    
    if (shift === 0) {
      octets.push(octet & 0xFF);
      octet = 0;
    }
  }
  
  // Push the last octet if there's data remaining
  if (shift !== 0) {
    octets.push(octet & 0xFF);
  }
  
  return octets;
}

// Decode UCS-2 characters
export function parseUCS2Characters(data: number[], length: number): string {
  let result = '';
  
  for (let i = 0; i < length / 2; i++) {
    if (i * 2 + 1 < data.length) {
      const highByte = data[i * 2];
      const lowByte = data[i * 2 + 1];
      result += String.fromCharCode((highByte << 8) | lowByte);
    }
  }
  
  return result;
}

// Encode text to UCS-2 characters
export function encodeUCS2Characters(text: string): number[] {
  const octets: number[] = [];
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    octets.push((charCode >> 8) & 0xFF);
    octets.push(charCode & 0xFF);
  }
  
  return octets;
}

// Parse Timestamp
export function parseTimestamp(data: number[]): string {
  if (data.length < 7) return '';
  
  const year = swapNibbles(data[0]).toString(16).padStart(2, '0');
  const month = swapNibbles(data[1]).toString(16).padStart(2, '0');
  const day = swapNibbles(data[2]).toString(16).padStart(2, '0');
  const hour = swapNibbles(data[3]).toString(16).padStart(2, '0');
  const minute = swapNibbles(data[4]).toString(16).padStart(2, '0');
  const second = swapNibbles(data[5]).toString(16).padStart(2, '0');
  
  // Time zone is in quarter hours
  const tz = swapNibbles(data[6]);
  const tzSign = (tz & 0x80) ? '-' : '+';
  const tzHourQuarters = tz & 0x7F;
  const tzHours = Math.floor(tzHourQuarters / 4);
  const tzMinutes = (tzHourQuarters % 4) * 15;
  
  return `20${year}-${month}-${day} ${hour}:${minute}:${second} (${tzSign}${tzHours.toString().padStart(2, '0')}:${tzMinutes.toString().padStart(2, '0')})`;
}

// Check for User Data Header
function hasUserDataHeader(firstOctet: number): boolean {
  return (firstOctet & 0x40) === 0x40;
}

// Utility function to get Information Element name
function getInformationElementName(ieID: number): string {
  switch (ieID) {
    case 0x00: return "Concatenated SMS (8-bit reference)";
    case 0x08: return "Concatenated SMS (16-bit reference)";
    case 0x01: return "Special SMS Message Indication";
    case 0x04: return "Application Port Addressing (8-bit)";
    case 0x05: return "Application Port Addressing (16-bit)";
    case 0x06: return "SMSC Control Parameters";
    case 0x07: return "UDH Source Indicator";
    case 0x09: return "Wireless Control Message Protocol";
    case 0x20: return "RFC 822 E-Mail Header";
    case 0x21: return "Hyperlink Format Element";
    case 0x22: return "Reply Address Element";
    case 0x24: return "National Language Single Shift";
    case 0x25: return "National Language Locking Shift";
    default: return `Unknown IE (${ieID.toString(16).padStart(2, '0')})`;
  }
}

// Parse User Data Header
function parseUserDataHeader(data: number[]): {
  headerLength: number,
  multipart: boolean,
  multipartInfo?: {
    reference: number,
    totalParts: number,
    partNumber: number
  },
  informationElements: Array<{
    identifier: number,
    identifierName: string,
    length: number,
    data: number[],
    description: string
  }>
} {
  if (!data.length) return { headerLength: 0, multipart: false, informationElements: [] };
  
  const headerLength = data[0] + 1; // +1 for the length byte itself
  let offset = 1;
  let multipart = false;
  let multipartInfo;
  const informationElements: Array<{
    identifier: number,
    identifierName: string,
    length: number,
    data: number[],
    description: string
  }> = [];
  
  while (offset < headerLength) {
    // Ensure we don't read past the data
    if (offset + 1 >= data.length) break;
    
    const ieID = data[offset++];
    const ieLength = data[offset++];
    
    // Safety check for buffer overruns
    if (offset + ieLength > data.length) break;
    
    // Extract the element data
    const elementData = data.slice(offset, offset + ieLength);
    let description = "";
    
    // Concatenated SMS (8-bit reference)
    if (ieID === 0x00 && ieLength === 3) {
      multipart = true;
      multipartInfo = {
        reference: elementData[0],
        totalParts: elementData[1],
        partNumber: elementData[2]
      };
      description = `Reference: ${elementData[0]}, Parts: ${elementData[1]}, This Part: ${elementData[2]}`;
    }
    // Concatenated SMS (16-bit reference)
    else if (ieID === 0x08 && ieLength === 4) {
      multipart = true;
      multipartInfo = {
        reference: (elementData[0] << 8) | elementData[1],
        totalParts: elementData[2],
        partNumber: elementData[3]
      };
      description = `Reference: ${(elementData[0] << 8) | elementData[1]}, Parts: ${elementData[2]}, This Part: ${elementData[3]}`;
    }
    // Application Port Addressing (8-bit)
    else if (ieID === 0x04 && ieLength === 2) {
      description = `Destination Port: ${elementData[0]}, Source Port: ${elementData[1]}`;
    } 
    // Application Port Addressing (16-bit)
    else if (ieID === 0x05 && ieLength === 4) {
      const destPort = (elementData[0] << 8) | elementData[1];
      const srcPort = (elementData[2] << 8) | elementData[3];
      description = `Destination Port: ${destPort}, Source Port: ${srcPort}`;
    }
    // Special SMS Message Indication
    else if (ieID === 0x01 && ieLength === 2) {
      const msgType = elementData[0] & 0x0F;
      const msgTypeDesc = msgType === 0 ? "Voicemail" :
                         msgType === 1 ? "Fax" :
                         msgType === 2 ? "Email" :
                         msgType === 3 ? "Other" : "Unknown";
      const isStored = ((elementData[0] & 0x80) !== 0) ? "Store" : "Discard";
      const msgCount = elementData[1];
      description = `Type: ${msgTypeDesc}, ${isStored}, Count: ${msgCount}`;
    }
    // National Language Single Shift
    else if (ieID === 0x24 && ieLength === 1) {
      description = `Language Identifier: ${elementData[0]}`;
    }
    // National Language Locking Shift
    else if (ieID === 0x25 && ieLength === 1) {
      description = `Language Identifier: ${elementData[0]}`;
    }
    // Wireless Control Message Protocol
    else if (ieID === 0x09) {
      description = "WAP Push or other wireless protocol data";
    }
    // Other Information Elements
    else {
      description = `Data: ${bytesToHex(elementData)}`;
    }
    
    // Add to the information elements collection
    informationElements.push({
      identifier: ieID,
      identifierName: getInformationElementName(ieID),
      length: ieLength,
      data: elementData,
      description
    });
    
    offset += ieLength;
  }
  
  return { headerLength, multipart, multipartInfo, informationElements };
}

// Parse PDU
export function parsePDU(pduString: string, pduType: "sms-deliver" | "sms-submit"): PDUParseResult {
  // Remove any whitespace
  pduString = pduString.replace(/\s/g, '');
  
  // Convert to bytes array
  const bytes = hexToBytes(pduString);
  
  // Initialize result
  const fields: PDUField[] = [];
  let offset = 0;
  let headerInfo: PDUHeader = {
    messageType: pduType,
    smsc: '',
    encoding: '',
    multipart: false
  };
  let messageText = '';
  const hexStructure: { offset: string, bytes: string, description: string }[] = [];
  const structureBreakdown = {
    bytes: [] as string[],
    descriptions: [] as string[],
    colors: [] as string[],
    tooltips: [] as string[]
  };
  
  // Parse SMSC information
  const smscLength = bytes[offset++];
  fields.push({
    name: 'SMSC Length',
    value: smscLength.toString(),
    description: 'Length of the SMSC information in octets',
    offset: 0,
    length: 1,
    rawBytes: bytesToHex([smscLength])
  });
  
  hexStructure.push({
    offset: '0000',
    bytes: bytesToHex([smscLength]),
    description: 'SMSC Length'
  });
  
  structureBreakdown.bytes.push(bytesToHex([smscLength]));
  structureBreakdown.descriptions.push('SMSC Length');
  structureBreakdown.colors.push('primary');
  structureBreakdown.tooltips.push(`SMSC Information Length (${smscLength} octets)`);
  
  // If SMSC length is not 0
  if (smscLength > 0) {
    const smscType = bytes[offset++];
    const smscData = bytes.slice(offset, offset + smscLength - 1);
    offset += smscLength - 1;
    
    fields.push({
      name: 'SMSC Type-of-Address',
      value: smscType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${(smscType & 0x70) >> 4 === 1 ? 'International' : 'National'} number`,
      offset: 1,
      length: 1,
      rawBytes: bytesToHex([smscType])
    });
    
    headerInfo.smsc = parseAddress(smscLength - 1, smscType, smscData);
    
    fields.push({
      name: 'SMSC Number',
      value: headerInfo.smsc,
      description: 'SMSC phone number in semi-octet format',
      offset: 2,
      length: smscLength - 1,
      rawBytes: bytesToHex(smscData)
    });
    
    structureBreakdown.bytes.push(bytesToHex([smscType]));
    structureBreakdown.descriptions.push('SMSC Type-of-Address');
    structureBreakdown.colors.push('primary');
    structureBreakdown.tooltips.push(`Type-of-Address (${smscType.toString(16).padStart(2, '0')} = ${(smscType & 0x70) >> 4 === 1 ? 'International' : 'National'} format)`);
    
    for (const byte of smscData) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push('SMSC Number');
      structureBreakdown.colors.push('primary');
      structureBreakdown.tooltips.push(`SMSC Number (${headerInfo.smsc})`);
    }
  }
  
  // First octet
  const firstOctet = bytes[offset++];
  fields.push({
    name: 'First Octet',
    value: firstOctet.toString(16).padStart(2, '0'),
    description: `First octet of ${pduType.toUpperCase()}`,
    offset: offset - 1,
    length: 1,
    rawBytes: bytesToHex([firstOctet])
  });
  
  structureBreakdown.bytes.push(bytesToHex([firstOctet]));
  structureBreakdown.descriptions.push(`First Octet of ${pduType.toUpperCase()}`);
  structureBreakdown.colors.push('secondary');
  structureBreakdown.tooltips.push(`First Octet of ${pduType.toUpperCase()} (${firstOctet.toString(16).padStart(2, '0')})`);
  
  // Parse message type indicator
  const mti = firstOctet & 0x03;
  
  // For parsing purposes, we'll accept the provided PDU type from the user
  // and not strictly validate the MTI field to allow for flexibility
  // This makes the tool more useful for educational purposes
  
  if (pduType === 'sms-deliver') {
    // For SMS-DELIVER, report but don't error if MTI is unexpected
    if (mti !== 0) {
      // Just provide a description, don't warn - this is expected for examples
      console.log(`Note: MTI ${mti} for SMS-DELIVER (standard is 0)`);
    }
  } else if (pduType === 'sms-submit') {
    // For SMS-SUBMIT, report but don't error if MTI is unexpected
    if (mti !== 1) {
      // Just provide a description, don't warn - this is expected for examples
      console.log(`Note: MTI ${mti} for SMS-SUBMIT (standard is 1)`);
    }
  }
  
  // Determine the actual message type description based on MTI and user-provided type
  let mtiDescription = '';
  if (mti === 0) {
    mtiDescription = 'SMS-DELIVER message';
  } else if (mti === 1) {
    mtiDescription = 'SMS-SUBMIT message';
  } else if (mti === 2) {
    mtiDescription = 'SMS-STATUS-REPORT message';
  } else {
    mtiDescription = 'SMS-RESERVED message';
  }
  
  fields.push({
    name: 'TP-MTI',
    value: mti.toString(),
    description: `${mtiDescription} (Using ${pduType.toUpperCase()} format for parsing)`
  });
  
  // Parse other flags
  if (pduType === 'sms-deliver') {
    // SMS-DELIVER specific flags
    fields.push({
      name: 'TP-MMS',
      value: ((firstOctet & 0x04) >> 2).toString(),
      description: (firstOctet & 0x04) ? 'No more messages to send' : 'More messages to send'
    });
    
    fields.push({
      name: 'TP-SRI',
      value: ((firstOctet & 0x20) >> 5).toString(),
      description: (firstOctet & 0x20) ? 'Status report requested' : 'Status report not requested'
    });
    
    fields.push({
      name: 'TP-UDHI',
      value: ((firstOctet & 0x40) >> 6).toString(),
      description: (firstOctet & 0x40) ? 'User Data Header included' : 'No User Data Header'
    });
    
    fields.push({
      name: 'TP-RP',
      value: ((firstOctet & 0x80) >> 7).toString(),
      description: (firstOctet & 0x80) ? 'Reply path exists' : 'No reply path'
    });
    
    // Originating Address
    const origAddrLength = bytes[offset++];
    const origAddrType = bytes[offset++];
    const origAddrData = bytes.slice(offset, offset + Math.ceil(origAddrLength / 2));
    offset += Math.ceil(origAddrLength / 2);
    
    headerInfo.sender = parseAddress(origAddrLength, origAddrType, origAddrData);
    
    fields.push({
      name: 'Originating Address Length',
      value: origAddrLength.toString(),
      description: `Length of the originating address: ${origAddrLength} digits`,
      offset: offset - origAddrData.length - 2,
      length: 1,
      rawBytes: bytesToHex([origAddrLength])
    });
    
    fields.push({
      name: 'Originating Address Type',
      value: origAddrType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${(origAddrType & 0x70) >> 4 === 1 ? 'International' : 'National'} number`,
      offset: offset - origAddrData.length - 1,
      length: 1,
      rawBytes: bytesToHex([origAddrType])
    });
    
    fields.push({
      name: 'Originating Address',
      value: headerInfo.sender,
      description: 'Sender phone number',
      offset: offset - origAddrData.length,
      length: origAddrData.length,
      rawBytes: bytesToHex(origAddrData)
    });
    
    structureBreakdown.bytes.push(bytesToHex([origAddrLength]));
    structureBreakdown.descriptions.push('Sender Address Length');
    structureBreakdown.colors.push('secondary');
    structureBreakdown.tooltips.push(`Sender Address Length (${origAddrLength} digits)`);
    
    structureBreakdown.bytes.push(bytesToHex([origAddrType]));
    structureBreakdown.descriptions.push('Sender Type-of-Address');
    structureBreakdown.colors.push('secondary');
    structureBreakdown.tooltips.push(`Sender Type-of-Address (${origAddrType.toString(16).padStart(2, '0')} = ${(origAddrType & 0x70) >> 4 === 1 ? 'International' : 'National'} format)`);
    
    for (const byte of origAddrData) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push('Sender Number');
      structureBreakdown.colors.push('secondary');
      structureBreakdown.tooltips.push(`Sender Number (${headerInfo.sender})`);
    }
    
  } else if (pduType === 'sms-submit') {
    // SMS-SUBMIT specific flags
    fields.push({
      name: 'TP-RD',
      value: ((firstOctet & 0x04) >> 2).toString(),
      description: (firstOctet & 0x04) ? 'Reject duplicates' : 'Allow duplicates'
    });
    
    fields.push({
      name: 'TP-VPF',
      value: ((firstOctet & 0x18) >> 3).toString(),
      description: (() => {
        const vpf = (firstOctet & 0x18) >> 3;
        if (vpf === 0) return 'No validity period specified';
        if (vpf === 1) return 'Validity period format: enhanced';
        if (vpf === 2) return 'Validity period format: relative';
        return 'Validity period format: absolute';
      })()
    });
    
    fields.push({
      name: 'TP-SRR',
      value: ((firstOctet & 0x20) >> 5).toString(),
      description: (firstOctet & 0x20) ? 'Status report requested' : 'Status report not requested'
    });
    
    fields.push({
      name: 'TP-UDHI',
      value: ((firstOctet & 0x40) >> 6).toString(),
      description: (firstOctet & 0x40) ? 'User Data Header included' : 'No User Data Header'
    });
    
    fields.push({
      name: 'TP-RP',
      value: ((firstOctet & 0x80) >> 7).toString(),
      description: (firstOctet & 0x80) ? 'Reply path exists' : 'No reply path'
    });
    
    // Check all bounds for SMS-SUBMIT specific parsing
    // This helps handle potentially malformed or truncated PDUs
    if (offset >= bytes.length) {
      throw new Error(`PDU parsing error: Incomplete SMS-SUBMIT PDU. Expected Message Reference field at offset ${offset}.`);
    }
    
    // Message Reference
    const messageRef = bytes[offset++];
    fields.push({
      name: 'TP-Message-Reference',
      value: messageRef.toString(),
      description: 'Message reference number',
      offset: offset - 1,
      length: 1,
      rawBytes: bytesToHex([messageRef])
    });
    
    structureBreakdown.bytes.push(bytesToHex([messageRef]));
    structureBreakdown.descriptions.push('Message Reference');
    structureBreakdown.colors.push('secondary');
    structureBreakdown.tooltips.push(`Message Reference (${messageRef})`);
    
    // Bounds check before reading Destination Address
    if (offset >= bytes.length) {
      throw new Error(`PDU parsing error: Incomplete SMS-SUBMIT PDU. Expected Destination Address Length field at offset ${offset}.`);
    }
    
    // Destination Address
    const destAddrLength = bytes[offset++];
    
    // Check for destination address length
    // In SMS PDUs, address length can be in semi-octets, so 0x0B could mean 11 semi-octets
    if (destAddrLength > 32) {
      console.log(`Note: Destination address length is ${destAddrLength} semi-octets`);
      
      // Add a note about this for educational purposes
      fields.push({
        name: 'Note',
        value: 'Address Length',
        description: `Address length of ${destAddrLength} semi-octets is interpreted as ${Math.ceil(destAddrLength/2)} octets`,
      });
    }
    
    // Bounds check before reading Address Type
    if (offset >= bytes.length) {
      throw new Error(`PDU parsing error: Incomplete SMS-SUBMIT PDU. Expected Destination Address Type field at offset ${offset}.`);
    }
    
    const destAddrType = bytes[offset++];
    
    // Calculate actual byte length for destination address
    // The address length is in semi-octets (4 bits), while we need to fetch full octets (8 bits)
    // For example, an address length of 11 needs 6 octets (ceil(11/2))
    const destAddrDataLength = Math.ceil(destAddrLength / 2);
    
    // Final bounds check and adjustment
    let actualDestAddrDataLength = destAddrDataLength;
    if (offset + destAddrDataLength > bytes.length) {
      // For SMS-SUBMIT, we want to be more lenient to improve compatibility
      // We'll just use whatever bytes are available
      console.warn(`Not enough bytes for full destination address. Expected ${destAddrDataLength} at offset ${offset}, but only ${bytes.length - offset} remain. Will use available bytes.`);
      actualDestAddrDataLength = Math.max(0, bytes.length - offset);
      
      // Add a note about this adjustment
      fields.push({
        name: 'Warning',
        value: 'Address Data Truncated',
        description: `PDU doesn't contain all expected address data. Using available ${actualDestAddrDataLength} byte(s).`,
      });
    }
    
    // Use the safer length we calculated
    const destAddrData = actualDestAddrDataLength > 0 ? 
      bytes.slice(offset, offset + actualDestAddrDataLength) : 
      [];
    
    offset += actualDestAddrDataLength;
    
    try {
      const parsedAddress = parseAddress(destAddrLength, destAddrType, destAddrData);
      
      // Add validation for the recipient - if it contains many non-printable characters
      // it's likely that the parsing resulted in garbage due to malformed PDU
      const nonPrintableCount = (parsedAddress.match(/[^\x20-\x7E]/g) || []).length;
      const printablePercent = parsedAddress.length > 0 ? 
        ((parsedAddress.length - nonPrintableCount) / parsedAddress.length) * 100 : 
        0;
        
      if (printablePercent < 50 && parsedAddress.length > 10) {
        // If less than 50% of the characters are printable, we likely have a bad parse
        console.warn('Recipient address contains mostly non-printable characters, may be malformed');
        headerInfo.recipient = `[Parsing Error: Malformed Address]`;
        
        fields.push({
          name: 'Warning',
          value: 'Address Format Invalid',
          description: `The destination address appears to be malformed or corrupted`,
        });
      } else {
        headerInfo.recipient = parsedAddress;
      }
      
      fields.push({
        name: 'Destination Address Length',
        value: destAddrLength.toString(),
        description: `Length of the destination address: ${destAddrLength} digits`,
        offset: offset - destAddrData.length - 2,
        length: 1,
        rawBytes: bytesToHex([destAddrLength])
      });
    } catch (error) {
      console.error('Error parsing recipient address:', error);
      headerInfo.recipient = '[PARSING_ERROR]';
      
      // Continue parsing as much as possible despite the error
      fields.push({
        name: 'Destination Address Length',
        value: destAddrLength.toString(),
        description: `Address parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        offset: offset - destAddrData.length - 2,
        length: 1,
        rawBytes: bytesToHex([destAddrLength])
      });
    }
    
    fields.push({
      name: 'Destination Address Type',
      value: destAddrType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${(destAddrType & 0x70) >> 4 === 1 ? 'International' : 'National'} number`,
      offset: offset - destAddrData.length - 1,
      length: 1,
      rawBytes: bytesToHex([destAddrType])
    });
    
    fields.push({
      name: 'Destination Address',
      value: headerInfo.recipient,
      description: 'Recipient phone number',
      offset: offset - destAddrData.length,
      length: destAddrData.length,
      rawBytes: bytesToHex(destAddrData)
    });
    
    structureBreakdown.bytes.push(bytesToHex([destAddrLength]));
    structureBreakdown.descriptions.push('Destination Address Length');
    structureBreakdown.colors.push('secondary');
    structureBreakdown.tooltips.push(`Destination Address Length (${destAddrLength} digits)`);
    
    structureBreakdown.bytes.push(bytesToHex([destAddrType]));
    structureBreakdown.descriptions.push('Destination Type-of-Address');
    structureBreakdown.colors.push('secondary');
    structureBreakdown.tooltips.push(`Destination Type-of-Address (${destAddrType.toString(16).padStart(2, '0')} = ${(destAddrType & 0x70) >> 4 === 1 ? 'International' : 'National'} format)`);
    
    for (const byte of destAddrData) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push('Destination Number');
      structureBreakdown.colors.push('secondary');
      structureBreakdown.tooltips.push(`Destination Number (${headerInfo.recipient})`);
    }
  }
  
  // Protocol Identifier
  // Check if we're within array bounds
  if (offset >= bytes.length) {
    throw new Error(`PDU parsing error: Attempted to access byte at offset ${offset} but PDU is only ${bytes.length} bytes long. This may be an unsupported or malformed PDU format.`);
  }
  
  const protocolId = bytes[offset++];
  fields.push({
    name: 'Protocol Identifier',
    value: protocolId.toString(16).padStart(2, '0'),
    description: protocolId === 0 ? 'Standard SMS' : 'Protocol-specific message',
    offset: offset - 1,
    length: 1,
    rawBytes: bytesToHex([protocolId])
  });
  
  structureBreakdown.bytes.push(bytesToHex([protocolId]));
  structureBreakdown.descriptions.push('Protocol Identifier');
  structureBreakdown.colors.push('neutral');
  structureBreakdown.tooltips.push(`Protocol Identifier (${protocolId.toString(16).padStart(2, '0')} = ${protocolId === 0 ? 'Standard SMS' : 'Protocol-specific message'})`);
  
  // Data Coding Scheme
  // Check bounds
  if (offset >= bytes.length) {
    throw new Error(`PDU parsing error: Attempted to access byte at offset ${offset} but PDU is only ${bytes.length} bytes long. This may be an unsupported or malformed PDU format.`);
  }
  
  const dcs = bytes[offset++];
  fields.push({
    name: 'Data Coding Scheme',
    value: dcs.toString(16).padStart(2, '0'),
    description: dcs === 0 ? '7-bit default alphabet' : dcs === 4 ? '8-bit data' : dcs === 8 ? 'UCS2 (16-bit)' : 'Unknown encoding',
    offset: offset - 1,
    length: 1,
    rawBytes: bytesToHex([dcs])
  });
  
  structureBreakdown.bytes.push(bytesToHex([dcs]));
  structureBreakdown.descriptions.push('Data Coding Scheme');
  structureBreakdown.colors.push('neutral');
  structureBreakdown.tooltips.push(`Data Coding Scheme (${dcs.toString(16).padStart(2, '0')} = ${dcs === 0 ? '7-bit default alphabet' : dcs === 4 ? '8-bit data' : dcs === 8 ? 'UCS2 (16-bit)' : 'Unknown encoding'})`);
  
  // Set encoding in header
  if (dcs === 0) headerInfo.encoding = 'GSM 7-bit';
  else if (dcs === 4) headerInfo.encoding = '8-bit data';
  else if (dcs === 8) headerInfo.encoding = 'UCS2 (16-bit)';
  else headerInfo.encoding = 'Unknown';
  
  // Service Centre Timestamp or Validity Period
  if (pduType === 'sms-deliver') {
    // Service Centre Timestamp
    const timestamp = bytes.slice(offset, offset + 7);
    offset += 7;
    
    headerInfo.timestamp = parseTimestamp(timestamp);
    
    fields.push({
      name: 'Service Centre Timestamp',
      value: headerInfo.timestamp,
      description: 'Timestamp when the SMS was received by the SMSC',
      offset: offset - 7,
      length: 7,
      rawBytes: bytesToHex(timestamp)
    });
    
    for (const byte of timestamp) {
      structureBreakdown.bytes.push(bytesToHex([byte]));
      structureBreakdown.descriptions.push('Timestamp');
      structureBreakdown.colors.push('accent');
      structureBreakdown.tooltips.push(`Timestamp (${headerInfo.timestamp})`);
    }
  } else if (pduType === 'sms-submit') {
    // Validity Period (optional)
    const vpf = (firstOctet & 0x18) >> 3;
    if (vpf === 2) {
      // Relative format
      const validityPeriod = bytes[offset++];
      fields.push({
        name: 'Validity Period',
        value: validityPeriod.toString(16).padStart(2, '0'),
        description: 'Period during which the message is valid',
        offset: offset - 1,
        length: 1,
        rawBytes: bytesToHex([validityPeriod])
      });
      
      structureBreakdown.bytes.push(bytesToHex([validityPeriod]));
      structureBreakdown.descriptions.push('Validity Period');
      structureBreakdown.colors.push('accent');
      structureBreakdown.tooltips.push(`Validity Period (${validityPeriod.toString(16).padStart(2, '0')})`);
    } else if (vpf === 3) {
      // Absolute format
      const validityPeriod = bytes.slice(offset, offset + 7);
      offset += 7;
      
      const vpTimestamp = parseTimestamp(validityPeriod);
      fields.push({
        name: 'Validity Period',
        value: vpTimestamp,
        description: 'Date and time when the message validity period expires',
        offset: offset - 7,
        length: 7,
        rawBytes: bytesToHex(validityPeriod)
      });
      
      for (const byte of validityPeriod) {
        structureBreakdown.bytes.push(bytesToHex([byte]));
        structureBreakdown.descriptions.push('Validity Period');
        structureBreakdown.colors.push('accent');
        structureBreakdown.tooltips.push(`Validity Period (${vpTimestamp})`);
      }
    }
  }
  
  // User Data Length
  const udLength = bytes[offset++];
  fields.push({
    name: 'User Data Length',
    value: udLength.toString(),
    description: `Length of the user data: ${udLength} ${dcs === 0 ? 'characters (7-bit)' : dcs === 8 ? 'characters (UCS2)' : 'bytes (8-bit)'}`,
    offset: offset - 1,
    length: 1,
    rawBytes: bytesToHex([udLength])
  });
  
  structureBreakdown.bytes.push(bytesToHex([udLength]));
  structureBreakdown.descriptions.push('User Data Length');
  structureBreakdown.colors.push('danger');
  structureBreakdown.tooltips.push(`User Data Length (${udLength} ${dcs === 0 ? 'characters (7-bit)' : dcs === 8 ? 'characters (UCS2)' : 'bytes (8-bit)'})`);
  
  // User Data
  const userData = bytes.slice(offset);
  
  // Check for User Data Header
  let headerLength = 0;
  if (hasUserDataHeader(firstOctet)) {
    const udhInfo = parseUserDataHeader(userData);
    headerLength = udhInfo.headerLength;
    headerInfo.multipart = udhInfo.multipart;
    headerInfo.multipartInfo = udhInfo.multipartInfo;
    
    // Add UDH length field
    fields.push({
      name: 'User Data Header Length',
      value: userData[0].toString(),
      description: `Length of the user data header: ${userData[0]} bytes`,
      offset: offset,
      length: 1,
      rawBytes: bytesToHex([userData[0]])
    });
    
    // Add the UDHL to the visual structure breakdown
    structureBreakdown.bytes.push(bytesToHex([userData[0]]));
    structureBreakdown.descriptions.push('UDH Length');
    structureBreakdown.colors.push('info');
    structureBreakdown.tooltips.push(`User Data Header Length (${userData[0]} bytes)`);
    
    // Process each information element
    for (const ie of udhInfo.informationElements) {
      const prevField = fields[fields.length - 1];
      const ieOffset = prevField && prevField.offset !== undefined && prevField.length !== undefined 
                      ? prevField.offset + prevField.length
                      : offset + 1; // fallback
      
      // Add IE details to field list
      fields.push({
        name: ie.identifierName,
        value: ie.description,
        description: `Information Element ID: ${ie.identifier.toString(16).padStart(2, '0')}, Length: ${ie.length}`,
        offset: ieOffset,
        length: ie.length + 2, // +2 for the IE ID and length bytes
        rawBytes: bytesToHex([ie.identifier, ie.length, ...ie.data])
      });
      
      // Add IE to visual structure breakdown
      const ieIdByte = bytesToHex([ie.identifier]);
      const ieLengthByte = bytesToHex([ie.length]);
      
      structureBreakdown.bytes.push(ieIdByte);
      structureBreakdown.descriptions.push('IE Identifier');
      structureBreakdown.colors.push('info');
      structureBreakdown.tooltips.push(`Information Element ID: ${ie.identifier.toString(16).padStart(2, '0')} (${ie.identifierName})`);
      
      structureBreakdown.bytes.push(ieLengthByte);
      structureBreakdown.descriptions.push('IE Length');
      structureBreakdown.colors.push('info');
      structureBreakdown.tooltips.push(`Information Element Length: ${ie.length} bytes`);
      
      // Add IE data bytes with a different color
      for (const dataByte of ie.data) {
        structureBreakdown.bytes.push(bytesToHex([dataByte]));
        structureBreakdown.descriptions.push('IE Data');
        structureBreakdown.colors.push('info-light');
        structureBreakdown.tooltips.push(`IE Data: ${ie.description}`);
      }
    }
    
    // If it's a multipart message, add a special summary field
    if (headerInfo.multipart && headerInfo.multipartInfo) {
      fields.push({
        name: 'Multipart Message',
        value: `Part ${headerInfo.multipartInfo.partNumber} of ${headerInfo.multipartInfo.totalParts}`,
        description: `This message is part of a concatenated SMS with reference number ${headerInfo.multipartInfo.reference}`,
      });
    }
  }
  
  // Parse the actual message content
  if (dcs === 0) {
    // 7-bit GSM alphabet
    const headerBits = headerLength * 8;
    const headerSeptets = Math.ceil(headerBits / 7);
    const messageSeptets = udLength - headerSeptets;
    
    if (headerLength > 0) {
      // Skip header septets
      messageText = parse7BitCharacters(userData.slice(headerLength), messageSeptets);
    } else {
      messageText = parse7BitCharacters(userData, udLength);
    }
  } else if (dcs === 8) {
    // UCS2 encoding
    if (headerLength > 0) {
      messageText = parseUCS2Characters(userData.slice(headerLength), udLength * 2 - headerLength * 2);
    } else {
      messageText = parseUCS2Characters(userData, udLength * 2);
    }
  } else {
    // 8-bit data or unknown, just convert to hex
    messageText = bytesToHex(userData.slice(headerLength));
  }
  
  fields.push({
    name: 'User Data',
    value: messageText,
    description: 'Message content',
    offset: offset,
    length: userData.length,
    rawBytes: bytesToHex(userData)
  });
  
  for (const byte of userData) {
    structureBreakdown.bytes.push(bytesToHex([byte]));
    structureBreakdown.descriptions.push('User Data');
    structureBreakdown.colors.push('danger');
    structureBreakdown.tooltips.push(`User Data: "${messageText}"`);
  }
  
  // Return parsed result
  return {
    header: headerInfo,
    message: messageText,
    properties: fields,
    hexStructure: hexStructure,
    structureBreakdown
  };
}

// Encode PDU
export function encodePDU(
  pduType: "sms-deliver" | "sms-submit",
  message: string,
  recipient: string,
  smsc?: string,
  encoding: "7bit" | "8bit" | "ucs2" = "7bit",
  statusReport: boolean = false,
  replyPath: boolean = false,
  validityPeriod?: string
): PDUEncodeResult {
  // Initialize byte array
  const bytes: number[] = [];
  const fields: PDUField[] = [];
  
  // 1. SMSC Information
  if (smsc) {
    // Remove any non-digit characters
    const cleanSmsc = smsc.replace(/\D/g, '');
    
    // International format starts with '+'
    const isInternational = smsc.startsWith('+');
    
    // Convert SMSC to semi-octets
    const smscData = numberToSemiOctets(cleanSmsc);
    
    // SMSC Length (1 byte for type-of-address + smsc data length)
    const smscLength = 1 + smscData.length;
    bytes.push(smscLength);
    
    // SMSC Type-of-Address (91 for international format, 81 for national)
    const smscType = isInternational ? 0x91 : 0x81;
    bytes.push(smscType);
    
    // SMSC Number
    bytes.push(...smscData);
    
    fields.push({
      name: 'SMSC Length',
      value: smscLength.toString(),
      description: 'Length of the SMSC information in octets',
      rawBytes: bytesToHex([smscLength])
    });
    
    fields.push({
      name: 'SMSC Type-of-Address',
      value: smscType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${isInternational ? 'International' : 'National'} number`,
      rawBytes: bytesToHex([smscType])
    });
    
    fields.push({
      name: 'SMSC Number',
      value: smsc,
      description: 'SMSC phone number in semi-octet format',
      rawBytes: bytesToHex(smscData)
    });
  } else {
    // No SMSC (use default)
    bytes.push(0);
    
    fields.push({
      name: 'SMSC Length',
      value: '0',
      description: 'Use default SMSC',
      rawBytes: '00'
    });
  }
  
  // 2. First Octet
  let firstOctet = 0;
  
  if (pduType === 'sms-deliver') {
    // SMS-DELIVER: MTI = 00
    firstOctet |= 0x00; // MTI = 00 (SMS-DELIVER)
    
    // Set status report indicator if requested
    if (statusReport) {
      firstOctet |= 0x20; // TP-SRI = 1
    }
    
    // Set reply path if requested
    if (replyPath) {
      firstOctet |= 0x80; // TP-RP = 1
    }
  } else {
    // SMS-SUBMIT: MTI = 01
    firstOctet |= 0x01; // MTI = 01 (SMS-SUBMIT)
    
    // Set validity period flag if provided
    if (validityPeriod) {
      firstOctet |= 0x10; // TP-VPF = 10 (relative format)
    }
    
    // Set status report request if requested
    if (statusReport) {
      firstOctet |= 0x20; // TP-SRR = 1
    }
    
    // Set reply path if requested
    if (replyPath) {
      firstOctet |= 0x80; // TP-RP = 1
    }
  }
  
  bytes.push(firstOctet);
  
  fields.push({
    name: 'First Octet',
    value: firstOctet.toString(16).padStart(2, '0'),
    description: `First octet of ${pduType.toUpperCase()}`,
    rawBytes: bytesToHex([firstOctet])
  });
  
  // 3. Message specific fields
  if (pduType === 'sms-deliver') {
    // 3a. Originating Address (sender)
    // For our encoder example, use a default sender if not provided
    const sender = '+123456789';
    const cleanSender = sender.replace(/\D/g, '');
    const isInternational = sender.startsWith('+');
    
    // Length
    const senderLength = cleanSender.length;
    bytes.push(senderLength);
    
    // Type-of-Address (91 for international, 81 for national)
    const senderType = isInternational ? 0x91 : 0x81;
    bytes.push(senderType);
    
    // Sender number in semi-octets
    const senderData = numberToSemiOctets(cleanSender);
    bytes.push(...senderData);
    
    fields.push({
      name: 'Originating Address Length',
      value: senderLength.toString(),
      description: `Length of the originating address: ${senderLength} digits`,
      rawBytes: bytesToHex([senderLength])
    });
    
    fields.push({
      name: 'Originating Address Type',
      value: senderType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${isInternational ? 'International' : 'National'} number`,
      rawBytes: bytesToHex([senderType])
    });
    
    fields.push({
      name: 'Originating Address',
      value: sender,
      description: 'Sender phone number',
      rawBytes: bytesToHex(senderData)
    });
    
  } else {
    // 3b. SMS-SUBMIT specific fields
    
    // Message Reference (can be 0)
    bytes.push(0);
    
    fields.push({
      name: 'TP-Message-Reference',
      value: '0',
      description: 'Message reference number (0)',
      rawBytes: '00'
    });
    
    // Destination Address (recipient)
    const cleanRecipient = recipient.replace(/\D/g, '');
    const isInternational = recipient.startsWith('+');
    
    // Length
    const recipientLength = cleanRecipient.length;
    bytes.push(recipientLength);
    
    // Type-of-Address (91 for international, 81 for national)
    const recipientType = isInternational ? 0x91 : 0x81;
    bytes.push(recipientType);
    
    // Recipient number in semi-octets
    const recipientData = numberToSemiOctets(cleanRecipient);
    bytes.push(...recipientData);
    
    fields.push({
      name: 'Destination Address Length',
      value: recipientLength.toString(),
      description: `Length of the destination address: ${recipientLength} digits`,
      rawBytes: bytesToHex([recipientLength])
    });
    
    fields.push({
      name: 'Destination Address Type',
      value: recipientType.toString(16).padStart(2, '0'),
      description: `Type-of-Address: ${isInternational ? 'International' : 'National'} number`,
      rawBytes: bytesToHex([recipientType])
    });
    
    fields.push({
      name: 'Destination Address',
      value: recipient,
      description: 'Recipient phone number',
      rawBytes: bytesToHex(recipientData)
    });
  }
  
  // 4. Protocol Identifier (standard SMS)
  bytes.push(0);
  
  fields.push({
    name: 'Protocol Identifier',
    value: '00',
    description: 'Standard SMS',
    rawBytes: '00'
  });
  
  // 5. Data Coding Scheme
  let dcs = 0;
  if (encoding === '7bit') {
    dcs = 0x00; // GSM 7-bit default alphabet
  } else if (encoding === '8bit') {
    dcs = 0x04; // 8-bit data
  } else if (encoding === 'ucs2') {
    dcs = 0x08; // UCS2 (16-bit)
  }
  
  bytes.push(dcs);
  
  fields.push({
    name: 'Data Coding Scheme',
    value: dcs.toString(16).padStart(2, '0'),
    description: encoding === '7bit' ? '7-bit default alphabet' : encoding === '8bit' ? '8-bit data' : 'UCS2 (16-bit)',
    rawBytes: bytesToHex([dcs])
  });
  
  // 6. Service Centre Timestamp or Validity Period
  if (pduType === 'sms-deliver') {
    // Service Centre Timestamp (current time)
    const now = new Date();
    const year = parseInt(now.getFullYear().toString().slice(-2), 10);
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    
    // Convert to semi-octets with swapped nibbles
    bytes.push(
      swapNibbles(year),
      swapNibbles(month),
      swapNibbles(day),
      swapNibbles(hour),
      swapNibbles(minute),
      swapNibbles(second),
      0x00 // Time zone (UTC+0)
    );
    
    const timestamp = `20${year.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')} (UTC+0)`;
    
    fields.push({
      name: 'Service Centre Timestamp',
      value: timestamp,
      description: 'Timestamp when the SMS was received by the SMSC',
      rawBytes: bytesToHex([
        swapNibbles(year),
        swapNibbles(month),
        swapNibbles(day),
        swapNibbles(hour),
        swapNibbles(minute),
        swapNibbles(second),
        0x00
      ])
    });
  } else if (pduType === 'sms-submit' && validityPeriod) {
    // Validity Period (relative format)
    let vpValue = 0;
    
    if (validityPeriod === '12h') vpValue = 0x0B; // 12 hours
    else if (validityPeriod === '1d') vpValue = 0xA7; // 1 day
    else if (validityPeriod === '3d') vpValue = 0xA9; // 3 days
    else if (validityPeriod === '1w') vpValue = 0xAD; // 1 week
    else if (validityPeriod === 'max') vpValue = 0xFF; // Maximum (~63 weeks)
    
    bytes.push(vpValue);
    
    fields.push({
      name: 'Validity Period',
      value: vpValue.toString(16).padStart(2, '0'),
      description: `Validity period: ${validityPeriod}`,
      rawBytes: bytesToHex([vpValue])
    });
  }
  
  // 7. User Data
  let userData: number[] = [];
  
  if (encoding === '7bit') {
    userData = encode7BitCharacters(message);
  } else if (encoding === 'ucs2') {
    userData = encodeUCS2Characters(message);
  } else {
    // 8-bit, just convert to bytes
    for (let i = 0; i < message.length; i++) {
      userData.push(message.charCodeAt(i));
    }
  }
  
  // 8. User Data Length
  let udLength = 0;
  
  if (encoding === '7bit') {
    udLength = message.length;
  } else if (encoding === 'ucs2') {
    udLength = message.length;
  } else {
    udLength = userData.length;
  }
  
  bytes.push(udLength);
  
  fields.push({
    name: 'User Data Length',
    value: udLength.toString(),
    description: `Length of the user data: ${udLength} ${encoding === '7bit' ? 'characters (7-bit)' : encoding === 'ucs2' ? 'characters (UCS2)' : 'bytes (8-bit)'}`,
    rawBytes: bytesToHex([udLength])
  });
  
  // 9. User Data
  bytes.push(...userData);
  
  fields.push({
    name: 'User Data',
    value: message,
    description: 'Message content',
    rawBytes: bytesToHex(userData)
  });
  
  // Convert the entire PDU to a hex string
  const pduString = bytesToHex(bytes);
  
  // Create header info
  const header: PDUHeader = {
    messageType: pduType,
    smsc: smsc || 'Default SMSC',
    encoding: encoding === '7bit' ? 'GSM 7-bit' : encoding === '8bit' ? '8-bit data' : 'UCS2 (16-bit)',
    multipart: false,
  };
  
  if (pduType === 'sms-deliver') {
    header.sender = '+123456789'; // Default sender for our example
    header.timestamp = new Date().toISOString();
  } else {
    header.recipient = recipient;
  }
  
  return {
    pduString,
    header,
    message,
    breakdown: fields
  };
}
