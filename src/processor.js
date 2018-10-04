export default function process(state, deadline) {
    const queue = [].concat(state.queue);
    let processor = state.processor;
    const finished = [];

    let now = 0;
    if (processor !== null) {
        now = processor.startedAt + processor.size;
        if (now < deadline) {
            finished.push(processor);
            processor = null;
        }
    }
    while (processor === null && queue.length > 0 && queue[0].arrivedAt < deadline) {
        processor = Object.assign({}, queue.shift());
        processor.startedAt = getStartTime(processor, now);

        now = processor.startedAt + processor.size;
        if (now < deadline) {
            finished.push(processor);
            processor = null;
        }
    }

    return {
        finished,
        processor,
        queue,
    };
}

function getStartTime(task, now) {
    return Math.max(task.arrivedAt, now);
}
