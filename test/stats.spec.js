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
});
