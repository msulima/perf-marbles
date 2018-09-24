import {expect} from 'chai';
import arrive from '../src/arrivalQueue';


describe('Arrival Queue', function () {

    it('should queue until hit limit and then add to scheduled', function () {
        // given
        const rng = createRng([130, 50, 20]);
        const sizeRng = createRng([1, 2, 3]);
        const state = {
            queue: [],
            lastArrival: 400,
        };
        const deadline = 600;

        // when
        const nextState = arrive(rng, sizeRng, state, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [{
                arrivedAt: 530,
                size: 1,
            }, {
                arrivedAt: 580,
                size: 2,
            }, {
                arrivedAt: 600,
                size: 3,
            }],
            lastArrival: 600,
        });
    });

    it('should wait until deadline passes', function () {
        // given
        const rng = createRng([]);
        const sizeRng = createRng([]);
        const state = {
            queue: [],
            lastArrival: 800,
        };
        const deadline = 800;

        // when
        const nextState = arrive(rng, sizeRng, state, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [],
            lastArrival: 800,
        });
    });

    it('should keep previous tasks', function () {
        // given
        const rng = createRng([100]);
        const sizeRng = createRng([1]);
        const state = {
            queue: [{
                arrivedAt: 500,
                size: 1000,
            }],
            lastArrival: 500,
        };
        const deadline = 600;

        // when
        const nextState = arrive(rng, sizeRng, state, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [{
                arrivedAt: 500,
                size: 1000,
            }, {
                arrivedAt: 600,
                size: 1,
            }],
            lastArrival: 600,
        });
    });
});

function createRng(values) {
    let invocation = 0;
    return function () {
        return values[invocation++];
    };
}
