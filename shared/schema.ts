import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication (if needed later)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// PDU schemas
export const pduSchema = z.object({
  pduString: z.string().min(2, "PDU string is required"),
  pduType: z.enum(["sms-deliver", "sms-submit"]),
});

export const encodePduSchema = z.object({
  pduType: z.enum(["sms-deliver", "sms-submit"]),
  smsc: z.string().optional(),
  recipient: z.string().min(1, "Recipient is required"),
  message: z.string().min(1, "Message is required"),
  statusReport: z.boolean().default(false),
  replyPath: z.boolean().default(false),
  validityPeriod: z.string().optional(),
  encoding: z.enum(["7bit", "8bit", "ucs2"]).default("7bit"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type PDUParseRequest = z.infer<typeof pduSchema>;
export type PDUEncodeRequest = z.infer<typeof encodePduSchema>;

// PDU parse result interfaces
export interface PDUField {
  name: string;
  value: string;
  description: string;
  offset?: number;
  length?: number;
  rawBytes?: string;
}

export interface PDUHeader {
  messageType: string;
  smsc: string;
  sender?: string;
  recipient?: string;
  timestamp?: string;
  encoding: string;
  multipart: boolean;
  multipartInfo?: {
    reference: number;
    totalParts: number;
    partNumber: number;
  };
}

export interface PDUParseResult {
  header: PDUHeader;
  message: string;
  properties: PDUField[];
  hexStructure: {
    offset: string;
    bytes: string;
    description: string;
  }[];
  structureBreakdown: {
    bytes: string[];
    descriptions: string[];
    colors: string[];
    tooltips: string[];
  };
}

export interface PDUEncodeResult {
  pduString: string;
  header: PDUHeader;
  message: string;
  breakdown: PDUField[];
}
