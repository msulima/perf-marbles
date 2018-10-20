export function getScaledMaxValue(points) {
    let maxValue = 0;

    points.forEach(point => {
        maxValue = Math.max(maxValue, point.value);
    });

    if (maxValue === 0) {
        return 1;
    }

    const order = Math.pow(10, Math.floor(Math.log10(maxValue)));

    return Math.ceil(maxValue / order) * order;
}

export default function scale(points, maxValue) {
    if (points.length === 0) {
        return [];
    }
    if (points.length === 1) {
        return [{
            value: 1,
        }]
    }
    return points.map(point => {
        return Object.assign({}, point, {
            value: maxValue > 0 ? point.value / maxValue : 0,
        });
    });
}
