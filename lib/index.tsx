import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as QRCodeImpl from 'qr.js/lib/QRCode';
import * as isEqual from 'lodash.isequal';

enum ErrorCorrectionLevel {
    'L' = 1,
    'M' = 0,
    'Q' = 3,
    'H' = 2
}

export interface IProps {
    value?: string;
    size?: number;
    ecLevel?: keyof typeof ErrorCorrectionLevel;
    padding?: number;
    bgColor?: string;
    fgColor?: string;
    logoImage?: string;
    logoWidth?: number;
    logoHeight?: number;
    logoOpacity?: number;
    style?: Object;
}

export class QRCode extends React.Component<IProps, {}> {

    private canvas: React.RefObject<HTMLCanvasElement>;

    public static defaultProps: IProps = {
        value: 'https://reactjs.org/',
        size: 150,
        ecLevel: 'M',
        padding: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1
    };

    public static utf16to8(str: string): string {
        let out: string = '', i: number, c: number;
        const len: number = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    constructor(props: IProps) {
        super(props);
        this.canvas = React.createRef();
    }


    shouldComponentUpdate(nextProps: IProps) {
        return !isEqual(this.props, nextProps);
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const { value, size, ecLevel, bgColor, fgColor, logoImage, logoWidth, logoHeight, logoOpacity } = this.props;

        const qrcode = new QRCodeImpl(-1, ErrorCorrectionLevel[ecLevel]);
        qrcode.addData(QRCode.utf16to8(value));
        qrcode.make();

        const canvas: HTMLCanvasElement = ReactDOM.findDOMNode(this.canvas.current) as HTMLCanvasElement;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        const cells = qrcode.modules;
        const tileW = size / cells.length;
        const tileH = size / cells.length;
        const scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);

        cells.forEach((row: number[], rdx: number) => {
            row.forEach((cell: number, cdx: number) => {
                ctx.fillStyle = cell ? fgColor : bgColor;
                const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            }, this);
        }, this);

        if (logoImage) {
            const image = new Image();
            image.onload = () => {
                const dwidth = logoWidth || size * 0.2;
                const dheight = logoHeight || dwidth;
                const dx = (size - dwidth) / 2;
                const dy = (size - dheight) / 2;
                image.width = dwidth;
                image.height = dheight;
                ctx.save();
                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(image, dx, dy, dwidth, dheight);
                ctx.restore();
            };
            image.src = logoImage;
        }
    }

    render() {
        return React.createElement('canvas', {
            id: 'react-qrcode-logo',
            height: this.props.size,
            width: this.props.size,
            style: Object.assign({
                height: this.props.size + 'px', width: this.props.size + 'px',
                padding: (100 * this.props.padding) / this.props.size + '%', background: this.props.bgColor
            }, this.props.style),
            ref: this.canvas
        });
    }
}


