const {Report} = require("./report");
const {getKeyByValue} = require("../Helper");
const {AddResult} = require("./add-result");
const {UserRow} = require("./user-row");
const {BaseModel} = require("./base-model");
const {v4} = require("uuid");

class User extends BaseModel {
    async getUser(peerId) {
        let user = await this.collection.findOne({peerId});

        if (user) return new UserRow(user);

        user = {
            peerId,
            customers: {},
        };

        await this.collection.insertOne(user);
        return new UserRow(user);
    }

    async addCustomerToUser(user, customer) {
        let addResult = new AddResult();
        let customers = user.getCustomers();
        let id = v4();
        let customerIndex = getKeyByValue(customers, customer);

        if (customerIndex) {
            addResult.addError("Пользователь уже существует");
        } else {
            await this.collection.updateOne({peerId: user.getPeerId()}, {$set: {["customers." + id]: customer}});
        }

        return addResult;
    }

    async addCustomerToUserByPeerId(peerId, customer) {
        return await this.addCustomerToUser(await this.getUser(peerId), customer);
    }

    async deleteCustomerFromUser(user, customer) {
        let addResult = new AddResult();
        let report = new Report(user);
        let customerIndex = user.getCustomerIndex(customer);

        if (!customerIndex) {
            addResult.addError("Пользователь не найден");
        } else {
            await this.collection.updateOne({peerId: user.getPeerId()}, {$unset: {["customers." + customerIndex]: ""}});
            await report.deleteReportsByCustomer(customer);
        }

        return addResult;
    }

    async deleteCustomerFromUserByPeerId(peerId, customer) {
        return await this.deleteCustomerFromUser(await this.getUser(peerId), customer);
    }

    getCollectionName() {
        return "users";
    }
}

module.exports = {User};