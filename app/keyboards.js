const Markup = require("node-vk-bot-api/lib/markup");

const defaultKeyboard = Markup.keyboard([
    [
        Markup.button('Добавить отчет', 'positive'),
        Markup.button('Посмотреть отчет', 'positive'),
    ],
    [
        Markup.button('Добавить пользователя', 'primary'),
        Markup.button('Список пользователей', 'primary'),
        Markup.button('Удалить пользователя', 'negative'),
    ],
]).oneTime();

const emptyKeyboard = Markup.keyboard([]);

const listCustomersKeyboard = (listCustomers) => {
    return Markup.keyboard(listCustomers, {
        columns: 3,
    }).inline();
};

const listReportsKeyboard = Markup.keyboard([
    [
        Markup.button('Отчет по пользователю', 'positive'),
        Markup.button('Отчет по всем', 'positive'),
    ]
]).oneTime();

module.exports = {defaultKeyboard, emptyKeyboard, listCustomersKeyboard, listReportsKeyboard};