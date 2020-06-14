const {AddResult} = require("./add-result");
const {BaseModel} = require("./base-model");

class Report extends BaseModel {
    constructor(user) {
        super();
        this.user = user;
    }

    async addReport(customerIndex, sum, description) {
        let addResult = new AddResult();

        if (!this.user.getCustomers()[customerIndex]) {
            addResult.addError("Пользователь не найден");
            return addResult;
        }

        await this.collection.insertOne({
            peerId: this.user.getPeerId(),
            customer: customerIndex,
            sum,
            description,
            time: new Date().getTime(),
        });

        return addResult;
    }

    async getReportByCustomer(customer) {
        let curYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        let reports = await this.collection.find({peerId: this.user.getPeerId(), customer, time: {$gt: curYear}}).toArray();
        let resultText = "";
        let curMonth = -1;
        let sumMonth = 0;
        let totalSum = 0;

        for (const report of reports) {
            let date = new Date(report.time);
            let month = date.getMonth();

            if (month !== curMonth) {
                if (curMonth !== -1) {
                    resultText += "\n\n Итого за месяц: " + sumMonth;
                    totalSum += sumMonth;
                    sumMonth = 0;
                }

                resultText += "Месяц " + this.getMonthName(month) + "\n";
                curMonth = month;
            }

            sumMonth += report.sum;
            resultText += `\n\nОтчет за ${date}\nСумма: ${report.sum}\nОписание: ${report.description}`;
        }

        resultText += "\n\n Итого за месяц: " + sumMonth;
        totalSum += sumMonth;
        resultText += "\n\nИтого: " + totalSum;

        return resultText;
    }

    async getReportByAll() {
        let curYear = new Date(new Date().getFullYear(), 0, 1).getTime();
        let reports = await this.collection.find({peerId: this.user.getPeerId(), time: {$gt: curYear}}).toArray();
        let resultText = "";
        let curMonth = -1;
        let sumMonth = 0;
        let totalSum = 0;

        for (const report of reports) {
            let date = new Date(report.time);
            let month = date.getMonth();

            if (month !== curMonth) {
                if (curMonth !== -1) {
                    resultText += "\n\n Итого за месяц: " + sumMonth;
                    totalSum += sumMonth;
                    sumMonth = 0;
                }

                resultText += "Месяц " + this.getMonthName(month) + "\n";
                curMonth = month;
            }

            sumMonth += report.sum;
            resultText += `\n\nОтчет за ${date}\nПользователь: ${this.user.getCustomerByIndex(report.customer)}\nСумма: ${report.sum}\nОписание: ${report.description}`;
        }

        resultText += "\n\n Итого за месяц: " + sumMonth;
        totalSum += sumMonth;
        resultText += "\n\nИтого: " + totalSum;

        return resultText;
    }

    async deleteReportsByCustomer(customer) {
        let customerIndex = this.user.getCustomerIndex(customer);

        await this.collection.deleteOne({customer: customerIndex});
    }

    getMonthReport() {
        return 123;
    }

    getMonthName(index) {
        return [
            "Январь", "Ферваль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ][index - 1];
    }

    getCollectionName() {
        return "reports";
    }
}

module.exports = {Report};