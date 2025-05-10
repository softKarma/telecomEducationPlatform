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

// SIM Application Toolkit schema
export const satSchema = z.object({
  pduString: z.string().min(2, "SAT command PDU string is required"),
  commandType: z.enum([
    "refresh",
    "setup-menu",
    "select-item",
    "send-sms",
    "display-text",
    "get-input",
    "setup-call",
    "other"
  ]).default("other")
});

// SMPP Protocol parsing schema
export const smppSchema = z.object({
  pduString: z.string().min(2, "SMPP PDU string is required"),
  pduType: z.enum([
    "submit_sm",
    "deliver_sm",
    "submit_sm_resp",
    "deliver_sm_resp",
    "bind_transmitter",
    "bind_receiver",
    "bind_transceiver",
    "unbind",
    "enquire_link",
    "other"
  ]).default("submit_sm")
});

// EF_SMS (Elementary File SMS) schema
export const efSmsSchema = z.object({
  hexData: z.string().min(2, "EF_SMS hexadecimal data is required"),
  recordNum: z.number().min(1).optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type PDUParseRequest = z.infer<typeof pduSchema>;
export type PDUEncodeRequest = z.infer<typeof encodePduSchema>;
export type SATParseRequest = z.infer<typeof satSchema>;
export type SMPPParseRequest = z.infer<typeof smppSchema>;
export type EFSMSParseRequest = z.infer<typeof efSmsSchema>;

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

// SIM Application Toolkit interfaces
export interface SATHeader {
  commandType: string;
  commandQualifier: string;
  deviceIdentities: {
    source: string;
    destination: string;
  };
  proactiveCommand: boolean;
}

export interface SATParseResult {
  header: SATHeader;
  command: string;
  commandDetails: string;
  properties: PDUField[];
  structureBreakdown: {
    bytes: string[];
    descriptions: string[];
    colors: string[];
    tooltips: string[];
  };
}

// SMPP Protocol interfaces
export interface SMPPHeader {
  commandId: string;
  commandStatus: string;
  sequenceNumber: number;
  commandLength: number;
  commandName: string;
}

export interface SMPPParseResult {
  header: SMPPHeader;
  messageContent?: string;
  sourceAddr?: string;
  destAddr?: string;
  servicetype?: string;
  properties: PDUField[];
  structureBreakdown: {
    bytes: string[];
    descriptions: string[];
    colors: string[];
    tooltips: string[];
  };
}

// EF_SMS Storage interfaces
export interface EFSMSHeader {
  status: string;
  statusDescription: string;
  messageType: string;
  recordNumber: number;
  recordSize: number;
  smsType: string;
}

export interface EFSMSParseResult {
  header: EFSMSHeader;
  pdu?: PDUParseResult;
  message?: string;
  properties: PDUField[];
  structureBreakdown: {
    bytes: string[];
    descriptions: string[];
    colors: string[];
    tooltips: string[];
  };
}
