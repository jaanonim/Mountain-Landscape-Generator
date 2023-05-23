import Random from "./random";

export interface PerlinData {
    size: number;
    offset: number;
    octaves: number;
    frequency: number;
    amplitude: number;
}

export default class PerlinNoise {
    seeds: number[];
    slopes: { [id: number]: number };
    random: Random;

    constructor(seed: string = "xQG3LKS8Pe") {
        this.seeds = Random.cyrb128(seed);
        this.random = new Random(seed);
        this.slopes = {};
        //TODO: Fix this
        for (let i = -1; i < 100000; i++) {
            this.slopeAt(i);
        }
    }

    _slopeAt(x: number): number {
        const n = Random.sfc32(
            x * this.seeds[0],
            x * this.seeds[1],
            x * this.seeds[2],
            x * this.seeds[3]
        )[0];
        return n * 2 - 1;
    }

    slopeAt(x: number): number {
        if (!this.slopes[x]) this.slopes[x] = this.random.rand();

        return this.slopes[x];
    }

    perlin(x: number): number {
        const lo = Math.floor(x);
        const hi = lo + 1;
        const dist = x - lo;
        const loSlope = this.slopeAt(lo);
        const hiSlope = this.slopeAt(hi);
        const loPos = loSlope * dist;
        const hiPos = -hiSlope * (1 - dist);
        const u = dist * dist * (3.0 - 2.0 * dist); // cubic curve
        return loPos * (1 - u) + hiPos * u; // interpolate
    }

    perlin1D({
        size,
        offset,
        octaves,
        frequency,
        amplitude,
    }: PerlinData): number[] {
        const octavesH: Array<number[]> = [];
        for (let o = 0; o < octaves; o++) {
            const start = o * 24570.63;
            const freq = frequency * Math.pow(2, o + 1);
            const amp = Math.pow(2, octaves - o) * amplitude;

            const heights: number[] = [];

            for (let x = 0; x < size; x++) {
                let v = 0;
                const pos = (offset + (x + start)) * freq;
                v += this.perlin(pos) * amp;
                heights.push(v);
            }
            octavesH.push(heights);
        }

        const res = [];
        for (let x = 0; x < size; x++) {
            res.push(octavesH.reduce((p: number, c: number[]) => p + c[x], 0));
        }
        return res;
    }
}
