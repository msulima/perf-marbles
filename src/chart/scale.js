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

export default function scale(points, count, maxValue) {
    if (points.length === 0) {
        return [];
    }
    if (points.length === 1) {
        return [{
            value: 1,
            timestamp: 0,
        }]
    }
    const {minTimestamp, maxTimestamp} = getStatistics(points);
    const averageBreak = (maxTimestamp - minTimestamp) / (points.length - 1);

    return points.map(point => {
        return Object.assign({}, point, {
            value: maxValue > 0 ? point.value / maxValue : 0,
            timestamp: (point.timestamp - maxTimestamp) / (averageBreak * count),
        });
    });
}

function getStatistics(points) {
    let minTimestamp = Infinity;
    let maxTimestamp = 0;

    points.forEach(point => {
        minTimestamp = Math.min(minTimestamp, point.timestamp);
        maxTimestamp = Math.max(maxTimestamp, point.timestamp);
    });
    return {
        minTimestamp,
        maxTimestamp,
    };
}
