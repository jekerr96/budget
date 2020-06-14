const {getKeyByValue} = require("../Helper");
const {BaseRow} = require("./base-row");

class UserRow extends BaseRow {
    getPeerId() {
        return this.data.peerId;
    }

    getCustomers() {
        return this.data.customers;
    }

    getCustomersForKeyboard() {
        let customers = this.getCustomers();
        let result = [];

        for (const key in customers) {
            if (!customers.hasOwnProperty(key)) continue;
            result.push(customers[key]);
        }

        return result;
    }

    getListCustomers() {
        let customers = this.getCustomers();
        let result = "";

        for (const key in customers) {
            if (!customers.hasOwnProperty(key)) continue;
            result += customers[key] + "\n";
        }

        if (!result) return "Список пользователей пуст";

        return result;
    }

    getCustomerIndex(customer) {
        let customers = this.getCustomers();
        return getKeyByValue(customers, customer);
    }

    getCustomerByIndex(index) {
        return this.getCustomers()[index];
    }

    hasCustomer(customer) {
        return !!this.getCustomerIndex(customer);
    }
}

module.exports = {UserRow};