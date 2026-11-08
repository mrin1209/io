import Config from "../config/config.js";

export default class Camera {
    constructor(p) {
        this.p = p;
    }

    run(tank) {
        const p = this.p;

        const viewWidth = Config.view.width / tank.zoom;
        const viewHeight = Config.view.height / tank.zoom;

        const zoom = Math.max(
            p.width / viewWidth,
            p.height / viewHeight,
        );

        p.translate(p.width / 2, p.height / 2);
        p.scale(zoom);
        p.translate(-tank.x, -tank.y);
    }
}