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
var isEqual = require("lodash.isequal");
var qrcode = require("qrcode-generator");
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
        var _a = this.props, value = _a.value, ecLevel = _a.ecLevel, enableCORS = _a.enableCORS, size = _a.size, bgColor = _a.bgColor, fgColor = _a.fgColor, logoImage = _a.logoImage, logoWidth = _a.logoWidth, logoHeight = _a.logoHeight, logoOpacity = _a.logoOpacity;
        var myqrcode = qrcode(0, ecLevel);
        myqrcode.addData(QRCode.utf16to8(value));
        myqrcode.make();
        var canvas = ReactDOM.findDOMNode(this.canvas.current);
        var ctx = canvas.getContext('2d');
        var tileW = size / myqrcode.getModuleCount();
        var tileH = size / myqrcode.getModuleCount();
        var scale = (window.devicePixelRatio || 1);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);
        for (var i = 0; i < (myqrcode.getModuleCount()); i++) {
            for (var j = 0; j < (myqrcode.getModuleCount()); j++) {
                ctx.fillStyle = myqrcode.isDark(i, j) ? fgColor : bgColor;
                var w = (Math.ceil((j + 1) * tileW) - Math.floor(j * tileW));
                var h = (Math.ceil((i + 1) * tileH) - Math.floor(i * tileH));
                ctx.fillRect(Math.round(j * tileW), Math.round(i * tileH), w, h);
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
                ctx.drawImage(image_1, dx, dy, dwidth, dheight);
                ctx.restore();
            };
            image_1.src = logoImage;
        }
    };
    QRCode.prototype.render = function () {
        return React.createElement('canvas', {
            id: 'react-qrcode-logo',
            height: this.props.size,
            width: this.props.size,
            style: __assign({ height: this.props.size + 'px', width: this.props.size + 'px', padding: this.props.padding + 'px', background: this.props.bgColor }, this.props.style),
            ref: this.canvas
        });
    };
    QRCode.defaultProps = {
        value: 'https://reactjs.org/',
        ecLevel: 'M',
        enableCORS: false,
        size: 150,
        padding: 10,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1
    };
    return QRCode;
}(React.Component));
exports.QRCode = QRCode;
