# Changelog

## [v2.2.1]
### Fixes
- Changed `quietZone` implementation so that it's included directly in the canvas, instead of just an HTML padding. This fixes the issue that caused the QR Code to appear without the quiet zone when it got saved.

## [v2.2.0]
### Features
- Added new optional prop `qrStyle` ('squares' | 'dots'), to specify a different pattern for the QR Code main part.

### Changes
- Changed the prop name `padding` to `quietZone`, for a clearer naming. The purpose of this prop is to define the width of the quiet zone around the QR Code, which a part of the QR Code needed by the scanner to distinguish the QRCode from the surroundings.
- Removed prop `style`.

### Fixes
- Fixed padding/quietZone value which was applied in percentage, and leaded to incorrect values sometimes.

## [v2.1.0]
### Features
- Made CORS optional, by adding a new prop `enableCORS`.

## [v2.0.1]
### Fixes
- Enabled CORS for logo image.

## [v2.0.0]
### Refactor
- Replaced the package used to implement the QRCode, from `qr.js` to `qrcode-generator`.

## [v1.0.0] 
- First version.
