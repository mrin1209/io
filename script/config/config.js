const Config = {
    map: {
        width: 500,
        height: 500,
    },

    view: {
        width: 750,
        height: 500,
        grid: 200,
    },

    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
    },

    max: {
        tank: 0,
        object: 100,
        status: 10,
    },

    wall: {
        density: 0,
    },

    debug: false,
};

if (Config.debug) {
    Config.map.width = 1000;
    Config.map.height = 1000;
    Config.max.tank = 1;
    Config.max.object = 0;
}

export default Config;