let interval = 500;
let taskSize = 100;

import arrive from './arrivalQueue';
import process from './processor';

const MAX_HISTORY = 50;

const start = Date.now();
const history = [];

export default function run(state) {
    const now = Date.now() - start;
    const arriveResult = runArrive(state, now);
    const processResult = runProcess(state, arriveResult, now);

    processResult.finished.forEach(task => {
        if (history.length === MAX_HISTORY) {
            history.shift();
        }
        history.push(task);
    });

    return {
        lastArrival: arriveResult.lastArrival,
        queue: processResult.queue,
        processor: processResult.processor,
        lastAverages: addInLimit(state.lastAverages, {
            timestamp: now,
            value: getAverage(history),
        }, MAX_HISTORY),
    };
}

function runArrive(state, now) {
    const {lastArrival, queue} = state;
    return arrive(getNextArrival, () => taskSize, {
        lastArrival,
        queue,
    }, now);

}

function getNextArrival() {
    return Math.random() * interval;
}

function runProcess(state, arriveResult, now) {
    const {queue} = arriveResult;

    const {processor} = state;
    return process({
        queue,
        processor,
    }, now)
}

function getAverage(history) {
    let totalLatency = 0;
    history.forEach(task => {
        totalLatency += task.startedAt - task.arrivedAt;
    });

    return (history.length > 0 ? totalLatency / history.length : 0).toPrecision(2);
}

function addInLimit(list, element, limit) {
    const nextList = [].concat(list).concat(element);
    if (nextList.length > limit) {
        nextList.shift();
    }
    return nextList;
}