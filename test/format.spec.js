import {expect} from 'chai';
import format from '../src/format';


describe('Format', function () {

    it('should format numbers', function () {
        expect(format(55.55)).to.equal("56");
    });
    it('should format numbers', function () {
        expect(format(5.555)).to.equal("5.6");
    });
    it('should format numbers', function () {
        expect(format(0.5555)).to.equal("0.6");
    });
    it('should format numbers', function () {
        expect(format(0.05555)).to.equal("0.06");
    });
    it('should format numbers', function () {
        expect(format(0)).to.equal("0");
    });
});
