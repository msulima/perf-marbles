export default function scale(points, count) {
    if (points.length === 0) {
        return [];
    }
    if (points.length === 1) {
        return [{
            value: 1,
            timestamp: 0,
        }]
    }
    const {maxValue, minTimestamp, maxTimestamp} = getStatistics(points);
    const averageBreak = (maxTimestamp - minTimestamp) / (points.length - 1);

    return points.map(point => {
        return Object.assign({}, point, {
            value: maxValue > 0 ? point.value / maxValue : 0,
            timestamp: (point.timestamp - maxTimestamp) / (averageBreak * count),
        });
    });
}

function getStatistics(points) {
    let maxValue = 0;
    let minTimestamp = Infinity;
    let maxTimestamp = 0;

    points.forEach(point => {
        maxValue = Math.max(maxValue, point.value);
        minTimestamp = Math.min(minTimestamp, point.timestamp);
        maxTimestamp = Math.max(maxTimestamp, point.timestamp);
    });
    return {
        maxValue,
        minTimestamp,
        maxTimestamp,
    };
}
