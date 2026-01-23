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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
var react_1 = __importDefault(require("react"));
var qrcode_generator_1 = __importDefault(require("qrcode-generator"));
var QRCode = /** @class */ (function (_super) {
    __extends(QRCode, _super);
    function QRCode(props) {
        var _this = _super.call(this, props) || this;
        _this.canvasRef = react_1.default.createRef();
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
    QRCode.prototype.isInPositioninZone = function (row, col, zones) {
        return zones.some(function (zone) { return (row >= zone.row && row <= zone.row + 7 &&
            col >= zone.col && col <= zone.col + 7); });
    };
    /**
     * Checks whether the coordinate is behind the logo and needs to be removed. true if the coordinate is behind the logo and needs to be removed.
     */
    QRCode.prototype.removeCoordinateBehindLogo = function (removeQrCodeBehindLogo, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle) {
        if (logoPadding === void 0) { logoPadding = 0; }
        if (logoPaddingStyle === void 0) { logoPaddingStyle = 'square'; }
        if (!removeQrCodeBehindLogo || !logoImage) {
            return false;
        }
        var paddingInCells = Math.ceil(logoPadding / cellSize);
        var snappedPadding = paddingInCells * cellSize;
        var absolute_dxLogo = dxLogo + offset;
        var absolute_dyLogo = dyLogo + offset;
        var cellLeft = Math.round(col * cellSize) + offset;
        var cellTop = Math.round(row * cellSize) + offset;
        var w = (Math.ceil((col + 1) * cellSize) - Math.floor(col * cellSize));
        var h = (Math.ceil((row + 1) * cellSize) - Math.floor(row * cellSize));
        var cellRight = cellLeft + w;
        var cellBottom = cellTop + h;
        if (logoPaddingStyle === 'square') {
            var logoLeft = absolute_dxLogo - snappedPadding;
            var logoRight = absolute_dxLogo + dWidthLogo + snappedPadding;
            var logoTop = absolute_dyLogo - snappedPadding;
            var logoBottom = absolute_dyLogo + dHeightLogo + snappedPadding;
            var overlapX = cellLeft < logoRight && cellRight > logoLeft;
            var overlapY = cellTop < logoBottom && cellBottom > logoTop;
            return overlapX && overlapY;
        }
        if (logoPaddingStyle === 'circle') {
            var logoCenterX = absolute_dxLogo + dWidthLogo / 2;
            var logoCenterY = absolute_dyLogo + dHeightLogo / 2;
            var circleRadius = (Math.max(dWidthLogo, dHeightLogo) / 2) + snappedPadding;
            var closestX = Math.max(cellLeft, Math.min(logoCenterX, cellRight));
            var closestY = Math.max(cellTop, Math.min(logoCenterY, cellBottom));
            var distanceX = logoCenterX - closestX;
            var distanceY = logoCenterY - closestY;
            var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
            return distanceSquared < (circleRadius * circleRadius);
        }
        return false;
    };
    QRCode.prototype.shouldComponentUpdate = function (nextProps) {
        return !deepEqual(this.props, nextProps);
    };
    QRCode.prototype.componentDidMount = function () {
        this.update();
    };
    QRCode.prototype.componentDidUpdate = function () {
        this.update();
    };
    QRCode.prototype.update = function () {
        var _a;
        var _b = this.props, value = _b.value, ecLevel = _b.ecLevel, enableCORS = _b.enableCORS, bgColor = _b.bgColor, fgColor = _b.fgColor, logoImage = _b.logoImage, logoOpacity = _b.logoOpacity, logoOnLoad = _b.logoOnLoad, removeQrCodeBehindLogo = _b.removeQrCodeBehindLogo, qrStyle = _b.qrStyle, eyeRadius = _b.eyeRadius, eyeColor = _b.eyeColor, logoPaddingStyle = _b.logoPaddingStyle, logoPaddingRadius = _b.logoPaddingRadius;
        // just make sure that these params are passed as numbers
        var size = +this.props.size;
        var quietZone = +this.props.quietZone;
        var logoWidth = this.props.logoWidth ? +this.props.logoWidth : 0;
        var logoHeight = this.props.logoHeight ? +this.props.logoHeight : 0;
        var logoPadding = this.props.logoPadding ? +this.props.logoPadding : 0;
        var qrCode = (0, qrcode_generator_1.default)(0, ecLevel);
        qrCode.addData(this.utf16to8(value));
        qrCode.make();
        var canvas = (_a = this.canvasRef) === null || _a === void 0 ? void 0 : _a.current;
        var ctx = canvas.getContext('2d');
        var canvasSize = size + (2 * quietZone);
        var length = qrCode.getModuleCount();
        var cellSize = size / length;
        var scale = (window.devicePixelRatio || 1);
        var dWidthLogo = logoWidth || size * 0.2;
        var dHeightLogo = logoHeight || dWidthLogo;
        var dxLogo = ((size - dWidthLogo) / 2);
        var dyLogo = ((size - dHeightLogo) / 2);
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
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo !== null && removeQrCodeBehindLogo !== void 0 ? removeQrCodeBehindLogo : false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
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
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo !== null && removeQrCodeBehindLogo !== void 0 ? removeQrCodeBehindLogo : false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
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
                    if (qrCode.isDark(row, col) && !this.isInPositioninZone(row, col, positioningZones)
                        && !this.removeCoordinateBehindLogo(removeQrCodeBehindLogo !== null && removeQrCodeBehindLogo !== void 0 ? removeQrCodeBehindLogo : false, row, col, dWidthLogo, dHeightLogo, dxLogo, dyLogo, cellSize, offset, logoImage, logoPadding, logoPaddingStyle)) {
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
                if (logoPadding) {
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
                        ctx.roundRect(dxLogoPadding, dyLogoPadding, dWidthLogoPadding, dHeightLogoPadding, logoPaddingRadius);
                        ctx.stroke();
                        ctx.fill();
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
        return react_1.default.createElement("canvas", { id: (_a = this.props.id) !== null && _a !== void 0 ? _a : 'react-qrcode-logo', height: qrSize, width: qrSize, style: __assign({ height: qrSize + 'px', width: qrSize + 'px' }, this.props.style), ref: this.canvasRef });
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
        logoPaddingStyle: 'square',
        logoPaddingRadius: 0
    };
    return QRCode;
}(react_1.default.Component));
exports.QRCode = QRCode;
function deepEqual(a, b, visited) {
    var e_1, _a, e_2, _b, e_3, _c;
    if (visited === void 0) { visited = new WeakMap(); }
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
        for (var i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i], visited))
                return false;
        }
        return true;
    }
    // sets
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size)
            return false;
        var _loop_1 = function (val) {
            if (!__spreadArray([], __read(b), false).some(function (bVal) { return deepEqual(val, bVal, visited); }))
                return { value: false };
        };
        try {
            for (var a_1 = __values(a), a_1_1 = a_1.next(); !a_1_1.done; a_1_1 = a_1.next()) {
                var val = a_1_1.value;
                var state_1 = _loop_1(val);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (a_1_1 && !a_1_1.done && (_a = a_1.return)) _a.call(a_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    }
    // maps
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size)
            return false;
        try {
            for (var a_2 = __values(a), a_2_1 = a_2.next(); !a_2_1.done; a_2_1 = a_2.next()) {
                var _d = __read(a_2_1.value, 2), key = _d[0], val = _d[1];
                if (!b.has(key) || !deepEqual(val, b.get(key), visited))
                    return false;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (a_2_1 && !a_2_1.done && (_b = a_2.return)) _b.call(a_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    }
    // plain objects
    if (Object.getPrototypeOf(a) === Object.prototype ||
        Object.getPrototypeOf(a) === null) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        if (keysA.length !== keysB.length)
            return false;
        try {
            for (var keysA_1 = __values(keysA), keysA_1_1 = keysA_1.next(); !keysA_1_1.done; keysA_1_1 = keysA_1.next()) {
                var key = keysA_1_1.value;
                if (!keysB.includes(key))
                    return false;
                if (!deepEqual(a[key], b[key], visited))
                    return false;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (keysA_1_1 && !keysA_1_1.done && (_c = keysA_1.return)) _c.call(keysA_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return true;
    }
    // remaining objects with custom prototypes (e.g., DOMPointInit, CSSProperties)
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    catch (_e) {
        return false;
    }
}
exports.default = QRCode;
