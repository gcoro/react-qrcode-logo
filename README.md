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
| Prop        | Type                                  | Default value        | Description    |
| ------------|---------------------------------------| ---------------------|-----|
| `value`       | `string`                                | https://reactjs.org/ | The value encoded in the QR Code. When the QR is decoded, this value will be returned |
| `size`        | `number` (in pixels)                    |   150                | The size of the canvas. Note that in this size is included both the QR Code size itself and the padding aound it |
| `padding`     | `number` (in pixels)                    |   10                 | The padding around the QR Code |
| `bgColor`     | `string` (css color)                    | #FFFFFF              | Backgound color |
| `fgColor`     | `string` (css color)                    | #000000              | Foreground color |
| `logoImage`   | `string` (src attribute)                |                      | The logo image. It can be a url/path or a base64 value |
| `logoWidth`   | `number` (in pixels)                    | `size` * 0.2           | Logo image width |
| `logoHeight`  | `number` (in pixels)                    | `logoWidth`                     | Logo image height |
| `logoOpacity` | `number` (css opacity 0 <= x <= 1)      | 1                    | Logo opacity. This allows you to modify the transparency of your logo, so that it won't compromise the readability of the QR Code |
| `style`       | `Object` (css style properties) |  { height: `size`, width: `size`, padding: `padding`, bgColor: `bgColor`} | You can specify an object with any css style properties you want to add to the canvas. The properties you specify will override the default ones | 
