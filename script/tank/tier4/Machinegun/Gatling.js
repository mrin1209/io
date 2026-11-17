import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Gatling extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

       this.gun = [
            [18.5, 30, 2.5],
            [13.2, 20, 7.5],
            [7.9, 10, 12.5],
            [2.6, 0, 15],
        ].flatMap(([y, shot, length]) =>
            [y, -y].map(y => ({
                ...this.gun[0],
                id: 1,
                x: 0,
                y: y,
                angle: 0,
                shot: shot,
                reload : 40, // 連射速度
                aim    : 25, // 拡散角度
                length : length,  // 砲身サイズ
                count  : 1, // 同時発射数
                recoil: 0.05, // 発射反動
                type: "normal",
            }))
        );

        this.bullet = [
            {
                ...this.bullet[0],
                id: 1,
                speed  : 5, // 弾丸速度
                armor  : 2, // 弾丸耐久力
                power  : 3, // 攻撃力
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