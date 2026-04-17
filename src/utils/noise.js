export function noise(x, y) {
    let n = x * 374761393 + y * 668265263 + 0x9e3779b9;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}