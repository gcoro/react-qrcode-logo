import * as React from 'react';
declare enum ErrorCorrectionLevel {
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
export declare class QRCode extends React.Component<IProps, {}> {
    private canvas;
    static defaultProps: IProps;
    static utf16to8(str: string): string;
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
            padding: string;
            background: string;
        } & Object;
        ref: React.RefObject<HTMLCanvasElement>;
    }, HTMLCanvasElement>;
}
export {};
