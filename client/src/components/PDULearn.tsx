import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Learning content sections
type LearnSection = 
  // Level 1: High-level telecom overview
  "telecom-overview" | "cellular-networks" | "network-evolution" | 
  "3g-technology" | "4g-technology" | "5g-technology" |
  // Level 2: Network architecture
  "network-architecture" | "gsm-concepts" | "signaling-protocols" |
  // Level 3: Mobile services
  "voice-services" | "data-services" | "messaging-services" |
  // Level 4: SMS technology
  "sms-overview" | "sms-architecture" | "sms-flow" |
  // Level 5: SMS protocols
  "pdu-formats" | "encodings" | "fields" | "multipart" |
  // Level 6: Advanced protocols
  "sat" | "smpp" |
  // Tools
  "encoding-tool" | "external-resources";

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
  const [section, setSection] = useState<LearnSection>("telecom-overview");
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
          
          <Accordion type="single" collapsible className="w-full mb-4">
            {/* Level 1: High-level telecom overview */}
            <AccordionItem value="level1">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                  <span>Telecom Fundamentals</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
                  <Button 
                    variant={section === "telecom-overview" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("telecom-overview")}
                  >
                    Telecom Overview
                  </Button>
                  <Button 
                    variant={section === "cellular-networks" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("cellular-networks")}
                  >
                    Cellular Networks
                  </Button>
                  <Button 
                    variant={section === "network-evolution" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("network-evolution")}
                  >
                    Network Evolution
                  </Button>
                  <Button 
                    variant={section === "3g-technology" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("3g-technology")}
                  >
                    3G Technology
                  </Button>
                  <Button 
                    variant={section === "4g-technology" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("4g-technology")}
                  >
                    4G Technology
                  </Button>
                  <Button 
                    variant={section === "5g-technology" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("5g-technology")}
                  >
                    5G Technology
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Level 2: Network architecture */}
            <AccordionItem value="level2">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                  <span>Network Architecture</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
                  <Button 
                    variant={section === "network-architecture" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("network-architecture")}
                  >
                    Network Components
                  </Button>
                  <Button 
                    variant={section === "gsm-concepts" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("gsm-concepts")}
                  >
                    GSM Concepts
                  </Button>
                  <Button 
                    variant={section === "signaling-protocols" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("signaling-protocols")}
                  >
                    Signaling Protocols
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Level 3: Mobile services */}
            <AccordionItem value="level3">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                  <span>Mobile Services</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
                  <Button 
                    variant={section === "voice-services" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("voice-services")}
                  >
                    Voice Services
                  </Button>
                  <Button 
                    variant={section === "data-services" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("data-services")}
                  >
                    Data Services
                  </Button>
                  <Button 
                    variant={section === "messaging-services" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("messaging-services")}
                  >
                    Messaging Services
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Level 4: SMS technology */}
            <AccordionItem value="level4">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
                  <span>SMS Technology</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
                  <Button 
                    variant={section === "sms-overview" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("sms-overview")}
                  >
                    SMS Overview
                  </Button>
                  <Button 
                    variant={section === "sms-architecture" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("sms-architecture")}
                  >
                    SMS Architecture
                  </Button>
                  <Button 
                    variant={section === "sms-flow" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("sms-flow")}
                  >
                    SMS Flow
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Level 5: SMS protocols */}
            <AccordionItem value="level5">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">5</span>
                  <span>SMS Protocols</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
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
              </AccordionContent>
            </AccordionItem>
            
            {/* Level 6: Advanced protocols */}
            <AccordionItem value="level6">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">6</span>
                  <span>Advanced Protocols</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
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

                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Tools */}
            <AccordionItem value="tools">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">T</span>
                  <span>Tools & Resources</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2 pl-8">
                  <Button 
                    variant={section === "encoding-tool" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("encoding-tool")}
                  >
                    Encoding Tool
                  </Button>
                  <Button 
                    variant={section === "external-resources" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSection("external-resources")}
                  >
                    External Resources
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {section === "telecom-overview" && (
            <>
              <h3>Introduction to Telecommunications</h3>
              <p>
                Telecommunications is the transmission of information over significant distances using electronic means. 
                This field encompasses a wide range of technologies that have transformed how we communicate, from traditional 
                telephone systems to modern mobile networks and the internet.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">Key Telecommunications Concepts</h4>
                <p className="mb-2">
                  Telecommunications systems typically consist of these fundamental components:
                </p>
                <ul className="mb-0">
                  <li><strong>Transmitter:</strong> Converts information into signals</li>
                  <li><strong>Transmission Medium:</strong> Carries signals (wire, fiber optic, wireless)</li>
                  <li><strong>Receiver:</strong> Converts signals back into usable information</li>
                  <li><strong>Protocols:</strong> Rules governing communication between systems</li>
                  <li><strong>Network Infrastructure:</strong> Interconnected systems enabling end-to-end communication</li>
                </ul>
              </div>
              
              <h4>Evolution of Telecommunications</h4>
              <p>
                Telecommunications has undergone remarkable evolution over the centuries:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Early Era (1800s-1950s)</h5>
                  <ul className="mb-0">
                    <li>Telegraph systems (1830s+)</li>
                    <li>Telephone networks (1870s+)</li>
                    <li>Radio broadcasting (1900s+)</li>
                    <li>Television broadcasting (1930s+)</li>
                    <li>Early switched telephone networks</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Modern Era (1960s-Present)</h5>
                  <ul className="mb-0">
                    <li>Digital transmission technologies</li>
                    <li>Satellite communications</li>
                    <li>Fiber optic networks</li>
                    <li>Cellular networks (1G to 5G)</li>
                    <li>Internet and packet-switched networks</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-l-4 border-info pl-4 my-6">
                <h5 className="mt-0 text-info">The Mobile Revolution</h5>
                <p className="mb-2">
                  Mobile telecommunications has seen rapid advancement through multiple generations:
                </p>
                <ul className="mb-0">
                  <li><strong>1G (1980s):</strong> Analog voice only, no data capabilities</li>
                  <li><strong>2G (1990s):</strong> Digital voice, SMS, basic data (GSM, CDMA)</li>
                  <li><strong>3G (2000s):</strong> Enhanced data capabilities, mobile internet</li>
                  <li><strong>4G (2010s):</strong> High-speed data, video streaming, VoIP</li>
                  <li><strong>5G (2020s):</strong> Ultra-low latency, massive capacity, IoT support</li>
                </ul>
              </div>
              
              <h4>Telecommunications Industry Structure</h4>
              <p>
                The modern telecommunications industry consists of several key segments:
              </p>
              
              <table className="min-w-full divide-y divide-gray-300 text-sm mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Segment</th>
                    <th className="py-2 px-4 text-left">Examples</th>
                    <th className="py-2 px-4 text-left">Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 px-4">Network Operators</td>
                    <td className="py-2 px-4">AT&T, Vodafone, NTT</td>
                    <td className="py-2 px-4">Own and operate telecom networks</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Equipment Vendors</td>
                    <td className="py-2 px-4">Ericsson, Nokia, Huawei</td>
                    <td className="py-2 px-4">Provide telecom infrastructure</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Service Providers</td>
                    <td className="py-2 px-4">MVNOs, ISPs, OTT providers</td>
                    <td className="py-2 px-4">Deliver services over networks</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Device Manufacturers</td>
                    <td className="py-2 px-4">Apple, Samsung, Xiaomi</td>
                    <td className="py-2 px-4">Create end-user telecommunications devices</td>
                  </tr>
                </tbody>
              </table>
              
              <h4>Key Standard-Setting Organizations</h4>
              <p>
                Several organizations play crucial roles in setting telecommunications standards:
              </p>
              <ul>
                <li><strong>ITU (International Telecommunication Union):</strong> UN agency for information and communication technologies</li>
                <li><strong>3GPP (3rd Generation Partnership Project):</strong> Develops mobile broadband standards (GSM, UMTS, LTE, 5G)</li>
                <li><strong>ETSI (European Telecommunications Standards Institute):</strong> Produces globally-applicable standards for ICT</li>
                <li><strong>IETF (Internet Engineering Task Force):</strong> Develops and promotes internet standards</li>
                <li><strong>IEEE (Institute of Electrical and Electronics Engineers):</strong> Technical standards for various technologies</li>
              </ul>
              
              <div className="bg-muted p-4 rounded-md my-6">
                <h4 className="mt-0 mb-2 font-medium">Explore Deeper</h4>
                <p className="mb-2">
                  To understand telecommunications in more detail, explore these fundamental areas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 bg-muted/30">
                    <h5 className="mt-0 mb-1 font-medium text-sm">Cellular Networks</h5>
                    <p className="text-xs mb-2">Learn how mobile networks are structured and operate</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setSection("cellular-networks")}
                    >
                      Explore Cellular Networks
                    </Button>
                  </div>
                  <div className="border rounded-md p-3 bg-muted/30">
                    <h5 className="mt-0 mb-1 font-medium text-sm">Network Architecture</h5>
                    <p className="text-xs mb-2">Understand the components that make up telecom networks</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setSection("network-architecture")}
                    >
                      Explore Network Architecture
                    </Button>
                  </div>
                  <div className="border rounded-md p-3 bg-muted/30">
                    <h5 className="mt-0 mb-1 font-medium text-sm">Messaging Services</h5>
                    <p className="text-xs mb-2">Dive into SMS and other mobile messaging technologies</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setSection("messaging-services")}
                    >
                      Explore Messaging Services
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
          
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
              
              <h3>Advanced SMS Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">Status Reports & PoR</h4>
                  <p className="text-sm mb-2">
                    SMS can include mechanisms to track message delivery:
                  </p>
                  <ul className="mb-0 text-sm">
                    <li><strong>Status Reports:</strong> SMS-STATUS-REPORT PDUs returned to the sender</li>
                    <li><strong>Proof of Receipt (PoR):</strong> Application-level confirmation that a message was processed</li>
                    <li><strong>TP-SRR Flag:</strong> Status Report Request flag in SMS-SUBMIT</li>
                    <li><strong>TP-SRI Flag:</strong> Status Report Indication flag in SMS-DELIVER</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">SIM Toolkit SMS</h4>
                  <p className="text-sm mb-2">
                    Special SMS types for SIM Application Toolkit:
                  </p>
                  <ul className="mb-0 text-sm">
                    <li><strong>SMS-PP Download:</strong> Messages sent directly to SIM applications</li>
                    <li><strong>TP-UDHI:</strong> User Data Header Indicator for SAT commands</li>
                    <li><strong>OTA Updates:</strong> Remote SIM card updates via SMS</li>
                    <li><strong>Class 2 Messages:</strong> Messages stored directly on the SIM</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">SMS Encryption</h4>
                  <p className="text-sm mb-2">
                    Methods to secure SMS content:
                  </p>
                  <ul className="mb-0 text-sm">
                    <li><strong>End-to-End:</strong> Message content encryption before PDU creation</li>
                    <li><strong>Network:</strong> Encryption between mobile and network (A5 algorithms)</li>
                    <li><strong>Binary SMS:</strong> Used for encrypted payloads (8-bit data)</li>
                    <li><strong>Crypto APIs:</strong> Application-level encryption via device APIs</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h4 className="mt-0 mb-2 font-medium">SMS Special Services</h4>
                  <p className="text-sm mb-2">
                    Additional SMS capabilities:
                  </p>
                  <ul className="mb-0 text-sm">
                    <li><strong>Reply Path:</strong> Allows direct reply to a message originator</li>
                    <li><strong>Validity Period:</strong> Duration the SMSC should try to deliver</li>
                    <li><strong>Priority:</strong> Message importance indicator</li>
                    <li><strong>Port Addressing:</strong> WAP Push and other application services</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {section === "sms-overview" && (
            <>
              <h3>SMS Technology & 3GPP 23.040</h3>
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
          
          {section === "sms-delivery-reports" && (
            <>
              <h3>SMS Delivery Reports & Proof of Receipt</h3>
              <p>
                SMS provides mechanisms to verify that messages have been delivered to the recipient's
                device and optionally that they have been processed by an application. These features are
                especially important for service-critical messaging applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4>Status Reports</h4>
                  <p className="text-sm">
                    A status report is a network-level confirmation that a message has reached the recipient's device.
                    It's implemented using the <strong>SMS-STATUS-REPORT</strong> PDU type and involves several key elements:
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-md border mb-4">
                    <h5 className="mt-0 text-sm font-medium">How Status Reports Work</h5>
                    <ol className="mb-0 text-sm">
                      <li>Sender sets the <strong>TP-SRR</strong> (Status Report Request) bit in the SMS-SUBMIT PDU</li>
                      <li>SMSC remembers this request and assigns a <strong>Message Reference</strong> number</li>
                      <li>When the message is delivered, the SMSC generates an SMS-STATUS-REPORT</li>
                      <li>The status report is sent back to the original sender's device</li>
                      <li>The sender's device matches the reference number to the original message</li>
                    </ol>
                  </div>
                </div>
                
                <div>
                  <h4>SMS-STATUS-REPORT Format</h4>
                  <p className="text-sm">
                    The SMS-STATUS-REPORT PDU contains the following key fields:
                  </p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Message Reference</TableCell>
                        <TableCell>Identifier matching the original SMS-SUBMIT</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Recipient Address</TableCell>
                        <TableCell>Address from the original message</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Service Centre Time Stamp</TableCell>
                        <TableCell>When the original message was received by the SMSC</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Discharge Time</TableCell>
                        <TableCell>When the message was delivered to the recipient</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Final delivery status code (delivered, failed, pending, etc.)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <h4>Proof of Receipt (PoR)</h4>
              <p>
                While status reports confirm delivery to a device, Proof of Receipt (PoR) provides application-level
                confirmation that a message was actually processed by an application on the recipient's device.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium">PoR Implementation</h5>
                  <p className="text-sm">
                    PoR can be implemented in several ways:
                  </p>
                  <ul className="text-sm">
                    <li><strong>Return Result:</strong> The receiving application sends back a confirmation message</li>
                    <li><strong>User Data Header:</strong> Special UDH elements to request and provide receipt</li>
                    <li><strong>WDP (Wireless Datagram Protocol):</strong> Acknowledgment at the bearer layer</li>
                    <li><strong>Custom protocols:</strong> Application-specific implementations</li>
                  </ul>
                  
                  <div className="border-l-4 border-info pl-4 mt-4">
                    <h5 className="mt-0 text-sm font-medium text-info">PoR for Secure Services</h5>
                    <p className="mb-0 text-sm">
                      PoR is essential for secure services like:
                    </p>
                    <ul className="mb-0 text-sm">
                      <li>Banking transactions</li>
                      <li>Two-factor authentication</li>
                      <li>SIM OTA updates</li>
                      <li>Device management commands</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">PoR User Data Header</h5>
                  <p className="text-sm">
                    When implemented via UDH, a PoR uses Information Elements with specific IDs:
                  </p>
                  <div className="font-mono bg-muted p-3 rounded text-xs">
                    <div>User Data Header:</div>
                    <div>- Header Length: <span className="text-primary">05</span></div>
                    <div>- Information Element ID: <span className="text-primary">09</span> (for PoR)</div>
                    <div>- IE Length: <span className="text-primary">03</span></div>
                    <div>- PoR Control Data:</div>
                    <div>&nbsp;&nbsp;- Request/Response: <span className="text-primary">01</span> or <span className="text-primary">02</span></div>
                    <div>&nbsp;&nbsp;- Status: <span className="text-primary">00</span> (Success) or other</div>
                    <div>&nbsp;&nbsp;- Message Reference: <span className="text-primary">XX</span></div>
                  </div>
                  
                  <p className="mt-3 text-sm">
                    The PoR message is typically sent as a normal SMS-SUBMIT PDU with the appropriate UDH elements,
                    referring to the original message.
                  </p>
                </div>
              </div>
              
              <h4>Delivery Report Status Codes</h4>
              <p>
                Status reports include a byte that indicates the delivery outcome with specific bit patterns.
                The most common status codes include:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 border">Hex Code</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">00</td>
                      <td className="px-4 py-2 border">Completed</td>
                      <td className="px-4 py-2 border">Message was successfully delivered</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">01</td>
                      <td className="px-4 py-2 border">Pending</td>
                      <td className="px-4 py-2 border">Message is still pending delivery</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">20</td>
                      <td className="px-4 py-2 border">Expired</td>
                      <td className="px-4 py-2 border">Message validity period expired</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">21</td>
                      <td className="px-4 py-2 border">Deleted</td>
                      <td className="px-4 py-2 border">Message was deleted by SMSC administrator</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">30-3F</td>
                      <td className="px-4 py-2 border">Temporary Error</td>
                      <td className="px-4 py-2 border">Temporary error, SMSC still trying</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">40-4F</td>
                      <td className="px-4 py-2 border">Permanent Error</td>
                      <td className="px-4 py-2 border">Permanent error, no more attempts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          
          {section === "sms-encryption" && (
            <>
              <h3>SMS Encryption & Security</h3>
              <p>
                SMS messages are transmitted in clear text through the mobile network, making them 
                vulnerable to interception. Various encryption methods have been developed to secure SMS
                communications for sensitive applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4>Network Layer Security</h4>
                  <p className="text-sm">
                    By default, SMS messages have basic security through the mobile network:
                  </p>
                  
                  <ul className="text-sm">
                    <li><strong>Air Interface Encryption:</strong> A5/1, A5/3 algorithms encrypt radio traffic</li>
                    <li><strong>Authentication:</strong> SIM-based authentication of the sending device</li>
                    <li><strong>SS7 Security:</strong> Network signaling protocols (limited security)</li>
                  </ul>
                  
                  <div className="bg-destructive/10 rounded-md p-3 mt-4">
                    <h5 className="text-sm font-medium mt-0 mb-1 text-destructive">Network Security Limitations</h5>
                    <ul className="text-sm mb-0">
                      <li>Only protects the radio link between phone and base station</li>
                      <li>Messages may be in clear text within the operator's network</li>
                      <li>Vulnerable to SS7 network attacks</li>
                      <li>No protection in the SMSC or on gateways</li>
                      <li>A5/1 encryption has known vulnerabilities</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4>End-to-End Encryption</h4>
                  <p className="text-sm">
                    For truly secure SMS, end-to-end encryption is required:
                  </p>
                  
                  <ul className="text-sm">
                    <li><strong>AES:</strong> Advanced Encryption Standard (128/256-bit)</li>
                    <li><strong>3DES:</strong> Triple Data Encryption Standard</li>
                    <li><strong>RSA:</strong> Public key cryptography for key exchange</li>
                    <li><strong>ECC:</strong> Elliptic Curve Cryptography (better for limited space)</li>
                  </ul>
                  
                  <div className="border rounded-md p-3 mt-4 bg-accent/10">
                    <h5 className="text-sm font-medium mt-0 mb-1">Implementation Methods</h5>
                    <ul className="text-sm mb-0">
                      <li><strong>Binary SMS:</strong> Using 8-bit encoded messages to carry encrypted data</li>
                      <li><strong>Secure Messaging Apps:</strong> OTT solutions with their own protocols</li>
                      <li><strong>SIM Toolkit:</strong> Encryption done within the secure SIM environment</li>
                      <li><strong>S/MIME:</strong> Encrypted message format for enterprise use</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h4>SMS Encryption Process</h4>
              <p>
                Implementing end-to-end encryption in SMS requires several key steps:
              </p>
              
              <div className="bg-muted/50 rounded-md p-4 mb-6">
                <ol className="mb-0">
                  <li>
                    <strong>Key Exchange:</strong> Secure exchange of encryption keys between parties
                    <ul className="text-sm">
                      <li>May use initial key exchange over a different secure channel</li>
                      <li>Or use asymmetric encryption (RSA/ECC) for key exchange</li>
                      <li>Sometimes uses pre-shared keys distributed securely</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Content Encryption:</strong> Original message encrypted using symmetric encryption
                    <ul className="text-sm">
                      <li>Typically AES or similar strong cipher</li>
                      <li>Generates ciphertext that is unreadable without the key</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Binary Encoding:</strong> Encrypted data encoded into a format suitable for SMS
                    <ul className="text-sm">
                      <li>Usually Base64 or hexadecimal encoding</li>
                      <li>Needs to be represented in characters that can be transmitted</li>
                    </ul>
                  </li>
                  <li>
                    <strong>PDU Creation:</strong> Creating an SMS-SUBMIT PDU with the encoded encrypted data
                    <ul className="text-sm">
                      <li>Typically uses 8-bit data encoding (DCS=0x04)</li>
                      <li>May include User Data Header for special processing instructions</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Decryption:</strong> Recipient's device decrypts the message
                    <ul className="text-sm">
                      <li>Extracts the encrypted payload from the PDU</li>
                      <li>Uses the corresponding decryption key</li>
                      <li>Recovers the original plain text message</li>
                    </ul>
                  </li>
                </ol>
              </div>
              
              <h4>8-bit SMS for Encrypted Messages</h4>
              <p>
                Encrypted SMS messages typically use the 8-bit data encoding format:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium">PDU Format Considerations</h5>
                  <ul className="text-sm">
                    <li><strong>DCS (Data Coding Scheme):</strong> Set to 0x04 for 8-bit data</li>
                    <li><strong>Max Length:</strong> Limited to 140 bytes per message</li>
                    <li><strong>Multipart:</strong> Often requires concatenated SMS for larger payloads</li>
                    <li><strong>UDH:</strong> May include security metadata in User Data Header</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">Example Encrypted SMS Structure</h5>
                  <div className="font-mono text-xs bg-black/5 p-2 rounded">
                    <div>07912374910000F4040B9193547654F60000F016FB0D9ABBDDA56B3DD70</div>
                    <div className="mt-1 grid grid-cols-1 gap-1">
                      <div><span className="bg-primary/20 px-1 py-0.5 rounded mr-1">0791...</span> SMSC Info</div>
                      <div><span className="bg-secondary/20 px-1 py-0.5 rounded mr-1">04</span> First Octet (SMS-DELIVER)</div>
                      <div><span className="bg-accent/20 px-1 py-0.5 rounded mr-1">0B91...</span> Sender Address</div>
                      <div><span className="bg-destructive/20 px-1 py-0.5 rounded mr-1">00</span> Protocol ID</div>
                      <div><span className="bg-primary/20 px-1 py-0.5 rounded mr-1">04</span> DCS (8-bit data)</div>
                      <div><span className="bg-secondary/20 px-1 py-0.5 rounded mr-1">00F0...</span> Timestamp</div>
                      <div><span className="bg-accent/20 px-1 py-0.5 rounded mr-1">16</span> User Data Length (22 bytes)</div>
                      <div><span className="bg-destructive/20 px-1 py-0.5 rounded mr-1">FB0D9A...</span> Encrypted Content</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {section === "user-data-header" && (
            <>
              <h3>User Data Header (UDH) in SMS Messages</h3>
              <p>
                The User Data Header (UDH) is a special mechanism in SMS messages that enables enhanced 
                functionality beyond simple text messages. The UDH is a binary header inserted at the beginning
                of the message content and is indicated by setting the TP-UDHI flag in the PDU.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4>Understanding TP-UDHI Flag</h4>
                  <p className="text-sm">
                    The TP-UDHI (User Data Header Indicator) is a bit in the first octet of SMS PDUs:
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-md border mb-4">
                    <h5 className="mt-0 text-sm font-medium">First Octet Bit Structure</h5>
                    <div className="font-mono text-xs overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Bit 7</th>
                            <th className="border px-2 py-1">Bit 6</th>
                            <th className="border px-2 py-1">Bit 5</th>
                            <th className="border px-2 py-1">Bit 4</th>
                            <th className="border px-2 py-1">Bit 3</th>
                            <th className="border px-2 py-1">Bit 2</th>
                            <th className="border px-2 py-1">Bit 1</th>
                            <th className="border px-2 py-1">Bit 0</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border px-2 py-1 text-center">RP</td>
                            <td className="border px-2 py-1 text-center">UDHI</td>
                            <td className="border px-2 py-1 text-center">SRR</td>
                            <td className="border px-2 py-1 text-center">VPF</td>
                            <td className="border px-2 py-1 text-center">VPF</td>
                            <td className="border px-2 py-1 text-center">RD</td>
                            <td className="border px-2 py-1 text-center">MTI</td>
                            <td className="border px-2 py-1 text-center">MTI</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <ul className="text-xs mt-2 mb-0">
                      <li><strong>MTI:</strong> Message Type Indicator (00 for SMS-DELIVER, 01 for SMS-SUBMIT)</li>
                      <li><strong>RD:</strong> Reject Duplicates</li>
                      <li><strong>VPF:</strong> Validity Period Format</li>
                      <li><strong>SRR:</strong> Status Report Request</li>
                      <li><strong>UDHI:</strong> User Data Header Indicator (1 = UDH present)</li>
                      <li><strong>RP:</strong> Reply Path</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    When the UDHI bit is set to 1 (true), it indicates that the User Data field begins 
                    with a header that contains additional control information.
                  </p>
                </div>
                
                <div>
                  <h4>UDH Structure</h4>
                  <p className="text-sm">
                    The User Data Header follows a consistent structure:
                  </p>
                  
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-3 py-2 border">Field</th>
                          <th className="px-3 py-2 border">Size (bytes)</th>
                          <th className="px-3 py-2 border">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="px-3 py-2 border">UDHL</td>
                          <td className="px-3 py-2 border text-center">1</td>
                          <td className="px-3 py-2 border">User Data Header Length</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="px-3 py-2 border" colSpan={3}>One or more Information Elements (IEs):</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 border pl-6">IEI</td>
                          <td className="px-3 py-2 border text-center">1</td>
                          <td className="px-3 py-2 border">Information Element Identifier</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="px-3 py-2 border pl-6">IEDL</td>
                          <td className="px-3 py-2 border text-center">1</td>
                          <td className="px-3 py-2 border">Information Element Data Length</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 border pl-6">IED</td>
                          <td className="px-3 py-2 border text-center">Variable</td>
                          <td className="px-3 py-2 border">Information Element Data</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-l-4 border-accent pl-4 mt-4">
                    <h5 className="text-sm font-medium mt-0 mb-1 text-accent">Example UDH</h5>
                    <div className="font-mono text-xs">
                      <div>05 00 03 AB 02 01</div>
                      <div className="mt-1">
                        <div>05: UDHL (header length = 5 bytes)</div>
                        <div>00: IEI (concatenated SMS, 8-bit reference)</div>
                        <div>03: IEDL (length of this IE = 3 bytes)</div>
                        <div>AB: Reference number (171)</div>
                        <div>02: Total parts (2 messages)</div>
                        <div>01: Part number (this is part 1)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4>Common Information Element Identifiers</h4>
              <p>
                The IEI byte identifies the type of information contained in each element:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 border">IEI Value</th>
                      <th className="px-4 py-2 border">Information Element</th>
                      <th className="px-4 py-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">00</td>
                      <td className="px-4 py-2 border">Concatenated SMS (8-bit reference)</td>
                      <td className="px-4 py-2 border">Indicates a message part in a multipart SMS with 8-bit reference number</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">08</td>
                      <td className="px-4 py-2 border">Concatenated SMS (16-bit reference)</td>
                      <td className="px-4 py-2 border">Indicates a message part in a multipart SMS with 16-bit reference number</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">04</td>
                      <td className="px-4 py-2 border">Application port addressing (8-bit)</td>
                      <td className="px-4 py-2 border">Specifies source and destination ports for WAP, OTA, etc.</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">05</td>
                      <td className="px-4 py-2 border">Application port addressing (16-bit)</td>
                      <td className="px-4 py-2 border">16-bit version of port addressing</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">01</td>
                      <td className="px-4 py-2 border">Special SMS Message Indication</td>
                      <td className="px-4 py-2 border">Indicates voicemail, fax, email, etc.</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">09</td>
                      <td className="px-4 py-2 border">Wireless Control Message Protocol</td>
                      <td className="px-4 py-2 border">Used for WAP Push messages</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-center font-mono">24</td>
                      <td className="px-4 py-2 border">National Language Single Shift</td>
                      <td className="px-4 py-2 border">Defines language-specific single shift tables</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border text-center font-mono">25</td>
                      <td className="px-4 py-2 border">National Language Locking Shift</td>
                      <td className="px-4 py-2 border">Defines language-specific locking shift tables</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>UDH Impact on Message Content</h4>
              <p>
                When a UDH is present in an SMS:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="text-sm font-medium">Character Count Effects</h5>
                  <ul className="text-sm">
                    <li>The UDH takes up space from the user data area</li>
                    <li>For 7-bit encoding: Header bytes reduce the available characters (160 → 153 or less)</li>
                    <li>For 8-bit data: Header bytes reduce available data bytes (140 → 134 or less)</li>
                    <li>For UCS2: Header bytes reduce available characters (70 → 67 or less)</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">7-bit Encoding Padding</h5>
                  <p className="text-sm">
                    For 7-bit encoding, special handling is required:
                  </p>
                  <ul className="text-sm mb-0">
                    <li>The UDH is always byte-aligned (8-bit boundary)</li>
                    <li>Fill bits (0-7 bits) may be added after the UDH for proper alignment</li>
                    <li>These fill bits ensure 7-bit encoded text starts on a septet boundary</li>
                    <li>The formula to calculate fill bits: (UDHL+1) * 8 % 7</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-6">
                <h4 className="mt-0">Implementing UDH in PDUs</h4>
                <ol className="mb-0">
                  <li>
                    <strong>Set the TP-UDHI bit in the first octet</strong>
                    <ul className="text-sm">
                      <li>For SMS-SUBMIT: First octet value of 0x41 includes UDHI</li>
                      <li>For SMS-DELIVER: First octet value of 0x40 includes UDHI</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Calculate the User Data Length correctly</strong>
                    <ul className="text-sm">
                      <li>Include the header length in the total User Data Length</li>
                      <li>For 7-bit: UDL = number of septets (not bytes) including header and fill bits</li>
                      <li>For 8-bit/UCS2: UDL = number of bytes including header</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Add the UDH at the beginning of the User Data field</strong>
                    <ul className="text-sm">
                      <li>Start with the UDHL byte</li>
                      <li>Follow with the IE(s) according to the correct format</li>
                    </ul>
                  </li>
                  <li>
                    <strong>For 7-bit encoding, add fill bits after the UDH if needed</strong>
                  </li>
                  <li>
                    <strong>Add the actual message content after the UDH (and any fill bits)</strong>
                  </li>
                </ol>
              </div>
              
              <h4>Parsing PDUs with UDHI Flag</h4>
              <p>
                When decoding a PDU with the UDHI flag set:
              </p>
              <ol>
                <li>Extract the first byte from the User Data field (UDHL)</li>
                <li>Extract the next UDHL bytes to get the complete UDH</li>
                <li>For each Information Element in the UDH:
                  <ul>
                    <li>Extract the IEI byte to identify the element type</li>
                    <li>Extract the IEDL byte to determine the element data length</li>
                    <li>Extract the IED bytes according to the IEDL</li>
                    <li>Process the IE according to its type (e.g., handle concatenation)</li>
                  </ul>
                </li>
                <li>For 7-bit encoded messages, calculate and skip any fill bits</li>
                <li>Process the remaining User Data as the actual message content</li>
              </ol>
            </>
          )}
          
          {section === "sim-toolkit-sms" && (
            <>
              <h3>SIM Toolkit SMS Messages</h3>
              <p>
                SIM Application Toolkit (SAT) uses special SMS message formats to communicate between 
                network applications and the SIM card. These messages are used for remote SIM management, 
                value-added services, and secure operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4>SMS Point-to-Point (SMS-PP) Download</h4>
                  <p className="text-sm">
                    SMS-PP is the primary mechanism for sending data to a SIM card application:
                  </p>
                  
                  <ul className="text-sm">
                    <li><strong>Purpose:</strong> Send commands or data directly to a SIM application</li>
                    <li><strong>Format:</strong> Special SMS format with specific Protocol ID (0x7F)</li>
                    <li><strong>Security:</strong> Often encrypted or cryptographically signed</li>
                    <li><strong>Processing:</strong> Automatically intercepted by the device and sent to SIM</li>
                  </ul>
                  
                  <div className="bg-muted/50 p-3 rounded mt-4">
                    <h5 className="text-sm font-medium mt-0 mb-1">SMS-PP Structure</h5>
                    <ol className="text-sm mb-0">
                      <li><strong>SMS-DELIVER PDU:</strong> Standard SMS message from network</li>
                      <li><strong>Protocol ID:</strong> 0x7F to indicate SIM Data Download</li>
                      <li><strong>User Data:</strong> Contains the Command Packet</li>
                      <li><strong>Command Packet:</strong> SIM command with headers and security</li>
                      <li><strong>Response Packet:</strong> Optionally sent back from SIM to server</li>
                    </ol>
                  </div>
                </div>
                
                <div>
                  <h4>Command Packet Structure</h4>
                  <p className="text-sm">
                    The Command Packet within the SMS-PP follows a defined structure:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse mt-2">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-3 py-2 border">Field</th>
                          <th className="px-3 py-2 border">Size</th>
                          <th className="px-3 py-2 border">Description</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="px-3 py-2 border">Command Packet Header</td>
                          <td className="px-3 py-2 border">Variable</td>
                          <td className="px-3 py-2 border">Includes length, SPI, KIC/KID</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="px-3 py-2 border">Command Header</td>
                          <td className="px-3 py-2 border">4 bytes</td>
                          <td className="px-3 py-2 border">CLA, INS, P1, P2 parameters</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 border">Lc</td>
                          <td className="px-3 py-2 border">1 byte</td>
                          <td className="px-3 py-2 border">Length of command data</td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="px-3 py-2 border">Command Data</td>
                          <td className="px-3 py-2 border">Variable</td>
                          <td className="px-3 py-2 border">Actual command data</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 border">Le</td>
                          <td className="px-3 py-2 border">0-1 byte</td>
                          <td className="px-3 py-2 border">Expected response length</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-l-4 border-info pl-4 mt-4">
                    <h5 className="text-sm font-medium mt-0 mb-1 text-info">Security Parameters</h5>
                    <ul className="text-sm mb-0">
                      <li><strong>SPI:</strong> Security Parameters Indicator</li>
                      <li><strong>KIC:</strong> Key and algorithm for cryptographic operations</li>
                      <li><strong>KID:</strong> Key and algorithm for integrity/authentication</li>
                      <li><strong>TAR:</strong> Toolkit Application Reference</li>
                      <li><strong>CNTR:</strong> Counter for replay protection</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h4>Over-The-Air (OTA) Updates</h4>
              <p>
                A key application of SIM Toolkit SMS is Over-The-Air updates for SIM cards:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="text-sm font-medium">OTA Operations</h5>
                  <ul className="text-sm">
                    <li><strong>Remote File Management:</strong> Update files on the SIM</li>
                    <li><strong>Application Management:</strong> Install, update, or delete applications</li>
                    <li><strong>Profile Management:</strong> Update subscriber details</li>
                    <li><strong>Key Management:</strong> Update security keys and parameters</li>
                    <li><strong>Service Activation:</strong> Enable/disable specific services</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium">APDU Commands</h5>
                  <p className="text-sm">
                    OTA updates use Application Protocol Data Units (APDUs) to interact with the SIM card:
                  </p>
                  <div className="font-mono text-xs bg-black/5 p-2 rounded">
                    <div className="mb-1">Example APDU Structure:</div>
                    <div><span className="text-primary">A0</span> <span className="text-secondary">A4</span> <span className="text-accent">00</span> <span className="text-destructive">00</span> <span className="text-info">02</span> <span className="text-warning">3F00</span> <span className="text-primary">00</span></div>
                    <div className="mt-1 grid grid-cols-1 gap-1">
                      <div><span className="text-primary">A0</span>: CLA (Class byte)</div>
                      <div><span className="text-secondary">A4</span>: INS (Instruction code - SELECT)</div>
                      <div><span className="text-accent">00</span>: P1 (Parameter 1)</div>
                      <div><span className="text-destructive">00</span>: P2 (Parameter 2)</div>
                      <div><span className="text-info">02</span>: Lc (Length of data field)</div>
                      <div><span className="text-warning">3F00</span>: Data (File ID to select)</div>
                      <div><span className="text-primary">00</span>: Le (Expected response length)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4>SMS-CB (Cell Broadcast) for SIM Toolkit</h4>
              <p>
                In addition to SMS-PP, Cell Broadcast messages can also be used for SIM Toolkit:
              </p>
              
              <ul>
                <li><strong>Function:</strong> Broadcasts to all devices in a geographic area</li>
                <li><strong>Format:</strong> Special message identifier for SIM Toolkit applications</li>
                <li><strong>Use Cases:</strong> Mass SIM updates, emergency services, location-based services</li>
                <li><strong>Processing:</strong> Messages with specific identifiers are forwarded to the SIM</li>
              </ul>
              
              <div className="border p-4 rounded bg-muted/20 mt-4">
                <h4 className="mt-0">SMS Class Values for SIM Toolkit</h4>
                <p>
                  SMS messages use specific class values to indicate how they should be handled:
                </p>
                <ul className="mb-0">
                  <li><strong>Class 0:</strong> "Flash" SMS, displayed immediately on screen</li>
                  <li><strong>Class 1:</strong> Stored on device (in default memory)</li>
                  <li><strong>Class 2:</strong> SIM-specific messages (stored on SIM card)</li>
                  <li><strong>Class 3:</strong> Messages intended for the receiving device itself</li>
                </ul>
                <p className="mt-4 mb-0">
                  <strong>Class 2</strong> is particularly important for SIM Toolkit, as these messages are stored 
                  directly on the SIM card and can be accessed by SIM applications.
                </p>
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
                and take control of the mobile device user interface. It's defined in the GSM 11.14 specification and later 
                evolved in the 3GPP TS 51.014 specifications and ETSI TS 102 223 standards.
              </p>
              
              <h4>Why SAT Exists</h4>
              <p>
                SAT was developed to overcome the limitations of SIM cards that were originally designed as passive storage
                devices. Key reasons for its development include:
              </p>
              <ul>
                <li><strong>Value-added services</strong>: Enabling mobile network operators to provide custom services beyond basic telephony</li>
                <li><strong>SIM independence</strong>: Allowing applications to run consistently across different mobile devices</li>
                <li><strong>Enhanced security</strong>: Providing secure storage and execution environments for sensitive applications</li>
                <li><strong>Remote management</strong>: Enabling operators to update services without changing SIM cards</li>
              </ul>
              
              <h4>How SAT Works - Architecture</h4>
              <p>
                SAT establishes a client-server relationship between the mobile device (Mobile Equipment/ME) and the SIM card:
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">SAT System Architecture</h4>
                <div className="flex justify-center my-4">
                  <div className="border rounded-lg p-4 max-w-2xl bg-black/5">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Network */}
                      <div className="border p-3 rounded bg-background text-center">
                        <div className="font-bold mb-2">Mobile Network</div>
                        <div className="text-xs mb-2">Base Station & Core Network</div>
                        <div className="text-sm">
                          • SMS Center<br />
                          • OTA Server<br />
                          • Application Server
                        </div>
                      </div>
                      
                      {/* Arrows */}
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div>⟷</div>
                          <div className="text-xs text-muted-foreground">Radio Interface</div>
                          <div>⟷</div>
                        </div>
                      </div>
                      
                      {/* Mobile Station */}
                      <div className="border p-3 rounded bg-background">
                        <div className="font-bold mb-2 text-center">Mobile Station</div>
                        <div className="flex flex-col gap-2">
                          <div className="border border-dashed p-2 rounded">
                            <div className="text-sm font-medium">Mobile Equipment (ME)</div>
                            <div className="text-xs">
                              • Display & Keyboard<br />
                              • Processor<br />
                              • SIM Interface<br />
                              • Radio Module
                            </div>
                          </div>
                          <div className="flex justify-center">⟷</div>
                          <div className="border border-dashed p-2 rounded">
                            <div className="text-sm font-medium">SIM Card (UICC)</div>
                            <div className="text-xs">
                              • SAT Runtime Environment<br />
                              • SAT Applications<br />
                              • SIM Files & Data<br />
                              • Security Elements
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-medium mt-4">Key Interfaces:</h5>
                <ul className="text-sm">
                  <li><strong>SIM-ME Interface</strong>: Physical and logical connection between SIM card and mobile device, carries proactive commands</li>
                  <li><strong>Air Interface</strong>: Radio connection between mobile station and network, carries SMS, USSD, and data</li>
                  <li><strong>SIM OTA</strong>: Over-The-Air interface allowing remote management of SIM applications</li>
                </ul>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">SAT Communication Flow</h4>
                <p>The SAT protocol involves a specific sequence of interactions:</p>
                <ol className="mb-3">
                  <li><strong>Proactive SIM commands</strong>: The SIM initiates commands to control the mobile device</li>
                  <li><strong>Terminal response</strong>: The mobile device responds to each command with success/failure status</li>
                  <li><strong>ME to SIM notifications</strong>: The mobile device can notify the SIM about events (calls, SMS, etc.)</li>
                  <li><strong>SIM data download</strong>: Data from the network can be directed to SAT applications</li>
                </ol>
                

              </div>
              
              <h4>SAT Applications in Real-World Use</h4>
              <p>
                SAT is used in many practical applications that mobile users interact with daily:
              </p>
              <ul>
                <li><strong>Banking and mobile payments</strong>: Secure transactions and mobile banking menus</li>
                <li><strong>Information services</strong>: Weather, news, sports scores delivered via SIM menu</li>
                <li><strong>Prepaid SIM management</strong>: Balance checking, top-up services</li>
                <li><strong>Roaming services</strong>: Automatic network selection, preferred network lists</li>
                <li><strong>Transport applications</strong>: Public transport ticketing and payment systems</li>
                <li><strong>Customer care</strong>: Direct customer support access through SIM menu</li>
              </ul>
              
              <h4>SAT Capabilities</h4>
              <p>
                SAT allows the SIM card to:
              </p>
              <ul>
                <li>Display text and menus on the phone screen</li>
                <li>Initiate calls, send SMS or USSD messages</li>
                <li>Provide information to the phone</li>
                <li>Set up event notifications (call, SMS, location updates)</li>
                <li>Request user input via phone interface</li>
                <li>Access and manage network services</li>
                <li>Launch the mobile browser to specific URLs</li>
                <li>Control timing of operations through timers</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Common SAT Commands</h4>
                <ul className="mt-2 mb-0">
                  <li><strong>DISPLAY TEXT</strong>: Shows text on the phone's display, can be configured to clear after timeout or wait for user action</li>
                  <li><strong>GET INPUT</strong>: Requests text input from the user with various configuration options (alphabet, minimum/maximum length)</li>
                  <li><strong>SELECT ITEM</strong>: Presents a menu for the user to select options, can include icons and help text</li>
                  <li><strong>SETUP MENU</strong>: Creates a persistent menu that becomes part of the phone's menu system</li>
                  <li><strong>SEND SMS</strong>: Instructs the phone to send an SMS message without user interaction</li>
                  <li><strong>SETUP CALL</strong>: Initiates a voice call, can be configured to require confirmation or be automatic</li>
                  <li><strong>REFRESH</strong>: Updates SIM file data on the phone, can range from specific files to complete SIM restart</li>
                  <li><strong>PROVIDE LOCAL INFO</strong>: Requests information like network status, location, time from the phone</li>
                  <li><strong>SET UP EVENT LIST</strong>: Configures which events the phone should notify the SIM about</li>
                  <li><strong>LAUNCH BROWSER</strong>: Opens the phone's web browser to a specified URL</li>
                </ul>
              </div>
              
              <h4>SAT and Mobile Security</h4>
              <p>
                SIM Application Toolkit provides several security features:
              </p>
              <ul>
                <li><strong>Secure Channel</strong>: Communication between SIM and network can be encrypted</li>
                <li><strong>Access Control</strong>: Commands can be restricted to authorized network operators</li>
                <li><strong>SIM as Secure Element</strong>: Provides a tamper-resistant environment for sensitive data</li>
                <li><strong>Digital Signatures</strong>: Supports verification of command authenticity</li>
              </ul>
              
              <h4>SAT Command Structure and Encoding</h4>
              <p>
                SAT commands follow a BER-TLV (Basic Encoding Rules - Tag-Length-Value) structure, allowing for a flexible protocol that can evolve over time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h5 className="font-medium">Proactive SIM Command Format</h5>
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
                </div>
                
                <div>
                  <h5 className="font-medium">TLV Structure in Detail</h5>
                  <div className="mb-3">
                    <p className="text-sm">Each information element in a SAT command follows the TLV format:</p>
                    <div className="border rounded bg-black/5 p-3 my-2">
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div className="border bg-primary/10 p-1 rounded">
                          <div className="text-xs font-bold">Tag (1 byte)</div>
                          <div className="text-xs">Identifies the type of data</div>
                        </div>
                        <div className="border bg-secondary/10 p-1 rounded">
                          <div className="text-xs font-bold">Length (1-3 bytes)</div>
                          <div className="text-xs">Size of the value field</div>
                        </div>
                        <div className="border bg-accent/10 p-1 rounded">
                          <div className="text-xs font-bold">Value (variable)</div>
                          <div className="text-xs">The actual data</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="font-medium mt-4">Common TLV Tags</h5>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tag</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Purpose</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>0x01</TableCell>
                        <TableCell>Command Details</TableCell>
                        <TableCell>Command type and parameters</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>0x02</TableCell>
                        <TableCell>Device Identities</TableCell>
                        <TableCell>Source and destination devices</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>0x0D</TableCell>
                        <TableCell>Text String</TableCell>
                        <TableCell>Text to display or process</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>0x05</TableCell>
                        <TableCell>Alpha Identifier</TableCell>
                        <TableCell>Text label for menus and commands</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>0x0F</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>Menu item for selection menus</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h5 className="mt-0 font-medium">Command Example: DISPLAY TEXT</h5>
                <p className="text-sm">The following is an example of a DISPLAY TEXT command broken down by its component parts:</p>
                
                <div className="font-mono text-xs overflow-x-auto bg-black/5 p-3 rounded my-2">
                  <span className="bg-primary/20 p-1 rounded mr-1">D0</span>
                  <span className="bg-secondary/20 p-1 rounded mr-1">28</span>
                  <span className="bg-accent/20 p-1 rounded mr-1">81 03 01 21 00</span>
                  <span className="bg-destructive/20 p-1 rounded mr-1">82 02 81 02</span>
                  <span className="bg-muted p-1 border rounded">8D 1A 04 54 68 69 73 20 69 73 20 61 20 74 65 73 74 20 74 65 78 74 2E 20 20 20 20 20</span>
                </div>
                
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="bg-primary/20 px-1 py-0.5 rounded text-xs mr-1.5">D0</span>
                      Proactive SIM Command Tag
                    </div>
                    <div>
                      <span className="bg-secondary/20 px-1 py-0.5 rounded text-xs mr-1.5">28</span>
                      Length (40 bytes)
                    </div>
                    <div>
                      <span className="bg-accent/20 px-1 py-0.5 rounded text-xs mr-1.5">81 03 01 21 00</span>
                      Command Details TLV (DISPLAY TEXT, high priority)
                    </div>
                    <div>
                      <span className="bg-destructive/20 px-1 py-0.5 rounded text-xs mr-1.5">82 02 81 02</span>
                      Device Identities TLV (SIM to Display)
                    </div>
                    <div className="col-span-2">
                      <span className="bg-muted p-0.5 border rounded text-xs mr-1.5">8D 1A 04...</span>
                      Text String TLV (contains "This is a test text.")
                    </div>
                  </div>
                </div>
              </div>
              
              <h4>Data Encoding in SAT</h4>
              <p>
                SAT supports multiple text encoding formats to accommodate different languages and character sets:
              </p>
              <ul>
                <li><strong>GSM 7-bit default alphabet</strong>: Most efficient for Latin-based languages</li>
                <li><strong>8-bit data</strong>: For binary data or specialized character sets</li>
                <li><strong>UCS2 (16-bit)</strong>: For languages with non-Latin scripts (Arabic, Chinese, etc.)</li>
              </ul>
              
              <p>
                The Data Coding Scheme (DCS) byte in a text string TLV indicates which encoding is used, similar to SMS PDU format.
              </p>
              
              <h4>Additional Common Command-specific TLVs</h4>
              <ul>
                <li><strong>Item Identifier (0x10)</strong>: Identifier for an item</li>
                <li><strong>SMS TPDU (0x8B)</strong>: SMS message to be sent</li>
                <li><strong>Address (0x06)</strong>: Phone number (in the same format as SMS PDUs)</li>
                <li><strong>Duration (0x04)</strong>: Time interval for command timeouts</li>
                <li><strong>Icon Identifier (0x1E)</strong>: Reference to an icon to display</li>
                <li><strong>URL (0x31)</strong>: Web address for LAUNCH BROWSER command</li>
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

          {section === "sms-architecture" && (
            <>
              <h3>SMS Network Architecture</h3>
              <p>
                The SMS service relies on a complex network architecture that involves multiple components working together.
                Understanding this architecture is essential for comprehending how SMS messages are processed and delivered.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-6">
                <h4 className="mt-0">Core SMS Network Components</h4>
                <div className="flex justify-center my-6">
                  <div className="border rounded-lg p-3 bg-black/5 max-w-4xl">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Sender side */}
                      <div className="border p-3 rounded bg-background">
                        <div className="font-bold mb-2 text-center">Sender Side</div>
                        <div className="flex flex-col gap-3">
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">Mobile Station (MS)</div>
                            <div className="text-xs text-muted-foreground">Mobile device + SIM</div>
                          </div>
                          <div className="flex justify-center">↓</div>
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">Base Station (BTS)</div>
                            <div className="text-xs text-muted-foreground">Radio interface</div>
                          </div>
                          <div className="flex justify-center">↓</div>
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">MSC/VLR</div>
                            <div className="text-xs text-muted-foreground">Mobile Switching Center</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle/Core Network */}
                      <div className="border p-3 rounded bg-background">
                        <div className="font-bold mb-2 text-center">Core Network</div>
                        <div className="flex flex-col gap-3 h-full justify-center">
                          <div className="border border-primary p-2 rounded text-center">
                            <div className="text-sm font-medium">SMSC</div>
                            <div className="text-xs text-muted-foreground">Short Message Service Center</div>
                            <ul className="text-xs text-left mt-1 mb-0">
                              <li>Store & Forward</li>
                              <li>Message Queuing</li>
                              <li>Delivery Retries</li>
                              <li>Protocol Conversion</li>
                            </ul>
                          </div>
                          <div className="flex flex-row justify-center gap-2 items-center">
                            <div>↔</div>
                            <div className="text-xs text-muted-foreground">SMS Gateway</div>
                            <div>↔</div>
                          </div>
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">HLR/HSS</div>
                            <div className="text-xs text-muted-foreground">Home Location Register</div>
                            <div className="text-xs text-muted-foreground">Subscriber Database</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Receiver side */}
                      <div className="border p-3 rounded bg-background">
                        <div className="font-bold mb-2 text-center">Receiver Side</div>
                        <div className="flex flex-col gap-3">
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">MSC/VLR</div>
                            <div className="text-xs text-muted-foreground">Mobile Switching Center</div>
                          </div>
                          <div className="flex justify-center">↓</div>
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">Base Station (BTS)</div>
                            <div className="text-xs text-muted-foreground">Radio interface</div>
                          </div>
                          <div className="flex justify-center">↓</div>
                          <div className="border border-dashed p-2 rounded text-center">
                            <div className="text-sm font-medium">Mobile Station (MS)</div>
                            <div className="text-xs text-muted-foreground">Mobile device + SIM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-medium mt-4">Key Components:</h5>
                <ul className="mb-0">
                  <li><strong>Mobile Station (MS):</strong> The mobile device (handset) and SIM card</li>
                  <li><strong>Base Transceiver Station (BTS):</strong> The radio tower that connects to mobile devices</li>
                  <li><strong>Mobile Switching Center (MSC):</strong> Manages call setup and routing</li>
                  <li><strong>Visitor Location Register (VLR):</strong> Temporary database of subscribers in the current area</li>
                  <li><strong>Home Location Register (HLR):</strong> Permanent database of subscriber information</li>
                  <li><strong>Short Message Service Center (SMSC):</strong> Stores, forwards, and manages SMS messages</li>
                  <li><strong>SMS Gateway:</strong> Interfaces between the SMSC and external networks or applications</li>
                </ul>
              </div>
              
              <h4>SMS Protocol Layers</h4>
              <p>
                SMS uses a layered protocol architecture following the OSI model:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 border">Layer</th>
                      <th className="px-4 py-2 border">Protocol</th>
                      <th className="px-4 py-2 border">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border font-medium">Application</td>
                      <td className="px-4 py-2 border">SMS Transfer Protocol (SMS-TP)</td>
                      <td className="px-4 py-2 border">End-to-end communication between MS and SMSC (PDU format)</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border font-medium">Transport</td>
                      <td className="px-4 py-2 border">SMS Relay Protocol (SMS-RP)</td>
                      <td className="px-4 py-2 border">Relay functionality between MS and SMSC</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-medium">Network</td>
                      <td className="px-4 py-2 border">Connection Management (CM)</td>
                      <td className="px-4 py-2 border">Management of signaling connections</td>
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-4 py-2 border font-medium">Network Core</td>
                      <td className="px-4 py-2 border">Mobile Application Part (MAP)</td>
                      <td className="px-4 py-2 border">Communication between network elements</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border font-medium">Underlying</td>
                      <td className="px-4 py-2 border">SS7, SIGTRAN, or IP</td>
                      <td className="px-4 py-2 border">Physical transport of signaling messages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4 className="mt-6">Evolution of SMS Architecture</h4>
              <p>
                The SMS architecture has evolved across different generations of mobile networks:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">2G (GSM) SMS</h5>
                  <ul className="mb-0 text-sm">
                    <li>Uses SS7 signaling</li>
                    <li>Circuit-switched</li>
                    <li>SMS over signaling channels</li>
                    <li>140 bytes per message</li>
                    <li>Limited to text only</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">3G (UMTS) SMS</h5>
                  <ul className="mb-0 text-sm">
                    <li>Backward compatibility with 2G</li>
                    <li>Improved reliability</li>
                    <li>Higher capacity</li>
                    <li>Support for enhanced messaging</li>
                    <li>MMS introduction</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">4G/5G SMS</h5>
                  <ul className="mb-0 text-sm">
                    <li>SMS over IMS (IP Multimedia Subsystem)</li>
                    <li>SMS over SGs interface</li>
                    <li>Rich Communication Services (RCS)</li>
                    <li>Integration with IP-based services</li>
                    <li>Enhanced security features</li>
                  </ul>
                </div>
              </div>
              
              <h4>SMS Routing and Addressing</h4>
              <p>
                The SMS architecture uses several identifiers for routing messages:
              </p>
              <ul>
                <li><strong>MSISDN (Mobile Station ISDN Number):</strong> The subscriber's phone number</li>
                <li><strong>IMSI (International Mobile Subscriber Identity):</strong> Unique subscriber identifier</li>
                <li><strong>SMSC Address:</strong> Address of the service center handling the message</li>
                <li><strong>Global Title (GT):</strong> Used in SS7 networks for routing</li>
                <li><strong>E.164 Address:</strong> International number format for routing messages</li>
              </ul>
              
              <div className="mt-6 border p-4 rounded bg-muted/20">
                <h4 className="mt-0">SMS Security in the Network Architecture</h4>
                <p className="mb-2">
                  Security mechanisms in the SMS architecture vary by network generation:
                </p>
                <ul className="mb-0">
                  <li><strong>Air Interface Encryption:</strong> Protects messages over the radio interface</li>
                  <li><strong>Authentication:</strong> Verifies the identity of the sending device</li>
                  <li><strong>Message Origin Validation:</strong> Verifies the sender's identity</li>
                  <li><strong>Network Core Security:</strong> SS7/SIGTRAN security measures</li>
                  <li><strong>SMS Firewalls:</strong> Protect against spam and fraud in modern networks</li>
                </ul>
              </div>
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


          {section === "cellular-networks" && (
            <>
              <h3>Cellular Network Fundamentals</h3>
              <p>
                Cellular networks are telecommunications networks designed to provide wireless connectivity over wide geographic areas.
                They divide the coverage area into smaller regions called "cells," each served by at least one fixed-location transceiver
                known as a base station.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">How Cellular Networks Work</h4>
                <p>
                  Mobile devices connect to the nearest base station, and as users move between cells, the network
                  performs "handovers" to transfer connections between base stations. This cellular architecture allows for:
                </p>
                <ul className="mb-0">
                  <li><strong>Frequency Reuse:</strong> The same frequencies can be reused in non-adjacent cells, increasing network capacity</li>
                  <li><strong>Seamless Mobility:</strong> Users can move throughout the coverage area while maintaining connectivity</li>
                  <li><strong>Scalable Deployment:</strong> Networks can grow by adding more cells</li>
                  <li><strong>Power Efficiency:</strong> Mobile devices only need enough power to communicate with the nearest base station</li>
                </ul>
              </div>
              
              <h4>Cellular Network Structure</h4>
              <p>
                Modern cellular networks are organized in a hierarchical structure consisting of various components:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Component</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Mobile Station (MS)</td>
                      <td className="px-4 py-2">The user device (phone, modem) that connects to the network</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Base Station (BTS/NodeB/eNodeB)</td>
                      <td className="px-4 py-2">Radio equipment that communicates with mobile devices</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Base Station Controller (BSC/RNC)</td>
                      <td className="px-4 py-2">Manages multiple base stations, handling resource allocation and handovers</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Mobile Switching Center (MSC)</td>
                      <td className="px-4 py-2">Routes voice calls and SMS, interfaces with other networks</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Home Location Register (HLR)</td>
                      <td className="px-4 py-2">Central database of subscriber information</td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Visitor Location Register (VLR)</td>
                      <td className="px-4 py-2">Temporary database of subscribers currently in a specific area</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Cell Types and Coverage</h4>
              <p>
                Network operators deploy different types of cells based on coverage requirements and user density:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Macrocells</h5>
                  <ul className="mb-0">
                    <li>Coverage: 2-30 km radius</li>
                    <li>Deployed on towers or building rooftops</li>
                    <li>Provide broad coverage in urban and rural areas</li>
                    <li>Higher transmission power</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Microcells</h5>
                  <ul className="mb-0">
                    <li>Coverage: 200-2000m radius</li>
                    <li>Used in densely populated urban areas</li>
                    <li>Mounted below rooftop level</li>
                    <li>Enhance capacity in high-traffic zones</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Small Cells</h5>
                  <ul className="mb-0">
                    <li>Picocells: 100-200m radius</li>
                    <li>Femtocells: 10-50m radius</li>
                    <li>Deployed indoors or in specific locations</li>
                    <li>Improve indoor coverage and offload traffic</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {section === "signaling-protocols" && (
            <>
              <h3>Telecommunications Signaling Protocols</h3>
              <p>
                Signaling protocols are essential communication mechanisms that enable network elements to exchange control 
                information and coordinate operations. They form the backbone of telecommunications systems by managing
                connections, resource allocation, and service delivery.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">Types of Signaling</h4>
                <p className="mb-2">
                  Signaling systems can be broadly categorized into several types:
                </p>
                <ul className="mb-0">
                  <li><strong>Subscriber Signaling:</strong> Between end-user device and network (e.g., DTMF tones)</li>
                  <li><strong>Network Access Signaling:</strong> Procedures for devices to access the network (e.g., RACH in GSM)</li>
                  <li><strong>Network-to-Network Signaling:</strong> Between network elements (e.g., SS7, Diameter)</li>
                  <li><strong>Channel-Associated Signaling (CAS):</strong> Uses the same channel as user data</li>
                  <li><strong>Common Channel Signaling (CCS):</strong> Uses separate channels for signaling and user data</li>
                </ul>
              </div>
              
              <h4>Key Signaling Protocols in Telecommunications</h4>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Protocol</th>
                      <th className="px-4 py-2 border-b border-r">Network</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">SS7 (Signaling System No. 7)</td>
                      <td className="px-4 py-2 border-r">PSTN, 2G/3G</td>
                      <td className="px-4 py-2">
                        Core signaling protocol for PSTN and early mobile networks, handling call setup, 
                        routing, SMS delivery, and roaming.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">ISUP (ISDN User Part)</td>
                      <td className="px-4 py-2 border-r">PSTN, SS7</td>
                      <td className="px-4 py-2">
                        Part of SS7, handles circuit-switched call establishment, management, and teardown.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">MAP (Mobile Application Part)</td>
                      <td className="px-4 py-2 border-r">2G/3G</td>
                      <td className="px-4 py-2">
                        Mobile-specific extension to SS7, supporting mobility management, 
                        SMS, and roaming operations.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">BSSAP (Base Station System Application Part)</td>
                      <td className="px-4 py-2 border-r">GSM</td>
                      <td className="px-4 py-2">
                        Communications between BSC and MSC, handling resource management and mobility.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">SCCP (Signaling Connection Control Part)</td>
                      <td className="px-4 py-2 border-r">SS7</td>
                      <td className="px-4 py-2">
                        Provides routing and addressing capabilities for non-circuit-related signaling.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">SIGTRAN</td>
                      <td className="px-4 py-2 border-r">IP networks</td>
                      <td className="px-4 py-2">
                        SS7 over IP, enabling traditional telephony signaling over packet networks.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Diameter</td>
                      <td className="px-4 py-2 border-r">4G/IMS</td>
                      <td className="px-4 py-2">
                        Authentication, authorization, and accounting protocol for 4G and IMS networks.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">SIP (Session Initiation Protocol)</td>
                      <td className="px-4 py-2 border-r">VoIP, IMS</td>
                      <td className="px-4 py-2">
                        Setup, modification, and termination of multimedia sessions in IP networks.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">GTP (GPRS Tunneling Protocol)</td>
                      <td className="px-4 py-2 border-r">2G/3G/4G</td>
                      <td className="px-4 py-2">
                        Tunneling of user data between GPRS/UMTS/LTE network components.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">RANAP (Radio Access Network Application Part)</td>
                      <td className="px-4 py-2 border-r">3G UMTS</td>
                      <td className="px-4 py-2">
                        Signaling between RNC and core network in UMTS.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">S1AP</td>
                      <td className="px-4 py-2 border-r">4G LTE</td>
                      <td className="px-4 py-2">
                        Signaling between eNodeB and MME in LTE networks.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">NGAP</td>
                      <td className="px-4 py-2 border-r">5G</td>
                      <td className="px-4 py-2">
                        Signaling between gNB and AMF in 5G networks.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>SMS-Related Signaling</h4>
              <p>
                SMS messaging relies on specific signaling protocols and mechanisms:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">SMS Point-to-Point (SMS-PP)</h5>
                  <p className="mb-0">
                    Uses Mobile Application Part (MAP) signaling to send SMS messages from the SMSC to mobile devices
                    or between mobile devices. MAP operations include:
                  </p>
                  <ul className="mb-0 mt-2">
                    <li>mo-ForwardSM (Mobile-Originated Forward Short Message)</li>
                    <li>mt-ForwardSM (Mobile-Terminated Forward Short Message)</li>
                    <li>SendRoutingInfoForSM (to locate recipient devices)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">SMS Cell Broadcast (SMS-CB)</h5>
                  <p className="mb-0">
                    Mechanism for sending messages to all mobile devices in a specific area.
                    Used for emergency alerts, weather warnings, and public information.
                    Doesn't use store-and-forward methodology like SMS-PP.
                  </p>
                </div>
              </div>
              
              <h4>Modern Network Signaling Evolution</h4>
              <p>
                The evolution of signaling protocols reflects the broader transition from circuit-switched to 
                packet-switched networks and the increasing importance of IP-based communications:
              </p>
              
              <div className="border rounded-md p-4 bg-secondary/5 my-4">
                <ul className="mb-0">
                  <li><strong>Traditional SS7:</strong> Hierarchical network architecture with dedicated signaling links</li>
                  <li><strong>SIGTRAN:</strong> Adaptation layer allowing SS7 protocols to run over IP networks</li>
                  <li><strong>Diameter:</strong> Designed as an improvement over RADIUS for IP networks, with peer-to-peer architecture</li>
                  <li><strong>HTTP/2-based Signaling:</strong> Modern 5G networks increasingly use REST APIs and HTTP/2 for signaling</li>
                  <li><strong>Service-Based Architecture (SBA):</strong> 5G core network uses web-based microservices approach</li>
                </ul>
              </div>
            </>
          )}
          
          {section === "voice-services" && (
            <>
              <h3>Voice Services in Mobile Networks</h3>
              <p>
                Voice services form the fundamental communication functionality of mobile networks, 
                enabling real-time audio conversations between users. While voice may seem simple, 
                the underlying technologies are complex and have evolved significantly across network generations.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">Voice Service Evolution</h4>
                <p className="mb-2">
                  Mobile voice services have evolved through several technologies:
                </p>
                <ul className="mb-0">
                  <li><strong>Circuit-Switched Voice (1G/2G/3G):</strong> Dedicated end-to-end channel for each call</li>
                  <li><strong>Voice over IP (VoIP):</strong> Voice transmitted as data packets over IP networks</li>
                  <li><strong>Voice over LTE (VoLTE):</strong> Native IP-based voice service in 4G networks</li>
                  <li><strong>Voice over NR (VoNR):</strong> Native voice service in 5G networks</li>
                  <li><strong>OTT Voice Services:</strong> Third-party apps providing voice service over data connection</li>
                </ul>
              </div>
              
              <h4>Circuit-Switched Voice</h4>
              <p>
                Traditional voice in 2G and 3G networks uses circuit-switching technology:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">GSM Voice (2G)</h5>
                  <ul className="mb-0">
                    <li><strong>Codec:</strong> Full-Rate (FR) or Enhanced Full-Rate (EFR), 13 kbps</li>
                    <li><strong>Channels:</strong> Traffic Channel (TCH) carries voice data</li>
                    <li><strong>Call Setup:</strong> Via ISUP signaling over SS7</li>
                    <li><strong>Frequency:</strong> Operates in 900/1800 MHz bands in Europe, 850/1900 MHz in US</li>
                    <li><strong>Time Division:</strong> Each frequency divided into 8 time slots</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">UMTS Voice (3G)</h5>
                  <ul className="mb-0">
                    <li><strong>Codec:</strong> Adaptive Multi-Rate (AMR), 4.75-12.2 kbps</li>
                    <li><strong>Channels:</strong> Dedicated Channel (DCH) carries voice data</li>
                    <li><strong>Technology:</strong> Wideband CDMA (WCDMA)</li>
                    <li><strong>Frequency:</strong> Typically 2100 MHz in Europe, mixed in US</li>
                    <li><strong>Quality:</strong> Improved voice quality over GSM</li>
                  </ul>
                </div>
              </div>
              
              <h4>Voice over LTE (VoLTE)</h4>
              <p>
                VoLTE represented a fundamental shift in mobile voice, moving from circuit-switched
                to fully packet-switched IP-based communication:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Feature</th>
                      <th className="px-4 py-2 border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">IP Multimedia Subsystem (IMS)</td>
                      <td className="px-4 py-2">
                        VoLTE is built on the IMS framework, which provides the infrastructure for IP-based services
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Codec</td>
                      <td className="px-4 py-2">
                        Adaptive Multi-Rate Wideband (AMR-WB/HD Voice), operating at up to 23.85 kbps,
                        providing enhanced voice quality
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">QoS</td>
                      <td className="px-4 py-2">
                        Guaranteed Quality of Service (QoS) through dedicated bearer channels with highest priority
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Signaling</td>
                      <td className="px-4 py-2">
                        Uses Session Initiation Protocol (SIP) for call setup and management
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Enhanced Services</td>
                      <td className="px-4 py-2">
                        Supports Rich Communication Services (RCS) including video calling, file transfer during calls
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Call Setup Time</td>
                      <td className="px-4 py-2">
                        Faster call setup compared to circuit-switched calls
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Battery Impact</td>
                      <td className="px-4 py-2">
                        Originally had higher battery consumption, improved in later implementations
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Voice in 5G Networks</h4>
              <p>
                5G networks introduce new approaches to voice services:
              </p>
              
              <div className="grid grid-cols-1 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Voice over New Radio (VoNR)</h5>
                  <p>
                    Native 5G voice service operating entirely on 5G standalone networks. Key features include:
                  </p>
                  <ul className="mb-0">
                    <li>Full end-to-end 5G connectivity without fallback to LTE</li>
                    <li>Lower latency than VoLTE (potentially under 10ms)</li>
                    <li>Enhanced voice quality with EVS codec (up to 128 kbps)</li>
                    <li>Built on enhanced IMS architecture</li>
                    <li>Supports advanced features like spatial audio and noise cancellation</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Voice over NR (VoNR)</h5>
                  <p className="mb-0">
                    Native voice service in 5G Standalone networks, offering ultra-low latency, 
                    improved call quality with EVS codecs, and fully IP-based architecture.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">EPS Fallback</h5>
                  <p className="mb-0">
                    When VoNR is not available, 5G devices can fall back to LTE (EPS) 
                    for voice calls, ensuring service continuity during early 5G deployments.
                  </p>
                </div>
              </div>
            </>
          )}
          
          {section === "data-services" && (
            <>
              <h3>Mobile Data Services</h3>
              <p>
                Mobile data services enable the transmission of non-voice information over cellular networks,
                from simple text messaging to high-speed internet access. These services have become increasingly
                central to mobile communications, evolving dramatically across network generations.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">Data Service Evolution</h4>
                <p className="mb-2">
                  Data capabilities have expanded exponentially across mobile generations:
                </p>
                <ul className="mb-0">
                  <li><strong>2G (GSM):</strong> Basic data at 9.6 kbps with circuit-switched data (CSD)</li>
                  <li><strong>2.5G (GPRS):</strong> Packet-switched data at up to 114 kbps</li>
                  <li><strong>2.75G (EDGE):</strong> Enhanced data rates up to 384 kbps</li>
                  <li><strong>3G (UMTS):</strong> Higher-speed data up to 2 Mbps, enabling mobile internet</li>
                  <li><strong>3.5G (HSPA/HSPA+):</strong> Advanced data services up to 42 Mbps</li>
                  <li><strong>4G (LTE):</strong> True broadband mobile data with speeds up to 300 Mbps</li>
                  <li><strong>4G+ (LTE-Advanced):</strong> Enhanced speeds up to 1 Gbps with carrier aggregation</li>
                  <li><strong>5G:</strong> Ultra-high speeds up to 20 Gbps with massive bandwidth and low latency</li>
                </ul>
              </div>
              
              <h4>Core Data Network Architecture</h4>
              <p>
                Mobile data services rely on specialized network components that have evolved over time:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Generation</th>
                      <th className="px-4 py-2 border-b border-r">Key Network Elements</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">2G/2.5G (GPRS)</td>
                      <td className="px-4 py-2 border-r">SGSN, GGSN</td>
                      <td className="px-4 py-2">
                        SGSN (Serving GPRS Support Node) handles mobility and authentication.<br />
                        GGSN (Gateway GPRS Support Node) connects to external data networks.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">3G (UMTS)</td>
                      <td className="px-4 py-2 border-r">SGSN, GGSN, RNC</td>
                      <td className="px-4 py-2">
                        Similar to GPRS but with added RNC (Radio Network Controller) for radio resource management.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">4G (LTE)</td>
                      <td className="px-4 py-2 border-r">S-GW, P-GW, MME</td>
                      <td className="px-4 py-2">
                        S-GW (Serving Gateway) handles user data and mobility.<br />
                        P-GW (PDN Gateway) connects to external networks.<br />
                        MME (Mobility Management Entity) handles signaling.
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">5G</td>
                      <td className="px-4 py-2 border-r">UPF, SMF, AMF</td>
                      <td className="px-4 py-2">
                        UPF (User Plane Function) handles user data traffic.<br />
                        SMF (Session Management Function) manages data sessions.<br />
                        AMF (Access and Mobility Function) handles connection and mobility.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Key Data Service Technologies</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Packet Switching</h5>
                  <p className="mb-0">
                    Core technology behind efficient data transmission in mobile networks. 
                    Data is divided into packets, each routed independently based on 
                    network conditions. This allows multiple users to share the same 
                    channel, optimizing network resources.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">IP-Based Networking</h5>
                  <p className="mb-0">
                    Modern mobile networks use Internet Protocol (IP) as the fundamental 
                    addressing and routing mechanism. 4G introduced a fully IP-based core 
                    network, while 5G extends this with simplified all-IP architecture and 
                    service-based interfaces.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Quality of Service (QoS)</h5>
                  <p className="mb-0">
                    Mechanisms to prioritize different types of traffic. 4G introduced 
                    QoS Class Identifiers (QCI) which assign priority levels to different 
                    services. 5G enhances this with 5G QoS Indicators (5QI) supporting 
                    ultra-reliable low-latency communications.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Network Slicing</h5>
                  <p className="mb-0">
                    5G technology that allows creation of multiple virtual networks on shared 
                    physical infrastructure. Each slice is optimized for specific services 
                    (e.g., IoT, autonomous vehicles, streaming) with tailored characteristics 
                    for bandwidth, latency, and reliability.
                  </p>
                </div>
              </div>
              
              <h4>Modern Mobile Data Applications</h4>
              <p>
                Today's data services enable a wide range of applications:
              </p>
              
              <div className="border rounded-md p-4 bg-secondary/5 my-4">
                <ul className="mb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li><strong>Mobile Broadband:</strong> High-speed internet access</li>
                  <li><strong>Video Streaming:</strong> HD and 4K content delivery</li>
                  <li><strong>Cloud Computing:</strong> Remote processing and storage</li>
                  <li><strong>IoT Applications:</strong> Smart devices and sensors</li>
                  <li><strong>Augmented Reality:</strong> Real-time digital overlays</li>
                  <li><strong>Virtual Reality:</strong> Immersive experiences</li>
                  <li><strong>Mobile Gaming:</strong> Real-time multiplayer experiences</li>
                  <li><strong>Telemedicine:</strong> Remote health monitoring and consultation</li>
                </ul>
              </div>
            </>
          )}
          
          {section === "messaging-services" && (
            <>
              <h3>Mobile Messaging Services</h3>
              <p>
                Messaging services enable the exchange of text, multimedia, and other content between mobile 
                users. From the revolutionary SMS to modern rich messaging platforms, these services have transformed
                how people communicate in the mobile era.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <h4 className="mt-0 text-primary">Types of Mobile Messaging</h4>
                <p className="mb-2">
                  Mobile networks support multiple messaging technologies:
                </p>
                <ul className="mb-0">
                  <li><strong>SMS (Short Message Service):</strong> Basic text messages up to 160 characters</li>
                  <li><strong>MMS (Multimedia Messaging Service):</strong> Messages with images, audio, video</li>
                  <li><strong>Cell Broadcast:</strong> Messages sent to all devices in specific cell areas</li>
                  <li><strong>RCS (Rich Communication Services):</strong> Enhanced messaging with advanced features</li>
                  <li><strong>OTT (Over-The-Top) Messaging:</strong> Third-party messaging apps using data connection</li>
                </ul>
              </div>
              
              <h4>SMS Technology Overview</h4>
              <p>
                SMS is the foundational mobile messaging technology, with several unique characteristics:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Store and Forward</h5>
                  <p className="mb-0">
                    SMS uses a store-and-forward mechanism where messages are sent to the SMSC (Short Message Service Center),
                    which stores them and attempts delivery. If the recipient is unavailable, the SMSC will retry
                    later, typically for 24-72 hours.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Signaling Channel</h5>
                  <p className="mb-0">
                    SMS messages travel over the control channels (SDCCH in GSM) rather than the voice or data channels.
                    This allows SMS to work even during voice calls and uses minimal network resources.
                    This design also contributes to SMS reliability.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Character Limitations</h5>
                  <p className="mb-0">
                    Standard SMS is limited to 160 characters using the GSM 7-bit alphabet, 140 characters using
                    8-bit encoding, or 70 characters using UCS-2 encoding for languages with non-Latin alphabets.
                    Longer messages are split into multiple SMS segments.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">PDU Format</h5>
                  <p className="mb-0">
                    SMS messages are transmitted in Protocol Data Unit (PDU) format, which encodes the message content,
                    recipient information, validity period, and other parameters into a compact binary format for
                    transmission over the network.
                  </p>
                </div>
              </div>
              
              <h4>MMS Technology</h4>
              <p>
                Multimedia Messaging Service extends SMS with media content support:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Feature</th>
                      <th className="px-4 py-2 border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Content Types</td>
                      <td className="px-4 py-2">
                        Images, audio clips, video clips, and formatted text
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Architecture</td>
                      <td className="px-4 py-2">
                        Uses MMSC (Multimedia Messaging Service Center) similar to SMSC,
                        but also uses WAP for content transfer
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Data Transport</td>
                      <td className="px-4 py-2">
                        Uses packet-switched data connection rather than signaling channels
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Size Limits</td>
                      <td className="px-4 py-2">
                        Varies by carrier, typically 300KB-1MB per message
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Delivery Notification</td>
                      <td className="px-4 py-2">
                        Can include read receipts and delivery confirmations
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Rich Communication Services (RCS)</h4>
              <p>
                RCS is designed as the successor to SMS/MMS, offering enhanced features while maintaining
                carrier-based infrastructure:
              </p>
              
              <div className="border rounded-md p-4 bg-secondary/5 my-4">
                <h5 className="mt-0 mb-2 font-medium">Key RCS Features</h5>
                <ul className="mb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li><strong>Rich Media Sharing:</strong> High-quality images and videos</li>
                  <li><strong>Group Chats:</strong> Enhanced group messaging capabilities</li>
                  <li><strong>Read Receipts:</strong> Confirmation when messages are read</li>
                  <li><strong>Typing Indicators:</strong> Shows when someone is composing a message</li>
                  <li><strong>Location Sharing:</strong> Real-time location information</li>
                  <li><strong>File Transfer:</strong> Sending documents and other files</li>
                  <li><strong>Video Calling:</strong> Integration with carrier video calls</li>
                  <li><strong>Business Messaging:</strong> Enhanced business-to-consumer communication</li>
                </ul>
              </div>
              
              <p>
                Despite its technical advantages, RCS has faced adoption challenges due to fragmented
                implementation across carriers and device manufacturers. Google's "Messages" app has
                helped standardize RCS on Android, while Apple announced RCS support in 2024.
              </p>
            </>
          )}
          
          {section === "network-evolution" && (
            <>
              <h3>Mobile Network Evolution</h3>
              <p>
                Mobile network technology has evolved through distinct generations, each bringing significant 
                improvements in functionality, speed, and services.
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Generation</th>
                      <th className="px-4 py-2 border-b border-r">Technology</th>
                      <th className="px-4 py-2 border-b border-r">Period</th>
                      <th className="px-4 py-2 border-b">Key Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">1G</td>
                      <td className="px-4 py-2 border-r">AMPS, NMT, TACS</td>
                      <td className="px-4 py-2 border-r">1980s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Analog voice only</li>
                          <li>No data capabilities</li>
                          <li>Limited security</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">2G</td>
                      <td className="px-4 py-2 border-r">GSM, CDMA, TDMA</td>
                      <td className="px-4 py-2 border-r">1990s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Digital voice</li>
                          <li>SMS and basic data (9.6 kbps)</li>
                          <li>Improved security with encryption</li>
                          <li>SIM cards introduced</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">2.5G</td>
                      <td className="px-4 py-2 border-r">GPRS</td>
                      <td className="px-4 py-2 border-r">Late 1990s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Packet-switched data (up to 114 kbps)</li>
                          <li>Always-on data connections</li>
                          <li>WAP for mobile internet</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">2.75G</td>
                      <td className="px-4 py-2 border-r">EDGE</td>
                      <td className="px-4 py-2 border-r">Early 2000s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Enhanced data rates (up to 384 kbps)</li>
                          <li>Improved data applications</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">3G</td>
                      <td className="px-4 py-2 border-r">UMTS, WCDMA, CDMA2000</td>
                      <td className="px-4 py-2 border-r">2000s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Higher data speeds (up to 2 Mbps)</li>
                          <li>Video calling</li>
                          <li>Mobile internet browsing</li>
                          <li>Multimedia messaging</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">3.5G</td>
                      <td className="px-4 py-2 border-r">HSPA, HSPA+</td>
                      <td className="px-4 py-2 border-r">Mid-2000s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Improved data speeds (up to 14 Mbps)</li>
                          <li>Enhanced multimedia applications</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">4G</td>
                      <td className="px-4 py-2 border-r">LTE, WiMAX</td>
                      <td className="px-4 py-2 border-r">2010s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>High-speed data (up to 100 Mbps)</li>
                          <li>IP-based voice (VoLTE)</li>
                          <li>HD video streaming</li>
                          <li>Advanced mobile applications</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">4G+</td>
                      <td className="px-4 py-2 border-r">LTE-Advanced</td>
                      <td className="px-4 py-2 border-r">Mid-2010s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Carrier aggregation</li>
                          <li>Higher speeds (up to 1 Gbps)</li>
                          <li>Reduced latency</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">5G</td>
                      <td className="px-4 py-2 border-r">5G NR</td>
                      <td className="px-4 py-2 border-r">2020s</td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Ultra-high speeds (up to 10 Gbps)</li>
                          <li>Ultra-low latency (1ms)</li>
                          <li>Massive device connectivity (IoT)</li>
                          <li>Network slicing</li>
                          <li>Edge computing integration</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Key Technological Shifts</h4>
              <p>
                The evolution of mobile networks has been driven by several fundamental technological shifts:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Analog to Digital</h5>
                  <p className="mb-0">
                    The transition from analog (1G) to digital (2G) transmission enabled more efficient use of spectrum, 
                    improved voice quality, and introduced basic data services like SMS.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Circuit-Switched to Packet-Switched</h5>
                  <p className="mb-0">
                    Moving from dedicated circuits (2G) to packet-switching (2.5G+) allowed more efficient resource 
                    utilization and enabled always-on data connections.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">All-IP Networks</h5>
                  <p className="mb-0">
                    4G introduced all-IP architectures, eliminating the separate circuit-switched domain for voice 
                    and moving all traffic to packet-based transmission.
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Network Softwarization</h5>
                  <p className="mb-0">
                    5G embraces software-defined networking, network function virtualization, and cloud-native principles, 
                    making networks more flexible and programmable.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-6">
                <h4 className="mt-0 text-primary mb-2">Spectrum Efficiency Evolution</h4>
                <p className="mb-1">
                  Each generation has improved spectrum efficiency (bits per Hz) through advanced technologies:
                </p>
                <ul className="mb-0">
                  <li><strong>1G:</strong> Analog FM modulation (low efficiency)</li>
                  <li><strong>2G:</strong> Digital modulation (GMSK in GSM)</li>
                  <li><strong>3G:</strong> WCDMA with adaptive modulation</li>
                  <li><strong>4G:</strong> OFDMA with advanced MIMO</li>
                  <li><strong>5G:</strong> Scalable OFDM, massive MIMO, beamforming</li>
                </ul>
              </div>
            </>
          )}
          
          {section === "3g-technology" && (
            <>
              <h3>3G Technology: The Mobile Broadband Revolution</h3>
              <p>
                Third Generation (3G) mobile technology represented a significant leap forward in telecommunications, 
                bringing true mobile broadband capabilities to consumers worldwide. Launched in the early 2000s, 
                3G networks enabled faster data transmission, video calling, and mobile internet access at 
                unprecedented speeds.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Key 3G Standards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mt-0 mb-2">UMTS/WCDMA</h5>
                    <ul className="mb-0">
                      <li>Evolved from GSM standards</li>
                      <li>Uses 5 MHz channel bandwidth</li>
                      <li>Supports theoretical speeds up to 2 Mbps</li>
                      <li>Deployed primarily in Europe and Asia</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mt-0 mb-2">CDMA2000</h5>
                    <ul className="mb-0">
                      <li>Evolved from CDMA (IS-95) standards</li>
                      <li>Includes 1xRTT and EV-DO variants</li>
                      <li>EV-DO Rev. A reached speeds of 3.1 Mbps</li>
                      <li>Widely deployed in North America</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h4>3G Network Architecture</h4>
              <p>
                The 3G UMTS architecture introduced several new components while maintaining compatibility 
                with existing GSM/GPRS infrastructure:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Component</th>
                      <th className="px-4 py-2 border-b border-r">Description</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Node B</td>
                      <td className="px-4 py-2 border-r">Base station in UMTS</td>
                      <td className="px-4 py-2">
                        Provides radio coverage and manages connections with mobile devices (UEs)
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">RNC</td>
                      <td className="px-4 py-2 border-r">Radio Network Controller</td>
                      <td className="px-4 py-2">
                        Controls multiple Node Bs and manages radio resources
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">SGSN</td>
                      <td className="px-4 py-2 border-r">Serving GPRS Support Node</td>
                      <td className="px-4 py-2">
                        Handles mobility management and packet routing
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">GGSN</td>
                      <td className="px-4 py-2 border-r">Gateway GPRS Support Node</td>
                      <td className="px-4 py-2">
                        Provides connectivity to external packet data networks (internet)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">MSC</td>
                      <td className="px-4 py-2 border-r">Mobile Switching Center</td>
                      <td className="px-4 py-2">
                        Handles circuit-switched services, including voice calls
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Air Interface Technology</h4>
              <p>
                The revolutionary aspect of 3G was its air interface, particularly the adoption of Code Division Multiple Access (CDMA) techniques:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">WCDMA (UMTS)</h5>
                  <ul className="mb-0">
                    <li><strong>Wideband CDMA:</strong> Uses wider 5 MHz channels (vs. 200 kHz in GSM)</li>
                    <li><strong>Spreading:</strong> Data is spread across the frequency band using unique codes</li>
                    <li><strong>Chip Rate:</strong> 3.84 Mcps (million chips per second)</li>
                    <li><strong>Advantage:</strong> Better spectrum efficiency and capacity</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">CDMA2000</h5>
                  <ul className="mb-0">
                    <li><strong>Multi-Carrier:</strong> Uses multiple 1.25 MHz carriers</li>
                    <li><strong>EV-DO:</strong> Evolution-Data Optimized for faster data</li>
                    <li><strong>Chip Rate:</strong> 1.2288 Mcps</li>
                    <li><strong>Advantage:</strong> Smooth upgrade path from IS-95 CDMA</li>
                  </ul>
                </div>
              </div>
              
              <h4>3G Enhancements: HSPA and Beyond</h4>
              <p>
                As 3G matured, several enhancements were introduced to improve data rates and efficiency:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Enhancement</th>
                      <th className="px-4 py-2 border-b border-r">Year</th>
                      <th className="px-4 py-2 border-b border-r">Downlink Speed</th>
                      <th className="px-4 py-2 border-b">Key Improvements</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">HSDPA (3.5G)</td>
                      <td className="px-4 py-2 border-r">2005-2006</td>
                      <td className="px-4 py-2 border-r">Up to 14.4 Mbps</td>
                      <td className="px-4 py-2">
                        Higher-order modulation (16-QAM), faster scheduling, HARQ
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">HSUPA</td>
                      <td className="px-4 py-2 border-r">2007-2008</td>
                      <td className="px-4 py-2 border-r">Up to 5.76 Mbps (UL)</td>
                      <td className="px-4 py-2">
                        Improved uplink speeds, faster response times
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">HSPA+</td>
                      <td className="px-4 py-2 border-r">2008-2011</td>
                      <td className="px-4 py-2 border-r">Up to 42 Mbps</td>
                      <td className="px-4 py-2">
                        64-QAM, MIMO, Dual-Carrier operation
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">DC-HSPA+</td>
                      <td className="px-4 py-2 border-r">2011+</td>
                      <td className="px-4 py-2 border-r">Up to 84 Mbps</td>
                      <td className="px-4 py-2">
                        Dual-Carrier with MIMO, approaching 4G speeds
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Technical Focus: WCDMA Principles</h4>
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                <p className="mb-2">
                  WCDMA is the primary air interface technology used in UMTS 3G networks. It works on these key principles:
                </p>
                <ol className="mb-0">
                  <li><strong>Spreading:</strong> Each user's data is multiplied by a unique high-rate spreading code (chips)</li>
                  <li><strong>Scrambling:</strong> Cells use different scrambling codes to differentiate from each other</li>
                  <li><strong>Power Control:</strong> Precise control (1500 times per second) to minimize interference</li>
                  <li><strong>Soft Handover:</strong> UE can connect to multiple cells simultaneously</li>
                  <li><strong>Variable Spreading Factor:</strong> Different services can use different spreading factors</li>
                </ol>
              </div>
              
              <h4>3G Impact and Legacy</h4>
              <p>
                3G revolutionized mobile communications with several lasting impacts:
              </p>
              <ul>
                <li><strong>Smartphone Revolution:</strong> 3G data speeds enabled the explosion of smartphones and mobile apps</li>
                <li><strong>Mobile Internet:</strong> Made browsing the real internet (not just WAP) practical on mobile devices</li>
                <li><strong>Video Services:</strong> Enabled mobile video calling and early mobile video streaming</li>
                <li><strong>Location Services:</strong> Supported better positioning technology for navigation and location-based services</li>
                <li><strong>Global Roaming:</strong> More unified global standards improved international connectivity</li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">3G Frequencies</h5>
                  <ul className="mb-0 text-sm">
                    <li>850 MHz (Band 5)</li>
                    <li>900 MHz (Band 8)</li>
                    <li>1700/2100 MHz (Band 4)</li>
                    <li>1900 MHz (Band 2)</li>
                    <li>2100 MHz (Band 1) - Primary</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Channel Bandwidth</h5>
                  <ul className="mb-0 text-sm">
                    <li>WCDMA: 5 MHz</li>
                    <li>CDMA2000 1X: 1.25 MHz</li>
                    <li>CDMA2000 EV-DO: 1.25 MHz</li>
                    <li>TD-SCDMA: 1.6 MHz</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Core Protocol Stack</h5>
                  <ul className="mb-0 text-sm">
                    <li>Physical Layer: WCDMA/CDMA</li>
                    <li>Data Link: RLC/MAC</li>
                    <li>Network: GTP tunneling</li>
                    <li>Transport: TCP/UDP</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {section === "5g-technology" && (
            <>
              <h3>5G Technology: The Next Generation of Mobile Communications</h3>
              <p>
                Fifth Generation (5G) mobile technology represents a revolutionary advancement in wireless 
                communications, designed not just as an incremental improvement over 4G, but as a transformative 
                platform enabling new use cases and industries. Commercialized from 2019, 5G combines significantly 
                higher data rates, ultra-low latency, massive connectivity, and enhanced reliability.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-6">
                <h4 className="mt-0 text-primary mb-2">5G Design Goals</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium mt-0 mb-2 text-sm">Enhanced Mobile Broadband (eMBB)</h5>
                    <ul className="mb-0 text-sm">
                      <li>Peak data rates up to 20 Gbps</li>
                      <li>User experienced rates of 100+ Mbps</li>
                      <li>Support for high-density areas</li>
                      <li>Improved coverage and capacity</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mt-0 mb-2 text-sm">Ultra-Reliable Low Latency Communications (URLLC)</h5>
                    <ul className="mb-0 text-sm">
                      <li>End-to-end latency of 1 ms</li>
                      <li>99.999% reliability</li>
                      <li>Support for mission-critical applications</li>
                      <li>Deterministic communications</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mt-0 mb-2 text-sm">Massive Machine Type Communications (mMTC)</h5>
                    <ul className="mb-0 text-sm">
                      <li>Connection density of 1 million/km²</li>
                      <li>Energy-efficient devices</li>
                      <li>Support for IoT at massive scale</li>
                      <li>Long battery life (10+ years)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h4>5G Network Architecture</h4>
              <p>
                5G introduces a service-based architecture (SBA) that is cloud-native, virtualized, and highly flexible:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Component</th>
                      <th className="px-4 py-2 border-b border-r">Description</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">gNB</td>
                      <td className="px-4 py-2 border-r">5G base station</td>
                      <td className="px-4 py-2">
                        Provides radio access for 5G NR; can be split into CU (centralized unit) and 
                        DU (distributed unit)
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">AMF</td>
                      <td className="px-4 py-2 border-r">Access and Mobility Management Function</td>
                      <td className="px-4 py-2">
                        Handles connection and mobility management, security
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">SMF</td>
                      <td className="px-4 py-2 border-r">Session Management Function</td>
                      <td className="px-4 py-2">
                        Manages sessions, IP address allocation, and routing
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">UPF</td>
                      <td className="px-4 py-2 border-r">User Plane Function</td>
                      <td className="px-4 py-2">
                        Handles user data, packet routing and forwarding, QoS enforcement
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">PCF</td>
                      <td className="px-4 py-2 border-r">Policy Control Function</td>
                      <td className="px-4 py-2">
                        Manages policies and rules for network behavior
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Key 5G Technologies</h4>
              <p>
                5G incorporates several revolutionary technologies that enable its enhanced capabilities:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Massive MIMO</h5>
                  <ul className="mb-0">
                    <li><strong>Scale:</strong> Dozens to hundreds of antenna elements</li>
                    <li><strong>Beamforming:</strong> Directs energy precisely to users</li>
                    <li><strong>Spatial Multiplexing:</strong> Multiple data streams in same spectrum</li>
                    <li><strong>Benefit:</strong> Dramatically increased capacity and coverage</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">mmWave Spectrum</h5>
                  <ul className="mb-0">
                    <li><strong>High-Frequency:</strong> 24-100 GHz bands</li>
                    <li><strong>Bandwidth:</strong> Much wider channels (100-400 MHz)</li>
                    <li><strong>Trade-off:</strong> Higher speeds but shorter range</li>
                    <li><strong>Challenge:</strong> Requires dense deployment, sensitive to obstacles</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Network Slicing</h5>
                  <ul className="mb-0">
                    <li><strong>Concept:</strong> Multiple virtual networks on shared infrastructure</li>
                    <li><strong>Customization:</strong> Each slice optimized for specific services</li>
                    <li><strong>Isolation:</strong> Guaranteed resources and security per slice</li>
                    <li><strong>Examples:</strong> eMBB slice, URLLC slice, IoT slice</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Edge Computing</h5>
                  <ul className="mb-0">
                    <li><strong>Concept:</strong> Moving computing resources closer to users</li>
                    <li><strong>MEC:</strong> Multi-access Edge Computing integration</li>
                    <li><strong>Result:</strong> Lower latency, reduced backhaul traffic</li>
                    <li><strong>Applications:</strong> AR/VR, autonomous vehicles, industrial control</li>
                  </ul>
                </div>
              </div>
              
              <h4>5G NR Air Interface</h4>
              <p>
                5G New Radio (NR) introduces a flexible, scalable air interface with significant advances:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Feature</th>
                      <th className="px-4 py-2 border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Scalable OFDM</td>
                      <td className="px-4 py-2">
                        Flexible subcarrier spacing (15/30/60/120/240 kHz) allowing adaption to different use cases and frequencies
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Advanced Channel Coding</td>
                      <td className="px-4 py-2">
                        LDPC (Low-Density Parity Check) for data channels, Polar codes for control channels - superior performance to turbo codes
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Flexible Numerology</td>
                      <td className="px-4 py-2">
                        Adaptable frame structure with different slot durations, allowing optimization for latency or throughput
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Mini-Slot Structure</td>
                      <td className="px-4 py-2">
                        Transmissions can start at any time without waiting for slot boundaries, crucial for URLLC
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">3D Beamforming</td>
                      <td className="px-4 py-2">
                        Precise beam steering in both horizontal and vertical planes, maximizing signal strength and minimizing interference
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>5G Deployment Modes</h4>
              <p>
                5G networks can be deployed in different modes, each with distinct characteristics:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Non-Standalone (NSA) Mode</h5>
                  <ul className="mb-0">
                    <li><strong>Architecture:</strong> Uses existing 4G core (EPC) with 5G radio (NR)</li>
                    <li><strong>Dual Connectivity:</strong> Devices connect to both 4G and 5G simultaneously</li>
                    <li><strong>Advantage:</strong> Faster deployment leveraging existing 4G infrastructure</li>
                    <li><strong>Limitation:</strong> Cannot deliver full 5G capabilities, especially URLLC</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Standalone (SA) Mode</h5>
                  <ul className="mb-0">
                    <li><strong>Architecture:</strong> Complete 5G system with 5G core and 5G radio</li>
                    <li><strong>Capabilities:</strong> Enables all 5G features including network slicing, URLLC</li>
                    <li><strong>Implementation:</strong> More complex, requires new core network</li>
                    <li><strong>Future:</strong> Ultimate target for 5G deployments</li>
                  </ul>
                </div>
              </div>
              
              <h4>5G Spectrum Bands</h4>
              <p>
                5G operates across a wide range of spectrum bands, categorized into three main groups:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Band Category</th>
                      <th className="px-4 py-2 border-b border-r">Frequency Range</th>
                      <th className="px-4 py-2 border-b border-r">Key Characteristics</th>
                      <th className="px-4 py-2 border-b">Typical Use Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Low-Band</td>
                      <td className="px-4 py-2 border-r">600-900 MHz</td>
                      <td className="px-4 py-2 border-r">
                        <ul className="mb-0 pl-4">
                          <li>Excellent coverage (10+ km)</li>
                          <li>Good building penetration</li>
                          <li>Limited bandwidth (40-100 MHz)</li>
                        </ul>
                      </td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Nationwide coverage</li>
                          <li>Rural deployments</li>
                          <li>IoT applications</li>
                        </ul>
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Mid-Band</td>
                      <td className="px-4 py-2 border-r">1-6 GHz</td>
                      <td className="px-4 py-2 border-r">
                        <ul className="mb-0 pl-4">
                          <li>Balanced coverage (1-2 km)</li>
                          <li>Good capacity</li>
                          <li>Moderate bandwidth (100-200 MHz)</li>
                        </ul>
                      </td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>Urban/suburban coverage</li>
                          <li>General mobile broadband</li>
                          <li>Fixed wireless access</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">High-Band (mmWave)</td>
                      <td className="px-4 py-2 border-r">24-100 GHz</td>
                      <td className="px-4 py-2 border-r">
                        <ul className="mb-0 pl-4">
                          <li>Limited coverage (200-300m)</li>
                          <li>Poor penetration</li>
                          <li>Massive bandwidth (400+ MHz)</li>
                        </ul>
                      </td>
                      <td className="px-4 py-2">
                        <ul className="mb-0 pl-4">
                          <li>High-density hotspots</li>
                          <li>Venues, stadiums</li>
                          <li>Industrial applications</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>5G Applications and Use Cases</h4>
              <p>
                5G enables a wide range of new applications and use cases beyond traditional mobile broadband:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Enhanced Mobile Broadband</h5>
                  <ul className="mb-0 text-sm">
                    <li>8K video streaming</li>
                    <li>360° video and AR/VR</li>
                    <li>Cloud gaming</li>
                    <li>Holographic communications</li>
                    <li>Fixed wireless access (FWA)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Ultra-Reliable Communications</h5>
                  <ul className="mb-0 text-sm">
                    <li>Autonomous vehicles</li>
                    <li>Remote surgery</li>
                    <li>Industrial automation</li>
                    <li>Smart grid control</li>
                    <li>Public safety and emergency response</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Massive IoT Connectivity</h5>
                  <ul className="mb-0 text-sm">
                    <li>Smart cities</li>
                    <li>Environmental monitoring</li>
                    <li>Asset tracking</li>
                    <li>Agricultural sensors</li>
                    <li>Massive industrial IoT</li>
                  </ul>
                </div>
              </div>
              
              <h4>Future Evolution: Beyond 5G</h4>
              <p>
                As 5G continues to evolve, several technological advancements are already being explored for future releases and beyond:
              </p>
              <ul>
                <li><strong>Terahertz Communications:</strong> Exploring spectrum above 100 GHz for even greater bandwidth</li>
                <li><strong>Cell-Free Massive MIMO:</strong> Distributed antenna systems that coordinate seamlessly</li>
                <li><strong>AI-Native Networks:</strong> Networks that use AI/ML for self-optimization and management</li>
                <li><strong>Quantum Communications:</strong> Quantum-secured links for unbreakable encryption</li>
                <li><strong>Integrated Sensing and Communications:</strong> Using the network for both communication and environmental sensing</li>
                <li><strong>6G Research:</strong> Early research into the next generation, targeting commercial deployment in the 2030s</li>
              </ul>
            </>
          )}
          
          {section === "4g-technology" && (
            <>
              <h3>4G Technology: The All-IP Mobile Broadband Era</h3>
              <p>
                Fourth Generation (4G) mobile technology marked a paradigm shift in mobile communications, 
                introducing all-IP networks that revolutionized how we access and use mobile data. 
                Launched commercially around 2010, 4G networks delivered substantially higher speeds, 
                lower latency, and better spectrum efficiency than their 3G predecessors.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-md border mb-4">
                <h4 className="mt-0">Key 4G Standards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mt-0 mb-2">LTE (Long Term Evolution)</h5>
                    <ul className="mb-0">
                      <li>Developed by 3GPP</li>
                      <li>Scalable bandwidth from 1.4 MHz to 20 MHz</li>
                      <li>Peak rates: 100 Mbps downlink, 50 Mbps uplink</li>
                      <li>Became the global 4G standard</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mt-0 mb-2">WiMAX (IEEE 802.16)</h5>
                    <ul className="mb-0">
                      <li>Developed by IEEE</li>
                      <li>Bandwidth up to 20 MHz</li>
                      <li>Initially competed with LTE</li>
                      <li>Limited commercial success</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h4>4G Network Architecture: EPC</h4>
              <p>
                The 4G LTE architecture introduced the Evolved Packet Core (EPC), a simplified, all-IP network architecture:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Component</th>
                      <th className="px-4 py-2 border-b border-r">Description</th>
                      <th className="px-4 py-2 border-b">Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">eNodeB</td>
                      <td className="px-4 py-2 border-r">Evolved Node B</td>
                      <td className="px-4 py-2">
                        Integrated base station that handles radio resource management directly 
                        (no RNC needed)
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">MME</td>
                      <td className="px-4 py-2 border-r">Mobility Management Entity</td>
                      <td className="px-4 py-2">
                        Handles signaling, mobility management, and user authentication
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">S-GW</td>
                      <td className="px-4 py-2 border-r">Serving Gateway</td>
                      <td className="px-4 py-2">
                        Routes data packets and serves as mobility anchor during handovers
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">P-GW</td>
                      <td className="px-4 py-2 border-r">PDN Gateway</td>
                      <td className="px-4 py-2">
                        Connects to external packet data networks and handles IP address allocation
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">HSS</td>
                      <td className="px-4 py-2 border-r">Home Subscriber Server</td>
                      <td className="px-4 py-2">
                        Central database containing user subscription information
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-6 mt-4">
                <h4 className="mt-0 text-primary mb-2">Key Architectural Improvements Over 3G</h4>
                <ul className="mb-0">
                  <li><strong>Flatter Architecture:</strong> Fewer network elements reduces latency</li>
                  <li><strong>Distributed Intelligence:</strong> More functions moved to base stations (eNodeBs)</li>
                  <li><strong>All-IP Network:</strong> No separate domain for voice traffic</li>
                  <li><strong>Simplified Interfaces:</strong> More direct connections between network elements</li>
                </ul>
              </div>
              
              <h4>4G Air Interface Technology: OFDMA</h4>
              <p>
                4G LTE replaced CDMA-based technologies with Orthogonal Frequency Division Multiple Access (OFDMA):
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">OFDMA (Downlink)</h5>
                  <ul className="mb-0">
                    <li><strong>Subcarriers:</strong> Data is transmitted on many narrow subcarriers (15 kHz each)</li>
                    <li><strong>Orthogonality:</strong> Subcarriers are mathematically orthogonal to prevent interference</li>
                    <li><strong>Resource Blocks:</strong> Smallest unit of resource allocation (12 subcarriers × 0.5ms)</li>
                    <li><strong>Advantage:</strong> Resilience to multipath fading, efficient spectrum use</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">SC-FDMA (Uplink)</h5>
                  <ul className="mb-0">
                    <li><strong>Single Carrier:</strong> Modified form of OFDMA with better power efficiency</li>
                    <li><strong>PAPR:</strong> Lower Peak-to-Average Power Ratio saves battery life</li>
                    <li><strong>DFT Spreading:</strong> Uses DFT spreading to reduce power fluctuations</li>
                    <li><strong>Advantage:</strong> Better for power-limited devices (mobile phones)</li>
                  </ul>
                </div>
              </div>
              
              <h4>Advanced LTE Features</h4>
              <p>
                Several key technologies enabled LTE's high performance:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Feature</th>
                      <th className="px-4 py-2 border-b">Description and Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">MIMO</td>
                      <td className="px-4 py-2">
                        Multiple-Input Multiple-Output antenna technology increases throughput and 
                        reliability by using multiple transmit and receive antennas
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Adaptive Modulation & Coding</td>
                      <td className="px-4 py-2">
                        Dynamically adjusts modulation scheme and coding rate based on channel 
                        conditions (QPSK, 16-QAM, 64-QAM)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">HARQ</td>
                      <td className="px-4 py-2">
                        Hybrid Automatic Repeat Request combines error correction coding and 
                        automatic retransmission for faster error recovery
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">X2 Interface</td>
                      <td className="px-4 py-2">
                        Direct connection between eNodeBs for faster handovers and improved 
                        interference coordination
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>LTE-Advanced: True 4G</h4>
              <p>
                While initial LTE deployments were marketed as 4G, only LTE-Advanced (LTE Release 10+) officially met 
                the ITU's IMT-Advanced requirements for true 4G:
              </p>
              
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 border-b border-r">Feature</th>
                      <th className="px-4 py-2 border-b border-r">Description</th>
                      <th className="px-4 py-2 border-b">Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">Carrier Aggregation</td>
                      <td className="px-4 py-2 border-r">
                        Combines up to 5 carriers of 20 MHz each
                      </td>
                      <td className="px-4 py-2">
                        Increased bandwidth and throughput up to 1 Gbps
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Enhanced MIMO</td>
                      <td className="px-4 py-2 border-r">
                        Up to 8x8 MIMO in downlink, 4x4 in uplink
                      </td>
                      <td className="px-4 py-2">
                        Higher spectral efficiency and data rates
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">CoMP</td>
                      <td className="px-4 py-2 border-r">
                        Coordinated Multi-Point transmission/reception
                      </td>
                      <td className="px-4 py-2">
                        Improved performance at cell edges
                      </td>
                    </tr>
                    <tr className="bg-muted/20">
                      <td className="px-4 py-2 font-medium border-r">Relay Nodes</td>
                      <td className="px-4 py-2 border-r">
                        Low-power base stations that relay signals
                      </td>
                      <td className="px-4 py-2">
                        Extended coverage and improved cell-edge performance
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium border-r">HetNets</td>
                      <td className="px-4 py-2 border-r">
                        Heterogeneous Networks with macro, micro, pico, and femto cells
                      </td>
                      <td className="px-4 py-2">
                        Increased capacity in high-traffic areas
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h4>Voice over LTE (VoLTE)</h4>
              <p>
                As 4G LTE is an all-IP network, it required new approaches for voice services:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">VoLTE Architecture</h5>
                  <ul className="mb-0">
                    <li><strong>IMS Core:</strong> IP Multimedia Subsystem for session management</li>
                    <li><strong>QoS:</strong> Dedicated bearer with guaranteed bit rate for voice</li>
                    <li><strong>Codec:</strong> Typically AMR-WB (HD Voice) for better quality</li>
                    <li><strong>SIP:</strong> Session Initiation Protocol for call setup</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">VoLTE Benefits</h5>
                  <ul className="mb-0">
                    <li><strong>HD Voice:</strong> Wider audio frequency range (50Hz–7kHz vs. 300Hz–3.4kHz)</li>
                    <li><strong>Fast Call Setup:</strong> Typically 2-3 seconds vs. 5-10 seconds</li>
                    <li><strong>Simultaneous Voice & Data:</strong> No switching between networks</li>
                    <li><strong>Enhanced Services:</strong> Video calling, rich communication services</li>
                  </ul>
                </div>
              </div>
              
              <h4>4G LTE Technical Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">LTE Frequencies</h5>
                  <ul className="mb-0 text-sm">
                    <li>700 MHz (Band 12, 13, 17)</li>
                    <li>850 MHz (Band 5, 18, 19)</li>
                    <li>900 MHz (Band 8)</li>
                    <li>1800 MHz (Band 3)</li>
                    <li>1900 MHz (Band 2, 25)</li>
                    <li>AWS 1700/2100 MHz (Band 4)</li>
                    <li>2600 MHz (Band 7)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Channel Bandwidths</h5>
                  <ul className="mb-0 text-sm">
                    <li>1.4 MHz (6 Resource Blocks)</li>
                    <li>3 MHz (15 Resource Blocks)</li>
                    <li>5 MHz (25 Resource Blocks)</li>
                    <li>10 MHz (50 Resource Blocks)</li>
                    <li>15 MHz (75 Resource Blocks)</li>
                    <li>20 MHz (100 Resource Blocks)</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4 bg-secondary/5">
                  <h5 className="mt-0 mb-2 font-medium">Frame Structure</h5>
                  <ul className="mb-0 text-sm">
                    <li>Frame: 10 ms</li>
                    <li>Subframe: 1 ms (TTI)</li>
                    <li>Slot: 0.5 ms</li>
                    <li>Symbol: 66.7 μs</li>
                    <li>Cyclic Prefix: Normal/Extended</li>
                  </ul>
                </div>
              </div>
              
              <h4>4G Impact and Legacy</h4>
              <p>
                4G LTE transformed mobile communications and enabled new use cases:
              </p>
              <ul>
                <li><strong>Mobile Video:</strong> Enabled high-quality streaming, video conferencing, and live broadcasting</li>
                <li><strong>App Economy:</strong> Boosted the mobile app ecosystem with reliable, fast connectivity</li>
                <li><strong>IoT Foundation:</strong> Early IoT deployments began leveraging LTE networks</li>
                <li><strong>Mobile Broadband:</strong> Made wireless a viable alternative to fixed broadband in many cases</li>
                <li><strong>Reduced Digital Divide:</strong> Brought high-speed internet to areas without fixed infrastructure</li>
                <li><strong>Foundation for 5G:</strong> Many 4G/LTE concepts evolved into 5G technologies</li>
              </ul>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
