export default class Random {
    a: number;
    b: number;
    c: number;
    d: number;

    static _instance: Random;

    constructor(seed: string = "xQG3LKS8Pe") {
        const seeds = Random.cyrb128(seed);
        this.a = seeds[0];
        this.b = seeds[1];
        this.c = seeds[2];
        this.d = seeds[3];
    }

    static cyrb128(str: string) {
        let h1 = 1779033703,
            h2 = 3144134277,
            h3 = 1013904242,
            h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [
            (h1 ^ h2 ^ h3 ^ h4) >>> 0,
            (h2 ^ h1) >>> 0,
            (h3 ^ h1) >>> 0,
            (h4 ^ h1) >>> 0,
        ];
    }

    static sfc32(a: number, b: number, c: number, d: number) {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return [(t >>> 0) / 4294967296, a, b, c, d];
    }

    rand(): number {
        const [n, a, b, c, d] = Random.sfc32(this.a, this.b, this.c, this.d);
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        return n;
    }

    static init(seed: string | undefined) {
        this._instance = new Random(seed);
    }

    static rand(): number {
        if (!this._instance) throw Error("Random not initialized");
        const [n, a, b, c, d] = this.sfc32(
            this._instance.a,
            this._instance.b,
            this._instance.c,
            this._instance.d
        );
        this._instance.a = a;
        this._instance.b = b;
        this._instance.c = c;
        this._instance.d = d;
        return n;
    }

    static generateSeed(length: number): string {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
            counter += 1;
        }
        return result;
    }
}
