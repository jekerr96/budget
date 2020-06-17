const Scene = require('node-vk-bot-api/lib/scene');
const {emptyKeyboard} = require("../keyboards");
const {Report} = require("../models/report");
const {listCustomersKeyboard} = require("../keyboards");
const {User} = require("../models/user");
const {defaultKeyboard, listReportsKeyboard} = require("../keyboards");

const reportScene = new Scene('report',
    async (ctx) => {
        ctx.scene.next();
        ctx.reply("Выберите отчет", null, listReportsKeyboard);
    },
    async (ctx) => {
       if (ctx.message.text === "Отчет по пользователю") {
           ctx.scene.enter("reportByUser");
       } else {
           let userModel = new User();
           let user = await userModel.getUser(ctx.message.peer_id);
           let report = new Report(user);

           ctx.scene.leave();
           ctx.reply(await report.getReportByAll(), null, defaultKeyboard);
       }
    });

const addReportScene = new Scene('addReport',
    async (ctx) => {
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        ctx.scene.next();
        ctx.reply("Введите пользователя", null, listCustomersKeyboard(user.getCustomersForKeyboard()));
    },
    async (ctx) => {
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        let customerIndex = user.getCustomerIndex(ctx.message.text);

        if (customerIndex === -1) {
            ctx.reply("Пользователь не найден \nВведите пользователя", null, listCustomersKeyboard(user.getCustomersForKeyboard()));
            return;
        }

        ctx.session.reportCustomer = customerIndex;
        ctx.scene.next();
        ctx.reply("Введите сумму", null, emptyKeyboard);
    },
    async (ctx) => {
        let sumList = ctx.message.text;
        let sum = 0;

        let splitSum = sumList.split("+");

        splitSum.forEach(sumItem => {
            sum += parseFloat(sumItem);
        });

        ctx.session.sumReport = sum;
        ctx.scene.next();
        ctx.reply("Принята сумма " + sum + "\nДобавьте описание к отчету", null, defaultKeyboard);
    },
    async (ctx) => {
        let description = ctx.message.text;
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        let report = new Report(user);
        let addResult = await report.addReport(ctx.session.reportCustomer, ctx.session.sumReport, description);

        if (addResult.isSuccess()) {
            ctx.reply("Ваш отчет принят", null, defaultKeyboard);
        } else {
            ctx.reply(addResult.getErrors("\n"), null, defaultKeyboard);
        }

        ctx.scene.leave();
    });

const reportByUserScene = new Scene('reportByUser',
    async (ctx) => {
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);

        ctx.scene.next();
        ctx.reply("Введите пользователя", null, listCustomersKeyboard(user.getCustomersForKeyboard()));
    },
    async (ctx) => {
        let customer = ctx.message.text;
        let userModel = new User();
        let user = await userModel.getUser(ctx.message.peer_id);
        let report = new Report(user);
        let customerIndex = user.getCustomerIndex(customer);

        if (!customerIndex) {
            ctx.scene.leave();
            ctx.reply("Пользователь не найден", null, defaultKeyboard);
            return;
        }

        ctx.session.customerReport = customerIndex;
        ctx.scene.leave();

        ctx.reply(await report.getReportByCustomer(customerIndex), null, defaultKeyboard);
    });

module.exports = {reportScene, reportByUserScene, addReportScene};