import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class ShotRifle extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [1, 5, "shotgun"],
            [2, 5, ""],
            [3, 5, ""],
        ].map(([id, aim, type]) => ({
            ...this.gun[0],
            id: id,
            x: 0,
            y: 0,
            angle: 0,
            shot: 0,
            reload: 60,
            aim: aim,
            length: 20,
            count: 1,
            recoil: 0.5,
            type: type,
        }));

        this.bullet = [
            [1, 6, 135],
            [2, 5.5, 150],
            [3, 5, 165],
        ].map(([id, speed, range]) => ({
            ...this.bullet[0],
            id: id,
            speed: speed,
            armor: 10,
            power: 10,
            penetration: 10,
            duration: 30,
            deceleration: 0.01,
            range: range,
            radius: 10,
            recoil: 0.5,
        }));

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}