import Drawer from "./drawer";
import "./style.css";
import Random from "./utilities/random";

function main(): void {
    const canvasHTML = document.getElementById("root") as HTMLCanvasElement;
    if (!canvasHTML) throw Error("Missing canvas");

    canvasHTML.onclick = () => {
        const ele = document.getElementById("options") as HTMLElement;
        if (ele.classList.contains("hidden")) ele.classList.remove("hidden");
        else ele.classList.add("hidden");
    };

    document.getElementById("download")!.onclick = () => {
        const link = document.createElement("a");
        link.download = "img.png";
        link.href = canvasHTML.toDataURL();
        link.click();
    };

    const ctx = canvasHTML.getContext("2d");
    if (!ctx) throw Error("Missing ctx");

    const seed = window.location.pathname.split("/")[1];
    generate(ctx, seed);

    document.getElementById("regenerate")!.onclick = () => {
        const seed = Random.generateSeed(6);
        window.history.replaceState(
            { additionalInformation: "Regenerated seed" },
            seed,
            seed
        );
        generate(ctx, seed);
    };
}

function generate(ctx: CanvasRenderingContext2D, seed: string) {
    const drawer = new Drawer(ctx, seed);

    onResize(ctx, drawer);
    window.onresize = () => {
        onResize(ctx, drawer);
    };
}

function onResize(ctx: CanvasRenderingContext2D, drawer: Drawer) {
    ctx.canvas.width = document.body.clientWidth;
    ctx.canvas.height = document.body.clientHeight;
    drawer.draw();
    generateFavicon(ctx);
}

function generateFavicon(originalCtx: CanvasRenderingContext2D) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = canvas.width;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw Error("Missing ctx");

    const w = originalCtx.canvas.width;
    const h = originalCtx.canvas.height;
    const xOffset = w > h ? (w - h) / 2 : 0;
    const yOffset = w < h ? (h - w) / 2 : 0;
    const size = Math.min(w, h);

    ctx.drawImage(
        originalCtx.canvas,
        xOffset,
        yOffset,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.globalCompositeOperation = "destination-in";

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(
        canvas.width / 2,
        canvas.width / 2,
        canvas.width / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    const link = document.getElementById("favicon") as HTMLLinkElement;
    link.href = canvas.toDataURL("image/x-icon");
}

main();
