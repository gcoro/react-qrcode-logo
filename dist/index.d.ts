import * as React from 'react';
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
export declare class QRCode extends React.Component<IProps, {}> {
    private canvas;
    static defaultProps: IProps;
    static getBackingStorePixelRatio(ctx: CanvasRendereringContext2D): number;
    static utf16to8(str: string): string;
    constructor(props: IProps);
    shouldComponentUpdate(nextProps: IProps): boolean;
    componentDidMount(): void;
    componentDidUpdate(): void;
    update(): void;
    render(): React.DetailedReactHTMLElement<{
        height: number;
        width: number;
        style: any;
        ref: React.RefObject<HTMLInputElement>;
    }, HTMLInputElement>;
}
