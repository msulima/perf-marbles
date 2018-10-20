import {expect} from 'chai';
import stats from '../src/stats';


describe('Stats', function () {

    it('should calculate average latency from history', function () {
        // given
        const history = [{
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 20,
            }]
        }, {
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 550,
                startedAt: 570,
                size: 20,
            }],
        }];

        // when
        const result = stats(history);

        // then
        expect(result).to.have.property('averageLatency', 10);
    });

    it('should calculate average utilisation', function () {
        // given
        const history = [{
            queue: [],
            processor: null,
            finished: []
        }, {
            queue: [],
            processor: {
                arrivedAt: 550,
                startedAt: 570,
                size: 20,
            },
            finished: [],
        }];

        // when
        const result = stats(history);

        // then
        expect(result).to.have.property('utilisation', 1 / 2);
    });

    it('should current queue length', function () {
        // given
        const history = [{
            processor: null,
            finished: []
        }, {
            queue: [{
                arrivedAt: 550,
                startedAt: 570,
                size: 20,
            }, {
                arrivedAt: 600,
                size: 20,
            }],
            processor: null,
            finished: [],
        }];
        const deadline = 600;

        // when
        const result = stats(history, deadline);

        // then
        expect(result).to.have.property('queueLength', 1);
    });

    it('should average rate', function () {
        // given
        const history = [{
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 20,
            }]
        }, {
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 630,
                startedAt: 670,
                size: 20,
            }],
        }];
        const deadline = 600;

        // when
        const result = stats(history, deadline);

        // then
        expect(result).to.have.property('arrivalRate', 10);
    });

    it('should get percentiles', function () {
        // given
        const history = [{
            queue: [],
            processor: null,
            finished: [
                finishedIn(0),
                finishedIn(20),
                finishedIn(10),
                finishedIn(40),
                finishedIn(30),
                finishedIn(60),
                finishedIn(50),
                finishedIn(80),
                finishedIn(70),
                finishedIn(100),
                finishedIn(90),
            ]
        }];
        const deadline = 100;

        // when
        const result = stats(history, deadline);

        // then
        expect(result).to.have.property('p50', 50);
        expect(result).to.have.property('p75', 80);
        expect(result).to.have.property('p95', 100);
        expect(result).to.have.property('p99', 100);
    });

    it('should get percentiles when no finished tasks', function () {
        // given
        const history = [{
            queue: [],
            processor: null,
            finished: []
        }];
        const deadline = 100;

        // when
        const result = stats(history, deadline);

        // then
        expect(result).to.have.property('p50', 0);
        expect(result).to.have.property('p75', 0);
        expect(result).to.have.property('p95', 0);
        expect(result).to.have.property('p99', 0);
    });
});

function finishedIn(time) {
    return {
        arrivedAt: 0,
        startedAt: 10,
        size: time - 10,
    };
}
