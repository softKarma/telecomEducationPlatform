# Example PDUs for Testing

This document provides example PDUs for testing each component of the SMS PDU Toolkit, along with explanations of what each example represents.

## SMS PDUs

### SMS-DELIVER Examples

#### Basic 7-bit GSM Message
```
07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07
```
- SMSC: +31624000000
- Sender: +31641600986
- Timestamp: 2002-06-28 19:37:41 (+02:00)
- Message: "How are you?"
- Encoding: GSM 7-bit

#### UCS2 (Unicode) Message
```
07911326040000F0040B911346610089F600082180214155840018D4F29C0E6A96E7F3F0B90C0A07D9D76D3D3739CC2E83C661757A0C0EB3D3
```
- SMSC: +31624000000
- Sender: +31641600986
- Timestamp: 2012-08-01 14:55:48 (+02:00)
- Message: Contains non-ASCII characters (Unicode text)
- Encoding: UCS2 (16-bit)

#### Concatenated (Multipart) Message
```
07911326040000F0440B911346610089F60000208062917314230A0B05040B8423F01906070301049BDA02
```
- SMSC: +31624000000
- Sender: +31641600986
- Timestamp: 2002-06-28 19:37:41 (+02:00)
- Message: Part 1 of a multipart message
- Contains User Data Header (UDH) for multipart information

### SMS-SUBMIT Examples

#### Basic Message
```
07911326040000F001000B911346610089F600000CC8329BFD06DDDF723619
```
- SMSC: +31624000000
- Recipient: +31641600986
- Message: "Hello world!"
- Encoding: GSM 7-bit

#### Long Message (Multipart)
```
0041010B915121551532F400036A0202018D4F29C0E6A97E7F3F0B90C92A3C3D46D341EDFB71E440FA9D4607D9E37450BB3C0FA9CFE971
```
- No SMSC (to be provided by phone)
- Recipient: +15125515234
- Contains User Data Header for multipart message
- This is part 2 of a 2-part message
- Encoding: UCS2 (16-bit)

#### With Validity Period
```
07911326040000F011000B911346610089F60000AA08C8329BFD06DDDF723619
```
- SMSC: +31624000000
- Recipient: +31641600986
- Message: "Hello world!"
- Contains a validity period of 1 day
- Encoding: GSM 7-bit

## SIM Application Toolkit (SAT) Commands

### Display Text Command
```
D0288103012180820281028D1A04546869732069732061207465737420746578742E2020202020
```
- Command: DISPLAY TEXT
- Source: UICC (SIM card)
- Destination: Terminal (phone)
- Text: "This is a test text."
- Immediate response required

### Select Menu Command
```
D03881030125008202818285096D61696E206D656E75860204F1860304F28604054C6F63616C860605536574757087050104000016180402
```
- Command: SET UP MENU
- Source: UICC
- Destination: Terminal
- Menu title: "main menu"
- Multiple menu items with identifiers
- Next action indicators included

### Send SMS Command
```
D0268103011380820281838B1904098156050005F0240A00F5A76173746520636865636B
```
- Command: SEND SMS
- Source: UICC
- Destination: Network
- Contains an SMS TPDU (Transport Protocol Data Unit)
- SMS message content: "waste check"

### Setup Call Command
```
D036810301108082028183050A43616C6C696E672E2E2E860608912143658709910600150005F06024069362537396332C371
```
- Command: SET UP CALL
- Source: UICC
- Destination: Network
- Alpha identifier: "Calling..."
- Phone number to call: +12345678901
- User confirmation required

### Get Input Command
```
D0388103012380820281028D0B04456E7465722050494E3A8F0101CD020200C50112C60101C7020118C8020118DA0101DB0101DC01019000
```
- Command: GET INPUT
- Source: UICC
- Destination: Terminal
- Text: "Enter PIN:"
- Input type: Numeric
- Minimum length: 1
- Maximum length: 8
- PIN input is masked

## SMPP Protocol

### SMPP Submit_SM (Submit Short Message)
```
0000003D00000004000000000000000100010134363730313030303030370001013436373031323334353600000000000000000100047465737400
```
- Command length: 61 bytes
- Command ID: 0x00000004 (submit_sm)
- Command status: 0x00000000 (ESME_ROK - success)
- Source address: 46701000007
- Destination address: 46701234567
- Message: "test"
- No optional parameters

### SMPP Deliver_SM (Deliver Short Message)
```
0000004D00000005000000000000000100010134363730313030303030370001013436373031323334353600000000000000000100047465737421020006536D73635F69640000
```
- Command length: 77 bytes
- Command ID: 0x00000005 (deliver_sm)
- Command status: 0x00000000 (ESME_ROK - success)
- Source address: 46701000007
- Destination address: 46701234567
- Message: "test!"
- Optional parameter: SMSC ID

### SMPP Bind_Transmitter
```
00000023000000020000000000000001534D50504B696E670000343536370000000000000034000000
```
- Command length: 35 bytes
- Command ID: 0x00000002 (bind_transmitter)
- Command status: 0x00000000 (ESME_ROK - success)
- System ID: "SMPPKing"
- Password: "4567"
- System type: ""
- Interface version: 0x34 (SMPP version 3.4)

## EF_SMS (SIM Card Storage)

### Unread Message
```
03071155247010F5400850180C0B05040B8423F019060703010402D937
```
- Status: 0x03 (Message received, to be read)
- TPDU: SMS-DELIVER message without SMSC info
- PDU type: SMS-DELIVER
- Sender: +15247010504
- Message: Part of a multipart message

### Read Message
```
010C91455245F61400080C0500036D7B83C8E5A3C3
```
- Status: 0x01 (Message received, read)
- TPDU: SMS-DELIVER message without SMSC info
- PDU type: SMS-DELIVER
- Sender: +441255641040
- Timestamp: included in the TPDU
- Message: "Hello"

### Message To Be Sent
```
07110011000C9124303932F500000BF4F29C0E4ACF416110BD3CA783DAF5340B
```
- Status: 0x07 (Message to be sent)
- TPDU: SMS-SUBMIT message without SMSC info
- PDU type: SMS-SUBMIT
- Recipient: +42939502
- Message: "Test message"

### Empty Record
```
00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
```
- Status: 0x00 (Empty record)
- Remaining bytes are padding (0xFF)

## Using These Examples

To use these examples in the SMS PDU Toolkit:

1. Copy the hexadecimal string (without any spaces or line breaks)
2. Paste it into the appropriate input field in the application
3. Select the correct format or message type if necessary
4. Click the "Parse" button

The application will decode the example and display its structure and content in the results panel.