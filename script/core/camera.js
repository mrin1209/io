import Config from "../config/config.js";

export default class Camera {
    constructor(p) {
        this.p = p;
    }

    run(tank) {
        const p = this.p;

        const zoom = tank.zoom
            ? Math.min(
                p.width / (Config.view.width / tank.zoom),
                p.height / (Config.view.height / tank.zoom)
            )
            : Math.max(
                p.width / Config.map.width,
                p.height / Config.map.height
            );

        p.translate(p.width / 2, p.height / 2);
        p.scale(zoom);
        p.translate(-tank.x, -tank.y);
    }
}