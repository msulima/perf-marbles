import {expect} from 'chai';
import {axisLabels} from '../../src/chart/axis';


describe('Axis', function () {
    it('rounds max to next order of magnitude', function () {
        // given
        const minValue = 100;
        const maxValue = 300;
        const bars = 4;

        // when
        const scaled = axisLabels(minValue, maxValue, bars);

        // then
        expect(scaled).to.deep.equal([{
            position: 0,
            text: '100.0',
        }, {
            position: 1 / 4,
            text: '150.0',
        }, {
            position: 1 / 2,
            text: '200.0',
        }, {
            position: 3 / 4,
            text: '250.0',
        }, {
            position: 1,
            text: '300.0',
        }]);
    });
});
