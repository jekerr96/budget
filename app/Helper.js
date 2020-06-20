const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};

const formatDate = (date) => {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

module.exports = {getKeyByValue, formatDate};