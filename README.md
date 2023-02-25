# react-qrcode-logo
Typescript React component to generate a customizable QR Code.

<div style="display: flex; flex-direction: row;">
	<img src="res/qrcode-react.png" height="256" width="256">
	<img src="res/qrcode-mikuv3.png" height="256" width="256">
	<img src="res/qrcode-ts.png" height="256" width="256">
</div>

## Installation

```bash
npm install --save react-qrcode-logo
```
## Usage

```javascript
import * as React from 'react';
import { QRCode } from 'react-qrcode-logo';

React.render(
  <QRCode value="https://github.com/gcoro/react-qrcode-logo" />,
  mountNode
);
```

## Props
| Prop                     | Type                                | Default value       | Description                                                                                                                        |
|--------------------------|-------------------------------------| --------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `value`                  | `string`                            | `https://reactjs.org/` | The value encoded in the QR Code. When the QR Code is decoded, this value will be returned                                         |
| `ecLevel`                | `L` &#124; `M` &#124; `Q` &#124; `H` |   `M`              | The error correction level of the QR Code                                                                                          |
| `enableCORS`             | `boolean`                           |   `false`           | Enable crossorigin attribute                                                                                                       |
| `size`                   | `number` (in pixels)                |   `150`             | The size of the QR Code                                                                                                            |
| `quietZone`              | `number` (in pixels)                |   `10`              | The size of the quiet zone around the QR Code. This will have the same color as QR Code bgColor                                    |
| `bgColor`                | `string` (css color)                | `#FFFFFF`           | Background color                                                                                                                   |
| `fgColor`                | `string` (css color)                | `#000000`           | Foreground color                                                                                                                   |
| `logoImage`              | `string` (src attribute)            |                     | The logo image. It can be a url/path or a base64 value                                                                             |
| `logoWidth`              | `number` (in pixels)                | `size * 0.2`        | Logo image width                                                                                                                   |
| `logoHeight`             | `number` (in pixels)                | `logoWidth`                  | Logo image height                                                                                                                  |
| `logoOpacity`            | `number` (css opacity 0 <= x <= 1)  | `1`                 | Logo opacity. This allows you to modify the transparency of your logo, so that it won't compromise the readability of the QR Code  |
| `logoOnLoad`             | `() => void`                        |                     | Callback function to know when the logo in the QR Code is loaded                                                                     |
| `removeQrCodeBehindLogo` | `boolean`                           |   `false`           | Removes points behind the logo. If no logoPadding is specified, the removed part will have the same size as the logo                                                    |
| `logoPadding`            | `number`                            |                     | Adds a border with no points around the logo. When > 0, the padding will be visible even if the prop removeQrCodeBehindLogo is not set to true                                                    |
| `logoPaddingStyle`            | `square` &#124; `circle`        | `square`     | Sets the shape of the padding area around the logo                                                     |
| `qrStyle`                | `squares` &#124; `dots`             | `squares`  | Style of the QR Code modules                                                                                                       |
| `eyeRadius`              | `CornerRadii` &#124; `CornerRadii[]` |  | The corner radius for the positional patterns (the three "eyes" around the QR code). [See more details here](res/eyeRadius_doc.md) |
| `eyeColor`               | `EyeColor` &#124; `EyeColor[]`      |  | The color for the positional patterns (the three "eyes" around the QR code). [See more details here](res/eyeColor_doc.md)          |
| `id`                     | `string`                            | `react-qrcode-logo` | Optional custom id for the QRCode canvas. You can use this prop if you have multiple QRCodes and need to differentiate them        |

## Usage example
You can find a very simple demo project [here](https://github.com/gcoro/QRCodeCustomizer).

## Contributing
PRs and suggestions are welcome.
When making a pull request, please explain in a clear way the changes you made and why you are making them (+ if you can also update the README accordingly, ty <3). 
Also try keep the current repo codestyle (eg. do not reformat all the code with prettier).

Thanks to everyone who contributed and/or will contribute :)

<table>
<tr><td align="center" valign="top">
			<a href="https://github.com/gcoro">
			<img src="https://avatars.githubusercontent.com/u/37499369?v=4" width="60px;" alt="gcoro" /><br />
			<sup><b>gcoro</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/jgillick">
			<img src="https://avatars.githubusercontent.com/u/35894?v=4" width="60px;" alt="jgillick" /><br />
			<sup><b>jgillick</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/dos1in">
			<img src="https://avatars.githubusercontent.com/u/981214?v=4" width="60px;" alt="dos1in" /><br />
			<sup><b>dos1in</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/halitogunc">
			<img src="https://avatars.githubusercontent.com/u/13641726?v=4" width="60px;" alt="halitogunc" /><br />
			<sup><b>halitogunc</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/qwei-1874">
			<img src="https://avatars.githubusercontent.com/u/13930277?v=4" width="60px;" alt="qwei-1874" /><br />
			<sup><b>qwei-1874</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/Trexy94">
			<img src="https://avatars.githubusercontent.com/u/16225761?v=4" width="60px;" alt="Trexy94" /><br />
			<sup><b>Trexy94</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/ty-everett">
			<img src="https://avatars.githubusercontent.com/u/23272461?v=4" width="60px;" alt="ty-everett" /><br />
			<sup><b>ty-everett</b></sup></a><br />
			</td><td align="center" valign="top">
			<a href="https://github.com/larstel">
			<img src="https://avatars.githubusercontent.com/u/45731552?v=4" width="60px;" alt="larstel" /><br />
			<sup><b>larstel</b></sup></a><br />
			</td></tr>
</table>

## More credits
This package was inspired by [cssivision/qrcode-react](https://github.com/cssivision/qrcode-react) and [zpao/qrcode.react](https://github.com/zpao/qrcode.react). Also looked up some parts from [kazuhikoarase/qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (which this package depends on).
