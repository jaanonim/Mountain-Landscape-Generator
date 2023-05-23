import { clamp } from "./math";

export default class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    static get red() {
        return new Color(255, 0, 0, 255);
    }
    static get green() {
        return new Color(0, 255, 0, 255);
    }
    static get blue() {
        return new Color(0, 0, 255, 255);
    }
    static get yellow() {
        return new Color(255, 255, 0, 255);
    }
    static get magenta() {
        return new Color(255, 0, 255, 255);
    }
    static get cyan() {
        return new Color(0, 255, 255, 255);
    }
    static get white() {
        return new Color(255, 255, 255, 255);
    }
    static get black() {
        return new Color(0, 0, 0, 255);
    }
    static get opaque() {
        return new Color(0, 0, 0, 0);
    }

    static random() {
        return new Color(
            Math.round((Math.random() * 255) / 25) * 25,
            Math.round((Math.random() * 255) / 25) * 25,
            Math.round((Math.random() * 255) / 25) * 25,
            255
        );
    }

    static fromHex(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) throw Error("Invalid hex value for color");
        return new Color(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            255
        );
    }

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
        this.r = clamp(r, 0, 255);
        this.g = clamp(g, 0, 255);
        this.b = clamp(b, 0, 255);
        this.a = clamp(a, 0, 255);
    }

    verifyValue(v: number) {
        return v <= 255 && v >= 0;
    }

    _valueToHex(v: number) {
        var hex = v.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    getHex() {
        return (
            "#" +
            this._valueToHex(this.r) +
            this._valueToHex(this.g) +
            this._valueToHex(this.b)
        );
    }

    getStringRGBA() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    multiply(v: number): Color;
    multiply(v: Color): Color;
    multiply(v: number | Color) {
        if (v instanceof Color) {
            this.r = this.r * v.r;
            this.g = this.g * v.g;
            this.b = this.b * v.b;
            this.a = this.a * v.a;
            return this;
        } else {
            this.r *= v;
            this.g *= v;
            this.b *= v;
            return this;
        }
    }

    normalize() {
        this.r /= 255;
        this.g /= 255;
        this.b /= 255;
        this.a /= 255;
        return this;
    }

    denormalize() {
        this.r = Math.round(this.r * 255);
        this.g = Math.round(this.g * 255);
        this.b = Math.round(this.b * 255);
        this.a = Math.round(this.a * 255);
        return this;
    }

    add(v: Color) {
        this.r = clamp(this.r + v.r, 0, 255);
        this.g = clamp(this.g + v.g, 0, 255);
        this.b = clamp(this.b + v.b, 0, 255);
        this.a = clamp(this.a + v.a, 0, 255);
        return this;
    }

    subtract(v: Color) {
        this.r = clamp(this.r - v.r, 0, 255);
        this.g = clamp(this.g - v.g, 0, 255);
        this.b = clamp(this.b - v.b, 0, 255);
        this.a = clamp(this.a - v.a, 0, 255);
        return this;
    }

    blend(v: Color) {
        //! Important TODO
        if (v.a == 0) return this; //TODO: This is quick fix and it need to be replaced.
        this.multiply(1 - this.a / 255).add(v.multiply(v.a / 255));
        return this;
    }

    getSubjectiveBrightness() {
        const n = this.copy().normalize();
        return (0.21 * n.r + 0.72 * n.g + 0.07 * n.b) * n.a;
    }
}
