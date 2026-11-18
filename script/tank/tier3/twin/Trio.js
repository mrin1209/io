import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Trio extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [12.5, 15, 30],
            [-12.5, -15, 30],
            [0, 0, 0],
        ].map(([y, angle, shot ]) => ({
            ...this.gun[0],
            id: 1,
            x: 0,
            y: y,
            angle: angle,
            shot: shot,
            reload : 60, // 連射速度
            aim    : 20, // 拡散角度
            length : 10,  // 砲身サイズ
            count  : 1, // 同時発射数
            recoil : 0.125, // 発射反動
            type: 'normal',
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
                radius   : 7.5, // 弾丸半径
                recoil : 0.125, // 着弾反動
            }
        ]

        this.previewColor = Color.red;

        super.setup(param);
    }
}