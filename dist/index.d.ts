import * as React from 'react';
declare type CornerRadii = number | number[] | InnerOuterRadii;
declare type InnerOuterRadii = {
    inner: number | number[];
    outer: number | number[];
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
    removeQrCodeBehindLogo?: boolean;
    eyeRadius?: CornerRadii | CornerRadii[];
    qrStyle?: 'squares' | 'dots';
    style?: object;
    id?: string;
    scale?: number;
}
export declare class QRCode extends React.Component<IProps, {}> {
    private canvas;
    static defaultProps: IProps;
    private static utf16to8;
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
    render(): React.DetailedReactHTMLElement<{
        id: string;
        height: number;
        width: number;
        style: {
            height: string;
            width: string;
        };
        ref: React.RefObject<HTMLCanvasElement>;
    }, HTMLCanvasElement>;
}
export {};
