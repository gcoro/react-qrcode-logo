# Changelog

## Unreleased
###Features
Added new optional prop `padding`, to specify a circular pattern for the QR Code parts.

###Fixes
Fixed padding that was applied in percentage, and leaded to incorrect values sometimes.

## [v2.1.0]
###Features
Made CORS optional, by adding a new prop `enableCORS`.

## [v2.0.1]
###Fixes
Enabled CORS for logo image.

## [v2.0.0]
###Refactor
Replaced the package used to implement the QRCode, from `qr.js` to `qrcode-generator`.

## [v1.0.0] 
First version with base functionalities.
