export function theme(theme) {
    switch (theme) {
        case 'autumn':
            return {
                grass: '#d7a86e',
                ground: '#4e342e'
            };
        case 'spring':
            return {
                grass: '#85da28',
                ground: '#543825'
            };
        case 'summer':
            return {
                grass: '#009134',
                ground: '#5d130a'
            };
        case 'winter':
            return {
                grass: '#bdf0ff',
                ground: '#b1d8e0'
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
