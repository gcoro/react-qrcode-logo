"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
var isEqual = require("lodash.isequal");
var qrGenerator = require("qrcode-generator");
var React = require("react");
var QRCode = /** @class */ (function (_super) {
    __extends(QRCode, _super);
    function QRCode(props) {
        var _this = _super.call(this, props) || this;
        _this.canvasRef = React.createRef();
        return _this;
    }
    QRCode.prototype.download = function (fileType, fileName) {
        if (this.canvasRef.current) {
            var mimeType = void 0;
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
            var url = this.canvasRef.current.toDataURL(mimeType, 1.0);
            var link = document.createElement('a');
            link.download = fileName !== null && fileName !== void 0 ? fileName : 'react-qrcode-logo';
            link.href = url;
            link.click();
        }
    };
    QRCode.prototype.utf16to8 = function (str) {
        var out = '', i, c;
        var len = str.length;
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
    };
    /**
     * Draw a rounded square in the canvas
     */
    QRCode.prototype.drawRoundedSquare = function (lineWidth, x, y, size, color, radii, fill, ctx) {
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
        radii = radii.map(function (r) {
            r = Math.min(r, size / 2);
            return (r < 0) ? 0 : r;
        });
        var rTopLeft = radii[0] || 0;
        var rTopRight = radii[1] || 0;
        var rBottomRight = radii[2] || 0;
        var rBottomLeft = radii[3] || 0;
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
    };
    /**
     * Draw a single positional pattern eye.
     */
    QRCode.prototype.drawPositioningPattern = function (ctx, cellSize, offset, row, col, color, radii) {
        if (radii === void 0) { radii = [0, 0, 0, 0]; }
        var lineWidth = Math.ceil(cellSize);
        var radiiOuter;
        var radiiInner;
        if (typeof radii !== 'number' && !Array.isArray(radii)) {
            radiiOuter = radii.outer || 0;
            radiiInner = radii.inner || 0;
        }
        else {
            radiiOuter = radii;
            radiiInner = radiiOuter;
        }
        var colorOuter;
        var colorInner;
        if (typeof color !== 'string') {
            colorOuter = color.outer;
            colorInner = color.inner;
        }
        else {
            colorOuter = color;
            colorInner = color;
        }
        var y = (row * cellSize) + offset;
        var x = (col * cellSize) + offset;
        var size = cellSize * 7;
        // Outer box
        this.drawRoundedSquare(lineWidth, x, y, size, colorOuter, radiiOuter, false, ctx);
        // Inner box
        size = cellSize * 3;
        y += cellSize * 2;
        x += cellSize * 2;
        this.drawRoundedSquare(lineWidth, x, y, size, colorInner, radiiInner, true, ctx);
    };
    ;
    /**
     * Is this dot inside a positional pattern zone.
     */
    QRCode.prototype.isInPositioninZone = function (col, row, zones) {
        return zones.some(function (zone) { return (row >= zone.row && row <= zone.row + 7 &&
            col >= zone.col && col <= zone.col + 7); });
    };
    QRCode.prototype.transformPixelLengthIntoNumberOfCells = function (pixelLength, cellSize) {
        return pixelLength / cellSize;
    };
    QRCode.prototype.isCoordinateInImage = function (col, row, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, logoImage) {
        if (logoImage) {
            var numberOfCellsMargin = 2;
            var firstRowOfLogo = this.transformPixelLengthIntoNumberOfCells(dxLogo, cellSize);
            var firstColumnOfLogo = this.transformPixelLengthIntoNumberOfCells(dyLogo, cellSize);
            var logoWidthInCells = this.transformPixelLengthIntoNumberOfCells(dWidthLogo, cellSize) - 1;
            var logoHeightInCells = this.transformPixelLengthIntoNumberOfCells(dHeightLogo, cellSize) - 1;
            return row >= firstRowOfLogo - numberOfCellsMargin && row <= firstRowOfLogo + logoWidthInCells + numberOfCellsMargin // check rows
                && col >= firstColumnOfLogo - numberOfCellsMargin && col <= firstColumnOfLogo + logoHeightInCells + numberOfCellsMargin; // check cols
        }
        else {
            return false;
        }
    };
    QRCode.prototype.shouldComponentUpdate = function (nextProps) {
        return !isEqual(this.props, nextProps);
    };
    QRCode.prototype.componentDidMount = function () {
        this.update();
    };
    QRCode.prototype.componentDidUpdate = function () {
        this.update();
    };
    QRCode.prototype.update = function () {
        var _a;
        var _b = this.props, value = _b.value, ecLevel = _b.ecLevel, enableCORS = _b.enableCORS, bgColor = _b.bgColor, fgColor = _b.fgColor, logoImage = _b.logoImage, logoOpacity = _b.logoOpacity, logoOnLoad = _b.logoOnLoad, removeQrCodeBehindLogo = _b.removeQrCodeBehindLogo, qrStyle = _b.qrStyle, eyeRadius = _b.eyeRadius, eyeColor = _b.eyeColor, logoPaddingStyle = _b.logoPaddingStyle;
        // just make sure that these params are passed as numbers
        var size = +this.props.size;
        var quietZone = +this.props.quietZone;
        var logoWidth = this.props.logoWidth ? +this.props.logoWidth : 0;
        var logoHeight = this.props.logoHeight ? +this.props.logoHeight : 0;
        var logoPadding = this.props.logoPadding ? +this.props.logoPadding : 0;
        var qrCode = qrGenerator(0, ecLevel);
        qrCode.addData(this.utf16to8(value));
        qrCode.make();
        var canvas = (_a = this.canvasRef) === null || _a === void 0 ? void 0 : _a.current;
        var ctx = canvas.getContext('2d');
        var canvasSize = size + (2 * quietZone);
        var length = qrCode.getModuleCount();
        var cellSize = size / length;
        var scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = canvasSize * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        var offset = quietZone;
        var positioningZones = [
            { row: 0, col: 0 },
            { row: 0, col: length - 7 },
            { row: length - 7, col: 0 },
        ];
        ctx.strokeStyle = fgColor;
        if (qrStyle === 'dots') {
            ctx.fillStyle = fgColor;
            var radius = cellSize / 2;
            for (var row = 0; row < length; row++) {
                for (var col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)) {
                        ctx.beginPath();
                        ctx.arc(Math.round(col * cellSize) + radius + offset, Math.round(row * cellSize) + radius + offset, (radius / 100) * 75, 0, 2 * Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        }
        else if (qrStyle === 'fluid') {
            var radius = Math.ceil(cellSize / 2);
            for (var row = 0; row < length; row++) {
                for (var col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)) {
                        var roundedCorners = [false, false, false, false]; // top-left, top-right, bottom-right, bottom-left
                        if ((row > 0 && !qrCode.isDark(row - 1, col)) && (col > 0 && !qrCode.isDark(row, col - 1)))
                            roundedCorners[0] = true;
                        if ((row > 0 && !qrCode.isDark(row - 1, col)) && (col < length - 1 && !qrCode.isDark(row, col + 1)))
                            roundedCorners[1] = true;
                        if ((row < length - 1 && !qrCode.isDark(row + 1, col)) && (col < length - 1 && !qrCode.isDark(row, col + 1)))
                            roundedCorners[2] = true;
                        if ((row < length - 1 && !qrCode.isDark(row + 1, col)) && (col > 0 && !qrCode.isDark(row, col - 1)))
                            roundedCorners[3] = true;
                        var w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        var h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
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
            for (var row = 0; row < length; row++) {
                for (var col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)) {
                        ctx.fillStyle = fgColor;
                        var w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        var h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
                        ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h);
                    }
                }
            }
        }
        // Draw positioning patterns
        for (var i = 0; i < 3; i++) {
            var _c = positioningZones[i], row = _c.row, col = _c.col;
            var radii = eyeRadius;
            var color = void 0;
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
            var image_1 = new Image();
            if (enableCORS) {
                image_1.crossOrigin = 'Anonymous';
            }
            image_1.onload = function (e) {
                ctx.save();
                var dWidthLogo = logoWidth || size * 0.2;
                var dHeightLogo = logoHeight || dWidthLogo;
                var dxLogo = ((size - dWidthLogo) / 2);
                var dyLogo = ((size - dHeightLogo) / 2);
                if (removeQrCodeBehindLogo || logoPadding) {
                    ctx.beginPath();
                    ctx.strokeStyle = bgColor;
                    ctx.fillStyle = bgColor;
                    var dWidthLogoPadding = dWidthLogo + (2 * logoPadding);
                    var dHeightLogoPadding = dHeightLogo + (2 * logoPadding);
                    var dxLogoPadding = dxLogo + offset - logoPadding;
                    var dyLogoPadding = dyLogo + offset - logoPadding;
                    if (logoPaddingStyle === 'circle') {
                        var dxCenterLogoPadding = dxLogoPadding + (dWidthLogoPadding / 2);
                        var dyCenterLogoPadding = dyLogoPadding + (dHeightLogoPadding / 2);
                        ctx.ellipse(dxCenterLogoPadding, dyCenterLogoPadding, dWidthLogoPadding / 2, dHeightLogoPadding / 2, 0, 0, 2 * Math.PI);
                        ctx.stroke();
                        ctx.fill();
                    }
                    else {
                        ctx.fillRect(dxLogoPadding, dyLogoPadding, dWidthLogoPadding, dHeightLogoPadding);
                    }
                }
                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(image_1, dxLogo + offset, dyLogo + offset, dWidthLogo, dHeightLogo);
                ctx.restore();
                if (logoOnLoad) {
                    logoOnLoad(e);
                }
            };
            image_1.src = logoImage;
        }
    };
    QRCode.prototype.render = function () {
        var _a;
        var qrSize = +this.props.size + (2 * +this.props.quietZone);
        return React.createElement("canvas", { id: (_a = this.props.id) !== null && _a !== void 0 ? _a : 'react-qrcode-logo', height: qrSize, width: qrSize, style: __assign({ height: qrSize + 'px', width: qrSize + 'px' }, this.props.style), ref: this.canvasRef });
    };
    QRCode.defaultProps = {
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
        logoPaddingStyle: 'square'
    };
    return QRCode;
}(React.Component));
exports.QRCode = QRCode;
