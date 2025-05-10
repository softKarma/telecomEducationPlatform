import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pduSchema, encodePduSchema } from "@shared/schema";
import { parse7BitCharacters, parseUCS2Characters, parsePDU, encodePDU } from "../client/src/lib/pduUtils";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Parse PDU
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
  
  // Encode PDU
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

  const httpServer = createServer(app);

  return httpServer;
}
