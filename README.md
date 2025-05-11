# SMS PDU Toolkit

A comprehensive web-based toolkit for parsing, encoding, and analyzing SMS Protocol Data Units (PDUs) and related telecom protocols.

![SMS PDU Toolkit Logo](generated-icon.png)

## Overview

SMS PDU Toolkit is designed for telecom professionals, developers, and educators who need to work with SMS PDUs and related protocols. This tool provides an interactive interface for:

- Parsing and encoding SMS PDUs (SMS-DELIVER and SMS-SUBMIT formats)
- Analyzing SIM Application Toolkit (SAT) commands
- Decoding Short Message Peer-to-Peer (SMPP) protocol messages
- Examining SIM card storage format (EF_SMS) records
- Comprehensive visualization and educational resources

The toolkit supports multiple character encodings (GSM 7-bit, 8-bit, UCS2), multipart messages, and provides detailed byte-by-byte breakdowns of all protocol structures.

## Features

### SMS PDU Parser & Encoder
- Full support for SMS-DELIVER and SMS-SUBMIT message types
- Multiple character encoding support (GSM 7-bit, 8-bit, UCS2)
- Multipart message handling
- Detailed field-by-field breakdown
- Visual byte representation with tooltips

### SIM Application Toolkit Parser
- Comprehensive support for SAT commands as defined in 3GPP TS 31.111 and ETSI TS 102 223
- 20+ example commands for testing and learning
- Detailed tag parsing and visualization
- Support for multiple device identities and command types

### SMPP Protocol Decoder
- Analysis of SMPP PDUs for SMS center communications
- Command identification and parameter extraction
- Structured visualization of SMPP messages

### EF_SMS (SIM Storage) Decoder
- Parsing of SMS messages stored on SIM cards
- Status identification (read, unread, sent, empty)
- Combined visualization of storage format and contained PDU

### Educational Resources
- Comprehensive documentation of SMS formats and encodings
- Interactive learning materials
- Technical references to standards

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query
- **Backend**: Express.js
- **Build Tools**: Vite

## Installation

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sms-pdu-toolkit.git
   cd sms-pdu-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### SMS PDU Parser

1. Select the PDU type (SMS-DELIVER or SMS-SUBMIT)
2. Enter or paste a hexadecimal PDU string
3. Click "Parse PDU"
4. View the decoded information, including header details, message content, and byte-by-byte breakdown

### SMS PDU Encoder

1. Fill in the required fields (SMSC, recipient/sender, message text)
2. Select encoding and options
3. Click "Encode PDU"
4. View the generated PDU string and its detailed structure

### SIM Application Toolkit Parser

1. Choose an example SAT command or enter your own hexadecimal SAT PDU
2. Click "Parse SAT Command"
3. Explore the command structure, including command type, parameters, and data

### SMPP Parser

1. Enter an SMPP PDU string
2. Click "Parse SMPP"
3. View the decoded command, parameters, and structure

### EF_SMS Parser

1. Enter an EF_SMS record data in hexadecimal
2. Specify the record number
3. Click "Parse EF_SMS"
4. View the status information and contained SMS PDU details

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory that can be deployed to any web server.

## Deployment

The application can be deployed on any static web server or Node.js hosting environment.

For a simple static deployment (after building):

```bash
npm install -g serve
serve -s dist
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the toolkit.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on 3GPP TS 23.040 specification for SMS
- References ETSI TS 101 267 and 3GPP TS 31.111 for SIM Application Toolkit
- SMPP protocol based on SMPP v3.4 specification