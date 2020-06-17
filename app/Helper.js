const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};

const formatDate = (date) => {
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getSeconds()}`;
};

module.exports = {getKeyByValue, formatDate};