# Changelog

## [v3.0.0]

### Fixes

- Removed use of `ReactDOM.findDOMNode`, which has been deprecated in React 18, and removed in React 19.

### Features

- Added `download` function to save the QRCode as image.
- Added optional `style` prop to pass CSS to the canvas.
- `logoOnLoad` callback now also returns the event details.

## [v2.10.0]

### Features

- Added new `qrStyle`: `fluid`.

## [v2.9.0]

### Features

- Added new optional prop `logoPadding` to specify optional padding around the logo.
- Added new optional prop `logoPaddingStyle` to specify the shape of the logo padding (rectangular with 'square' or elliptic with 'circle').

### Changes

- Prop `removeQrCodeBehindLogo` does not have a default padding anymore, but has the same size as the logo.

## [v2.8.0]

### Features

- Added new optional prop `eyeColor` to specify different colors for the positional patterns.

## [v2.7.0]

### Features

- Added optional prop `removeQrCodeBehindLogo`, if set to true will draw an empty square around the logo.

## [v2.6.0]

### Features

- Added optional prop `id` to specify the id of the canvas element.

## [v2.5.0]

### Features

- Added new optional prop `eyeRadius` to specify the corner radius for the positional patterns.

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
