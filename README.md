# react-qrcode-logo
Typescript React component to generate a customizable QR Code.

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

## Props
| Prop        | Type                                  | Default value        | Description    |
| ------------|---------------------------------------| ---------------------|-----|
| `value`       | `string`                                | `https://reactjs.org/` | The value encoded in the QR Code. When the QR Code is decoded, this value will be returned |
| `ecLevel`        | `L` &#124; `M` &#124; `Q` &#124; `H`              |   `M`              | The error correction level of the QR Code |
| `enableCORS`         | `boolean`                 |   `false`              | Enable crossorigin attribute |
| `size`        | `number` (in pixels)                    |   `150`                | The size of the QR Code |
| `quietZone`     | `number` (in pixels)                    |   `10`                 | The size of the quiet zone around the QR Code. This will have the same color as QR Code bgColor |
| `bgColor`     | `string` (css color)                    | `#FFFFFF`              | Background color |
| `fgColor`     | `string` (css color)                    | `#000000`              | Foreground color |
| `logoImage`   | `string` (src attribute)                |                      | The logo image. It can be a url/path or a base64 value |
| `logoWidth`   | `number` (in pixels)                    | `size * 0.2`           | Logo image width |
| `logoHeight`  | `number` (in pixels)                    | `logoWidth`                     | Logo image height |
| `logoOpacity` | `number` (css opacity 0 <= x <= 1)      | `1`                    | Logo opacity. This allows you to modify the transparency of your logo, so that it won't compromise the readability of the QR Code |
| `qrStyle` | `squares` &#124; `dots` | `squares`  | Style of the QR Code modules |

## Credits 
This package was inspired by [cssivision/qrcode-react](https://github.com/cssivision/qrcode-react) and [zpao/qrcode.react](https://github.com/zpao/qrcode.react). Also looked up some parts from [kazuhikoarase/qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (which this package depends on). 

## Contributing
PR's are welcome. Thanks to everyone who contributed :)
