// Data sanitization
// Check if input is an integer
const isInteger = (str) => {
    if (typeof str == 'string') {
        return false;
    }
    const num = Number(str);
    if (Number.isInteger(num)) {
        return true;
    } else {
        return false;
    }
}

module.exports = isInteger;