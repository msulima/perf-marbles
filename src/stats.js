export default function stats(history, deadline) {
    const finished = getAllFinished(history);
    const {latency, response} = getAverage(finished);

    return {
        averageLatency: latency,
        averageResponse: response,
        utilisation: getUtilisation(history),
        queueLength: getQueueLength(history, deadline),
    };
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

function getQueueLength(history, deadline) {
    const lastQueue = (history.length > 0 ? history[history.length - 1].queue : []);
    return lastQueue.filter(task => task.arrivedAt < deadline).length;
}
