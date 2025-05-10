import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Learning content sections
type LearnSection = "overview" | "pdu-formats" | "encodings" | "fields" | "multipart";

export default function PDULearn() {
  const [section, setSection] = useState<LearnSection>("overview");

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">3GPP 23.040 SMS Specification Guide</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={section === "overview" ? "default" : "outline"}
            size="sm"
            onClick={() => setSection("overview")}
          >
            Overview
          </Button>
          <Button 
            variant={section === "pdu-formats" ? "default" : "outline"}
            size="sm"
            onClick={() => setSection("pdu-formats")}
          >
            PDU Formats
          </Button>
          <Button 
            variant={section === "encodings" ? "default" : "outline"}
            size="sm"
            onClick={() => setSection("encodings")}
          >
            Character Encodings
          </Button>
          <Button 
            variant={section === "fields" ? "default" : "outline"}
            size="sm"
            onClick={() => setSection("fields")}
          >
            Fields Reference
          </Button>
          <Button 
            variant={section === "multipart" ? "default" : "outline"}
            size="sm"
            onClick={() => setSection("multipart")}
          >
            Multipart SMS
          </Button>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {section === "overview" && (
            <>
              <h3>What is 3GPP 23.040?</h3>
              <p>
                The 3GPP 23.040 specification defines the Short Message Service (SMS) for GSM and UMTS networks. 
                It details the format, protocols, and procedures for exchanging text messages between mobile devices 
                and the SMS Center (SMSC).
              </p>
              
              <h3>PDU Format Overview</h3>
              <p>
                SMS messages are transmitted in a binary format called Protocol Data Units (PDUs). These PDUs contain 
                not only the message text but also metadata like the sender's number, timestamp, and other control information.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Main PDU Types</h4>
                <ul className="mt-2">
                  <li><strong>SMS-DELIVER</strong>: Mobile-terminated message (network to phone)</li>
                  <li><strong>SMS-SUBMIT</strong>: Mobile-originated message (phone to network)</li>
                  <li><strong>SMS-STATUS-REPORT</strong>: Delivery status report</li>
                  <li><strong>SMS-COMMAND</strong>: Commands sent to the SMSC</li>
                </ul>
              </div>
              
              <h3>How SMS PDUs Work</h3>
              <p>
                When you send a text message from your phone, your device creates an SMS-SUBMIT PDU that includes:
              </p>
              <ul>
                <li>The recipient's phone number</li>
                <li>The message text (encoded in a specific format)</li>
                <li>Control information like validity period</li>
                <li>Service center information</li>
              </ul>
              
              <p>
                This PDU is sent to the SMSC (Short Message Service Center), which processes it and forwards it to the recipient's device as an SMS-DELIVER PDU. The SMS-DELIVER PDU includes similar information, but with sender details instead of recipient details, and a timestamp for when the message was received by the SMSC.
              </p>
            </>
          )}

          {section === "pdu-formats" && (
            <>
              <h3>PDU Formats in Detail</h3>
              <p>
                The 3GPP 23.040 specification defines several PDU formats, but the two most common are SMS-DELIVER and SMS-SUBMIT. Each has a specific structure that enables network elements to correctly interpret and process the message.
              </p>
              
              <h4>SMS-DELIVER Format</h4>
              <p>
                This is the format used by the SMSC to deliver a message to a mobile device. Here's the structure:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Size (octets)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SMSC Information</TableCell>
                    <TableCell>1-12</TableCell>
                    <TableCell>Length byte + Type byte + Address (variable)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>First Octet (MTI)</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Message Type Indicator and flags (00xxxxxx)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Originating Address</TableCell>
                    <TableCell>2-12</TableCell>
                    <TableCell>Length byte + Type byte + Address (variable)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Protocol Identifier</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Protocol information</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Data Coding Scheme</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Message encoding information</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Service Centre Timestamp</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>Time when SMSC received the message</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Data Length</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Length of user data in characters/bytes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Data</TableCell>
                    <TableCell>Variable</TableCell>
                    <TableCell>Message content (may include header)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4 className="mt-4">SMS-SUBMIT Format</h4>
              <p>
                This is the format used by a mobile device to send a message to the SMSC. Here's the structure:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Size (octets)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>SMSC Information</TableCell>
                    <TableCell>1-12</TableCell>
                    <TableCell>Length byte + Type byte + Address (variable)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>First Octet (MTI)</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Message Type Indicator and flags (01xxxxxx)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Message Reference</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Message identifier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Destination Address</TableCell>
                    <TableCell>2-12</TableCell>
                    <TableCell>Length byte + Type byte + Address (variable)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Protocol Identifier</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Protocol information</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Data Coding Scheme</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Message encoding information</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Validity Period</TableCell>
                    <TableCell>0, 1, or 7</TableCell>
                    <TableCell>How long the SMSC should try to deliver</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Data Length</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Length of user data in characters/bytes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>User Data</TableCell>
                    <TableCell>Variable</TableCell>
                    <TableCell>Message content (may include header)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}

          {section === "encodings" && (
            <>
              <h3>Character Encodings in SMS</h3>
              <p>
                SMS messages can use different character encodings, which affects the maximum message length:
              </p>
              
              <h4>GSM 7-bit Default Alphabet</h4>
              <p>
                This is the standard encoding for SMS messages in GSM networks. It can represent 128 characters including:
              </p>
              <ul>
                <li>ASCII printable characters (A-Z, a-z, 0-9, common punctuation)</li>
                <li>Some European language characters (é, ä, ö, etc.)</li>
                <li>Special symbols and control characters</li>
              </ul>
              <p>
                <strong>Maximum characters per message:</strong> 160<br />
                <strong>Maximum characters per segment in multipart messages:</strong> 153
              </p>
              <p>
                The 7-bit encoding is space-efficient but doesn't support many non-Latin scripts or emojis.
              </p>
              
              <h4>8-bit Data</h4>
              <p>
                This encoding is used for binary data (not all networks support it for standard SMS):
              </p>
              <ul>
                <li>Used for non-textual data like ringtones, logos, etc.</li>
                <li>Each character uses a full byte</li>
              </ul>
              <p>
                <strong>Maximum bytes per message:</strong> 140<br />
                <strong>Maximum bytes per segment in multipart messages:</strong> 134
              </p>
              
              <h4>UCS2 (16-bit Unicode)</h4>
              <p>
                This encoding supports a much wider range of characters and is necessary for:
              </p>
              <ul>
                <li>Non-Latin scripts (Arabic, Chinese, Cyrillic, etc.)</li>
                <li>Emojis and other special symbols</li>
                <li>Characters outside GSM 7-bit alphabet</li>
              </ul>
              <p>
                <strong>Maximum characters per message:</strong> 70<br />
                <strong>Maximum characters per segment in multipart messages:</strong> 67
              </p>
              <p>
                The tradeoff is that UCS2 messages can carry fewer characters per SMS.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border my-4">
                <h4 className="mt-0">Encoding Selection Logic</h4>
                <p className="mb-2">
                  Mobile devices automatically select the appropriate encoding:
                </p>
                <ol className="mb-0">
                  <li>If all characters are in GSM 7-bit alphabet → Use 7-bit encoding</li>
                  <li>If any character is outside the 7-bit alphabet → Switch to UCS2</li>
                  <li>For binary data applications → Use 8-bit encoding</li>
                </ol>
              </div>
            </>
          )}

          {section === "fields" && (
            <>
              <h3>SMS PDU Fields Reference</h3>
              <p>
                Here's a detailed reference for the important fields in SMS PDUs:
              </p>

              <h4>First Octet</h4>
              <p>
                The first octet after the SMSC information contains several bit flags that control message handling:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bits</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>SMS-DELIVER</TableHead>
                    <TableHead>SMS-SUBMIT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>0-1</TableCell>
                    <TableCell>TP-MTI (Message Type Indicator)</TableCell>
                    <TableCell>00</TableCell>
                    <TableCell>01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>TP-MMS (More Messages to Send) <br/>TP-RD (Reject Duplicates)</TableCell>
                    <TableCell>0 = More messages, 1 = No more</TableCell>
                    <TableCell>0 = Allow duplicates, 1 = Reject</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3-4</TableCell>
                    <TableCell>N/A <br/>TP-VPF (Validity Period Format)</TableCell>
                    <TableCell>Not used</TableCell>
                    <TableCell>00 = Not present <br/>10 = Relative format <br/>11 = Absolute format</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5</TableCell>
                    <TableCell>TP-SRI (Status Report Indication) <br/>TP-SRR (Status Report Request)</TableCell>
                    <TableCell>0 = No report, 1 = Report</TableCell>
                    <TableCell>0 = No report, 1 = Report</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6</TableCell>
                    <TableCell>TP-UDHI (User Data Header Indicator)</TableCell>
                    <TableCell>0 = No header, 1 = Header present</TableCell>
                    <TableCell>0 = No header, 1 = Header present</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7</TableCell>
                    <TableCell>TP-RP (Reply Path)</TableCell>
                    <TableCell>0 = No path, 1 = Path set</TableCell>
                    <TableCell>0 = No path, 1 = Path set</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4 className="mt-4">Address Fields</h4>
              <p>
                Address fields (for both sender and recipient) consist of:
              </p>
              <ul>
                <li><strong>Length:</strong> Number of digits in the address</li>
                <li><strong>Type-of-Address:</strong> Format and numbering plan</li>
                <li><strong>Address:</strong> The actual number in semi-octet format</li>
              </ul>
              
              <h4>Type-of-Address Format</h4>
              <p>
                The Type-of-Address byte has this structure:
              </p>
              <ul>
                <li>Bits 0-3: Numbering Plan Identification (1 for ISDN/telephone)</li>
                <li>Bits 4-6: Type of Number:
                  <ul>
                    <li>000 = Unknown</li>
                    <li>001 = International (starts with +)</li>
                    <li>010 = National</li>
                    <li>101 = Alphanumeric</li>
                  </ul>
                </li>
                <li>Bit 7: Always 1</li>
              </ul>
              <p>
                <strong>Example:</strong> 91 = 10010001 (International number, ISDN/telephone plan)
              </p>
              
              <h4>Data Coding Scheme</h4>
              <p>
                The DCS byte specifies the character encoding:
              </p>
              <ul>
                <li><strong>00000000</strong> (0x00): GSM 7-bit default alphabet</li>
                <li><strong>00000100</strong> (0x04): 8-bit data encoding</li>
                <li><strong>00001000</strong> (0x08): UCS2 (16-bit) encoding</li>
              </ul>
              
              <h4>Service Centre Timestamp</h4>
              <p>
                In SMS-DELIVER PDUs, this 7-byte field contains:
              </p>
              <ul>
                <li>Year (last two digits)</li>
                <li>Month (01-12)</li>
                <li>Day (01-31)</li>
                <li>Hour (00-23)</li>
                <li>Minute (00-59)</li>
                <li>Second (00-59)</li>
                <li>Time zone (in 15-minute increments from GMT)</li>
              </ul>
              <p>
                Each byte is encoded in semi-octet format with swapped nibbles.
              </p>
            </>
          )}

          {section === "multipart" && (
            <>
              <h3>Multipart SMS Messages</h3>
              <p>
                When a message exceeds the single SMS limit, it can be split into multiple parts using the User Data Header (UDH).
                The UDH contains information to reassemble the parts in the correct order.
              </p>
              
              <h4>How Multipart SMS Works</h4>
              <p>
                A long message is split into multiple SMS messages, each with:
              </p>
              <ul>
                <li>The TP-UDHI flag set (bit 6 of first octet)</li>
                <li>A User Data Header containing concatenation information</li>
                <li>A portion of the original message text</li>
              </ul>
              
              <h4>User Data Header Structure</h4>
              <p>
                The UDH contains:
              </p>
              <ol>
                <li><strong>UDHL</strong> (User Data Header Length): 1 byte indicating total header length</li>
                <li><strong>IEI</strong> (Information Element Identifier): 1 byte identifying element type
                  <ul>
                    <li>0x00: Concatenated short messages (8-bit reference)</li>
                    <li>0x08: Concatenated short messages (16-bit reference)</li>
                  </ul>
                </li>
                <li><strong>IEDL</strong> (Information Element Data Length): 1 byte indicating the length of the IE data</li>
                <li><strong>Data</strong>: For concatenated messages, contains:
                  <ul>
                    <li>Reference number (identifies the complete message)</li>
                    <li>Total number of parts</li>
                    <li>Sequence number of this part (1-based)</li>
                  </ul>
                </li>
              </ol>
              
              <div className="bg-muted/50 p-4 rounded-md border my-4">
                <h4 className="mt-0">Example UDH for Concatenated SMS</h4>
                <p className="mb-0">
                  <code>05 00 03 AB 02 01</code>
                </p>
                <ul className="mb-0">
                  <li><code>05</code>: Header length (5 bytes follow)</li>
                  <li><code>00</code>: Concatenated SMS with 8-bit reference</li>
                  <li><code>03</code>: Length of this IE (3 bytes)</li>
                  <li><code>AB</code>: Reference number (171)</li>
                  <li><code>02</code>: Total parts (2)</li>
                  <li><code>01</code>: This is part 1</li>
                </ul>
              </div>
              
              <h4>Character Limits for Multipart Messages</h4>
              <p>
                The UDH takes space from the user data area, reducing the available characters per message part:
              </p>
              <ul>
                <li><strong>7-bit encoding:</strong> 153 characters per part (instead of 160)</li>
                <li><strong>8-bit data:</strong> 134 bytes per part (instead of 140)</li>
                <li><strong>UCS2 encoding:</strong> 67 characters per part (instead of 70)</li>
              </ul>
              
              <h4>Message Assembly</h4>
              <p>
                The receiving device:
              </p>
              <ol>
                <li>Identifies messages with the same reference number</li>
                <li>Stores parts until all are received</li>
                <li>Orders them by sequence number</li>
                <li>Combines them and presents as a single message</li>
              </ol>
              <p>
                Most modern phones handle this automatically, so users see only the complete message.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
