import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class MicroShotgun extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [1, 60, "shotgun"],
            [2, 60, ""],
            [3, 55, ""],
            [4, 55, ""],
            [5, 50, ""],
            [6, 50, ""],
            [7, 45, ""],
            [8, 45, ""],
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
            count: 8,
            recoil: 0.05,
            type: type,
        }));

        this.bullet = [
            [1, 3, 130],
            [2, 2.75, 132],
            [3, 2.5, 134],
            [4, 2.25, 136],
            [5, 2, 138],
            [6, 1.75, 140],
            [7, 1.5, 142],
            [8, 1.25, 144],
        ].map(([id, speed, range]) => ({
            ...this.bullet[0],
            id: id,
            speed: speed,
            armor  : 2, // 弾丸耐久力
            power  : 2.5, // 攻撃力
            penetration : 5, // 弾丸攻撃力
            duration: 30, // 初速持続時間
            deceleration: 0.01, // 減速率
            range  : range, // 消滅時間
            radius   : 4, // 弾丸半径
            recoil : 0.125, // 着弾反動
        }));

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}