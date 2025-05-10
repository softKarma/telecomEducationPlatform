import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { EFSMSParseResult } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ByteDisplay from "./ByteDisplay";
import { exampleEfSmsPdus } from "@/lib/efSmsUtils";

export default function EFSMSParser() {
  const [hexData, setHexData] = useState<string>("03001901059144371300006018402151311063A7F79B9D066181C6687CB6890BB4C0699DF723A");
  const [recordNum, setRecordNum] = useState<number>(1);
  const [resultsTab, setResultsTab] = useState<string>("overview");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");

  // EF_SMS Parse mutation
  const { mutate: parseEfSms, data: parsedData, isPending, isError, error } = useMutation({
    mutationFn: async (data: { hexData: string; recordNum: number }) => {
      const response = await apiRequest("POST", "/api/parse-efsms", data);
      return response.json() as Promise<EFSMSParseResult>;
    }
  });

  // Handle parse button click
  const handleParse = () => {
    if (hexData.trim()) {
      parseEfSms({ hexData: hexData.trim(), recordNum });
    }
  };

  // Load example data
  const loadExampleData = (example: keyof typeof exampleEfSmsPdus) => {
    const data = exampleEfSmsPdus[example];
    setHexData(data);
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
            <h2 className="text-lg font-medium mb-4">EF_SMS Record Data</h2>
            
            {/* Hex Data Input */}
            <div className="mb-4">
              <Label htmlFor="hex-data" className="block text-sm font-medium mb-1">
                Hexadecimal Data
              </Label>
              <Textarea
                id="hex-data"
                rows={4}
                value={hexData}
                onChange={(e) => setHexData(e.target.value)}
                placeholder="Enter EF_SMS record hexadecimal data"
                className="font-mono text-sm resize-none"
              />
              <div className="mt-1 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <AlertCircle className="h-3 w-3 inline-block mr-1" />
                        EF_SMS format
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>EF_SMS (Elementary File for Short Message Storage) is the format used to store SMS messages on a SIM card. The data starts with a status byte followed by the SMS PDU.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setHexData("")}
                  className="h-auto p-0 text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Record Number */}
            <div className="mb-4">
              <Label htmlFor="record-num" className="block text-sm font-medium mb-1">
                Record Number
              </Label>
              <Input
                id="record-num"
                type="number"
                min={1}
                value={recordNum}
                onChange={(e) => setRecordNum(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                SIM card record number (for reference only)
              </p>
            </div>

            {/* Example Data */}
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-2">Example EF_SMS Records</Label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExampleData("unread-message")}
                  className="h-7 text-xs"
                >
                  Unread Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExampleData("read-message")}
                  className="h-7 text-xs"
                >
                  Read Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExampleData("stored-sent")}
                  className="h-7 text-xs"
                >
                  Stored (Sent)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadExampleData("empty-record")}
                  className="h-7 text-xs"
                >
                  Empty Record
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
                <path d="M17 21H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4.5"></path>
                <path d="M13 18a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"></path>
                <path d="M13 6H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5"></path>
                <path d="M16 6h.3c.3 0 .5.1.7.3L20 10"></path>
              </svg>
              {isPending ? "Parsing..." : "Parse EF_SMS Data"}
            </Button>

            {/* Parse Errors */}
            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to parse EF_SMS data"}
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
            <h2 className="text-lg font-medium mb-4">EF_SMS Analysis</h2>

            {parsedData ? (
              <Tabs value={resultsTab} onValueChange={setResultsTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Record Overview</TabsTrigger>
                  <TabsTrigger value="pdu">PDU Content</TabsTrigger>
                  <TabsTrigger value="structure">Hex Structure</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Record Information</h3>
                      <div className="bg-muted/50 p-3 rounded border">
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Record Number:</td>
                              <td className="pb-1 font-medium">{parsedData.header.recordNumber}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Status:</td>
                              <td className="pb-1 font-medium">{parsedData.header.status} ({parsedData.header.statusDescription})</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Message Type:</td>
                              <td className="pb-1 font-medium">{parsedData.header.messageType}</td>
                            </tr>
                            <tr>
                              <td className="pb-1 pr-3 text-muted-foreground">Record Size:</td>
                              <td className="pb-1 font-medium">{parsedData.header.recordSize} bytes</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {parsedData.message && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Message Content</h3>
                        <div className="bg-muted/50 p-3 rounded border h-full">
                          <p className="text-sm whitespace-pre-wrap">{parsedData.message}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Record Fields */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Record Fields</h3>
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
                </TabsContent>

                {/* PDU Content Tab */}
                <TabsContent value="pdu">
                  {parsedData.pdu ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">PDU Information</h3>
                          <div className="bg-muted/50 p-3 rounded border">
                            <table className="w-full text-sm">
                              <tbody>
                                <tr>
                                  <td className="pb-1 pr-3 text-muted-foreground">PDU Type:</td>
                                  <td className="pb-1 font-medium">{parsedData.pdu.header.messageType.toUpperCase()}</td>
                                </tr>
                                <tr>
                                  <td className="pb-1 pr-3 text-muted-foreground">SMSC:</td>
                                  <td className="pb-1 font-medium">{parsedData.pdu.header.smsc}</td>
                                </tr>
                                {parsedData.pdu.header.sender && (
                                  <tr>
                                    <td className="pb-1 pr-3 text-muted-foreground">Sender:</td>
                                    <td className="pb-1 font-medium">{parsedData.pdu.header.sender}</td>
                                  </tr>
                                )}
                                {parsedData.pdu.header.recipient && (
                                  <tr>
                                    <td className="pb-1 pr-3 text-muted-foreground">Recipient:</td>
                                    <td className="pb-1 font-medium">{parsedData.pdu.header.recipient}</td>
                                  </tr>
                                )}
                                {parsedData.pdu.header.timestamp && (
                                  <tr>
                                    <td className="pb-1 pr-3 text-muted-foreground">Timestamp:</td>
                                    <td className="pb-1 font-medium">{parsedData.pdu.header.timestamp}</td>
                                  </tr>
                                )}
                                <tr>
                                  <td className="pb-1 pr-3 text-muted-foreground">Encoding:</td>
                                  <td className="pb-1 font-medium">{parsedData.pdu.header.encoding}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold mb-2">Message Content</h3>
                          <div className="bg-muted/50 p-3 rounded border h-full">
                            <p className="text-sm whitespace-pre-wrap">{parsedData.pdu.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No PDU Data Available</h3>
                      <p className="text-muted-foreground">
                        This record does not contain a valid SMS PDU or it couldn't be parsed.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Hex Structure Tab */}
                <TabsContent value="structure">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Byte Structure</h3>
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
                          <span>Status</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-secondary/20 border border-secondary/30 inline-block mr-2"></span>
                          <span>SMSC Information</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-accent/20 border border-accent/30 inline-block mr-2"></span>
                          <span>Address Fields</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 bg-destructive/20 border border-destructive/30 inline-block mr-2"></span>
                          <span>Message Content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <path d="M17 21H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v4.5"></path>
                    <path d="M13 18a2 2 0 1 1 4 0 2 2 0 1 1-4 0z"></path>
                    <path d="M13 6H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5"></path>
                    <path d="M16 6h.3c.3 0 .5.1.7.3L20 10"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium">No EF_SMS Data Parsed Yet</h3>
                <p className="text-muted-foreground">Enter EF_SMS data and click "Parse" to analyze it.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}