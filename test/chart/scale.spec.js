import {expect} from 'chai';
import scale, {getScaledMaxValue} from '../../src/chart/scale';


describe('Scale', function () {

    it('rounds max to same order of magnitude', function () {
        // given
        const points = [
            [33, 166],
        ];

        // when
        const scaled = getScaledMaxValue(points);

        // then
        expect(scaled).to.equal(200);
    });

    it('rounds max less than 1 to same order of magnitude', function () {
        // given
        const points = [
            [0.045],
        ];

        // when
        const scaled = getScaledMaxValue(points);

        // then
        expect(scaled).to.equal(0.05);
    });

    it('should scale values to [0,1] range', function () {
        // given
        const points = [
            [100, 200, 300],
            [100, 200, 400],
        ];
        const maxValue = 400;

        // when
        const scaled = scale(points, maxValue);

        // then
        expect(scaled).to.deep.equal([
            [1 / 4, 1 / 2, 3 / 4],
            [1 / 4, 1 / 2, 1],
        ]);
    });

    it('should zero max value to zero', function () {
        // given
        const points = [
            [0, 0],
        ];

        // when
        const scaled = scale(points);

        // then
        expect(scaled).to.deep.equal([
            [0, 0],
        ]);
    });

    it('should work for single point', function () {
        // given
        const points = [
            [1],
            [1],
        ];

        // when
        const scaled = scale(points);

        // then
        expect(scaled).to.deep.equal([
            [1],
            [1],
        ]);
    });

    it('should work for no points', function () {
        // given
        const points = [
            [],
        ];

        // when
        const scaled = scale(points);

        // then
        expect(scaled).to.deep.equal(points);
    });
});
