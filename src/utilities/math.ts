export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

export function map(
    v: number,
    minIn: number,
    maxIn: number,
    minOut: number,
    maxOut: number
): number {
    return ((v - minIn) * (maxOut - minOut)) / (maxIn - minIn) + minOut;
}

/**
 * Clamp value between min and max values
 * @param v number value
 * @param min number min value
 * @param max number max value
 * @returns number
 */
export function clamp(v: number, min: number = 0, max: number = 1) {
    if (v < min) v = min;
    if (v > max) v = max;
    return v;
}

export function sigmoid(v: number) {
    return (1 / (1 + Math.exp(-v))) * 2 - 1;
}

/**
 * Return random element from table
 * @param array table
 * @returns random element from table
 */
export function getRandomElement<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}
