require("dotenv").config();
const MongoDb = require("./app/db/connect");
const VkBot = require("node-vk-bot-api");
const Markup = require("node-vk-bot-api/lib/markup");
const Session = require('node-vk-bot-api/lib/session');
const Stage = require('node-vk-bot-api/lib/stage');
const {User} = require("./app/models/user");
const {reportScene, addReportScene, reportByUserScene} = require("./app/scenes/report");
const {defaultKeyboard} = require("./app/keyboards");
const {addScene} = require("./app/scenes/add");
const {deleteScene} = require("./app/scenes/delete");

const session = new Session();

(async () => {
    global.dbConnection = await MongoDb.getConnection();
    global.vkBot = new VkBot(process.env.vk);

    const stage = new Stage(addScene, deleteScene, reportScene, addReportScene, reportByUserScene);

    global.vkBot.use(session.middleware());
    global.vkBot.use(stage.middleware());

    global.vkBot.command('Назад', (ctx) => {
        ctx.scene.leave();

        ctx.reply('Что будем делать?', null, defaultKeyboard);
    });

    global.vkBot.command("Начать", async (ctx) => {
        ctx.reply('Что будем делать?', null, defaultKeyboard);
    });

    global.vkBot.command('Добавить пользователя', (ctx) => {
        ctx.scene.enter('add');
    });

    global.vkBot.command('Удалить пользователя', (ctx) => {
        ctx.scene.enter('delete');
    });

    global.vkBot.command('Список пользователей', async (ctx) => {
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        ctx.reply(user.getListCustomers(), null, defaultKeyboard);
    });

    global.vkBot.command('Посмотреть отчет', async (ctx) => {
        ctx.scene.enter("report")
    });

    global.vkBot.command('Добавить отчет', async (ctx) => {
        ctx.scene.enter("addReport")
    });

    global.vkBot.on((ctx) => {
        ctx.reply('Что будем делать?', null, defaultKeyboard);
    });

    global.vkBot.startPolling(() => {
        console.log('Bot started.')
    });
})();
