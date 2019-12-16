import * as isEqual from 'lodash.isequal';
import * as qrGenerator from 'qrcode-generator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
    value?: string;
    ecLevel?: 'L' | 'M' | 'Q' | 'H';
    enableCORS?: boolean;
    size?: number;
    quietZone?: number;
    bgColor?: string;
    fgColor?: string;
    logoImage?: string;
    logoWidth?: number;
    logoHeight?: number;
    logoOpacity?: number;
    qrStyle?: 'squares' | 'dots';
    style?: object;
}

export class QRCode extends React.Component<IProps, {}> {

    private canvas: React.RefObject<HTMLCanvasElement>;

    public static defaultProps: IProps = {
        value: 'https://reactjs.org/',
        ecLevel: 'M',
        enableCORS: false,
        size: 150,
        quietZone: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1,
        qrStyle: 'squares'
    };

    private static utf16to8(str: string): string {
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

    private drawPositioningPattern(cellSize, offset, row, col, length, ctx) {
        for (let r = -1; r <= 7; r++) {
            if (!(row + r <= -1 || length <= row + r)) {
                for (let c = -1; c <= 7; c++) {
                    if (!(col + c <= -1 || length <= col + c) &&
                        (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
                        (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
                        (2 <= r && r <= 4 && 2 <= c && c <= 4)) {

                        const w = (Math.ceil(((row + r) + 1) * cellSize) - Math.floor((row + r) * cellSize));
                        const h = (Math.ceil(((col + c) + 1) * cellSize) - Math.floor((col + c) * cellSize));

                        ctx.fillStyle = this.props.fgColor;
                        ctx.fillRect(Math.round((row + r) * cellSize) + offset, Math.round((col + c) * cellSize) + offset, w, h);
                    }
                }
            }
        }
    };

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
        const {
            value,
            ecLevel,
            enableCORS,
            size,
            quietZone,
            bgColor,
            fgColor,
            logoImage,
            logoWidth,
            logoHeight,
            logoOpacity,
            qrStyle
        } = this.props;

        const qrCode = qrGenerator(0, ecLevel);
        qrCode.addData(QRCode.utf16to8(value));
        qrCode.make();

        const canvas: HTMLCanvasElement = ReactDOM.findDOMNode(this.canvas.current) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        const canvasSize = +size + (2 * +quietZone);
        const length = qrCode.getModuleCount();
        const cellSize = size / length;
        const scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = canvasSize * scale;
        ctx.scale(scale, scale);

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        const offset = +quietZone;

        if (qrStyle === 'dots') {
            ctx.fillStyle = fgColor;
            const radius = cellSize / 2;
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col)) {
                        ctx.beginPath();
                        ctx.arc(
                            Math.round(col * cellSize) + radius + offset,
                            Math.round(row * cellSize) + radius + offset,
                            (radius / 100) * 75,
                            0,
                            2 * Math.PI,
                            false);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }

            this.drawPositioningPattern(cellSize, offset, 0, 0, length, ctx);
            this.drawPositioningPattern(cellSize, offset, length - 7, 0, length, ctx);
            this.drawPositioningPattern(cellSize, offset, 0, length - 7, length, ctx);
        } else {
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col)) {
                        ctx.fillStyle = fgColor;
                        const w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        const h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
                        ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h);
                    }
                }
            }
        }

        if (logoImage) {
            const image = new Image();
            if (enableCORS) {
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
                ctx.drawImage(image, dx + offset, dy + offset, dwidth, dheight);
                ctx.restore();
            };
            image.src = logoImage;
        }
    }

    render() {
        const size = +this.props.size + (2 * +this.props.quietZone);
        return React.createElement('canvas', {
            id: 'react-qrcode-logo',
            height: size,
            width: size,
            style: { height: size + 'px',   width: size + 'px' },
            ref: this.canvas
        });
    }
}