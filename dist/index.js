"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var qr = require("qr.js");
var isEqual = require("lodash.isequal");
var QRCode = /** @class */ (function (_super) {
    __extends(QRCode, _super);
    function QRCode(props) {
        var _this = _super.call(this, props) || this;
        _this.canvas = React.createRef();
        return _this;
    }
    QRCode.getBackingStorePixelRatio = function (ctx) {
        return (ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1);
    };
    QRCode.utf16to8 = function (str) {
        var out, i, len, c;
        out = '';
        len = str.length;
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
        var _this = this;
        var value = QRCode.utf16to8(this.props.value);
        var qrcode = qr(value);
        var canvas = ReactDOM.findDOMNode(this.canvas.current);
        var ctx = canvas.getContext('2d');
        var cells = qrcode.modules;
        var tileW = this.props.size / cells.length;
        var tileH = this.props.size / cells.length;
        var scale = (window.devicePixelRatio || 1) / QRCode.getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = this.props.size * scale;
        ctx.scale(scale, scale);
        cells.forEach(function (row, rdx) {
            row.forEach(function (cell, cdx) {
                ctx.fillStyle = cell ? _this.props.fgColor : _this.props.bgColor;
                var w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                var h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            }, _this);
        }, this);
        if (this.props.logoImage) {
            var image_1 = new Image();
            image_1.onload = function () {
                var dwidth = _this.props.logoWidth || _this.props.size * 0.2;
                var dheight = _this.props.logoHeight || dwidth;
                var dx = (_this.props.size - dwidth) / 2;
                var dy = (_this.props.size - dheight) / 2;
                image_1.width = dwidth;
                image_1.height = dheight;
                ctx.save();
                ctx.globalAlpha = _this.props.logoOpacity;
                ctx.drawImage(image_1, dx, dy, dwidth, dheight);
                ctx.restore();
            };
            image_1.src = this.props.logoImage;
        }
    };
    QRCode.prototype.render = function () {
        return React.createElement('canvas', {
            height: this.props.size,
            width: this.props.size,
            style: Object.assign({
                height: this.props.size + 'px', width: this.props.size + 'px',
                padding: (100 * this.props.padding) / this.props.size + '%', background: this.props.bgColor
            }, this.props.style),
            ref: this.canvas
        });
    };
    QRCode.defaultProps = {
        value: 'https://reactjs.org/',
        size: 150,
        padding: 40,
        bgColor: '#FFFFFF',
        fgColor: '#000000',
        logoOpacity: 1
    };
    return QRCode;
}(React.Component));
exports.QRCode = QRCode;
