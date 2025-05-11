import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { EFSMSParseResult } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exampleEfSmsPdus } from "@/lib/efSmsUtils";
import ByteDisplay from "./ByteDisplay";

export default function EFSMSParser() {
  const [hexData, setHexData] = useState("");
  const [recordNumber, setRecordNumber] = useState(1);
  const [activeTab, setActiveTab] = useState("input");
  
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["parse-efsms", hexData, recordNumber],
    queryFn: async () => {
      if (!hexData) return Promise.resolve(null);
      try {
        const result = await apiRequest("/api/parse-efsms", {
          method: "POST",
          body: JSON.stringify({ hexData, recordNumber }),
        });
        return result as EFSMSParseResult;
      } catch (e) {
        console.error("Error parsing EF_SMS data:", e);
        throw e;
      }
    },
    enabled: !!hexData,
  });

  const handleParse = async () => {
    if (hexData.trim()) {
      try {
        await refetch();
        if (activeTab === "input") {
          setActiveTab("output");
        }
      } catch (error) {
        console.error("Error parsing EF_SMS data:", error);
      }
    }
  };

  const handleUseExample = (example: string) => {
    setHexData(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">SIM EF_SMS Record Parser</CardTitle>
        <CardDescription>
          Parse Elementary File for SMS (EF_SMS) records from a SIM card. EF_SMS records contain SMS messages 
          stored on the SIM card, with a status byte indicating the message state.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="efsms-hex">EF_SMS Hex Data</Label>
              <Input
                id="efsms-hex"
                placeholder="Enter EF_SMS hexadecimal data..."
                value={hexData}
                onChange={(e) => setHexData(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="record-number">Record Number</Label>
              <Input
                id="record-number"
                type="number"
                min={1}
                value={recordNumber}
                onChange={(e) => setRecordNumber(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground ml-2">
                SIM card record number (typically 1-10)
              </span>
            </div>
            
            <div className="flex flex-col space-y-2 mt-4">
              <Button onClick={handleParse} className="w-full sm:w-auto">Parse EF_SMS Data</Button>
              
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">Example EF_SMS Records:</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-mono overflow-hidden truncate"
                    onClick={() => handleUseExample(exampleEfSmsPdus["unread-message"])}
                  >
                    <span className="font-normal mr-2 text-muted-foreground">Unread:</span>
                    {exampleEfSmsPdus["unread-message"].substring(0, 20)}...
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-mono overflow-hidden truncate"
                    onClick={() => handleUseExample(exampleEfSmsPdus["read-message"])}
                  >
                    <span className="font-normal mr-2 text-muted-foreground">Read:</span>
                    {exampleEfSmsPdus["read-message"].substring(0, 20)}...
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-mono overflow-hidden truncate"
                    onClick={() => handleUseExample(exampleEfSmsPdus["stored-sent"])}
                  >
                    <span className="font-normal mr-2 text-muted-foreground">Sent:</span>
                    {exampleEfSmsPdus["stored-sent"].substring(0, 20)}...
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-6">
            {isPending && <div className="text-center">Parsing EF_SMS data...</div>}
            
            {isError && (
              <div className="bg-destructive/10 p-4 rounded-md text-destructive">
                <h3 className="font-medium">Error Parsing EF_SMS Data</h3>
                <p>{(error as Error)?.message || "Unknown error occurred"}</p>
              </div>
            )}
            
            {data && (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-md border">
                  <h3 className="text-lg font-medium mb-2">EF_SMS Header Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status:</p>
                      <p className="font-mono">{data.header.status} ({data.header.statusDescription})</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SMS Type:</p>
                      <p className="font-mono">{data.header.smsType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Record Number:</p>
                      <p className="font-mono">{data.header.recordNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Record Size:</p>
                      <p className="font-mono">{data.header.recordSize} bytes</p>
                    </div>
                  </div>
                </div>
                
                {data.message && (
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h3 className="text-lg font-medium mb-2">Decoded Message</h3>
                    <p className="font-medium border-l-4 border-primary pl-3 py-1">{data.message}</p>
                  </div>
                )}
                
                {data.pdu && (
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <h3 className="text-lg font-medium mb-2">Embedded PDU Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Message Type:</p>
                        <p className="font-mono">{data.pdu.header.messageType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Encoding:</p>
                        <p className="font-mono">{data.pdu.header.encoding}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sender:</p>
                        <p className="font-mono">{data.pdu.header.sender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Recipient:</p>
                        <p className="font-mono">{data.pdu.header.recipient || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp:</p>
                        <p className="font-mono">{data.pdu.header.timestamp || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">SMSC:</p>
                        <p className="font-mono">{data.pdu.header.smsc}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-medium mb-2">EF_SMS Binary Structure</h3>
                  <div className="w-full border rounded-md overflow-hidden">
                    <div className="grid grid-cols-12 gap-1 p-3 overflow-x-auto">
                      {data.structureBreakdown.bytes.map((byte, index) => (
                        <ByteDisplay
                          key={index}
                          value={byte}
                          color={data.structureBreakdown.colors[index] || "default"}
                          tooltip={data.structureBreakdown.tooltips[index] || byte}
                        />
                      ))}
                    </div>
                    <div className="bg-muted/50 border-t p-2">
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(data.structureBreakdown.colors)).map((color, index) => {
                          // Find the first index with this color
                          const descIndex = data.structureBreakdown.colors.indexOf(color);
                          const description = data.structureBreakdown.descriptions[descIndex] || '';
                          
                          return (
                            <div key={index} className="flex items-center">
                              <div 
                                className={`w-3 h-3 rounded-full mr-1 ${
                                  color === 'primary' ? 'bg-primary' :
                                  color === 'secondary' ? 'bg-secondary' :
                                  color === 'destructive' ? 'bg-destructive' :
                                  color === 'warning' ? 'bg-yellow-500' :
                                  color === 'success' ? 'bg-green-500' :
                                  color === 'info' ? 'bg-blue-500' :
                                  'bg-gray-500'
                                }`}
                              />
                              <span className="text-xs">{description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {data.properties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">EF_SMS Fields</h3>
                    <div className="overflow-x-auto border rounded-md">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Field</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Value</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {data.properties.map((field, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium">{field.name}</td>
                              <td className="px-4 py-2 text-sm font-mono">{field.value}</td>
                              <td className="px-4 py-2 text-sm">{field.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}