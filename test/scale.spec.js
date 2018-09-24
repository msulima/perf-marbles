import {expect} from 'chai';
import scale from '../src/scale';


describe('Scale', function () {

    it('should scale values to [0,1] range', function () {
        // given
        const points = [{
            value: 100,
            timestamp: 1,
        }, {
            value: 200,
            timestamp: 2,
        }, {
            value: 300,
            timestamp: 3,
        }];

        // when
        const scaled = scale(points);

        // then
        expect(scaled.map(x => x.value)).to.deep.equal([1 / 3, 2 / 3, 1]);
    });

    it('should zero max value to zero', function () {
        // given
        const points = [{
            value: 0,
            timestamp: 400,
        }, {
            value: 0,
            timestamp: 500,
        }];
        const count = 10;

        // when
        const scaled = scale(points, count);

        // then
        expect(scaled.map(x => x.value)).to.deep.equal([0, 0]);
    });

    it('should scale timestamps to [-1,0] range', function () {
        // given
        const points = [{
            value: 1,
            timestamp: 100,
        }, {
            value: 2,
            timestamp: 200,
        }, {
            value: 3,
            timestamp: 300,
        }];
        const count = 3;

        // when
        const scaled = scale(points, count);

        // then
        expect(scaled.map(x => x.timestamp)).to.deep.equal([-2 / 3, -1 / 3, 0]);
    });

    it('should scale timestamps to [-1,0] range and adjust for expected count', function () {
        // given
        const points = [{
            value: 1,
            timestamp: 400,
        }, {
            value: 2,
            timestamp: 500,
        }, {
            value: 3,
            timestamp: 600,
        }];
        const count = 10;

        // when
        const scaled = scale(points, count);

        // then
        expect(scaled.map(x => x.timestamp)).to.deep.equal([-2 / 10, -1 / 10, 0]);
    });

    it('should work for single point', function () {
        // given
        const points = [{
            value: 1,
            timestamp: 400,
        }];
        const count = 10;

        // when
        const scaled = scale(points, count);

        // then
        expect(scaled).to.deep.equal([{
            value: 1,
            timestamp: 0,
        }]);
    });

    it('should work for no points', function () {
        // given
        const points = [];
        const count = 10;

        // when
        const scaled = scale(points, count);

        // then
        expect(scaled).to.deep.equal([]);
    });
});
