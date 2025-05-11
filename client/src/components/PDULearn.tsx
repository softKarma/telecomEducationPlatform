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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
