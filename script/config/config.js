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

    area: {
        width: 0.2,
        height: 0.2,
    },

    spawn: {
        width: 0.6,
        height: 0.6,
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

    debug: false,
};

if (Config.debug) {
    Config.map.width = 1000;
    Config.map.height = 1000;
    Config.max.tank = 0;
    Config.max.object = 0;
}

export default Config;