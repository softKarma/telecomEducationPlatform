import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PDUEncodeResult } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Copy } from "lucide-react";

export default function PDUEncoder() {
  const [pduType, setPduType] = useState<"sms-deliver" | "sms-submit">("sms-submit");
  const [smsc, setSmsc] = useState<string>("+31624000000");
  const [recipient, setRecipient] = useState<string>("+31641600986");
  const [message, setMessage] = useState<string>("Hello world");
  const [statusReport, setStatusReport] = useState<boolean>(false);
  const [replyPath, setReplyPath] = useState<boolean>(false);
  const [validityPeriod, setValidityPeriod] = useState<string>("none");
  const [encoding, setEncoding] = useState<"7bit" | "8bit" | "ucs2">("7bit");
  const [clipboardStatus, setClipboardStatus] = useState<"idle" | "copied">("idle");

  // Calculate character counts and message parts
  const getCharacterInfo = () => {
    const length = message.length;
    let maxCharsPerMessage = 160;
    let maxCharsPerPart = 153;
    
    if (encoding === "8bit") {
      maxCharsPerMessage = 140;
      maxCharsPerPart = 134;
    } else if (encoding === "ucs2") {
      maxCharsPerMessage = 70;
      maxCharsPerPart = 67;
    }
    
    const parts = length <= maxCharsPerMessage ? 1 : Math.ceil(length / maxCharsPerPart);
    
    return {
      chars: length,
      parts,
      maxCharsPerMessage
    };
  };
  
  const charInfo = getCharacterInfo();

  // PDU Encode mutation
  const { mutate: encodePdu, data: encodedData, isPending, isError, error } = useMutation({
    mutationFn: async (data: {
      pduType: "sms-deliver" | "sms-submit";
      smsc?: string;
      recipient: string;
      message: string;
      statusReport: boolean;
      replyPath: boolean;
      validityPeriod?: string;
      encoding: "7bit" | "8bit" | "ucs2";
    }) => {
      const response = await apiRequest("POST", "/api/encode-pdu", data);
      return response.json() as Promise<PDUEncodeResult>;
    }
  });

  // Handle encode button click
  const handleEncode = () => {
    if (recipient.trim() && message.trim()) {
      encodePdu({
        pduType,
        smsc: smsc.trim() || undefined,
        recipient: recipient.trim(),
        message: message.trim(),
        statusReport,
        replyPath,
        validityPeriod: validityPeriod === "none" ? undefined : validityPeriod,
        encoding
      });
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
            <h2 className="text-lg font-medium mb-4">Create SMS PDU</h2>
            
            {/* PDU Type Selection */}
            <div className="mb-4">
              <Label className="block text-sm font-medium mb-1">PDU Type</Label>
              <RadioGroup 
                value={pduType} 
                onValueChange={(value) => setPduType(value as "sms-deliver" | "sms-submit")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms-submit" id="r1" />
                  <Label htmlFor="r1">SMS-SUBMIT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms-deliver" id="r2" />
                  <Label htmlFor="r2">SMS-DELIVER</Label>
                </div>
              </RadioGroup>
            </div>

            {/* SMS Configuration */}
            <div className="space-y-4">
              {/* Service Center */}
              <div>
                <Label htmlFor="smsc" className="block text-sm font-medium mb-1">
                  Service Center (SMSC)
                </Label>
                <Input
                  id="smsc"
                  value={smsc}
                  onChange={(e) => setSmsc(e.target.value)}
                  placeholder="+31624000000"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave empty to use default SMSC
                </p>
              </div>

              {/* Recipient */}
              <div>
                <Label htmlFor="recipient" className="block text-sm font-medium mb-1">
                  {pduType === "sms-submit" ? "Recipient" : "Sender"} Number
                </Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="+31641600986"
                />
              </div>

              {/* Message Options */}
              <div>
                <Label className="block text-sm font-medium mb-2">Message Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="status-report" 
                      checked={statusReport}
                      onCheckedChange={(checked) => setStatusReport(checked as boolean)}
                    />
                    <Label htmlFor="status-report" className="text-sm font-normal">
                      Request Status Report
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reply-path" 
                      checked={replyPath}
                      onCheckedChange={(checked) => setReplyPath(checked as boolean)}
                    />
                    <Label htmlFor="reply-path" className="text-sm font-normal">
                      Reply Path
                    </Label>
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              {pduType === "sms-submit" && (
                <div>
                  <Label htmlFor="validity" className="block text-sm font-medium mb-1">
                    Validity Period
                  </Label>
                  <Select value={validityPeriod} onValueChange={setValidityPeriod}>
                    <SelectTrigger id="validity">
                      <SelectValue placeholder="Not specified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      <SelectItem value="12h">12 hours</SelectItem>
                      <SelectItem value="1d">1 day</SelectItem>
                      <SelectItem value="3d">3 days</SelectItem>
                      <SelectItem value="1w">1 week</SelectItem>
                      <SelectItem value="max">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Data Coding Scheme */}
              <div>
                <Label htmlFor="dcs" className="block text-sm font-medium mb-1">
                  Character Encoding
                </Label>
                <Select value={encoding} onValueChange={(value) => setEncoding(value as "7bit" | "8bit" | "ucs2")}>
                  <SelectTrigger id="dcs">
                    <SelectValue placeholder="GSM 7-bit (standard)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7bit">GSM 7-bit (standard)</SelectItem>
                    <SelectItem value="8bit">8-bit data (binary)</SelectItem>
                    <SelectItem value="ucs2">UCS2 (unicode)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message Content */}
              <div>
                <Label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message Content
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message text"
                  className="resize-none"
                />
                <div className="mt-1 flex justify-between items-center">
                  <div className="text-xs">
                    <span>{charInfo.chars}</span> characters,
                    <span className={charInfo.parts > 1 ? "text-amber-500 font-semibold" : ""}> {charInfo.parts}</span> message(s)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Max: <span>{charInfo.maxCharsPerMessage}</span> chars/SMS
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              className="w-full mt-4" 
              onClick={handleEncode}
              disabled={isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {isPending ? "Generating..." : "Generate PDU"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="lg:col-span-7">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">Generated PDU</h2>

            {encodedData ? (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">PDU String</h3>
                  <div className="relative">
                    <div className="bg-muted/50 border rounded-md p-3 font-mono text-sm break-all mb-1">
                      <span>{encodedData.pduString}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-8 w-8"
                      onClick={() => copyToClipboard(encodedData.pduString)}
                    >
                      {clipboardStatus === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hexadecimal representation of the SMS PDU
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">PDU Information</h3>
                  
                  <div className="mb-4 p-3 bg-muted/50 border rounded-md">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">Message Type:</td>
                          <td className="pb-1 font-medium">{encodedData.header.messageType.toUpperCase()}</td>
                        </tr>
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">SMSC:</td>
                          <td className="pb-1 font-medium">{encodedData.header.smsc}</td>
                        </tr>
                        {encodedData.header.recipient && (
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Recipient:</td>
                            <td className="pb-1 font-medium">{encodedData.header.recipient}</td>
                          </tr>
                        )}
                        {encodedData.header.sender && (
                          <tr>
                            <td className="pb-1 pr-3 text-muted-foreground">Sender:</td>
                            <td className="pb-1 font-medium">{encodedData.header.sender}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">Protocol ID:</td>
                          <td className="pb-1 font-medium">0x00 (Standard SMS)</td>
                        </tr>
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">Data Coding:</td>
                          <td className="pb-1 font-medium">{encodedData.header.encoding}</td>
                        </tr>
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">Message Length:</td>
                          <td className="pb-1 font-medium">{encodedData.message.length} characters</td>
                        </tr>
                        <tr>
                          <td className="pb-1 pr-3 text-muted-foreground">Message:</td>
                          <td className="pb-1 font-medium">{encodedData.message}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Structure Breakdown</h3>
                    <div className="overflow-x-auto border rounded-md p-3 bg-muted/50">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-left border-b">
                            <th className="pb-2">Octets</th>
                            <th className="pb-2">Value</th>
                            <th className="pb-2">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {encodedData.breakdown.map((field, index) => (
                            <tr key={index}>
                              <td className="py-2 font-medium">{index + 1}</td>
                              <td className="py-2 font-mono">{field.rawBytes || field.value}</td>
                              <td className="py-2">{field.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                <h3 className="text-lg font-medium">No PDU Generated Yet</h3>
                <p className="text-muted-foreground mt-2">
                  Configure message settings and click "Generate PDU" to create a PDU string.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
