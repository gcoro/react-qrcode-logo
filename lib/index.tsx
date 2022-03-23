import * as isEqual from 'lodash.isequal';
import * as qrGenerator from 'qrcode-generator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


type CornerRadii = number | number[] | InnerOuterRadii;
type InnerOuterRadii = {
    inner: number | number[],
    outer: number | number[],
}

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
    removeQrCodeBehindLogo?: boolean;
    eyeRadius?: CornerRadii | CornerRadii[];
    qrStyle?: 'squares' | 'dots';
    style?: object;
    id?: string;
}

interface ICoordinates {
    row: number;
    col: number;
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
        removeQrCodeBehindLogo: false,
        qrStyle: 'squares',
        eyeRadius: [],
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

    /**
     * Draw a rounded square in the canvas
     */
    private drawRoundedSquare(lineWidth: number, x: number, y: number, size: number, radii: number | number[], fill: boolean, ctx) {
        ctx.lineWidth= lineWidth;

        // Adjust coordinates so that the outside of the stroke is aligned to the edges
        y += lineWidth/2;
        x += lineWidth/2;
        size -= lineWidth;

        if (!Array.isArray(radii)) {
            radii = [radii, radii, radii, radii];
        }

        // Radius should not be greater than half the size or less than zero
        radii = radii.map((r) => {
            r = Math.min(r, size/2);
            return (r < 0) ? 0 : r;
        });

        const rTopLeft = radii[0] || 0;
        const rTopRight = radii[1] || 0;
        const rBottomRight = radii[2] || 0;
        const rBottomLeft = radii[3] || 0;

        ctx.beginPath();

        ctx.moveTo(x + rTopLeft, y);

        ctx.lineTo(x + size - rTopRight, y);
        if (rTopRight)  ctx.quadraticCurveTo(x + size, y, x + size, y + rTopRight);

        ctx.lineTo(x + size, y + size - rBottomRight);
        if (rBottomRight) ctx.quadraticCurveTo(x + size, y + size, x + size - rBottomRight, y + size);

        ctx.lineTo(x + rBottomLeft, y + size);
        if (rBottomLeft) ctx.quadraticCurveTo(x, y + size, x, y + size - rBottomLeft);

        ctx.lineTo(x, y + rTopLeft);
        if (rTopLeft) ctx.quadraticCurveTo(x, y, x + rTopLeft, y);

        ctx.closePath();

        ctx.stroke();
        if (fill) {
            ctx.fill();
        }
    }

    /**
     * Draw a single positional pattern eye.
     */
    private drawPositioningPattern(ctx, cellSize, offset, row, col, radii: CornerRadii=[0,0,0,0]) {
        const lineWidth = Math.ceil(cellSize);

        let radiiOuter;
        let radiiInner;
        if (typeof radii !== 'number' && !Array.isArray(radii)) {
            radiiOuter = radii.outer || 0;
            radiiInner = radii.inner || 0;
        } else {
            radiiOuter = radii as CornerRadii;
            radiiInner = radiiOuter;
        }


        let y = (row * cellSize) + offset;
        let x = (col * cellSize) + offset;
        let size = cellSize * 7;

        // Outer box
        this.drawRoundedSquare(lineWidth, x, y, size, radiiOuter, false, ctx);

        // Inner box
        size = cellSize * 3;
        y += cellSize * 2;
        x += cellSize * 2;
        this.drawRoundedSquare(lineWidth, x, y, size, radiiInner, true, ctx);
    };

    /**
     * Is this dot inside a positional pattern zone.
     */
    private isInPositioninZone(col: number, row: number, zones: ICoordinates[]) {
        return zones.some((zone) => (
            row >= zone.row && row <= zone.row + 7 &&
            col >= zone.col && col <= zone.col + 7
        ));
    }

    private transformPixelLengthIntoNumberOfCells(pixelLength: number, cellSize: number) {
        return pixelLength / cellSize;
    }

    private isCoordinateInImage(col: number, row: number, dWidthLogo: number, dHeightLogo: number, dxLogo: number, dyLogo: number, cellSize: number, logoImage: string) {
        if(logoImage) {
            const numberOfCellsMargin = 2;
            const firstRowOfLogo = this.transformPixelLengthIntoNumberOfCells(dxLogo, cellSize);
            const firstColumnOfLogo = this.transformPixelLengthIntoNumberOfCells(dyLogo, cellSize);
            const logoWidthInCells = this.transformPixelLengthIntoNumberOfCells(dWidthLogo, cellSize)-1;
            const logoHeightInCells = this.transformPixelLengthIntoNumberOfCells(dHeightLogo, cellSize)-1;

            return row >= firstRowOfLogo - numberOfCellsMargin && row <= firstRowOfLogo + logoWidthInCells + numberOfCellsMargin // check rows
            && col >=  firstColumnOfLogo - numberOfCellsMargin && col <= firstColumnOfLogo + logoHeightInCells + numberOfCellsMargin // check cols
        } else {
            return false;
        }
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
            removeQrCodeBehindLogo,
            qrStyle,
            eyeRadius
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

        const dWidthLogo = logoWidth || size * 0.2;
        const dHeightLogo = logoHeight || dWidthLogo;
        const dxLogo = ((size - dWidthLogo) / 2);
        const dyLogo = ((size - dHeightLogo) / 2);

        const positioningZones: ICoordinates[] = [
            { row: 0,         col:0 },
            { row: 0,         col: length - 7 },
            { row:length - 7, col: 0 },
        ];

        ctx.strokeStyle = fgColor;
        if (qrStyle === 'dots') {
            ctx.fillStyle = fgColor;
            const radius = cellSize / 2;
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones) && !(removeQrCodeBehindLogo && this.isCoordinateInImage(row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, logoImage))) {
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
        } else {
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones) && !(removeQrCodeBehindLogo && this.isCoordinateInImage(row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, logoImage))) {
                        ctx.fillStyle = fgColor;
                        const w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        const h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
                        ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h);
                    }
                }
            }
        }

        // Draw positioning patterns
        for (let i = 0; i < 3; i++) {
            const { row, col } = positioningZones[i];
            let radii = eyeRadius;
            if (Array.isArray(radii)) {
                radii = radii[i];
            }
            if (typeof radii == 'number') {
                radii = [radii, radii, radii, radii] as CornerRadii;
            }
            this.drawPositioningPattern(ctx, cellSize, offset, row, col, radii as CornerRadii);
        }

        if (logoImage) {
            const image = new Image();
            if (enableCORS) {
                image.crossOrigin = 'Anonymous';
            }
            image.onload = () => {
                ctx.save();
                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(image, dxLogo + offset, dyLogo + offset, dWidthLogo, dHeightLogo);
                ctx.restore();
            };
            image.src = logoImage;
        }
    }

    render() {
        const size = +this.props.size + (2 * +this.props.quietZone);
        return React.createElement('canvas', {
            id: this.props.id ?? 'react-qrcode-logo',
            height: size,
            width: size,
            style: { height: size + 'px',   width: size + 'px' },
            ref: this.canvas
        });
    }
}
