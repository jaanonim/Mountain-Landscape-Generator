import Color from "./utilities/color";

export default async function getPallet(...args: Color[]) {
    if (args.length > 5) throw new Error("Too many args");

    const input = new Array(5).fill(0).map((_, i) => {
        if (args[i]) {
            return [args[i].r, args[i].g, args[i].b];
        }
        return "N";
    });

    const res = await fetch("http://colormind.io/api/", {
        method: "POST",
        body: JSON.stringify({
            model: "default",
            input: input,
        }),
    });
    const data = await res.json();
    return data.result.map(
        (ele: number[]) => new Color(ele[1], ele[2], ele[3], 255)
    );
}
