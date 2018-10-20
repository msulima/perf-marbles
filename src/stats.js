export default function stats(history, deadline) {
    const finished = getAllFinished(history);
    const {latency, response} = getAverage(finished);

    return Object.assign({
        averageLatency: latency,
        averageResponse: response,
        utilisation: getUtilisation(history),
        arrivalRate: getArrivalRate(finished),
        queueLength: getQueueLength(history, deadline),
    }, getPercentiles(finished));
}

function getAllFinished(history) {
    return history.reduce((acc, value) => {
        return acc.concat(value.finished);
    }, []);
}

function getAverage(finished) {
    if (finished.length === 0) {
        return {
            latency: 0,
            response: 0,
        }
    }
    let totalLatency = 0;
    let totalResponse = 0;
    finished.forEach(task => {
        totalLatency += task.startedAt - task.arrivedAt;
        totalResponse += task.size + task.startedAt - task.arrivedAt;
    });

    return {
        latency: totalLatency / finished.length,
        response: totalResponse / finished.length,
    };
}

function getUtilisation(history) {
    let totalUtilised = 0;
    history.forEach(queue => {
        totalUtilised += queue.processor === null ? 0 : 1;
    });

    return (history.length > 0 ? totalUtilised / history.length : 0);
}

function getArrivalRate(history) {
    if (history.length < 2) {
        return 0;
    }

    return 1000 * (history.length - 1) / (history[history.length - 1].arrivedAt - history[0].arrivedAt);
}

function getQueueLength(history, deadline) {
    const lastQueue = (history.length > 0 ? history[history.length - 1].queue : []);
    return lastQueue.filter(task => task.arrivedAt < deadline).length;
}

function getPercentiles(finished) {
    const sizes = finished.map(task => task.size + task.startedAt - task.arrivedAt).sort((a, b) => a - b);
    return {
        p50: getPercentile(sizes, 50),
        p75: getPercentile(sizes, 75),
        p95: getPercentile(sizes, 95),
        p99: getPercentile(sizes, 99),
    }
}

function getPercentile(data, n) {
    if (data.length === 0) {
        return 0;
    }
    return data[Math.floor(data.length * n / 100)];
}
