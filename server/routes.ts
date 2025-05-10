import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pduSchema, encodePduSchema, satSchema, smppSchema, efSmsSchema } from "@shared/schema";
import { parse7BitCharacters, parseUCS2Characters, parsePDU, encodePDU } from "../client/src/lib/pduUtils";
import { parseSAT } from "../client/src/lib/satUtils";
import { parseSMPP } from "../client/src/lib/smppUtils";
import { parseEFSMS } from "../client/src/lib/efSmsUtils";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Parse SMS PDU
  app.post("/api/parse-pdu", async (req, res) => {
    try {
      const { pduString, pduType } = pduSchema.parse(req.body);
      
      const parsedPDU = parsePDU(pduString, pduType);
      
      return res.json(parsedPDU);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to parse PDU" 
      });
    }
  });
  
  // Encode SMS PDU
  app.post("/api/encode-pdu", async (req, res) => {
    try {
      const pduRequest = encodePduSchema.parse(req.body);
      
      const encodedPDU = encodePDU(
        pduRequest.pduType,
        pduRequest.message,
        pduRequest.recipient,
        pduRequest.smsc,
        pduRequest.encoding,
        pduRequest.statusReport,
        pduRequest.replyPath,
        pduRequest.validityPeriod
      );
      
      return res.json(encodedPDU);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to encode PDU" 
      });
    }
  });

  // Parse SIM Application Toolkit command
  app.post("/api/parse-sat", async (req, res) => {
    try {
      const { pduString } = satSchema.parse(req.body);
      
      const parsedSAT = parseSAT(pduString);
      
      return res.json(parsedSAT);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to parse SIM Application Toolkit command" 
      });
    }
  });

  // Parse SMPP PDU
  app.post("/api/parse-smpp", async (req, res) => {
    try {
      const { pduString } = smppSchema.parse(req.body);
      
      const parsedSMPP = parseSMPP(pduString);
      
      return res.json(parsedSMPP);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to parse SMPP PDU" 
      });
    }
  });
  
  // Parse EF_SMS (SIM card SMS storage format)
  app.post("/api/parse-efsms", async (req, res) => {
    try {
      const { hexData, recordNum } = efSmsSchema.parse(req.body);
      
      const parsedEFSMS = parseEFSMS(hexData, recordNum || 1);
      
      return res.json(parsedEFSMS);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to parse EF_SMS data" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
