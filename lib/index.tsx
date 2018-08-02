import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as  qr from 'qr.js';
import * as isEqual from 'lodash.isequal';

export interface IProps {
    value?: string;
    size?: number;
    padding?: number;
    bgColor?: string;
    fgColor?: string;
    logoImage?: string;
    logoWidth?: number;
    logoHeight?: number;
    logoOpacity?: number;
    style?: Object;
}

export interface CanvasRendereringContext2D {
    webkitBackingStorePixelRatio: number;
    mozBackingStorePixelRatio: number;
    msBackingStorePixelRatio: number;
    oBackingStorePixelRatio: number;
    backingStorePixelRatio: number;
}

export class QRCode extends React.Component<IProps, {}> {

    private canvas: React.RefObject<HTMLInputElement>;

    public static defaultProps: IProps = {
        value: 'https://reactjs.org/',
        size: 150,
        padding: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1
    };

    public static getBackingStorePixelRatio(ctx: CanvasRendereringContext2D): number {
        return (
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1
        );
    }

    public static utf16to8(str: string): string {
        let out, i, len, c;
        out = '';
        len = str.length;
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
        const value = QRCode.utf16to8(this.props.value);
        const qrcode = qr(value);
        const canvas: any = ReactDOM.findDOMNode(this.canvas.current);

        const ctx = canvas.getContext('2d');
        const cells = qrcode.modules;
        const tileW = this.props.size / cells.length;
        const tileH = this.props.size / cells.length;
        const scale = (window.devicePixelRatio || 1) / QRCode.getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = this.props.size * scale;
        ctx.scale(scale, scale);

        cells.forEach((row: number[], rdx: number) => {
            row.forEach((cell: number, cdx: number) => {
                ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
                const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            }, this);
        }, this);

        if (this.props.logoImage) {
            const image = new Image();
            image.onload = () => {
                const dwidth = this.props.logoWidth || this.props.size * 0.2;
                const dheight = this.props.logoHeight || dwidth;
                const dx = (this.props.size - dwidth) / 2;
                const dy = (this.props.size - dheight) / 2;
                image.width = dwidth;
                image.height = dheight;
                ctx.save();
                ctx.globalAlpha = this.props.logoOpacity;
                ctx.drawImage(image, dx, dy, dwidth, dheight);
                ctx.restore();
            };
            image.src = this.props.logoImage;
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

