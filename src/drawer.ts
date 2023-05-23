import Color from "./utilities/color";
import Event from "./utilities/event";
import PerlinNoise, { PerlinData } from "./utilities/perlinNoise";

export default class Drawer {
    perlin: PerlinNoise;
    offset: number;
    deltaTime: number;
    stars: { x: number; y: number; l: number }[];
    public onOffsetChange: Event<number>;
    pallet: Color[];

    constructor(
        private ctx: CanvasRenderingContext2D,
        private animate: boolean
    ) {
        this.perlin = new PerlinNoise();
        this.offset = 0;
        this.deltaTime = 1;
        this.onOffsetChange = new Event();

        this.stars = [];
        this.pallet = [
            Color.fromHex("#050515"),
            Color.fromHex("#050515"),
            Color.fromHex("#2d1d7a"),
            Color.fromHex("#fd8046"),
            Color.fromHex("#ff5533"),
        ];
    }

    setOffset(n: number) {
        this.offset = n;
    }

    changeAnimate() {
        this.animate = !this.animate;
    }

    regenerate(seed: string) {
        this.perlin = new PerlinNoise(seed);
        //this.offset = 0;
    }

    onResize() {
        this.stars = [];
        const size = Math.max(this.ctx.canvas.width, this.ctx.canvas.height);
        for (let i = 0; i < 100; i++) {
            const x = this.perlin.random.randInt(size);
            const y = this.perlin.random.randInt(size);
            const l = this.perlin.random.rand() / 10 + 0.1;
            this.stars.push({ x, y, l });
        }
    }

    async background() {
        const size = Math.max(this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = this.pallet[0].getHex();
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const gradient = this.ctx.createRadialGradient(
            this.ctx.canvas.width / 2,
            this.offset / 2,
            130,
            this.ctx.canvas.width / 2,
            this.offset / 5,
            size
        );
        gradient.addColorStop(0, this.pallet[4].getHex());
        gradient.addColorStop(0.00001, this.pallet[3].getHex());
        gradient.addColorStop(0.4, this.pallet[2].getHex());
        gradient.addColorStop(1, this.pallet[1].getHex());
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        const angle = this.offset / 2000;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        this.stars.forEach((s) => {
            const tx = s.x - this.ctx.canvas.width / 2;
            const ty = s.y - this.ctx.canvas.height;
            const x = tx * cos - ty * sin;
            const y = tx * sin + ty * cos;
            this.star(
                x + this.ctx.canvas.width / 2,
                y + this.ctx.canvas.height,
                s.l
            );
        });
    }

    star(x: number, y: number, l: number) {
        const data = this.ctx.getImageData(x, y, 1, 1).data;
        const color = new Color(data[0], data[1], data[2], data[3]);

        const b = color.getSubjectiveBrightness();
        const c = l * 100 - b * 100;
        if (c > 0) {
            this.ctx.fillStyle = new Color(255, 255, 255, c).getStringRGBA();
            this.ctx.fillRect(x, y, 2, 2);
        }
    }

    drawMountainRange(
        posY: number,
        colorStart: Color,
        colorEnd: Color,
        perlinData: PerlinData
    ) {
        const heights = this.perlin.perlin1D(perlinData);

        const gradient = this.ctx.createLinearGradient(
            0,
            0,
            0,
            this.ctx.canvas.height
        );
        gradient.addColorStop(0, colorStart.getHex());
        gradient.addColorStop(1, colorEnd.getHex());
        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ctx.canvas.height);
        this.ctx.lineTo(0, posY);
        for (let x = 0; x < this.ctx.canvas.width; x++) {
            this.ctx.lineTo(x, posY + heights[x]);
        }
        this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        const start = performance.now();

        this.draw();

        requestAnimationFrame(() => {
            this.deltaTime = performance.now() - start;
            this.update();
        });
    }

    async draw() {
        this.background();

        /*
            Color.fromHex("#103050"),
            Color.fromHex("#002030"),
            Color.fromHex("#102040"),
            Color.fromHex("#001014"),
            Color.fromHex("#012030"),
            Color.fromHex("#000102"),
        */

        const base = Color.fromHex("#000102");
        const step = new Color(10, 10, 20);

        this.drawMountainRange(
            this.ctx.canvas.height / 2,
            base.copy().add(step.copy().multiply(4)),
            base.copy().add(step.copy().multiply(2)),
            {
                size: this.ctx.canvas.width,
                offset: this.offset,
                octaves: 4,
                frequency: 0.001,
                amplitude: 50,
            }
        );

        this.drawMountainRange(
            (this.ctx.canvas.height * 7) / 10,
            base.copy().add(step.copy().multiply(3)),
            base.copy().add(step.copy()),
            {
                size: this.ctx.canvas.width,
                offset: 2000 + this.offset * 2,
                octaves: 4,
                frequency: 0.0005,
                amplitude: 70,
            }
        );

        this.drawMountainRange(
            (this.ctx.canvas.height * 4) / 5,
            base.copy().add(step.multiply(2)),
            base,
            {
                size: this.ctx.canvas.width,
                offset: 4000 + this.offset * 4,
                octaves: 2,
                frequency: 0.001,
                amplitude: 90,
            }
        );
        if (this.animate) this.offset += this.deltaTime / 20;
        this.onOffsetChange.call(this.offset);
    }
}
