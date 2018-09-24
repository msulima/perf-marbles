import {expect} from 'chai';
import scale, {getScaledMaxValue} from '../../src/chart/scale';


describe('Scale', function () {

    it('rounds max to same order of magnitude', function () {
        // given
        const points = [{
            value: 33,
        }, {
            value: 166,
        }];

        // when
        const scaled = getScaledMaxValue(points);

        // then
        expect(scaled).to.equal(200);
    });

    it('rounds max less than 1 to same order of magnitude', function () {
        // given
        const points = [{
            value: 0.045,
        }];

        // when
        const scaled = getScaledMaxValue(points);

        // then
        expect(scaled).to.equal(0.05);
    });

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
        const maxValue = 400;

        // when
        const scaled = scale(points, 50, maxValue);

        // then
        expect(scaled.map(x => x.value)).to.deep.equal([1 / 4, 1 / 2, 3 / 4]);
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
