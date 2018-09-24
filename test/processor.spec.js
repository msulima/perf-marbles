import {expect} from 'chai';
import process from '../src/processor';


describe('Processor', function () {

    it('should finish all tasks before deadline', function () {
        // given
        const processor = null;
        const queue = [{
            arrivedAt: 530,
            size: 20,
        }, {
            arrivedAt: 550,
            size: 20,
        }, {
            arrivedAt: 580,
            size: 20,
        }];
        const deadline = 600;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 20,
            }, {
                arrivedAt: 550,
                startedAt: 550,
                size: 20,
            }],
            processor: {
                arrivedAt: 580,
                startedAt: 580,
                size: 20,
            },
            queue: []
        });
    });

    it('should start tasks later if processor is occupied', function () {
        // given
        const processor = null;
        const queue = [{
            arrivedAt: 530,
            size: 30,
        }, {
            arrivedAt: 550,
            size: 20,
        }];
        const deadline = 600;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 30,
            }, {
                arrivedAt: 550,
                startedAt: 560,
                size: 20,
            }],
            processor: null,
            queue: []
        });
    });

    it('should finish currently executing tasks', function () {
        // given
        const processor = {
            arrivedAt: 530,
            startedAt: 580,
            size: 30,
        };
        const queue = [{
            arrivedAt: 550,
            size: 20,
        }];
        const deadline = 700;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            finished: [{
                arrivedAt: 530,
                startedAt: 580,
                size: 30,
            }, {
                arrivedAt: 550,
                startedAt: 610,
                size: 20,
            }],
            processor: null,
            queue: []
        });
    });
});
