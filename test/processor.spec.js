import {expect} from 'chai';
import process from '../src/processor';


describe('Processor', function () {

    it('should finish all tasks before deadline', function () {
        // given
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
        const processor = null;
        const deadline = 600;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [],
            processor: {
                arrivedAt: 580,
                startedAt: 580,
                size: 20,
            },
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 20,
            }, {
                arrivedAt: 550,
                startedAt: 550,
                size: 20,
            }],
        });
    });

    it('should start tasks later if processor is occupied', function () {
        // given
        const queue = [{
            arrivedAt: 530,
            size: 30,
        }, {
            arrivedAt: 550,
            size: 20,
        }];
        const processor = null;
        const deadline = 600;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 530,
                startedAt: 530,
                size: 30,
            }, {
                arrivedAt: 550,
                startedAt: 560,
                size: 20,
            }],
        });
    });

    it('should finish currently executing tasks', function () {
        // given
        const queue = [{
            arrivedAt: 550,
            size: 20,
        }];
        const processor = {
            arrivedAt: 530,
            startedAt: 580,
            size: 30,
        };
        const deadline = 700;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [],
            processor: null,
            finished: [{
                arrivedAt: 530,
                startedAt: 580,
                size: 30,
            }, {
                arrivedAt: 550,
                startedAt: 610,
                size: 20,
            }],
        });
    });

    it('should queue tasks if busy', function () {
        // given
        const queue = [{
            arrivedAt: 550,
            size: 50,
        }, {
            arrivedAt: 580,
            size: 20,
        }];
        const processor = null;
        const deadline = 600;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue: [{
                arrivedAt: 580,
                size: 20,
            }],
            processor: {
                arrivedAt: 550,
                startedAt: 550,
                size: 50,
            },
            finished: [],
        });
    });

    it('should not start tasks from the future', function () {
        // given
        const queue = [{
            arrivedAt: 530,
            size: 30,
        }, {
            arrivedAt: 550,
            size: 20,
        }];
        const processor = null;
        const deadline = 500;

        // when
        const nextState = process({queue, processor}, deadline);

        // then
        expect(nextState).to.deep.equal({
            queue,
            processor: null,
            finished: [],
        });
    });
});
