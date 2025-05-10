import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SMPPParseResult } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ByteDisplay from "./ByteDisplay";
import { exampleSmppPdus } from "@/lib/smppUtils";

export default function SMPPParser() {
  const [pduString, setPduString] = useState<string>("0000003B00000004000000000000000100010101313233343536373839000101013132333435363738390000000000000000040548656C6C6F");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");

  // SMPP Parse mutation
  const { mutate: parseSmpp, data: parsedData, isPending, isError, error } = useMutation({
    mutationFn: async (data: { pduString: string }) => {
      const response = await apiRequest("POST", "/api/parse-smpp", data);
      return response.json() as Promise<SMPPParseResult>;
    }
  });

  // Handle parse button click
  const handleParse = () => {
    if (pduString.trim()) {
      parseSmpp({ pduString: pduString.trim() });
    }
  };

  // Load example SMPP PDU
  const loadExamplePdu = (example: keyof typeof exampleSmppPdus) => {
    const pdu = exampleSmppPdus[example];
    setPduString(pdu);
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
            <h2 className="text-lg font-medium mb-4">SMPP Protocol PDU</h2>
            
            {/* PDU Input */}
            <div className="mb-4">
              <Label htmlFor="smpp-input" className="block text-sm font-medium mb-1">
                SMPP PDU String (Hexadecimal)
              </Label>
              <Textarea
                id="smpp-input"
                rows={4}
                value={pduString}
                onChange={(e) => setPduString(e.target.value)}
                placeholder="Enter SMPP PDU hex string"
                className="font-mono text-sm resize-none"
              />
              <div className="mt-1 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <AlertCircle className="h-3 w-3 inline-block mr-1" />
                        SMPP format
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>SMPP PDUs start with a 4-byte command length, followed by 4-byte command ID, 4-byte command status, and 4-byte sequence number.</p>
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
              <Label className="block text-sm font-medium mb-2">Example SMPP PDUs</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("submit_sm")}
                  className="h-7 text-xs"
                >
                  submit_sm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("deliver_sm")}
                  className="h-7 text-xs"
                >
                  deliver_sm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("bind_transmitter")}
                  className="h-7 text-xs"
                >
                  bind_transmitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExamplePdu("enquire_link")}
                  className="h-7 text-xs"
                >
                  enquire_link
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
                <path d="M15 3v4a1 1 0 0 0 1 1h4"></path>
                <path d="M18 17v-1a5 5 0 0 0-5-5H9.5A3.5 3.5 0 0 0 6 14.5V16"></path>
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="4 17 8 13 10 15 14 11 20 17"></polyline>
              </svg>
              {isPending ? "Parsing..." : "Parse SMPP PDU"}
            </Button>

            {/* Parse Errors */}
            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to parse SMPP PDU"}
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
            <h2 className="text-lg font-medium mb-4">SMPP Protocol Analysis</h2>

            {parsedData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Command Information</h3>
                    <div className="bg-muted/50 p-3 rounded border">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Command Name:</td>
                            <td className="pb-1 font-medium">{parsedData.header.commandName}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Command ID:</td>
                            <td className="pb-1 font-medium">{parsedData.header.commandId}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Command Status:</td>
                            <td className="pb-1 font-medium">{parsedData.header.commandStatus}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Command Length:</td>
                            <td className="pb-1 font-medium">{parsedData.header.commandLength} bytes</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Sequence Number:</td>
                            <td className="pb-1 font-medium">{parsedData.header.sequenceNumber}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Message Information</h3>
                    <div className="bg-muted/50 p-3 rounded border">
                      <table className="w-full text-sm">
                        <tbody>
                          {parsedData.sourceAddr && (
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Source:</td>
                              <td className="pb-1 font-medium">{parsedData.sourceAddr}</td>
                            </tr>
                          )}
                          {parsedData.destAddr && (
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Destination:</td>
                              <td className="pb-1 font-medium">{parsedData.destAddr}</td>
                            </tr>
                          )}
                          {parsedData.servicetype && (
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Service Type:</td>
                              <td className="pb-1 font-medium">{parsedData.servicetype || "Default"}</td>
                            </tr>
                          )}
                          {parsedData.messageContent && (
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Message:</td>
                              <td className="pb-1 font-medium">{parsedData.messageContent}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* PDU Structure Breakdown */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">PDU Structure</h3>
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
                        <span>Command Length</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-secondary/20 border border-secondary/30 inline-block mr-2"></span>
                        <span>Command ID & Destination</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-accent/20 border border-accent/30 inline-block mr-2"></span>
                        <span>Command Status & Timing</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-destructive/20 border border-destructive/30 inline-block mr-2"></span>
                        <span>Source & Message Content</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-muted border border-muted-foreground/30 inline-block mr-2"></span>
                        <span>Sequence & Optional TLVs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDU Fields */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">SMPP Fields</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-muted text-left">
                          <th className="px-4 py-2 font-medium">Field</th>
                          <th className="px-4 py-2 font-medium">Value</th>
                          <th className="px-4 py-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parsedData.properties.map((property, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{property.name}</td>
                            <td className="px-4 py-2 font-mono">{property.value}</td>
                            <td className="px-4 py-2 text-muted-foreground">{property.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">No SMPP PDU Parsed Yet</h3>
                <p className="text-muted-foreground">Enter an SMPP PDU and click "Parse" to analyze it.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}