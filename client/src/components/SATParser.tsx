import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SATParseResult } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Copy, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ByteDisplay from "./ByteDisplay";
import { exampleSatPdus } from "@/lib/satUtils";
import { useLocation } from "wouter";

// Knowledge base mapping for SAT fields with descriptions
interface KnowledgeItem {
  section: string;
  summary: string;
}

const fieldToKnowledgeSection: Record<string, KnowledgeItem> = {
  "Command Details": { 
    section: "sat", 
    summary: "Defines the specific SAT command type and its parameters" 
  },
  "Device Identities": { 
    section: "sat", 
    summary: "Identifies the source and destination devices for the command" 
  },
  "Text String": { 
    section: "sat", 
    summary: "Contains text content to be displayed on the device" 
  },
  "Command Qualifier": { 
    section: "sat", 
    summary: "Contains modifiers that affect how the command should be executed" 
  },
  "Proactive SIM Command": { 
    section: "sat", 
    summary: "Commands initiated by the SIM rather than the network" 
  },
};

export default function SATParser() {
  const [pduString, setPduString] = useState<string>("D0288103012180820281028D1A04546869732069732061207465737420746578742E2020202020");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");
  const [, setLocation] = useLocation();
  
  // Function to get the knowledge base item for a field
  const getKnowledgeBaseItem = (fieldName: string): KnowledgeItem | null => {
    return fieldToKnowledgeSection[fieldName] || null;
  };
  
  // Function to navigate to the knowledge base section
  const openKnowledgeSection = (sectionId: string) => {
    // First make sure we're on the home page
    setLocation('/');
    
    // Use setTimeout to ensure we're on home page before trying to navigate to the learn tab
    setTimeout(() => {
      // Find the learn tab and click it
      const learnTab = document.querySelector('[data-value="learn"]');
      if (learnTab) {
        (learnTab as HTMLElement).click();
        
        // Then try to find and click the specific section
        setTimeout(() => {
          console.log(`Looking for section: ${sectionId}`);
          
          // First try to find a button with data-section attribute
          const sectionButton = document.querySelector(`[data-section="${sectionId}"]`);
          if (sectionButton) {
            console.log("Found section button, clicking it");
            (sectionButton as HTMLElement).click();
          } else {
            // If we can't find a button with the data-section attribute, try other approaches
            console.log("Section button not found, trying other approaches");
            
            // Approach 2: Look for buttons that have the section name in their text content
            const buttons = document.querySelectorAll('button');
            // Convert NodeList to Array to use forEach
            Array.from(buttons).forEach(button => {
              if (button.textContent?.toLowerCase().includes(sectionId.toLowerCase().replace(/-/g, ' '))) {
                console.log("Found button by text content, clicking it");
                (button as HTMLElement).click();
              }
            });
          }
        }, 500);
      } else {
        console.log("Learn tab not found");
      }
    }, 300);
  };

  // SAT Parse mutation
  const { mutate: parseSat, data: parsedData, isPending, isError, error } = useMutation({
    mutationFn: async (data: { pduString: string }) => {
      const response = await apiRequest("POST", "/api/parse-sat", data);
      return response.json() as Promise<SATParseResult>;
    }
  });

  // Handle parse button click
  const handleParse = () => {
    if (pduString.trim()) {
      parseSat({ pduString: pduString.trim() });
    }
  };

  // Load example SAT command
  const loadExamplePdu = (example: keyof typeof exampleSatPdus) => {
    const pdu = exampleSatPdus[example];
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
            <h2 className="text-lg font-medium mb-4">SIM Application Toolkit Command</h2>
            
            {/* PDU Input */}
            <div className="mb-4">
              <Label htmlFor="sat-input" className="block text-sm font-medium mb-1">
                SAT Command PDU String (Hexadecimal)
              </Label>
              <Textarea
                id="sat-input"
                rows={4}
                value={pduString}
                onChange={(e) => setPduString(e.target.value)}
                placeholder="Enter SAT command PDU hex string (e.g., D0288103012180820281028D1A04546869732069732061207465737420746578742E2020202020)"
                className="font-mono text-sm resize-none"
              />
              <div className="mt-1 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help">
                        <AlertCircle className="h-3 w-3 inline-block mr-1" />
                        SAT Command format
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>SIM Application Toolkit commands start with 0xD0 (Proactive SIM Command Tag)</p>
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
              <Label className="block text-sm font-medium mb-2">Example SAT Commands</Label>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium mb-1">Basic Commands:</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("display-text")}
                    className="h-7 text-xs"
                  >
                    Display Text
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("select-menu")}
                    className="h-7 text-xs"
                  >
                    Select Menu
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("send-sms")}
                    className="h-7 text-xs"
                  >
                    Send SMS
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("setup-call")}
                    className="h-7 text-xs"
                  >
                    Setup Call
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground font-medium mt-3 mb-1">UI Commands:</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("get-input")}
                    className="h-7 text-xs"
                  >
                    Get Input
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("get-inkey")}
                    className="h-7 text-xs"
                  >
                    Get Inkey
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("play-tone")}
                    className="h-7 text-xs"
                  >
                    Play Tone
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("set-idle-text")}
                    className="h-7 text-xs"
                  >
                    Set Idle Text
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground font-medium mt-3 mb-1">System Commands:</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("refresh")}
                    className="h-7 text-xs"
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("setup-event-list")}
                    className="h-7 text-xs"
                  >
                    Setup Events
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("provide-local-info")}
                    className="h-7 text-xs"
                  >
                    Local Info
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("launch-browser")}
                    className="h-7 text-xs"
                  >
                    Launch Browser
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground font-medium mt-3 mb-1">Advanced Commands:</div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("open-channel")}
                    className="h-7 text-xs"
                  >
                    Open Channel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("send-data")}
                    className="h-7 text-xs"
                  >
                    Send Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("receive-data")}
                    className="h-7 text-xs"
                  >
                    Receive Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadExamplePdu("close-channel")}
                    className="h-7 text-xs"
                  >
                    Close Channel
                  </Button>
                </div>
              </div>
            </div>

            {/* Parse Button */}
            <Button 
              className="w-full" 
              onClick={handleParse}
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              {isPending ? "Parsing..." : "Parse SAT Command"}
            </Button>

            {/* Parse Errors */}
            {isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to parse SAT command"}
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
            <h2 className="text-lg font-medium mb-4">SIM Application Toolkit Analysis</h2>

            {parsedData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Command Information</h3>
                    <div className="bg-muted/50 p-3 rounded border">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">
                              <div className="flex items-center">
                                <span>Command Type:</span>
                                {getKnowledgeBaseItem("Command Details") && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          onClick={() => openKnowledgeSection(getKnowledgeBaseItem("Command Details")!.section)}
                                          className="ml-1 inline-flex"
                                        >
                                          <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{getKnowledgeBaseItem("Command Details")?.summary || "Learn more about Command Details"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="pb-1 font-medium">{parsedData.header.commandType}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">
                              <div className="flex items-center">
                                <span>Command Qualifier:</span>
                                {getKnowledgeBaseItem("Command Qualifier") && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          onClick={() => openKnowledgeSection(getKnowledgeBaseItem("Command Qualifier")!.section)}
                                          className="ml-1 inline-flex"
                                        >
                                          <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{getKnowledgeBaseItem("Command Qualifier")?.summary || "Learn more about Command Qualifier"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="pb-1 font-medium">0x{parsedData.header.commandQualifier}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">
                              <div className="flex items-center">
                                <span>Source Device:</span>
                                {getKnowledgeBaseItem("Device Identities") && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          onClick={() => openKnowledgeSection(getKnowledgeBaseItem("Device Identities")!.section)}
                                          className="ml-1 inline-flex"
                                        >
                                          <Info size={12} className="text-blue-400 hover:text-blue-500" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{getKnowledgeBaseItem("Device Identities")?.summary || "Learn more about Device Identities"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                            <td className="pb-1 font-medium">{parsedData.header.deviceIdentities.source}</td>
                          </tr>
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Destination Device:</td>
                            <td className="pb-1 font-medium">{parsedData.header.deviceIdentities.destination}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Command Details</h3>
                    <div className="bg-muted/50 p-3 rounded border">
                      <p className="text-sm whitespace-pre-wrap">{parsedData.commandDetails}</p>
                    </div>
                  </div>
                </div>
                
                {/* Command Structure Breakdown */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Command Structure</h3>
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
                        <span>Command Header</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-secondary/20 border border-secondary/30 inline-block mr-2"></span>
                        <span>Tag & Length</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-accent/20 border border-accent/30 inline-block mr-2"></span>
                        <span>Tag Data</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Command Properties */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Command Properties</h3>
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
                        {parsedData.properties.map((property, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              <div className="flex items-center">
                                <span>{property.name}</span>
                                {getKnowledgeBaseItem(property.name) && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          onClick={() => openKnowledgeSection(getKnowledgeBaseItem(property.name)!.section)}
                                          className="ml-1 inline-flex"
                                        >
                                          <Info size={14} className="text-blue-400 hover:text-blue-500" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{getKnowledgeBaseItem(property.name)?.summary || `Learn more about ${property.name}`}</p>
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
                <h3 className="text-lg font-medium">No SAT Command Parsed Yet</h3>
                <p className="text-muted-foreground">Enter a SIM Application Toolkit command PDU and click "Parse" to analyze it.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}