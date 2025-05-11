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
import { AlertCircle, Check, Copy, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ByteDisplay from "./ByteDisplay";
import { useLocation } from "wouter";

// Example PDUs
const examplePdus = {
  "deliver-7bit": "07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07",
  "deliver-ucs2": "07911326040000F0040B911346610089F600082180214155840018D4F29C0E6A96E7F3F0B90C0A07D9D76D3D3739CC2E83C661757A0C0EB3D3",
  "submit-7bit": "0011000B916407281553F80000AA0C48656C6C6F20776F726C64",
  "submit-binary": "0011000B916407281553F800F40605041504050423F0",
  "submit-multipart-1": "0051000B916407281553F80000A0050003010201546869732069732074686520666972737420706172742073686F77696E6720686F772061206C6F6E67206D657373616765206973207370616E206163726F7373206D756C7469706C652053",
  "submit-multipart-2": "0051000B916407281553F80000A005000301024D532053554D4954206D6573736167657320627920627265616B696E67207468656D20696E746F20736D616C6C6572206368756E6B732E2054686973206973207061727420322E",
}

// Knowledge base mapping for PDU fields
const fieldToKnowledgeSection: Record<string, string> = {
  "TP-MTI": "pdu-formats",
  "TP-MMS": "pdu-formats",
  "TP-RP": "pdu-formats",
  "TP-UDHI": "pdu-formats",
  "TP-SRR": "pdu-formats",
  "TP-VPF": "pdu-formats",
  "TP-RD": "pdu-formats",
  "TP-DA": "fields",
  "TP-OA": "fields",
  "TP-PID": "fields",
  "TP-DCS": "encodings",
  "TP-SCTS": "fields",
  "TP-UDL": "fields",
  "TP-UD": "fields",
  "TP-VP": "fields",
  "SMSC Address": "sms-architecture",
  "First Octet": "pdu-formats",
  "User Data Header": "multipart",
  "Data Coding Scheme": "encodings",
  "Protocol Identifier": "fields",
  "Validity Period": "fields",
  "Service Centre Time Stamp": "fields"
};

export default function PDUParser() {
  const [pduType, setPduType] = useState<"sms-deliver" | "sms-submit">("sms-deliver");
  const [pduString, setPduString] = useState<string>("07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07");
  const [resultsTab, setResultsTab] = useState<string>("decoded");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");
  const [, setLocation] = useLocation();
  
  // Function to get the knowledge base section for a field
  const getKnowledgeBaseLink = (fieldName: string): string | null => {
    return fieldToKnowledgeSection[fieldName] || null;
  };
  
  // Function to navigate to the knowledge base section
  const openKnowledgeSection = (sectionId: string) => {
    setLocation(`/?tab=learn&section=${sectionId}`);
  };

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
                                <div className="flex items-center">
                                  Message Type:
                                  {getKnowledgeBaseLink("TP-MTI") && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            onClick={() => openKnowledgeSection(getKnowledgeBaseLink("TP-MTI")!)}
                                            className="ml-1 inline-flex"
                                          >
                                            <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Learn more about Message Types</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.messageType.toUpperCase()}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                <div className="flex items-center">
                                  SMSC:
                                  {getKnowledgeBaseLink("SMSC Address") && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            onClick={() => openKnowledgeSection(getKnowledgeBaseLink("SMSC Address")!)}
                                            className="ml-1 inline-flex"
                                          >
                                            <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Learn more about SMSC</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.smsc}</td>
                            </tr>
                            {parsedData.header.sender && (
                              <tr>
                                <td className="pb-1 pr-3 text-muted-foreground">
                                  <div className="flex items-center">
                                    Sender:
                                    {getKnowledgeBaseLink("TP-OA") && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              onClick={() => openKnowledgeSection(getKnowledgeBaseLink("TP-OA")!)}
                                              className="ml-1 inline-flex"
                                            >
                                              <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Learn more about Originating Address</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                </td>
                                <td className="pb-1 font-medium">{parsedData.header.sender}</td>
                              </tr>
                            )}
                            {parsedData.header.recipient && (
                              <tr>
                                <td className="pb-1 pr-3 text-muted-foreground align-top">
                                  <div className="flex items-center">
                                    Recipient:
                                    {getKnowledgeBaseLink("TP-DA") && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              onClick={() => openKnowledgeSection(getKnowledgeBaseLink("TP-DA")!)}
                                              className="ml-1 inline-flex"
                                            >
                                              <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Learn more about Destination Address</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
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
                                  <div className="flex items-center">
                                    Timestamp:
                                    {getKnowledgeBaseLink("Service Centre Time Stamp") && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              onClick={() => openKnowledgeSection(getKnowledgeBaseLink("Service Centre Time Stamp")!)}
                                              className="ml-1 inline-flex"
                                            >
                                              <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Learn more about Timestamps</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
                                </td>
                                <td className="pb-1 font-medium">{parsedData.header.timestamp}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                <div className="flex items-center">
                                  Encoding:
                                  {getKnowledgeBaseLink("Data Coding Scheme") && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            onClick={() => openKnowledgeSection(getKnowledgeBaseLink("Data Coding Scheme")!)}
                                            className="ml-1 inline-flex"
                                          >
                                            <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Learn more about SMS Encodings</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </td>
                              <td className="pb-1 font-medium">{parsedData.header.encoding}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">
                                <div className="flex items-center">
                                  Multipart:
                                  {getKnowledgeBaseLink("User Data Header") && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            onClick={() => openKnowledgeSection(getKnowledgeBaseLink("User Data Header")!)}
                                            className="ml-1 inline-flex"
                                          >
                                            <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="text-xs">Learn more about Multipart SMS</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
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
                                <td className="px-4 py-2">
                                  <div className="flex items-center">
                                    {property.name}
                                    {getKnowledgeBaseLink(property.name) && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              onClick={() => openKnowledgeSection(getKnowledgeBaseLink(property.name)!)}
                                              className="ml-1 inline-flex"
                                            >
                                              <Info size={14} className="text-blue-400 hover:text-blue-500" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-xs">Learn more about {property.name}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </div>
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
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-primary/20 border border-primary/30 inline-block mr-2"></span>
                          <div className="flex items-center">
                            <span>SMSC Information</span>
                            {getKnowledgeBaseLink("SMSC Address") && (
                              <button 
                                onClick={() => openKnowledgeSection(getKnowledgeBaseLink("SMSC Address")!)}
                                className="ml-1 inline-flex"
                              >
                                <Info size={12} className="text-blue-400 hover:text-blue-500" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-secondary/20 border border-secondary/30 inline-block mr-2"></span>
                          <div className="flex items-center">
                            <span>{parsedData.header.messageType === 'sms-deliver' ? 'Originating Address' : 'Destination Address'}</span>
                            {getKnowledgeBaseLink(parsedData.header.messageType === 'sms-deliver' ? "TP-OA" : "TP-DA") && (
                              <button 
                                onClick={() => openKnowledgeSection(getKnowledgeBaseLink(parsedData.header.messageType === 'sms-deliver' ? "TP-OA" : "TP-DA")!)}
                                className="ml-1 inline-flex"
                              >
                                <Info size={12} className="text-blue-400 hover:text-blue-500" />
                              </button>
                            )}
                          </div>
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
                      {parsedData.properties
                        .filter(prop => prop.rawBytes)
                        .map((property, index) => (
                          <div key={index} className="p-3">
                            <h4 className="font-medium">
                              {property.offset !== undefined 
                                ? `0x${property.offset.toString(16).padStart(2, '0')}: ${property.rawBytes}`
                                : property.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {property.description}
                            </p>
                          </div>
                        ))}
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
