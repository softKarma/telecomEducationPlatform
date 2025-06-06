import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PDUParseResult } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ByteDisplay from "./ByteDisplay";
import { Info } from "lucide-react";
import { findTooltip, hasTooltip } from "@/lib/tooltipUtils";

// Field Info component
interface FieldInfoProps {
  tooltip: string;
}

function FieldInfo({ tooltip }: FieldInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex ml-1 cursor-help">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// PDU field descriptions
const fieldDescriptions = {
  // Header fields
  messageType: "Indicates the direction and purpose of the SMS message (SMS-DELIVER or SMS-SUBMIT)",
  smsc: "Short Message Service Center address that routes and handles the SMS message",
  sender: "Originating address (phone number) of the message sender",
  recipient: "Destination address (phone number) to which the message is being sent",
  timestamp: "Date and time when the message was submitted to the SMSC",
  encoding: "Character encoding scheme used for the message content (7-bit, 8-bit, UCS2)",
  multipart: "Indicates whether this message is part of a multi-part (concatenated) SMS",
  
  // PDU structure fields
  smscLength: "Length of the SMSC information in bytes",
  smscType: "Type of SMSC address (international, national, alphanumeric)",
  firstOctet: "Contains message flags including reply path, user data header indicator, and status report request",
  messageReference: "Reference number for identifying the SMS-SUBMIT message",
  destAddrLength: "Length of the destination address in digits",
  destAddrType: "Type of destination address (international, national, alphanumeric)",
  protocolId: "Protocol identifier parameter indicating how the SC is to process the message",
  dataCoding: "Indicates the message encoding scheme and message class",
  validityPeriod: "Period during which the message is valid if it cannot be delivered immediately",
  userDataLength: "Length of the user data section in the appropriate units based on encoding",
  userDataHeader: "Optional header containing information for concatenated messages, port addressing, etc.",
  userData: "The actual message content encoded according to the data coding scheme",
  
  // Common field variants
  "smsc length": "Length of the SMSC information in bytes",
  "smsc type of address": "Type of SMSC address (international, national, alphanumeric)",
  "first octet": "Contains message flags including reply path, user data header indicator, and status report request",
  "message reference": "Reference number for identifying the SMS-SUBMIT message",
  "destination address length": "Length of the destination address in digits",
  "destination address type": "Type of destination address (international, national, alphanumeric)",
  "protocol identifier": "Protocol identifier parameter indicating how the SC is to process the message",
  "data coding scheme": "Indicates the message encoding scheme and message class",
  "validity period": "Period during which the message is valid if it cannot be delivered immediately",
  "user data length": "Length of the user data section in the appropriate units based on encoding",
  "user data header": "Optional header containing information for concatenated messages, port addressing, etc.",
  "user data": "The actual message content encoded according to the data coding scheme",
  "tp-pid": "Protocol identifier parameter indicating how the SC is to process the message",
  "tp-dcs": "Data coding scheme indicating the message encoding scheme and message class",
  "tp-udl": "User data length in the appropriate units based on encoding",
  "tp-udhi": "User data header indicator flag - when set to 1, indicates user data begins with a header",
  
  // UDH specific fields
  "user data header length": "Length of the User Data Header in octets (excluding this length byte itself)",
  "information element identifier": "Identifier for the type of information element in the UDH",
  "information element length": "Length of the information element data in octets",
  "information element data": "Data portion of the information element",
  "concatenated sms": "Information about a segmented SMS message that should be reassembled",
  "concatenated sms reference": "Reference number to identify all parts of the same concatenated message",
  "application port addressing": "Port numbers to route SMS to specific applications on the device",
  "special message indication": "Indicates messages like voicemail, fax notifications, etc.",
  "national language shift tables": "Defines which character set to use for the message text"
};

// Example PDUs
const examplePdus = {
  "deliver-7bit": "07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07",
  "deliver-ucs2": "07911326040000F0040B911346610089F600082180214155840018D4F29C0E6A96E7F3F0B90C0A07D9D76D3D3739CC2E83C661757A0C0EB3D3",
  "submit-7bit": "0011000B916407281553F80000AA0C48656C6C6F20776F726C64",
  "submit-binary": "0011000B916407281553F800F40605041504050423F0",
  "submit-multipart-1": "0051000B916407281553F80000A0050003010201546869732069732074686520666972737420706172742073686F77696E6720686F772061206C6F6E67206D657373616765206973207370616E206163726F7373206D756C7469706C652053",
  "submit-multipart-2": "0051000B916407281553F80000A005000301024D532053554D4954206D6573736167657320627920627265616B696E67207468656D20696E746F20736D616C6C6572206368756E6B732E2054686973206973207061727420322E",
  
  // UDH Examples
  "deliver-udh-port": "07912407003000F0440B912407950736F9400000418082815290805000300630020007400650073007400200077006900740068002000550044004800200061006E0064002000550043005300320020006500780061006D0070006C00650020006D0065007300730061006700650020002D00200061007000700020006900640020003100390032003700",
  "deliver-udh-concat1": "07917360021111F040B915121940547F400061605292339504050003010201426F74680070617274732061726520696E2074686520554348322073797374656D2E205468652066697273742070617274206F66206D6573736167652068617320746865206865616465722C207468652073",
  "deliver-udh-concat2": "07917360021111F040B915121940547F400061605292339504050003010202 65636F6E64207061727420646F65736E2774206861766520746865206865616465722E20546869732077696C6C20636F6E74696E756520696E7374656164",
  "deliver-udh-7bit1": "0791448720003023440C91449761331001000012607221222348050003010201D4F29C9E769F41E17319A4E0F9FBDC754B01D1E139F83C220F29E1EA03",
  "deliver-udh-7bit2": "0791448720003023440C91449761331001000012607221222358050003010202909357D374FB0C7AB3C9E83E675399BFEF9F5B91F",
  "deliver-udh-special": "07914400000000F04401C1624243F5006080615131650A0560030104040201A00106224F60597CA683D56FB50BD4887DB203"
}

export default function PDUParser() {
  const [pduType, setPduType] = useState<"sms-deliver" | "sms-submit">("sms-deliver");
  const [pduString, setPduString] = useState<string>("07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07");
  const [resultsTab, setResultsTab] = useState<string>("decoded");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");

  // PDU Parse mutation
  const { mutate: parsePdu, data: parsedData, isPending, isError, error } = useMutation({
    mutationFn: async (data: { pduString: string; pduType: "sms-deliver" | "sms-submit" }) => {
      const response = await apiRequest("POST", "/api/parse-pdu", data);
      return response.json() as Promise<PDUParseResult>;
    }
  });

  // Handle parse button click
  const handleParse = () => {
    if (pduString.trim()) {
      parsePdu({ pduString: pduString.trim(), pduType });
    }
  };

  // Load example PDU
  const loadExamplePdu = (example: keyof typeof examplePdus) => {
    const pdu = examplePdus[example];
    setPduString(pdu);
    if (example.startsWith("deliver")) {
      setPduType("sms-deliver");
    } else {
      setPduType("sms-submit");
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setClipboardStatus("copied");
    setTimeout(() => setClipboardStatus("idle"), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Panel */}
      <div className="lg:col-span-5">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">Input PDU</h2>
            
            {/* PDU Type Selection */}
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-1">PDU Type</Label>
              <RadioGroup 
                value={pduType} 
                onValueChange={(value) => setPduType(value as "sms-deliver" | "sms-submit")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms-deliver" id="r1" />
                  <Label htmlFor="r1">SMS-DELIVER</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms-submit" id="r2" />
                  <Label htmlFor="r2">SMS-SUBMIT</Label>
                </div>
              </RadioGroup>
            </div>

            {/* PDU Input */}
            <div className="mb-4">
              <Label htmlFor="pdu-input" className="block text-sm font-medium mb-1">
                PDU String (Hexadecimal)
              </Label>
              <Textarea
                id="pdu-input"
                rows={4}
                value={pduString}
                onChange={(e) => setPduString(e.target.value)}
                placeholder="Enter PDU hex string (e.g., 07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07)"
                className="font-mono text-sm resize-none"
              />
              <div className="mt-1 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <AlertCircle className="h-3 w-3 inline-block mr-1" />
                        PDU format
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>A PDU is a binary format for SMS messages. Enter the hexadecimal representation here.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setPduString("")}
                  className="h-auto p-0 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Example Presets */}
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-2">Example PDUs</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-7bit")}
                  className="h-7 text-xs"
                >
                  Deliver (7-bit)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-ucs2")}
                  className="h-7 text-xs"
                >
                  Deliver (UCS2)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("submit-7bit")}
                  className="h-7 text-xs"
                >
                  Submit (7-bit)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("submit-binary")}
                  className="h-7 text-xs"
                >
                  Submit (Binary)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("submit-multipart-1")}
                  className="h-7 text-xs"
                >
                  Submit (Part 1)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("submit-multipart-2")}
                  className="h-7 text-xs"
                >
                  Submit (Part 2)
                </Button>
              </div>
              
              <Label className="block text-sm font-medium mb-2 mt-4">UDH Examples</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-port")}
                  className="h-7 text-xs"
                >
                  UDH (App Port)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-concat1")}
                  className="h-7 text-xs"
                >
                  UDH (Concat 1/2)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-concat2")}
                  className="h-7 text-xs"
                >
                  UDH (Concat 2/2)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-7bit1")}
                  className="h-7 text-xs"
                >
                  UDH (7-bit, 1/2)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-7bit2")}
                  className="h-7 text-xs"
                >
                  UDH (7-bit, 2/2)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver-udh-special")}
                  className="h-7 text-xs"
                >
                  UDH (Special Msg)
                </Button>
              </div>
            </div>

            {/* Parse Button */}
            <Button 
              className="w-full" 
              onClick={handleParse}
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              {isPending ? "Parsing..." : "Parse PDU"}
            </Button>

            {/* Parse Errors */}
            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to parse PDU"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">PDU Analysis</h2>

            {parsedData ? (
              <Tabs value={resultsTab} onValueChange={setResultsTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="decoded">Decoded Message</TabsTrigger>
                  <TabsTrigger value="structure">PDU Structure</TabsTrigger>
                  <TabsTrigger value="hex">Hex View</TabsTrigger>
                </TabsList>

                {/* Decoded Message View */}
                <TabsContent value="decoded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Header Information</h3>
                      <div className="bg-muted/50 p-3 rounded border">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                Message Type:
                                <FieldInfo tooltip={findTooltip('messageType', fieldDescriptions)} />
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.messageType.toUpperCase()}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                SMSC:
                                <FieldInfo tooltip={findTooltip('smsc', fieldDescriptions)} />
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.smsc}</td>
                            </tr>
                            {parsedData.header.sender && (
                              <tr>
                                <td className="pb-1 pr-3 text-muted-foreground">
                                  Sender:
                                  <FieldInfo tooltip={findTooltip('sender', fieldDescriptions)} />
                                </td>
                                <td className="pb-1 font-medium">{parsedData.header.sender}</td>
                              </tr>
                            )}
                            {parsedData.header.recipient && (
                              <tr>
                                <td className="pb-1 pr-3 text-muted-foreground align-top">
                                  Recipient:
                                  <FieldInfo tooltip={findTooltip('recipient', fieldDescriptions)} />
                                </td>
                                <td className="pb-1 font-medium break-all max-w-[200px]" title={parsedData.header.recipient}>
                                  {parsedData.header.recipient.length > 50 
                                    ? `${parsedData.header.recipient.substring(0, 50)}...` 
                                    : parsedData.header.recipient}
                                </td>
                              </tr>
                            )}
                            {parsedData.header.timestamp && (
                              <tr>
                                <td className="pb-1 pr-3 text-muted-foreground">
                                  Timestamp:
                                  <FieldInfo tooltip={findTooltip('timestamp', fieldDescriptions)} />
                                </td>
                                <td className="pb-1 font-medium">{parsedData.header.timestamp}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                Encoding:
                                <FieldInfo tooltip={findTooltip('encoding', fieldDescriptions)} />
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.encoding}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                User Data Header:
                                <FieldInfo tooltip={findTooltip('user data header', fieldDescriptions)} />
                              </td>
                              <td className="pb-1 font-medium">
                                {parsedData.properties.some(prop => prop.name.toLowerCase().includes('user data header')) ? (
                                  <span className="text-blue-500">Present</span>
                                ) : (
                                  "None"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                Multipart:
                                <FieldInfo tooltip={findTooltip('multipart', fieldDescriptions)} />
                              </td>
                              <td className="pb-1 font-medium">
                                {parsedData.header.multipart ? (
                                  <>
                                    Yes (Part {parsedData.header.multipartInfo?.partNumber} of {parsedData.header.multipartInfo?.totalParts})
                                  </>
                                ) : (
                                  "No"
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">Message Content</h3>
                      <div className="bg-muted/50 p-3 rounded border h-full">
                        <p className="text-sm whitespace-pre-wrap">{parsedData.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message Properties */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Message Properties</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-muted text-left">
                            <th className="px-4 py-2 font-medium">Property</th>
                            <th className="px-4 py-2 font-medium">Value</th>
                            <th className="px-4 py-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {parsedData.properties
                            .filter(prop => !prop.rawBytes)
                            .map((property, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 flex items-center">
                                  {property.name}
                                  <FieldInfo tooltip={findTooltip(property.name, fieldDescriptions)} />
                                </td>
                                <td className="px-4 py-2 font-mono">{property.value}</td>
                                <td className="px-4 py-2 text-muted-foreground">{property.description}</td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* PDU Structure View */}
                <TabsContent value="structure">
                  <div className="overflow-x-auto">
                    <h3 className="text-sm font-semibold mb-2">PDU Structure Breakdown</h3>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {parsedData.structureBreakdown.bytes.map((byte, index) => (
                          <ByteDisplay 
                            key={index} 
                            value={byte} 
                            color={parsedData.structureBreakdown.colors[index]} 
                            tooltip={parsedData.structureBreakdown.tooltips[index]} 
                          />
                        ))}
                      </div>

                      <div className="text-xs space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Basic PDU Elements</h4>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-primary/20 border border-primary/30 inline-block mr-2"></span>
                              <span>SMSC Information</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-secondary/20 border border-secondary/30 inline-block mr-2"></span>
                              <span>{parsedData.header.messageType === 'sms-deliver' ? 'Originating Address' : 'Destination Address'}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-muted border border-muted-foreground/30 inline-block mr-2"></span>
                              <span>Protocol Identifiers</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-accent/20 border border-accent/30 inline-block mr-2"></span>
                              <span>{parsedData.header.messageType === 'sms-deliver' ? 'Timestamp' : 'Validity Period'}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-destructive/20 border border-destructive/30 inline-block mr-2"></span>
                              <span>User Data</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">UDH Elements</h4>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-blue-500/20 border-blue-500/40 border inline-block mr-2"></span>
                              <span>User Data Header</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-blue-300/20 border-blue-300/40 border inline-block mr-2"></span>
                              <span>Information Element Data</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-orange-500/20 border-orange-500/40 border inline-block mr-2"></span>
                              <span>Concatenated SMS</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 bg-green-500/20 border-green-500/40 border inline-block mr-2"></span>
                              <span>Application Port or Special Indicators</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Hex View */}
                <TabsContent value="hex">
                  <div className="overflow-x-auto">
                    <h3 className="text-sm font-semibold mb-2">Hexadecimal View</h3>
                    <div className="flex border rounded-lg">
                      <div className="w-16 flex-shrink-0 bg-muted border-r p-2">
                        <div className="font-mono text-xs text-muted-foreground">Offset</div>
                        {Array.from({ length: Math.ceil(pduString.length / 32) }).map((_, i) => (
                          <div key={i} className="font-mono text-xs">{(i * 16).toString(16).padStart(4, '0')}</div>
                        ))}
                      </div>
                      <div className="flex-grow p-2">
                        <div className="font-mono text-xs space-y-1">
                          <div className="text-muted-foreground">00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</div>
                          {Array.from({ length: Math.ceil(pduString.length / 32) }).map((_, i) => {
                            const startIdx = i * 32;
                            const hexSubstr = pduString.substring(startIdx, startIdx + 32);
                            const hexBytes = [];
                            
                            for (let j = 0; j < hexSubstr.length; j += 2) {
                              hexBytes.push(hexSubstr.substring(j, j + 2));
                            }
                            
                            return (
                              <div key={i}>{hexBytes.join(' ')}</div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold my-2">Octet Description</h3>
                    <div className="border rounded-lg divide-y">
                      {/* Group fields by type for better organization */}
                      {(() => {
                        // Extract UDH-related fields
                        const udhFields = parsedData.properties.filter(prop => 
                          prop.rawBytes && 
                          (prop.name.toLowerCase().includes('user data header') || 
                           prop.name.toLowerCase().includes('information element'))
                        );
                        
                        // Extract non-UDH fields
                        const normalFields = parsedData.properties.filter(prop => 
                          prop.rawBytes && 
                          !(prop.name.toLowerCase().includes('user data header') || 
                            prop.name.toLowerCase().includes('information element'))
                        );
                        
                        // Render normal fields first
                        return (
                          <>
                            {normalFields.map((property, index) => (
                              <div key={`normal-${index}`} className="p-3">
                                <h4 className="font-medium">
                                  {property.offset !== undefined 
                                    ? `0x${property.offset.toString(16).padStart(2, '0')}: ${property.rawBytes}`
                                    : property.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {property.description}
                                </p>
                                {property.value && property.value !== property.rawBytes && (
                                  <p className="text-xs mt-1">Value: <span className="font-medium">{property.value}</span></p>
                                )}
                              </div>
                            ))}
                            
                            {/* UDH Section Header if UDH fields exist */}
                            {udhFields.length > 0 && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border-t-2 border-blue-300">
                                <h4 className="font-semibold text-blue-600 dark:text-blue-400">User Data Header Fields</h4>
                                <p className="text-xs text-muted-foreground">
                                  The following fields are part of the User Data Header, indicated by the UDHI flag
                                </p>
                              </div>
                            )}
                            
                            {/* UDH Fields with special styling */}
                            {udhFields.map((property, index) => (
                              <div key={`udh-${index}`} className="p-3 bg-blue-50/30 dark:bg-blue-950/10">
                                <h4 className="font-medium text-blue-700 dark:text-blue-300">
                                  {property.offset !== undefined 
                                    ? `0x${property.offset.toString(16).padStart(2, '0')}: ${property.rawBytes}`
                                    : property.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {property.description}
                                </p>
                                {property.value && property.value !== property.rawBytes && (
                                  <p className="text-xs mt-1">Value: <span className="font-medium">{property.value}</span></p>
                                )}
                              </div>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No PDU Parsed Yet</h3>
                <p className="text-muted-foreground mt-2">
                  Enter a PDU string and click "Parse PDU" to see the analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
