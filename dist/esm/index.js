import React from 'react';
import qrGenerator from 'qrcode-generator';
export class QRCode extends React.Component {
    canvasRef = React.createRef();
    static defaultProps = {
        value: 'https://reactjs.org/',
        ecLevel: 'M',
        enableCORS: false,
        size: 150,
        quietZone: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1,
        qrStyle: 'squares',
        eyeRadius: [0, 0, 0],
        logoPaddingStyle: 'square',
        logoPaddingRadius: 0
    };
    download(fileType, fileName) {
        if (this.canvasRef.current) {
            let mimeType;
            switch (fileType) {
                case 'jpg':
                    mimeType = 'image/jpeg';
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    break;
                case 'png':
                default:
                    mimeType = 'image/png';
                    break;
            }
            const url = this.canvasRef.current.toDataURL(mimeType, 1.0);
            const link = document.createElement('a');
            link.download = fileName ?? 'react-qrcode-logo';
            link.href = url;
            link.click();
        }
    }
    utf16to8(str) {
        let out = '', i, c;
        const len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            }
            else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
            else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
    /**
     * Draw a rounded square in the canvas
     */
    drawRoundedSquare(lineWidth, x, y, size, color, radii, fill, ctx) {
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        // Adjust coordinates so that the outside of the stroke is aligned to the edges
        y += lineWidth / 2;
        x += lineWidth / 2;
        size -= lineWidth;
        if (!Array.isArray(radii)) {
            radii = [radii, radii, radii, radii];
        }
        // Radius should not be greater than half the size or less than zero
        radii = radii.map((r) => {
            r = Math.min(r, size / 2);
            return (r < 0) ? 0 : r;
        });
        const rTopLeft = radii[0] || 0;
        const rTopRight = radii[1] || 0;
        const rBottomRight = radii[2] || 0;
        const rBottomLeft = radii[3] || 0;
        ctx.beginPath();
        ctx.moveTo(x + rTopLeft, y);
        ctx.lineTo(x + size - rTopRight, y);
        if (rTopRight)
            ctx.quadraticCurveTo(x + size, y, x + size, y + rTopRight);
        ctx.lineTo(x + size, y + size - rBottomRight);
        if (rBottomRight)
            ctx.quadraticCurveTo(x + size, y + size, x + size - rBottomRight, y + size);
        ctx.lineTo(x + rBottomLeft, y + size);
        if (rBottomLeft)
            ctx.quadraticCurveTo(x, y + size, x, y + size - rBottomLeft);
        ctx.lineTo(x, y + rTopLeft);
        if (rTopLeft)
            ctx.quadraticCurveTo(x, y, x + rTopLeft, y);
        ctx.closePath();
        ctx.stroke();
        if (fill) {
            ctx.fill();
        }
    }
    /**
     * Draw a single positional pattern eye.
     */
    drawPositioningPattern(ctx, cellSize, offset, row, col, color, radii = [0, 0, 0, 0]) {
        const lineWidth = Math.ceil(cellSize);
        let radiiOuter;
        let radiiInner;
        if (typeof radii !== 'number' && !Array.isArray(radii)) {
            radiiOuter = radii.outer || 0;
            radiiInner = radii.inner || 0;
        }
        else {
            radiiOuter = radii;
            radiiInner = radiiOuter;
        }
        let colorOuter;
        let colorInner;
        if (typeof color !== 'string') {
            colorOuter = color.outer;
            colorInner = color.inner;
        }
        else {
            colorOuter = color;
            colorInner = color;
        }
        let y = (row * cellSize) + offset;
        let x = (col * cellSize) + offset;
        let size = cellSize * 7;
        // Outer box
        this.drawRoundedSquare(lineWidth, x, y, size, colorOuter, radiiOuter, false, ctx);
        // Inner box
        size = cellSize * 3;
        y += cellSize * 2;
        x += cellSize * 2;
        this.drawRoundedSquare(lineWidth, x, y, size, colorInner, radiiInner, true, ctx);
    }
    ;
    /**
     * Is this dot inside a positional pattern zone.
     */
    isInPositioninZone(row, col, zones) {
        return zones.some((zone) => (row >= zone.row && row <= zone.row + 7 &&
            col >= zone.col && col <= zone.col + 7));
    }
    /**
     * Checks whether the coordinate is behind the logo and needs to be removed. true if the coordinate is behind the logo and needs to be removed.
     */
    removeCoordinateBehindLogo(removeQrCodeBehindLogo, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding = 0, logoPaddingStyle = 'square') {
        if (!removeQrCodeBehindLogo || !logoImage) {
            return false;
        }
        const paddingInCells = Math.ceil(logoPadding / cellSize);
        const snappedPadding = paddingInCells * cellSize;
        const absolute_dxLogo = dxLogo + offset;
        const absolute_dyLogo = dyLogo + offset;
        const cellLeft = Math.round(col * cellSize) + offset;
        const cellTop = Math.round(row * cellSize) + offset;
        const w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
        const h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
        const cellRight = cellLeft + w;
        const cellBottom = cellTop + h;
        if (logoPaddingStyle === 'square') {
            const logoLeft = absolute_dxLogo - snappedPadding;
            const logoRight = absolute_dxLogo + dWidthLogo + snappedPadding;
            const logoTop = absolute_dyLogo - snappedPadding;
            const logoBottom = absolute_dyLogo + dHeightLogo + snappedPadding;
            const overlapX = cellLeft < logoRight && cellRight > logoLeft;
            const overlapY = cellTop < logoBottom && cellBottom > logoTop;
            return overlapX && overlapY;
        }
        if (logoPaddingStyle === 'circle') {
            const logoCenterX = absolute_dxLogo + dWidthLogo / 2;
            const logoCenterY = absolute_dyLogo + dHeightLogo / 2;
            const circleRadius = (Math.max(dWidthLogo, dHeightLogo) / 2) + snappedPadding;
            const closestX = Math.max(cellLeft, Math.min(logoCenterX, cellRight));
            const closestY = Math.max(cellTop, Math.min(logoCenterY, cellBottom));
            const distanceX = logoCenterX - closestX;
            const distanceY = logoCenterY - closestY;
            const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
            return distanceSquared < (circleRadius * circleRadius);
        }
        return false;
    }
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps) {
        return !deepEqual(this.props, nextProps);
    }
    componentDidMount() {
        this.update();
    }
    componentDidUpdate() {
        this.update();
    }
    update() {
        const { value, ecLevel, enableCORS, bgColor, fgColor, logoImage, logoOpacity, logoOnLoad, removeQrCodeBehindLogo, qrStyle, eyeRadius, eyeColor, logoPaddingStyle, logoPaddingRadius, } = this.props;
        // just make sure that these params are passed as numbers
        const size = +this.props.size;
        const quietZone = +this.props.quietZone;
        const logoWidth = this.props.logoWidth ? +this.props.logoWidth : 0;
        const logoHeight = this.props.logoHeight ? +this.props.logoHeight : 0;
        const logoPadding = this.props.logoPadding ? +this.props.logoPadding : 0;
        const qrCode = qrGenerator(0, ecLevel);
        qrCode.addData(this.utf16to8(value));
        qrCode.make();
        const canvas = this.canvasRef?.current;
        const ctx = canvas.getContext('2d');
        const canvasSize = size + (2 * quietZone);
        const length = qrCode.getModuleCount();
        const cellSize = size / length;
        const scale = (window.devicePixelRatio || 1);
        const dWidthLogo = logoWidth || size * 0.2;
        const dHeightLogo = logoHeight || dWidthLogo;
        const dxLogo = ((size - dWidthLogo) / 2);
        const dyLogo = ((size - dHeightLogo) / 2);
        canvas.height = canvas.width = canvasSize * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        const offset = quietZone;
        const positioningZones = [
            { row: 0, col: 0 },
            { row: 0, col: length - 7 },
            { row: length - 7, col: 0 },
        ];
        ctx.strokeStyle = fgColor;
        if (qrStyle === 'dots') {
            ctx.fillStyle = fgColor;
            const radius = cellSize / 2;
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo ?? false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
                        ctx.beginPath();
                        ctx.arc(Math.round(col * cellSize) + radius + offset, Math.round(row * cellSize) + radius + offset, (radius / 100) * 75, 0, 2 * Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }
        else if (qrStyle === 'fluid') {
            const radius = Math.ceil(cellSize / 2);
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo ?? false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
                        let roundedCorners = [false, false, false, false]; // top-left, top-right, bottom-right, bottom-left
                        if ((row > 0 && !qrCode.isDark(row - 1, col)) && (col > 0 && !qrCode.isDark(row, col - 1)))
                            roundedCorners[0] = true;
                        if ((row > 0 && !qrCode.isDark(row - 1, col)) && (col < length - 1 && !qrCode.isDark(row, col + 1)))
                            roundedCorners[1] = true;
                        if ((row < length - 1 && !qrCode.isDark(row + 1, col)) && (col < length - 1 && !qrCode.isDark(row, col + 1)))
                            roundedCorners[2] = true;
                        if ((row < length - 1 && !qrCode.isDark(row + 1, col)) && (col > 0 && !qrCode.isDark(row, col - 1)))
                            roundedCorners[3] = true;
                        const w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        const h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
                        ctx.fillStyle = fgColor;
                        ctx.beginPath();
                        ctx.arc(Math.round(col * cellSize) + radius + offset, Math.round(row * cellSize) + radius + offset, radius, 0, 2 * Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                        if (!roundedCorners[0])
                            ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w / 2, h / 2);
                        if (!roundedCorners[1])
                            ctx.fillRect(Math.round(col * cellSize) + offset + Math.floor(w / 2), Math.round(row * cellSize) + offset, w / 2, h / 2);
                        if (!roundedCorners[2])
                            ctx.fillRect(Math.round(col * cellSize) + offset + Math.floor(w / 2), Math.round(row * cellSize) + offset + Math.floor(h / 2), w / 2, h / 2);
                        if (!roundedCorners[3])
                            ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset + Math.floor(h / 2), w / 2, h / 2);
                    }
                }
            }
        }
        else {
            for (let row = 0; row < length; row++) {
                for (let col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo ?? false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
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
            let color;
            if (Array.isArray(radii)) {
                radii = radii[i];
            }
            if (typeof radii == 'number') {
                radii = [radii, radii, radii, radii];
            }
            if (!eyeColor) { // if not specified, eye color is the same as foreground, 
                color = fgColor;
            }
            else {
                if (Array.isArray(eyeColor)) { // if array, we pass the single color
                    color = eyeColor[i];
                }
                else {
                    color = eyeColor;
                }
            }
            this.drawPositioningPattern(ctx, cellSize, offset, row, col, color, radii);
        }
        if (logoImage) {
            const image = new Image();
            if (enableCORS) {
                image.crossOrigin = 'Anonymous';
            }
            image.onload = (e) => {
                ctx.save();
                if (logoPadding) {
                    ctx.beginPath();
                    ctx.strokeStyle = bgColor;
                    ctx.fillStyle = bgColor;
                    const dWidthLogoPadding = dWidthLogo + (2 * logoPadding);
                    const dHeightLogoPadding = dHeightLogo + (2 * logoPadding);
                    const dxLogoPadding = dxLogo + offset - logoPadding;
                    const dyLogoPadding = dyLogo + offset - logoPadding;
                    if (logoPaddingStyle === 'circle') {
                        const dxCenterLogoPadding = dxLogoPadding + (dWidthLogoPadding / 2);
                        const dyCenterLogoPadding = dyLogoPadding + (dHeightLogoPadding / 2);
                        ctx.ellipse(dxCenterLogoPadding, dyCenterLogoPadding, dWidthLogoPadding / 2, dHeightLogoPadding / 2, 0, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.fill();
                    }
                    else {
                        ctx.roundRect(dxLogoPadding, dyLogoPadding, dWidthLogoPadding, dHeightLogoPadding, logoPaddingRadius);
                        ctx.stroke();
                        ctx.fill();
                    }
                }
                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(image, dxLogo + offset, dyLogo + offset, dWidthLogo, dHeightLogo);
                ctx.restore();
                if (logoOnLoad) {
                    logoOnLoad(e);
                }
            };
            image.src = logoImage;
        }
    }
    render() {
        const qrSize = +this.props.size + (2 * +this.props.quietZone);
        return React.createElement("canvas", { id: this.props.id ?? 'react-qrcode-logo', height: qrSize, width: qrSize, style: { height: qrSize + 'px', width: qrSize + 'px', ...this.props.style }, ref: this.canvasRef });
    }
}
function deepEqual(a, b, visited = new WeakMap()) {
    // same reference or same primitive value
    if (Object.is(a, b))
        return true;
    // different types -> cannot be equal
    if (typeof a !== typeof b)
        return false;
    // null / undefined check
    if (a == null || b == null)
        return false;
    // functions compare only by reference
    if (typeof a === 'function' || typeof b === 'function') {
        return a === b;
    }
    // avoid infinite loops on circular references
    if (typeof a === 'object' && typeof b === 'object') {
        if (visited.has(a) && visited.get(a) === b) {
            return true;
        }
        visited.set(a, b);
    }
    // date
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    // arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i], visited))
                return false;
        }
        return true;
    }
    // sets
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size)
            return false;
        for (const val of a) {
            if (![...b].some(bVal => deepEqual(val, bVal, visited)))
                return false;
        }
        return true;
    }
    // maps
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size)
            return false;
        for (const [key, val] of a) {
            if (!b.has(key) || !deepEqual(val, b.get(key), visited))
                return false;
        }
        return true;
    }
    // plain objects
    if (Object.getPrototypeOf(a) === Object.prototype ||
        Object.getPrototypeOf(a) === null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length)
            return false;
        for (const key of keysA) {
            if (!keysB.includes(key))
                return false;
            if (!deepEqual(a[key], b[key], visited))
                return false;
        }
        return true;
    }
    // remaining objects with custom prototypes (e.g., DOMPointInit, CSSProperties)
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    catch {
        return false;
    }
}
export default QRCode;
