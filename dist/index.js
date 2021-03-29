"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
var isEqual = require("lodash.isequal");
var qrGenerator = require("qrcode-generator");
var React = require("react");
var ReactDOM = require("react-dom");
var QRCode = /** @class */ (function (_super) {
    __extends(QRCode, _super);
    function QRCode(props) {
        var _this = _super.call(this, props) || this;
        _this.canvas = React.createRef();
        return _this;
    }
    QRCode.utf16to8 = function (str) {
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
    QRCode.prototype.drawPositioningPattern = function (cellSize, offset, row, col, length, ctx) {
        for (var r = -1; r <= 7; r++) {
            if (!(row + r <= -1 || length <= row + r)) {
                for (var c = -1; c <= 7; c++) {
                    if (!(col + c <= -1 || length <= col + c) &&
                        (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
                        (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
                        (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                        var w = (Math.ceil(((row + r) + 1) * cellSize) - Math.floor((row + r) * cellSize));
                        var h = (Math.ceil(((col + c) + 1) * cellSize) - Math.floor((col + c) * cellSize));
                        ctx.fillStyle = this.props.fgColor;
                        ctx.fillRect(Math.round((row + r) * cellSize) + offset, Math.round((col + c) * cellSize) + offset, w, h);
                    }
                }
            }
        }
    };
    ;
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
        var _a = this.props, value = _a.value, ecLevel = _a.ecLevel, enableCORS = _a.enableCORS, size = _a.size, quietZone = _a.quietZone, bgColor = _a.bgColor, fgColor = _a.fgColor, logoImage = _a.logoImage, logoWidth = _a.logoWidth, logoHeight = _a.logoHeight, logoOpacity = _a.logoOpacity, qrStyle = _a.qrStyle;
        var qrCode = qrGenerator(0, ecLevel);
        qrCode.addData(QRCode.utf16to8(value));
        qrCode.make();
        var canvas = ReactDOM.findDOMNode(this.canvas.current);
        var ctx = canvas.getContext('2d');
        var canvasSize = +size + (2 * +quietZone);
        var length = qrCode.getModuleCount();
        var cellSize = size / length;
        var scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = canvasSize * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        var offset = +quietZone;
        if (qrStyle === 'dots') {
            ctx.fillStyle = fgColor;
            var radius = cellSize / 2;
            for (var row = 0; row < length; row++) {
                for (var col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col)) {
                        ctx.beginPath();
                        ctx.arc(Math.round(col * cellSize) + radius + offset, Math.round(row * cellSize) + radius + offset, (radius / 100) * 75, 0, 2 * Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
            this.drawPositioningPattern(cellSize, offset, 0, 0, length, ctx);
            this.drawPositioningPattern(cellSize, offset, length - 7, 0, length, ctx);
            this.drawPositioningPattern(cellSize, offset, 0, length - 7, length, ctx);
        }
        else {
            for (var row = 0; row < length; row++) {
                for (var col = 0; col < length; col++) {
                    if (qrCode.isDark(row, col)) {
                        ctx.fillStyle = fgColor;
                        var w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
                        var h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
                        ctx.fillRect(Math.round(col * cellSize) + offset, Math.round(row * cellSize) + offset, w, h);
                    }
                }
            }
        }
        if (logoImage) {
            var image_1 = new Image();
            if (enableCORS) {
                image_1.crossOrigin = 'Anonymous';
            }
            image_1.onload = function () {
                var dwidth = logoWidth || size * 0.2;
                var dheight = logoHeight || dwidth;
                var dx = (size - dwidth) / 2;
                var dy = (size - dheight) / 2;
                image_1.width = dwidth;
                image_1.height = dheight;
                ctx.save();
                ctx.globalAlpha = logoOpacity;
                ctx.drawImage(image_1, dx + offset, dy + offset, dwidth, dheight);
                ctx.restore();
            };
            image_1.src = logoImage;
        }
    };
    QRCode.prototype.render = function () {
        var size = +this.props.size + (2 * +this.props.quietZone);
        return React.createElement('canvas', {
            id: 'react-qrcode-logo',
            height: size,
            width: size,
            style: { height: size + 'px', width: size + 'px' },
            ref: this.canvas
        });
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
        qrStyle: 'squares'
    };
    return QRCode;
}(React.Component));
exports.QRCode = QRCode;
