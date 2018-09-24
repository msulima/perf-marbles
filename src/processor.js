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
    while (queue.length > 0 && processor === null) {
        processor = Object.assign({}, queue.shift());
        processor.startedAt = Math.max(processor.arrivedAt, now);

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