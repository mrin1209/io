import Config from "../config/config.js"

export default class Random {
    constructor(seed = Config.seed) {
        this.seed = this.toSeed(seed);
    }

    toSeed(seed) {
        if (typeof seed === "number") {
            return Math.abs(Math.floor(seed)) % 2147483646 + 1;
        }

        let hash = 2166136261;

        for (let i = 0; i < seed.length; i++) {
            hash ^= seed.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        return (hash >>> 0) % 2147483646 + 1;
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