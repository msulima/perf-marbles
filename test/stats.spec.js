import {expect} from 'chai';
import stats from '../src/stats';


describe('Stats', function () {

    it('should calculate average latency from history', function () {
        // given
        const processor = null;
        const queues = [{
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
        const result = stats(queues);

        // then
        expect(result).to.have.property('averageLatency', 10);
    });

    it('should calculate average utilisation', function () {
        // given
        const processor = null;
        const queues = [{
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
        const result = stats(queues);

        // then
        expect(result).to.have.property('utilisation', 1 / 2);
    });

    it('should current queue length', function () {
        // given
        const processor = null;
        const queues = [{
            processor: null,
            finished: []
        }, {
            queue: [{
                arrivedAt: 550,
                startedAt: 570,
                size: 20,
            }],
            processor: null,
            finished: [],
        }];

        // when
        const result = stats(queues);

        // then
        expect(result).to.have.property('queueLength', 1);
    });
});
