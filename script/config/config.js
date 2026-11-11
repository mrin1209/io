const Config = {
    map: {
        width: 5000,
        height: 5000,
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
        object: 255,
        status: 10,
    },

    wall: {
        density: 0.2,
    },

    debug: false,
};

if (Config.debug) {
    Config.map.width = 500;
    Config.map.height = 500;
    Config.max.tank = 1;
    Config.max.object = 0;
}

export default Config;