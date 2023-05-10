import Color from "./utilities/color";
import PerlinNoise, { PerlinData } from "./utilities/perlinNoise";

export default class Drawer {
    perlin: PerlinNoise;
    constructor(
        private ctx: CanvasRenderingContext2D,
        seed?: string | undefined
    ) {
        this.perlin = new PerlinNoise(seed);
    }

    background() {
        const gradient = this.ctx.createLinearGradient(
            0,
            0,
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );
        gradient.addColorStop(0, "#000001");
        gradient.addColorStop(1, "#111112");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    background2() {
        const size = Math.max(this.ctx.canvas.width, this.ctx.canvas.height);
        const gradient = this.ctx.createRadialGradient(
            this.ctx.canvas.width / 2,
            this.ctx.canvas.height / 2,
            130,
            this.ctx.canvas.width / 2,
            this.ctx.canvas.height / 2,
            size / 2
        );
        gradient.addColorStop(0, "#ff5533");
        gradient.addColorStop(0.00001, "#fd8046");
        gradient.addColorStop(1, "#2d1d7a");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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

    draw() {
        this.background2();

        this.drawMountainRange(
            this.ctx.canvas.height / 2,
            Color.fromHex("#204070"),
            Color.fromHex("#000204"),
            {
                size: this.ctx.canvas.width,
                offset: 0,
                octaves: 4,
                frequency: 0.001,
                amplitude: 50,
            }
        );

        this.drawMountainRange(
            (this.ctx.canvas.height * 7) / 10,
            Color.fromHex("#153057"),
            Color.fromHex("#000204"),
            {
                size: this.ctx.canvas.width,
                offset: 2000,
                octaves: 4,
                frequency: 0.0005,
                amplitude: 70,
            }
        );

        this.drawMountainRange(
            (this.ctx.canvas.height * 4) / 5,
            Color.fromHex("#012030"),
            Color.fromHex("#000102"),
            {
                size: this.ctx.canvas.width,
                offset: 4000,
                octaves: 2,
                frequency: 0.001,
                amplitude: 90,
            }
        );
    }
}
