const Scene = require('node-vk-bot-api/lib/scene');
const {User} = require("../models/user");
const {defaultKeyboard} = require("../keyboards");
const {listCustomersKeyboard} = require("../keyboards");

const deleteScene = new Scene('delete',
    async (ctx) => {
        ctx.scene.next();
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        ctx.reply('Введите имя пользователя', null, listCustomersKeyboard(user.getCustomersForKeyboard()));
    },
    async (ctx) => {
        let userModel = new User();
        let addResult = await userModel.deleteCustomerFromUserByPeerId(ctx.message.peer_id, ctx.message.text);

        ctx.scene.leave();
        ctx.reply(addResult.isSuccess() ? 'Пользователь удален' : addResult.getErrors("\n"), null, defaultKeyboard);
    });

module.exports = {deleteScene};