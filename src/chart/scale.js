export function getScaledMaxValue(series) {
    let maxValue = 0;

    series.forEach(points => {
        points.forEach(point => {
            maxValue = Math.max(maxValue, point);
        });
    });

    if (maxValue === 0) {
        return 1;
    }

    const order = Math.pow(10, Math.floor(Math.log10(maxValue)));

    return Math.ceil(maxValue / order) * order;
}

export default function scale(series, maxValue) {
    if (series[0].length === 1 && maxValue !== 1) {
        return scale(series, 1);
    }
    return series.map(points => {
        return points.map(point => {
            return maxValue > 0 ? point / maxValue : 0;
        });
    });
}
