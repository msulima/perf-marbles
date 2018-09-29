export default function format(number, base = number) {
    if (base >= 10) {
        return number.toFixed(0);
    }
    if (base >= 1) {
        return number.toFixed(1);
    }
    if (base > 10e-6) {
        return number.toFixed(1 - Math.ceil(Math.log10(base)));
    }
    return "0";
}