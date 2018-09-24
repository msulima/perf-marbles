export function axisLabels(minValue, maxValue, bars) {
    const result = [];
    const step = (maxValue - minValue) / bars;

    for (let i = 0; i <= bars; i++) {
        result.push({
            position: i / bars,
            text: (minValue + i * step).toFixed(1),
        });
    }

    return result;
}
