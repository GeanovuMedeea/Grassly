export function shade(hex, factor, shift = 1) {
    let n = parseInt(hex.replace('#', ''), 16);

    let r = (n >> 16) & 255;
    let g = (n >> 8) & 255;
    let b = n & 255;

    r *= factor;
    g *= factor;
    b *= factor;

    r *= shift;
    g *= (2 - shift);
    b *= (1 + (shift - 1) * 0.5);

    const c = 1.1;
    r = (r - 128) * c + 128;
    g = (g - 128) * c + 128;
    b = (b - 128) * c + 128;

    return `rgb(${r | 0},${g | 0},${b | 0})`;
}
