export function theme(theme) {
    switch (theme) {
        case 'autumn':
            return {
                grass: '#d7a86e',
                ground: '#4e342e'
            };
        case 'neon':
            return {
                grass: '#00ffcc',
                ground: '#11266a'
            };
        case 'lilac':
            return {
                grass: '#cc9fed',
                ground: '#81b3a0'
            };
        case 'desert':
            return {
                grass: '#DBD2B6',
                ground: '#f0edce'
            };
        default:
            return {
                grass: '#81c784',
                ground: '#3e2723'
            };
    }
}
