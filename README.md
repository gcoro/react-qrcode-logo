# react-qrcode-logo
Typescript React component to generate a customizable QR Code. Based on [cssivision/qrcode-react](https://github.com/cssivision/qrcode-react).

## Installation

```
npm install --save react-qrcode-logo
```
## Usage 

```
import * as React from 'react';
import { QRCode } from 'react-qrcode-logo';

React.render(
  <QRCode value="https://github.com/gcoro/react-qrcode-logo" />,
  mountNode
);
```

## Avaiable Props
| Prop        | Type                                  | Default value        |
| ------------|---------------------------------------| ---------------------|
| value       | string                                | https://reactjs.org/ |
| size        | number (in pixels)                    |   150                |
| padding     | number (in pixels)                    |   10                 |
| bgColor     | string (css color)                    | #FFFFFF              |
| fgColor     | string (css color)                    | #000000              |
| logoImage   | string (src attribute)                ||
| logoWidth   | number (in pixels)                    ||
| logoHeight  | number (in pixels)                    ||
| logoOpacity | number (css opacity 0 < x < 1)        | 1|
| style       | Object (add any css style properties) ||
