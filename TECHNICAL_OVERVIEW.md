# Technical Overview: SMS PDU Toolkit

This document provides a technical overview of the protocols implemented in the SMS PDU Toolkit and how they relate to each other in the telecom ecosystem.

## Protocol Relationships

The SMS PDU Toolkit covers several interconnected protocols used in mobile telecommunications:

```
                                ┌─────────────────┐
                                │                 │
                                │  Mobile Network │
                                │                 │
                                └────────┬────────┘
                                         │
                                         ▼
┌────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│                │            │                 │            │                 │
│  SIM Card      │◄──────────►│  Mobile Device  │◄──────────►│  SMS Center     │
│  (EF_SMS)      │            │  (SAT)          │            │  (SMPP)         │
│                │            │                 │            │                 │
└────────────────┘            └─────────────────┘            └─────────────────┘
         ▲                             ▲                              ▲
         │                             │                              │
         └─────────────────────────────┼──────────────────────────────┘
                                       │
                                       ▼
                               ┌─────────────────┐
                               │                 │
                               │  SMS PDUs       │
                               │                 │
                               └─────────────────┘
```

## 1. SMS PDUs (Protocol Data Units)

SMS PDUs are the core format for encoding SMS messages as defined in 3GPP TS 23.040. There are multiple PDU types, with the two most common being:

### SMS-SUBMIT (Mobile Originating)
- Sent from the mobile device to the SMS center
- Contains recipient address, message content, and options
- Structure:
  - SMSC information
  - First octet (flags)
  - Message reference
  - Destination address
  - Protocol identifier
  - Data coding scheme
  - Validity period (optional)
  - User data length
  - User data (message content)

### SMS-DELIVER (Mobile Terminating)
- Sent from the SMS center to the mobile device
- Contains sender address, message content, and timestamp
- Structure:
  - SMSC information
  - First octet (flags)
  - Originating address
  - Protocol identifier
  - Data coding scheme
  - Service center timestamp
  - User data length
  - User data (message content)

### Character Encodings
SMS PDUs support multiple character encodings:
- GSM 7-bit (default alphabet)
- 8-bit data
- UCS2 (16-bit Unicode)

### Implemented in
- `client/src/lib/pduUtils.ts` - Core PDU parsing and encoding functions
- `client/src/components/PDUParser.tsx` - UI for parsing PDUs
- `client/src/components/PDUEncoder.tsx` - UI for encoding PDUs

## 2. SIM Application Toolkit (SAT)

SIM Application Toolkit is a standard interface that allows the SIM card to initiate commands and interact with the mobile device. Defined in ETSI TS 101 267 and 3GPP TS 31.111.

### Command Structure
- Proactive command tag (0xD0)
- Command length
- Command details TLV (Tag-Length-Value)
- Device identities TLV
- Command-specific TLVs

### Common Commands
- DISPLAY TEXT - Show text on the device screen
- SELECT ITEM - Present a menu of options
- GET INPUT - Request text input from user
- SET UP CALL - Initiate a phone call
- SEND SMS - Send an SMS message
- LAUNCH BROWSER - Open a URL in the browser
- PLAY TONE - Play audio alerts

### Implemented in
- `client/src/lib/satUtils.ts` - SAT parsing functions
- `client/src/components/SATParser.tsx` - UI for parsing SAT commands

## 3. Short Message Peer-to-Peer (SMPP)

SMPP is the protocol used between SMS centers (SMSCs) and external messaging entities. It's defined in the SMPP v3.4 specification.

### PDU Structure
- Command Length
- Command ID
- Command Status
- Sequence Number
- Command-specific parameters

### Common Operations
- submit_sm - Submit an SMS message for delivery
- deliver_sm - Deliver an SMS message to an application
- query_sm - Query the status of a message
- cancel_sm - Cancel a pending message
- replace_sm - Replace the content of a message

### Implemented in
- `client/src/lib/smppUtils.ts` - SMPP parsing functions
- `client/src/components/SMPPParser.tsx` - UI for parsing SMPP PDUs

## 4. Elementary File for SMS (EF_SMS)

EF_SMS is the file structure used on SIM cards to store SMS messages. Each record in the EF_SMS file contains status information and an SMS-DELIVER or SMS-SUBMIT PDU.

### Record Structure
- Status byte (indicating read/unread/sent/empty)
- SMS PDU (TPDU) without the SMSC information
- Padding bytes

### Status Values
- 0x01: Message received by MS from network; message read
- 0x03: Message received by MS from network; message to be read
- 0x05: Message sent from MS to network; message sent
- 0x07: Message sent from MS to network; message to be sent
- 0x00: Empty record

### Implemented in
- `client/src/lib/efSmsUtils.ts` - EF_SMS parsing functions
- `client/src/components/EFSMSParser.tsx` - UI for parsing EF_SMS records

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

1. **Utility Modules** - Core parsing and encoding logic for each protocol
   - Each protocol has its own utility file with specialized functions

2. **UI Components** - React components for user interaction
   - Each protocol has a dedicated parser/encoder component
   - Shared UI elements (buttons, fields, etc.) from shadcn/ui

3. **API Layer** - Express.js backend that exposes endpoints for each parsing/encoding operation
   - Routes defined in `server/routes.ts`
   - API calls managed with React Query

4. **State Management** - Leverages React Query for API state management
   - Local component state for form inputs and UI state

5. **Data Models** - TypeScript interfaces define data structures
   - Shared schemas in `shared/schema.ts`

## Performance Considerations

- Byte-level operations are performance-intensive
- Large PDUs with complex structures may require optimization
- The application handles all parsing client-side to reduce server load

## Security Considerations

- Input validation for hexadecimal strings prevents injection attacks
- Proper error handling prevents application crashes on malformed input