import Tank from "../../tank.js";
import Color from "../../../config/color.js";

export default class Crown extends Tank {
    constructor(param) {
        super(param);

        this.tank = {
            ...this.tank,
            zoom   : 1, // ズーム率
            recoil : 1, // 接触反動
        }

        this.gun = [
            [22.5, 30, 15],
            [67.5, 30, 15],
            [112.5, 30, 15],
            [157.5, 30, 15],
            [202.5, 30, 15],
            [247.5, 30, 15],
            [292.5, 30, 15],
            [337.5, 30, 15],
            [45, 0, 20],
            [135, 0, 20],
            [225, 0, 20],
            [315, 0, 20],
            [0, 0, 20],
            [90, 0, 20],
            [180, 0, 20],
            [270, 0, 20],
        ].map(([angle, shot, length]) => ({
            ...this.gun[0],
            id: 1,
            x: 0,
            y: 0,
            angle: angle,
            shot: shot,
            reload : 60, // 連射速度
            aim    : 10, // 拡散角度
            length : length,  // 砲身サイズ
            count  : 1, // 同時発射数
            recoil : 0.25, // 発射反動
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
                radius   : 10, // 弾丸半径
                recoil : 0.25, // 着弾反動
            }
        ]

        this.previewColor = Color.blue;

        super.setup(param);
    }
}