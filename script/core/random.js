export default class Random {
    constructor(seed = 52519) {
        this.seed = seed;
    }

    get(min = 0, max = 1) {
        this.seed = (this.seed * 16807) % 2147483647;

        const value = (this.seed - 1) / 2147483646;

        return min + value * (max - min);
    }

    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = this.get(0, 16) | 0;
            return (c === 'x' ? r : (r & 3) | 8).toString(16);
        });
    }
}