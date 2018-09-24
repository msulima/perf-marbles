export default function arrive(rng, sizeRng, state, deadline) {
    const queue = [].concat(state.queue);

    let lastArrival = state.lastArrival;
    while (lastArrival < deadline) {
        lastArrival += rng();
        queue.push({
            arrivedAt: lastArrival,
            size: sizeRng(),
        });
    }

    return {
        lastArrival,
        queue,
    };
}

