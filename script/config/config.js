const Config = {
    map: {
        width: 4000,
        height: 4000,
    },

    view: {
        width: 750,
        height: 500,
        chunk: 200,
        grid: 20,
    },

    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    max: {
        tank: 20,
        object: 200,
    },

    wall: {
        density: 0.2,
    },

    debug: true,
};

if (Config.debug) {
    Config.map.width = 500;
    Config.map.height = 500;
    Config.max.tank = 0;
    Config.max.object = 0;
}

export default Config;