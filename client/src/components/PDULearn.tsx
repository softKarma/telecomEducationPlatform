import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

// Learning content sections
type LearnSection = 
  // Core SMS concepts
  "overview" | "pdu-formats" | "encodings" | "fields" | "multipart" | 
  // Advanced protocols
  "sat" | "smpp" | "sms-flow" | "efsms" |
  // Additional telecom topics
  "network-architecture" | "gsm-concepts" | "encoding-tool";

// Simple utility functions for encoding exercises
const encode7Bit = (text: string): string => {
  // This is a simplified version for educational purposes
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    // Convert to hex and pad with zeros if needed
    result.push(char.toString(16).padStart(2, '0'));
  }
  return result.join('').toUpperCase();
};

const encodeUCS2 = (text: string): string => {
  // This is a simplified version for educational purposes
  const result = [];
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    // Convert to hex and pad with zeros if needed
    result.push(char.toString(16).padStart(4, '0'));
  }
  return result.join('').toUpperCase();
};

export default function PDULearn() {
  const [section, setSection] = useState<LearnSection>("overview");
  const [encodingText, setEncodingText] = useState<string>("");
  const [encodingResult, setEncodingResult] = useState<string>("");
  const [encodingFeedback, setEncodingFeedback] = useState<{success: boolean; message: string} | null>(null);
  const [encodingType, setEncodingType] = useState<"7bit" | "ucs2">("7bit");
  
  // Function to handle encoding practice exercises
  const handleEncoding = () => {
    try {
      if (!encodingText.trim()) {
        setEncodingFeedback({
          success: false,
          message: "Please enter some text to encode."
        });
        return;
      }
      
      let result = "";
      if (encodingType === "7bit") {
        result = encode7Bit(encodingText);
      } else {
        result = encodeUCS2(encodingText);
      }
      
      setEncodingResult(result);
      setEncodingFeedback({
        success: true,
        message: `Text successfully encoded using ${encodingType === "7bit" ? "7-bit" : "UCS2"} encoding.`
      });
    } catch (error) {
      setEncodingFeedback({
        success: false,
        message: "Error encoding text. Please try again."
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-medium mb-4">SMS Protocol & Specification Guide</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Telecom Knowledge Base</h3>
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
            <Button 
              variant={section === "sat" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("sat")}
            >
              SIM Toolkit
            </Button>
            <Button 
              variant={section === "smpp" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("smpp")}
            >
              SMPP Protocol
            </Button>
            <Button 
              variant={section === "sms-flow" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("sms-flow")}
            >
              SMS Flow
            </Button>
            <Button 
              variant={section === "efsms" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("efsms")}
            >
              EF_SMS Storage
            </Button>
            <Button 
              variant={section === "network-architecture" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("network-architecture")}
            >
              Network Architecture
            </Button>
            <Button 
              variant={section === "gsm-concepts" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("gsm-concepts")}
            >
              GSM Concepts
            </Button>
            <Button 
              variant={section === "encoding-tool" ? "default" : "outline"}
              size="sm"
              onClick={() => setSection("encoding-tool")}
            >
              Encoding Tool
            </Button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {section === "encoding-tool" && (
            <>
              <h3>SMS Character Encoding Tool</h3>
              <p>
                This interactive tool helps you understand how text is encoded in SMS messages.
                Try different characters and see how they are converted to hexadecimal representation.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">About SMS Character Encoding</h4>
                <p className="mb-2">
                  SMS messages can use different character encoding schemes depending on the content:
                </p>
                <ul className="mb-0">
                  <li><strong>7-bit GSM:</strong> Used for basic Latin alphabet, supports 160 chars per SMS</li>
                  <li><strong>UCS2:</strong> Used for Unicode characters (emoji, non-Latin scripts), 70 chars per SMS</li>
                </ul>
              </div>
              
              <div className="not-prose">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-medium mb-2">Step 1: Enter Text to Encode</h5>
                    <Textarea 
                      value={encodingText}
                      onChange={(e) => setEncodingText(e.target.value)}
                      placeholder="Enter text to encode (e.g., Hello World)"
                      className="h-24"
                    />
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Step 2: Choose Encoding Type</h5>
                    <div className="flex space-x-2 mb-4">
                      <Button 
                        variant={encodingType === "7bit" ? "default" : "outline"}
                        onClick={() => setEncodingType("7bit")}
                      >
                        GSM 7-bit Encoding
                      </Button>
                      <Button 
                        variant={encodingType === "ucs2" ? "default" : "outline"}
                        onClick={() => setEncodingType("ucs2")}
                      >
                        UCS2 (16-bit) Encoding
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {encodingType === "7bit" 
                        ? "7-bit encoding is used for basic Latin characters and can fit 160 characters in a single SMS."
                        : "UCS2 encoding is used for non-Latin scripts and emojis but only fits 70 characters per SMS."}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Button onClick={handleEncoding}>
                    Encode Text
                  </Button>
                </div>
                
                {encodingFeedback && (
                  <Alert className={encodingFeedback.success ? "bg-success/20" : "bg-destructive/20"}>
                    {encodingFeedback.success ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <AlertTitle>{encodingFeedback.success ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>
                      {encodingFeedback.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {encodingResult && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Result: Hexadecimal Representation</h5>
                    <div className="bg-muted p-3 rounded-md overflow-auto">
                      <code className="text-xs break-all">{encodingResult}</code>
                    </div>
                    
                    <div className="bg-secondary/5 p-4 rounded-md border mt-4">
                      <h5 className="font-medium mt-0 mb-2">Explanation</h5>
                      <p className="mb-1 text-sm">Your text "{encodingText}" was encoded as follows:</p>
                      <ul className="mb-0 text-sm">
                        <li><strong>Encoding method:</strong> {encodingType === "7bit" ? "7-bit GSM alphabet" : "UCS2 (16-bit Unicode)"}</li>
                        <li><strong>Characters:</strong> {encodingText.length}</li>
                        <li><strong>Hex bytes:</strong> {encodingType === "7bit" ? encodingText.length : encodingText.length * 2}</li>
                        <li><strong>Would fit in one SMS:</strong> {
                          (encodingType === "7bit" && encodingText.length <= 160) || 
                          (encodingType === "ucs2" && encodingText.length <= 70) 
                            ? "Yes" : "No"
                        }</li>
                      </ul>
                    </div>
                    
                    <div className="bg-info/5 p-4 rounded-md border mt-4">
                      <h5 className="font-medium mt-0 mb-2">Try This</h5>
                      <ul className="mb-0 text-sm">
                        <li>Try special characters like € or @ to see how they're encoded</li>
                        <li>Compare the hex output with 7-bit vs UCS2 encoding</li>
                        <li>Try non-Latin characters (Arabic, Chinese, Cyrillic) with UCS2 encoding</li>
                        <li>Notice how emoji characters are represented in UCS2</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {section === "network-architecture" && (
            <>
              <h3>Telecom Network Architecture</h3>
              <p>
                SMS messages travel through a complex network before reaching their destination.
                This reference page explains the key components of the telecom network architecture
                that enable messaging services.
              </p>
              
              <div className="bg-muted p-4 rounded-md my-4">
                <h4 className="mt-0 mb-2 font-medium">Key Network Elements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="mt-0 mb-1 font-medium">Mobile Station (MS)</h5>
                    <p className="text-sm mb-3">
                      The mobile device (phone) where messages originate or terminate.
                      Contains the Mobile Equipment (ME) and SIM card.
                    </p>
                    
                    <h5 className="mt-0 mb-1 font-medium">Base Station System (BSS)</h5>
                    <p className="text-sm mb-0">
                      Handles radio communication with mobile devices.
                      Consists of Base Transceiver Stations (BTS) and Base Station Controllers (BSC).
                    </p>
                  </div>
                  <div>
                    <h5 className="mt-0 mb-1 font-medium">Mobile Switching Center (MSC)</h5>
                    <p className="text-sm mb-3">
                      Core network element that routes calls and SMS messages.
                      Interfaces with other networks and the SMSC.
                    </p>
                    
                    <h5 className="mt-0 mb-1 font-medium">Short Message Service Center (SMSC)</h5>
                    <p className="text-sm mb-0">
                      Stores and forwards SMS messages.
                      Handles message routing, retries, and delivery reports.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-info pl-4 my-6">
                <h4 className="mt-0 text-info">SMS Message Flow</h4>
                <ol className="mb-0 text-sm">
                  <li><strong>Submission:</strong> MS encodes the message and sends it to the MSC</li>
                  <li><strong>Routing:</strong> MSC forwards the message to the SMSC</li>
                  <li><strong>Storage:</strong> SMSC stores the message and attempts delivery</li>
                  <li><strong>Recipient Location:</strong> SMSC queries the HLR for recipient location</li>
                  <li><strong>Delivery:</strong> SMSC routes the message to the recipient's MSC</li>
                  <li><strong>Final Delivery:</strong> MSC forwards the message to the recipient's MS</li>
                  <li><strong>Confirmation:</strong> Delivery reports are sent back through the network</li>
                </ol>
              </div>
              
              <div className="bg-secondary/5 p-4 rounded-md my-4 border">
                <h4 className="mt-0 mb-2 font-medium">Home Location Register (HLR) and Visitor Location Register (VLR)</h4>
                <p className="mb-1">
                  These databases play a crucial role in SMS delivery:
                </p>
                <ul className="mb-0">
                  <li><strong>HLR:</strong> Permanent database storing subscriber information, including current location area</li>
                  <li><strong>VLR:</strong> Temporary database for subscribers currently in a specific location area</li>
                </ul>
              </div>
              
              <h4 className="mt-6">Network References</h4>
              <p>
                The SMS architecture is defined in the following 3GPP specifications:
              </p>
              <ul>
                <li>3GPP TS 23.040: Technical realization of the Short Message Service (SMS)</li>
                <li>3GPP TS 23.038: Alphabets and language-specific information</li>
                <li>3GPP TS 29.002: Mobile Application Part (MAP) specification</li>
              </ul>
            </>
          )}
          
          {section === "gsm-concepts" && (
            <>
              <h3>GSM Concepts & Fundamentals</h3>
              <p>
                The Global System for Mobile Communications (GSM) is the foundation for most mobile telecom
                systems worldwide. This page covers key GSM concepts that are essential for understanding
                mobile messaging and telecommunications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">GSM Network Structure</h4>
                  <ul className="mb-0">
                    <li><strong>Cell Structure:</strong> Network divided into geographic cells</li>
                    <li><strong>Frequency Reuse:</strong> Same frequencies reused in non-adjacent cells</li>
                    <li><strong>Circuit-Switched:</strong> Traditional connection method for voice calls</li>
                    <li><strong>Packet-Switched:</strong> Data transmission method (GPRS, EDGE)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">SIM Card Technology</h4>
                  <p className="mb-0">
                    The SIM (Subscriber Identity Module) is a crucial component:
                  </p>
                  <ul className="mb-0">
                    <li><strong>IMSI:</strong> International Mobile Subscriber Identity</li>
                    <li><strong>Ki:</strong> Authentication key stored securely</li>
                    <li><strong>File System:</strong> Hierarchical structure for storing contacts, messages</li>
                    <li><strong>SIM Application Toolkit:</strong> Environment for network-controlled apps</li>
                  </ul>
                </div>
              </div>
              
              <div className="my-6">
                <h4>GSM Identifiers</h4>
                <p>
                  GSM networks use several important identifiers:
                </p>
                
                <table className="min-w-full divide-y divide-gray-300 text-sm mb-4">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-left">Identifier</th>
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-left">Format Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 px-4">IMSI</td>
                      <td className="py-2 px-4">International Mobile Subscriber Identity</td>
                      <td className="py-2 px-4">310150123456789</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">MSISDN</td>
                      <td className="py-2 px-4">Mobile phone number</td>
                      <td className="py-2 px-4">+14155551234</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">IMEI</td>
                      <td className="py-2 px-4">International Mobile Equipment Identity</td>
                      <td className="py-2 px-4">490154203237518</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">TMSI</td>
                      <td className="py-2 px-4">Temporary Mobile Subscriber Identity</td>
                      <td className="py-2 px-4">0A1B2C3D</td>
                    </tr>
                  </tbody>
                </table>
              </div>
                
              <div className="border-l-4 border-info pl-4 my-6">
                <h4 className="mt-0 text-info">GSM SMS Features</h4>
                <p>
                  SMS in GSM networks provides several features:
                </p>
                <ul className="mb-0">
                  <li><strong>Store and Forward:</strong> Messages stored at SMSC until recipient is available</li>
                  <li><strong>Delivery Reports:</strong> Confirmation of message delivery</li>
                  <li><strong>Message Classes:</strong> Different display behaviors (flash, normal, SIM, ME)</li>
                  <li><strong>Cell Broadcast:</strong> Messages sent to all phones in a geographic area</li>
                </ul>
              </div>
            </>
          )}
          
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

          {section === "sat" && (
            <>
              <h3>SIM Application Toolkit (SAT)</h3>
              <p>
                The SIM Application Toolkit is a standard of the GSM system which enables the SIM card to initiate actions 
                which can be used for various value-added services and applications. It's defined in the GSM 11.14 and later 
                in the 3GPP TS 51.014 specifications.
              </p>
              
              <h4>SAT Basics</h4>
              <p>
                SAT allows the SIM card to:
              </p>
              <ul>
                <li>Display text and menus on the phone screen</li>
                <li>Initiate calls, send SMS or USSD messages</li>
                <li>Provide information to the phone</li>
                <li>Set up event notifications</li>
                <li>Request user input</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Common SAT Commands</h4>
                <ul className="mt-2 mb-0">
                  <li><strong>DISPLAY TEXT</strong>: Shows text on the phone's display</li>
                  <li><strong>GET INPUT</strong>: Requests text input from the user</li>
                  <li><strong>SELECT ITEM</strong>: Presents a menu for the user to select options</li>
                  <li><strong>SETUP MENU</strong>: Creates a menu that becomes part of the phone's menu system</li>
                  <li><strong>SEND SMS</strong>: Instructs the phone to send an SMS</li>
                  <li><strong>SETUP CALL</strong>: Initiates a voice call</li>
                  <li><strong>REFRESH</strong>: Updates the SIM data on the phone</li>
                </ul>
              </div>
              
              <h4>Proactive SIM Command Format</h4>
              <p>
                SAT commands follow a TLV (Tag-Length-Value) structure:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Size (bytes)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Proactive SIM Command Tag</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>Always 0xD0 to indicate a proactive command</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Length</TableCell>
                    <TableCell>1-3</TableCell>
                    <TableCell>Length of all subsequent data</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Command Details TLV</TableCell>
                    <TableCell>3-5</TableCell>
                    <TableCell>Tag (0x01), Length (3), and command details (command number, type, qualifier)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Device Identities TLV</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Tag (0x02), Length (2), Source and Destination device identities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Command-specific TLVs</TableCell>
                    <TableCell>Variable</TableCell>
                    <TableCell>Additional TLVs specific to the command type</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4>Common Command-specific TLVs</h4>
              <ul>
                <li><strong>Text String (0x0D)</strong>: Text to be displayed or used</li>
                <li><strong>Alpha Identifier (0x05)</strong>: Text label for menus and commands</li>
                <li><strong>Item (0x0F)</strong>: Menu item for selection menus</li>
                <li><strong>Item Identifier (0x10)</strong>: Identifier for an item</li>
                <li><strong>SMS TPDU (0x8B)</strong>: SMS message to be sent</li>
                <li><strong>Address (0x06)</strong>: Phone number (in the same format as SMS PDUs)</li>
              </ul>
              
              <h4>Example: DISPLAY TEXT command</h4>
              <p>
                A typical DISPLAY TEXT command would have this structure:
              </p>
              <pre><code>D0 ## 
01 03 21 ## ## (Command Details)
02 02 81 82    (Device Identities: SIM to Terminal)
0D ## 04 Text  (Text String with DCS=0x04 for 8-bit text)
</code></pre>
              
              <h4>Applications of SAT</h4>
              <p>
                SAT enables numerous applications on mobile phones, especially in emerging markets:
              </p>
              <ul>
                <li>Mobile banking and payment services</li>
                <li>Information services (weather, news, etc.)</li>
                <li>Prepaid account management</li>
                <li>Value-added services like call forwarding configuration</li>
                <li>Location-based services</li>
              </ul>
            </>
          )}

          {section === "smpp" && (
            <>
              <h3>Short Message Peer-to-Peer (SMPP) Protocol</h3>
              <p>
                SMPP is an open, industry standard protocol designed for exchanging SMS messages between 
                Short Message Service Centers (SMSCs) and External Short Message Entities (ESMEs) such as
                SMS gateways, SMS applications, or other SMSCs.
              </p>
              
              <h4>SMPP Basics</h4>
              <p>
                SMPP is a binary protocol that operates at the application layer. It's typically used over TCP/IP 
                connections and provides features for:
              </p>
              <ul>
                <li>Submitting messages to an SMSC for delivery</li>
                <li>Delivering messages from an SMSC to an application</li>
                <li>Querying message status</li>
                <li>Canceling or replacing messages</li>
                <li>Managing the connection between an ESME and an SMSC</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Key SMPP Operations</h4>
                <ul className="mt-2 mb-0">
                  <li><strong>bind_transmitter</strong>: Establish a connection for sending messages</li>
                  <li><strong>bind_receiver</strong>: Establish a connection for receiving messages</li>
                  <li><strong>bind_transceiver</strong>: Establish a bidirectional connection</li>
                  <li><strong>submit_sm</strong>: Submit a message for delivery</li>
                  <li><strong>deliver_sm</strong>: Deliver a message to an ESME</li>
                  <li><strong>query_sm</strong>: Query the status of a message</li>
                  <li><strong>cancel_sm</strong>: Cancel a previously submitted message</li>
                  <li><strong>replace_sm</strong>: Replace a previously submitted message</li>
                  <li><strong>unbind</strong>: Terminate the connection</li>
                </ul>
              </div>
              
              <h4>SMPP PDU Format</h4>
              <p>
                All SMPP operations use a standard PDU format:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Size (bytes)</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Command Length</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Total length of the PDU in bytes (including this field)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Command ID</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Identifies the SMPP operation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Command Status</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Indicates success/failure in responses (0 = success)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sequence Number</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Used to correlate requests and responses</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Command Body</TableCell>
                    <TableCell>Variable</TableCell>
                    <TableCell>Command-specific parameters</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4>Example: submit_sm PDU</h4>
              <p>
                A <code>submit_sm</code> PDU is used to submit a message to an SMSC. Its body contains:
              </p>
              <ul>
                <li><strong>service_type</strong>: Type of service (e.g., "CMT" for cellular messaging)</li>
                <li><strong>source_addr_ton, source_addr_npi</strong>: Type of number and numbering plan for source address</li>
                <li><strong>source_addr</strong>: Source address (usually a phone number)</li>
                <li><strong>dest_addr_ton, dest_addr_npi</strong>: Type of number and numbering plan for destination address</li>
                <li><strong>destination_addr</strong>: Destination address (usually a phone number)</li>
                <li><strong>esm_class</strong>: Message mode and type</li>
                <li><strong>protocol_id</strong>: Protocol identifier</li>
                <li><strong>priority_flag</strong>: Priority level of the message</li>
                <li><strong>schedule_delivery_time</strong>: When to deliver the message</li>
                <li><strong>validity_period</strong>: How long the message is valid</li>
                <li><strong>registered_delivery</strong>: Whether a delivery receipt is requested</li>
                <li><strong>replace_if_present_flag</strong>: Whether to replace an existing message</li>
                <li><strong>data_coding</strong>: Encoding scheme</li>
                <li><strong>sm_default_msg_id</strong>: Default message ID</li>
                <li><strong>sm_length</strong>: Length of the short message</li>
                <li><strong>short_message</strong>: The actual message content</li>
              </ul>
              
              <h4>SMPP Versions</h4>
              <p>
                The most commonly used versions of SMPP are:
              </p>
              <ul>
                <li><strong>SMPP v3.3</strong>: Introduced TLV (Tag-Length-Value) parameters</li>
                <li><strong>SMPP v3.4</strong>: The most widely deployed version with additional features</li>
                <li><strong>SMPP v5.0</strong>: Added broadcast messaging capabilities</li>
              </ul>
              
              <h4>TLV Parameters</h4>
              <p>
                SMPP v3.3 and later allows optional parameters in a TLV format:
              </p>
              <ul>
                <li><strong>Tag</strong>: 2-byte identifier</li>
                <li><strong>Length</strong>: 2-byte length of the value</li>
                <li><strong>Value</strong>: Parameter value of specified length</li>
              </ul>
              <p>
                Common TLVs include message_payload (for longer messages), receipted_message_id (in delivery receipts), and sar_* parameters (for multipart messages).
              </p>
              
              <h4>SMPP in the Messaging Ecosystem</h4>
              <p>
                SMPP is widely used in the telecommunication industry for integrating with SMS services:
              </p>
              <ul>
                <li>Enterprises use SMPP to send notifications, alerts, and marketing messages</li>
                <li>Messaging aggregators connect to multiple operators via SMPP</li>
                <li>Mobile network operators use SMPP to interconnect their messaging infrastructure</li>
                <li>Application-to-Person (A2P) messaging services typically use SMPP</li>
              </ul>
            </>
          )}

          {section === "sms-flow" && (
            <>
              <h3>SMS Flow: From SIM to Recipient</h3>
              <p>
                The journey of an SMS message involves multiple components and protocols. Here's a comprehensive 
                overview of how a message travels from the sender's SIM card to the recipient's device.
              </p>
              
              <h4>SMS Message Journey</h4>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">1. Message Creation and SIM Card</h5>
                <p className="mb-1">
                  The process begins when a user composes a message on their mobile phone:
                </p>
                <ul className="mb-0">
                  <li>The mobile device's operating system handles the user interface</li>
                  <li>The SIM card may be involved if applications on the SIM (via SIM Application Toolkit) initiate the message</li>
                  <li>The device prepares the message for transmission, applying the appropriate character encoding</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">2. Mobile Station to Network</h5>
                <p className="mb-1">
                  The mobile station (MS) formats the message as an SMS-SUBMIT PDU according to 3GPP 23.040:
                </p>
                <ul className="mb-0">
                  <li>The MS encapsulates the SMS PDU within lower-level protocols</li>
                  <li>The message is sent over the air interface to the base station using control channels</li>
                  <li>For GSM, the message uses the Cell Broadcast Control Channel (CBCH) or Stand-alone Dedicated Control Channel (SDCCH)</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">3. Mobile Switching Center</h5>
                <p className="mb-1">
                  The Base Station forwards the message to the Mobile Switching Center (MSC):
                </p>
                <ul className="mb-0">
                  <li>The MSC identifies that it's an SMS message</li>
                  <li>The MSC forwards the message to the SMS Center (SMSC) using protocols like SS7 MAP (Mobile Application Part)</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">4. SMS Center (SMSC) Processing</h5>
                <p className="mb-1">
                  The SMSC is responsible for handling the message:
                </p>
                <ul className="mb-0">
                  <li>The SMSC receives the SMS-SUBMIT PDU from the MSC</li>
                  <li>The SMSC validates the message, checks routing, and prepares for delivery</li>
                  <li>The SMSC may interact with other systems using SMPP (Short Message Peer-to-Peer) protocol</li>
                  <li>The SMSC stores the message if it cannot be delivered immediately (store-and-forward)</li>
                  <li>For delivery, the SMSC transforms the SMS-SUBMIT PDU into an SMS-DELIVER PDU</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">5. Delivery to Recipient</h5>
                <p className="mb-1">
                  To deliver the message, the SMSC follows these steps:
                </p>
                <ul className="mb-0">
                  <li>The SMSC queries the Home Location Register (HLR) to determine the recipient's location</li>
                  <li>The SMSC forwards the SMS-DELIVER PDU to the appropriate MSC serving the recipient</li>
                  <li>The MSC sends a paging request to locate the recipient's mobile device</li>
                  <li>Once the device responds, the MSC sends the SMS-DELIVER PDU to the base station</li>
                  <li>The base station transmits the message to the recipient's mobile device</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0">6. Recipient Mobile Device Processing</h5>
                <p className="mb-1">
                  When the message reaches the recipient's device:
                </p>
                <ul className="mb-0">
                  <li>The device's baseband processor receives the SMS-DELIVER PDU</li>
                  <li>The SMS stack in the device's software processes the PDU</li>
                  <li>If it's a multi-part message, the device stores and waits for all parts</li>
                  <li>The device decodes the message using the specified character encoding</li>
                  <li>The device displays the message to the user or processes it programmatically</li>
                  <li>The device may store the message on the SIM card or in its internal memory</li>
                </ul>
              </div>
              
              <h4>Protocol Stack in SMS Transmission</h4>
              <p>
                SMS uses a complex stack of protocols at different stages:
              </p>
              <ol>
                <li><strong>Application Layer</strong>: SMS PDU formats (3GPP 23.040)</li>
                <li><strong>Transport Layer</strong>: SMS Transport Protocol (SMS-TP)</li>
                <li><strong>Relay Layer</strong>: SMS Relay Protocol (SMS-RP)</li>
                <li><strong>Connection Layer</strong>: Connection Management (CM) sublayer</li>
                <li><strong>Network Layer</strong>: Mobile Application Part (MAP) for inter-network communication</li>
                <li><strong>External Systems</strong>: SMPP for communication with external entities</li>
              </ol>
              
              <h4>Advanced Features in the SMS Flow</h4>
              <ul>
                <li><strong>Status Reports</strong>: Optional delivery receipts that follow the same path in reverse</li>
                <li><strong>Flash SMS</strong>: Messages that appear directly on the screen without being stored</li>
                <li><strong>Class 0-3 Messages</strong>: Different storage behaviors based on message class</li>
                <li><strong>SIM Toolkit Interactions</strong>: Messages that trigger or are triggered by SIM applications</li>
                <li><strong>SMS Gateways</strong>: Interfaces between SMS networks and other communication systems (email, internet apps)</li>
              </ul>
            </>
          )}

          {section === "efsms" && (
            <>
              <h3>EF_SMS: Elementary File for SMS Storage</h3>
              <p>
                EF_SMS is a specific file in the SIM card file system that stores SMS messages. It's defined 
                in telecommunications standards (3GPP TS 51.011 / GSM 11.11) and is used to store SMS messages 
                directly on the SIM card.
              </p>
              
              <h4>SIM Card File System Overview</h4>
              <p>
                A SIM card contains a hierarchical file system with:
              </p>
              <ul>
                <li><strong>MF (Master File)</strong>: The root directory of the SIM file system</li>
                <li><strong>DF (Dedicated File)</strong>: Subdirectories that group related files</li>
                <li><strong>EF (Elementary File)</strong>: Actual data files that store various information</li>
              </ul>
              
              <p>
                EF_SMS is located under DF_TELECOM and stores SMS messages. In the SIM file system, it has the identifier '6F3C'.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">EF_SMS Record Format</h4>
                <p className="mb-1">
                  Each SMS record in EF_SMS consists of:
                </p>
                <ol className="mb-0">
                  <li><strong>Status byte</strong>: Indicates the message status (e.g., read, unread, free)</li>
                  <li><strong>TPDU</strong>: The actual SMS PDU (Protocol Data Unit) as defined in 3GPP 23.040</li>
                </ol>
              </div>
              
              <h4>Status Byte Values</h4>
              <p>
                The first byte in each EF_SMS record indicates the message's status:
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status Value</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>0x00</TableCell>
                    <TableCell>Free space (unused record)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0x01</TableCell>
                    <TableCell>Message received and read</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0x03</TableCell>
                    <TableCell>Message received and unread</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0x05</TableCell>
                    <TableCell>Message sent (status report not requested)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0x07</TableCell>
                    <TableCell>Message to be sent (stored but not sent yet)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>0xD0-0xD7</TableCell>
                    <TableCell>Reserved for future use</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <h4>EF_SMS Characteristics</h4>
              <ul>
                <li><strong>File Size</strong>: Typically allows 10-15 messages, depending on the SIM</li>
                <li><strong>Record Length</strong>: Usually fixed at 176 bytes per record</li>
                <li><strong>Structure</strong>: Linear fixed (records of equal size)</li>
                <li><strong>Access Conditions</strong>: READ/UPDATE/INVALIDATE/REHABILITATE (controlled by PIN protection)</li>
              </ul>
              
              <h4>Example: Unread Message Record</h4>
              <pre className="overflow-x-auto"><code>03 00 19 01 05 91 44 37 13 00 00 60 18 40 21 51 31 10 63 A7 F7 9B 9D 06 61 81 C6 68 7C B6 89 0B B4 C0 69 9D F7 23 A...</code></pre>
              <p>Where:</p>
              <ul>
                <li><strong>03</strong>: Status byte (unread message)</li>
                <li><strong>00 19</strong>: SMSC address length and type</li>
                <li><strong>01 05 91...</strong>: Rest of the SMS PDU (as per 3GPP 23.040)</li>
              </ul>
              
              <h4>Technical Details</h4>
              <p>
                Some technical aspects of EF_SMS implementation:
              </p>
              <ul>
                <li>Messages can be written to any free record - there's no specific order</li>
                <li>When a record is deleted, its status is changed to 0x00 (free)</li>
                <li>SIM cards typically report "Memory Full" when all records are used</li>
                <li>When reading EF_SMS contents from a SIM, you typically read record by record</li>
                <li>Status value is specific to the SIM card storage and not part of the 3GPP 23.040 specification</li>
              </ul>
              
              <h4>Applications and Usage</h4>
              <p>
                EF_SMS storage has several important uses:
              </p>
              <ul>
                <li>Backup for messages when phone memory is full</li>
                <li>Migration of messages when moving to a new phone</li>
                <li>Storage for special/important messages that need to be retained</li>
                <li>SIM Toolkit applications that use stored messages</li>
                <li>Recovery of messages after phone issues</li>
              </ul>
              
              <p>
                EF_SMS storage is becoming less relevant with modern smartphones which have their own message databases, 
                but it's still important for compatibility, specialized applications, and feature phones.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
