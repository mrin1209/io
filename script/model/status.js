import Color from "../config/color.js";
import Config from "../config/config.js";

export default class Status {
    constructor() {
        this.items = [
            { key: "tank.armor", name: "Health", count: 0, max: 10, rate: 0.25, direction: 1, color: Color.orange },
            { key: "tank.power", name: "Body Power", count: 0, max: 10, rate: 0.25, direction: 1, color: Color.red },
            { key: "tank.speed", name: "Move Speed", count: 0, max: 10, rate: 0.05, direction: 1, color: Color.yellow },
            { key: "gun.reload", name: "Reload", count: 0, max: 10, rate: 0.05, direction: -1, color: Color.green },
            { key: "bullet.power", name: "Bullet Power", count: 0, max: 10, rate: 0.1, direction: 1, color: Color.blue },
            { key: "bullet.armor", name: "Bullet Armor", count: 0, max: 10, rate: 0.1, direction: 1, color: Color.purple },
            { key: "bullet.speed", name: "Bullet Speed", count: 0, max: 10, rate: 0.05, direction: 1, color: Color.pink },
        ];
    }

    update(key) {
        const item = this.items.find(item => item.key === key);

        if (!item || item.count >= Config.max.status) return null;

        item.count++;

        return item;
    }
}