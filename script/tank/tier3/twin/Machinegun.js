import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Machinegun extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [5, 0, 15],
            [-5, 0, 15],
            [15, 15, 10],
            [-15, 15, 10],
        ].map(([y, shot, length]) => ({
            ...this.gun[0],
            id: 1,
            x: 0,
            y: y,
            angle: 0,
            shot: shot,
            reload : 30, // 連射速度
            aim    : 10, // 拡散角度
            length : length,  // 砲身サイズ
            count  : 1, // 同時発射数
            recoil: 0.2, // 発射反動
            type: "normal",
        }));

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 5, // 弾丸速度
                armor  : 2, // 弾丸耐久力
                power  : 5, // 攻撃力
                penetration : 5, // 弾丸攻撃力
                duration: 30, // 初速持続時間
                deceleration: 0.01, // 減速率
                range  : 135, // 消滅時間
                radius   : 4, // 弾丸半径
                recoil : 0.2, // 着弾反動
            }
        ]

        this.previewColor = Color.yellow;

        super.setup(param);
    }
}