import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Shotgun extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [1, 45, "shotgun"],
            [2, 40, ""],
            [3, 35, ""],
            [4, 30, ""],
        ].map(([id, aim, type]) => ({
            ...this.gun[0],
            id: id,
            x: 0,
            y: 0,
            angle: 0,
            shot: 0,
            reload: 40,
            aim: aim,
            length: 20,
            count: 3,
            recoil: 0.05,
            type: type,
        }));

        this.bullet = [
            [1, 2, 90],
            [2, 1.7, 85],
            [3, 1.5, 80],
            [4, 1.3, 75],
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
            recoil: 0.25,
        }));

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}