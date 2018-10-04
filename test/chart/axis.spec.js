import {expect} from 'chai';
import {axisLabels} from '../../src/chart/axis';


describe('Axis', function () {
    it('rounds max to next order of magnitude', function () {
        // given
        const minValue = 1;
        const maxValue = 3;
        const bars = 4;

        // when
        const scaled = axisLabels(minValue, maxValue, bars);

        // then
        expect(scaled).to.deep.equal([{
            position: 0,
            text: '1.0',
        }, {
            position: 1 / 4,
            text: '1.5',
        }, {
            position: 1 / 2,
            text: '2.0',
        }, {
            position: 3 / 4,
            text: '2.5',
        }, {
            position: 1,
            text: '3.0',
        }]);
    });
});
