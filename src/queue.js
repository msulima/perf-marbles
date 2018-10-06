import arrive from './arrivalQueue';
import process from './processor';

export default function run(state, arrivalGenerator, taskSize, now) {
    const arriveResult = runArrive(state, arrivalGenerator, taskSize, now);
    const processResult = runProcess(state, arriveResult, now);

    return {
        lastArrival: arriveResult.lastArrival,
        queue: processResult.queue,
        processor: processResult.processor,
        finished: processResult.finished,
    };
}

function runArrive(state, arrivalGenerator, taskSize, now) {
    const {lastArrival, queue} = state;

    return arrive(arrivalGenerator, () => taskSize, {
        lastArrival,
        queue,
    }, now);
}

function getNextArrival(interval) {
    return Math.random() * interval * 2;
}

function runProcess(state, arriveResult, now) {
    const {queue} = arriveResult;

    const {processor} = state;
    return process({
        queue,
        processor,
    }, now)
}
