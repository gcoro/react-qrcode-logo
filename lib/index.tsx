import * as isEqual from 'lodash.isequal';
import * as qrcode from 'qrcode-generator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
    value?: string;
    ecLevel?: 'L' | 'M' | 'Q' | 'H';
    enCORS?: boolean;
    size?: number;
    padding?: number;
    bgColor?: string;
    fgColor?: string;
    logoImage?: string;
    logoWidth?: number;
    logoHeight?: number;
    logoOpacity?: number;
    style?: object;
}

export class QRCode extends React.Component<IProps, {}> {

    private canvas: React.RefObject<HTMLCanvasElement>;

    public static defaultProps: IProps = {
        value: 'https://reactjs.org/',
        ecLevel: 'M',
        enCORS: false,
        size: 150,
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
        const { value, ecLevel, enCORS, size, bgColor, fgColor, logoImage, logoWidth, logoHeight, logoOpacity } = this.props;

        const myqrcode = qrcode(0, ecLevel);
        myqrcode.addData(QRCode.utf16to8(value));
        myqrcode.make();

        const canvas: HTMLCanvasElement = ReactDOM.findDOMNode(this.canvas.current) as HTMLCanvasElement;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        const tileW = size / myqrcode.getModuleCount();
        const tileH = size / myqrcode.getModuleCount();
        const scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);

        for (let i = 0; i < (myqrcode.getModuleCount()); i++) {
            for (let j = 0; j < (myqrcode.getModuleCount()); j++) {
                ctx.fillStyle = myqrcode.isDark(i, j) ? fgColor : bgColor;
                const w = (Math.ceil((j + 1) * tileW) - Math.floor(j * tileW));
                const h = (Math.ceil((i + 1) * tileH) - Math.floor(i * tileH));
                ctx.fillRect(Math.round(j * tileW), Math.round(i * tileH), w, h);
            }
        }

        if (logoImage) {
            const image = new Image();
            if (enCORS) {
                image.crossOrigin = 'Anonymous';
            }
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
            style: {
                height: this.props.size + 'px',
                width: this.props.size + 'px',
                padding: (100 * this.props.padding) / this.props.size + '%',
                background: this.props.bgColor,
                ...this.props.style
            },
            ref: this.canvas
        });
    }
}