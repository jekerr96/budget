const Scene = require('node-vk-bot-api/lib/scene');
const {cancelKeyboard} = require("../keyboards");
const {User} = require("../models/user");
const {defaultKeyboard} = require("../keyboards");

const addScene = new Scene('add',
    (ctx) => {
        ctx.scene.next();
        ctx.reply('Введите имя пользователя', null, cancelKeyboard);
    },
    async (ctx) => {
        if (ctx.message.text === "Отмена") {
            ctx.scene.leave();
            ctx.reply('Что будем делать?', null, defaultKeyboard);
            return;
        }

        let userModel = new User();
        let addResult = await userModel.addCustomerToUserByPeerId(ctx.message.peer_id, ctx.message.text);

        ctx.scene.leave();
        ctx.reply(addResult.isSuccess() ? 'Пользователь добавлен' : addResult.getErrors("\n"), null, defaultKeyboard);
    });

module.exports = {addScene};