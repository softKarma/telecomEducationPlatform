import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pduSchema, encodePduSchema, satSchema, smppSchema, efSmsSchema } from "@shared/schema";
import { parse7BitCharacters, parseUCS2Characters, parsePDU, encodePDU } from "../client/src/lib/pduUtils";
import { parseSAT } from "../client/src/lib/satUtils";
import { parseSMPP } from "../client/src/lib/smppUtils";
import { parseEFSMS } from "../client/src/lib/efSmsUtils";
import { ZodError } from "zod";
import axios from "axios";
import { exec } from "child_process";

// Define the telecom API response types
interface TelecomResourceItem {
  name: string;
  url: string;
  description: string;
}

interface TelecomResourcesResponse {
  resources: TelecomResourceItem[];
}

interface ScraperRequest {
  url: string;
}

interface ScraperResponse {
  content: string;
  status: string;
  url: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Parse SMS PDU
  app.post("/api/parse-pdu", async (req, res) => {
    try {
      const { pduString, pduType } = pduSchema.parse(req.body);
      
      console.log(`Processing PDU: ${pduString}, type: ${pduType}`);
      
      try {
        const parsedPDU = parsePDU(pduString, pduType);
        return res.json(parsedPDU);
      } catch (parseError) {
        console.error('PDU Parse Error:', parseError);
        if (parseError instanceof Error) {
          console.error(parseError.stack);
        }
        throw parseError;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : "Failed to parse PDU";
      console.error(`Error processing PDU: ${errorMessage}`);
      
      return res.status(400).json({ 
        message: errorMessage 
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

  // Telecom resources API endpoint
  app.get("/api/telecom_resources", async (req, res) => {
    try {
      // Start the Python scraper service if it's not already running
      startPythonScraperIfNeeded();
      
      // Forward the request to the Python service
      const response = await axios.get<TelecomResourcesResponse>("http://localhost:8000/api/telecom_resources");
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching telecom resources:", error);
      res.status(500).json({ 
        error: "Failed to retrieve telecom resources",
        message: "The web scraper service may not be running" 
      });
    }
  });

  // Web scraper API endpoint
  app.post("/api/scrape", async (req: Request, res: Response) => {
    try {
      const scraperRequest = req.body as ScraperRequest;
      
      // Input validation
      if (!scraperRequest.url || !scraperRequest.url.startsWith("http")) {
        return res.status(400).json({ error: "Invalid URL. Please provide a valid URL starting with http or https." });
      }

      // Start the Python scraper service if it's not already running
      startPythonScraperIfNeeded();
      
      // Forward the request to the Python service
      const response = await axios.post<ScraperResponse>(
        "http://localhost:8000/api/scrape", 
        scraperRequest
      );
      
      res.json(response.data);
    } catch (error) {
      console.error("Error scraping content:", error);
      res.status(500).json({ 
        error: "Failed to scrape content",
        message: "The web scraper service may not be running or the URL may be invalid"
      });
    }
  });
  
  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to start the Python scraper service
function startPythonScraperIfNeeded() {
  // Check if the service is already running
  exec("pgrep -f 'python web_scraper.py'", (error, stdout, stderr) => {
    if (error || !stdout) {
      console.log("Starting Python web scraper service...");
      // Start the service if it's not running
      exec("python web_scraper.py &", (error, stdout, stderr) => {
        if (error) {
          console.error("Failed to start web scraper service:", error);
        } else {
          console.log("Web scraper service started");
        }
      });
    }
  });
}
