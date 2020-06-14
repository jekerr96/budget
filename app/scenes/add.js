const Scene = require('node-vk-bot-api/lib/scene');
const {User} = require("../models/user");
const {defaultKeyboard} = require("../keyboards");
const {emptyKeyboard} = require("../keyboards");

const addScene = new Scene('add',
    (ctx) => {
        ctx.scene.next();
        ctx.reply('Введите имя пользователя', null, emptyKeyboard);
    },
    async (ctx) => {
        let userModel = new User();
        let addResult = await userModel.addCustomerToUserByPeerId(ctx.message.peer_id, ctx.message.text);

        ctx.scene.leave();
        ctx.reply(addResult.isSuccess() ? 'Пользователь добавлен' : addResult.getErrors("\n"), null, defaultKeyboard);
    });

module.exports = {addScene};