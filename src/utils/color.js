export function shade(hex, factor) {
    let n = parseInt(hex.replace('#', ''), 16);

    let r = (n >> 16) & 255;
    let g = (n >> 8) & 255;
    let b = n & 255;

    r *= factor;
    g *= factor;
    b *= factor;

    return `rgb(${r | 0},${g | 0},${b | 0})`;
}
