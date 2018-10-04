export default function stats(history) {
    const finished = getAllFinished(history);

    return {
        averageLatency: getAverage(finished),
        utilisation: getUtilisation(history),
        queueLength: getQueueLength(history),
    };
}

function getAllFinished(history) {
    return history.reduce((acc, value) => {
        return acc.concat(value.finished);
    }, []);
}

function getAverage(finished) {
    let totalLatency = 0;
    finished.forEach(task => {
        totalLatency += task.startedAt - task.arrivedAt;
    });

    return (finished.length > 0 ? totalLatency / finished.length : 0);
}

function getUtilisation(history) {
    let totalUtilised = 0;
    history.forEach(queue => {
        totalUtilised += queue.processor === null ? 0 : 1;
    });

    return (history.length > 0 ? totalUtilised / history.length : 0);
}

function getQueueLength(history) {
    return (history.length > 0 ? history[history.length - 1].queue.length : 0);
}
