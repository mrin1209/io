import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Booster extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [0, 0, 0.25, 15],
            [125, 20, 1.5, 10],
            [235, 20, 1.5, 10],
            [155, 40, 0.75, 15],
            [205, 40, 0.75, 15],
        ].map(([angle, shot, recoil, length]) => ({
            ...this.gun[0],
            id: 1,
            x: 0,
            y: 0,
            angle: angle,
            shot: shot,
            reload: 60,
            aim: 10,
            length: length,
            count: 1,
            recoil: recoil,
            type: "normal",
        }));

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 3, // 弾丸速度
                armor  : 10, // 弾丸耐久力
                power  : 10, // 攻撃力
                penetration : 10, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 135, // 消滅時間
                radius   : 10, // 弾丸半径
                recoil : 1, // 着弾反動
            }
        ]

        this.previewColor = Color.green;

        super.setup(param);
    }
}