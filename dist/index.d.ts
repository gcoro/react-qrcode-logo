import * as React from 'react';
type EyeColor = string | InnerOuterEyeColor;
type InnerOuterEyeColor = {
    inner: string;
    outer: string;
};
type CornerRadii = number | [number, number, number, number] | InnerOuterRadii;
type InnerOuterRadii = {
    inner: number | [number, number, number, number];
    outer: number | [number, number, number, number];
};
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
    logoOnLoad?: (e: Event) => void;
    removeQrCodeBehindLogo?: boolean;
    logoPadding?: number;
    logoPaddingStyle?: 'square' | 'circle';
    eyeRadius?: CornerRadii | [CornerRadii, CornerRadii, CornerRadii];
    eyeColor?: EyeColor | [EyeColor, EyeColor, EyeColor];
    qrStyle?: 'squares' | 'dots' | 'fluid';
    style?: React.CSSProperties;
    id?: string;
}
export declare class QRCode extends React.Component<IProps, {}> {
    private canvasRef;
    static defaultProps: IProps;
    download(fileType?: 'png' | 'jpg' | 'webp', fileName?: string): void;
    private utf16to8;
    /**
     * Draw a rounded square in the canvas
     */
    private drawRoundedSquare;
    /**
     * Draw a single positional pattern eye.
     */
    private drawPositioningPattern;
    /**
     * Is this dot inside a positional pattern zone.
     */
    private isInPositioninZone;
    private transformPixelLengthIntoNumberOfCells;
    private isCoordinateInImage;
    constructor(props: IProps);
    shouldComponentUpdate(nextProps: IProps): boolean;
    componentDidMount(): void;
    componentDidUpdate(): void;
    update(): void;
    render(): React.JSX.Element;
}
export {};
