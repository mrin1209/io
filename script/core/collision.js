import Config from "../config/config.js";

export default class Collision {
    circleCircle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const radius = a.radius + b.radius;

        return dx * dx + dy * dy <= radius * radius;
    }

    circleRect(circle, rect) {
        const closestX = Math.max(
            rect.x,
            Math.min(circle.x, rect.x + rect.width)
        );

        const closestY = Math.max(
            rect.y,
            Math.min(circle.y, rect.y + rect.height)
        );

        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        return dx * dx + dy * dy <= circle.radius * circle.radius;
    }

    outside(object) {
        return (
            object.x - object.radius < 0 ||
            object.y - object.radius < 0 ||
            object.x + object.radius > Config.map.width ||
            object.y + object.radius > Config.map.height
        );
    }

    lineRect(line, rect) {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;

        let min = 0;
        let max = 1;

        if (dx === 0) {
            if (line.x1 < rect.x || line.x1 > rect.x + rect.width) {
                return false;
            }
        } else {
            const t1 = (rect.x - line.x1) / dx;
            const t2 = (rect.x + rect.width - line.x1) / dx;

            min = Math.max(min, Math.min(t1, t2));
            max = Math.min(max, Math.max(t1, t2));
        }

        if (dy === 0) {
            if (line.y1 < rect.y || line.y1 > rect.y + rect.height) {
                return false;
            }
        } else {
            const t1 = (rect.y - line.y1) / dy;
            const t2 = (rect.y + rect.height - line.y1) / dy;

            min = Math.max(min, Math.min(t1, t2));
            max = Math.min(max, Math.max(t1, t2));
        }

        return min <= max;
    }

    get() {
        return {
            class: 'wall',
            power: 10,
            penetration: 10,
        }
    }
}
