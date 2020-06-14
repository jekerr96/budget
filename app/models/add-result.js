class AddResult {
    constructor() {
        this.success = true;
        this.id = null;
        this.data = [];
        this.errorMessages = [];
    }

    addError(error) {
        this.success = false;
        this.errorMessages.push(error);
    }

    getErrors(join = false) {
        if (join) {
            return this.errorMessages.join(join);
        }

        return this.errorMessages;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setData(data) {
        this.data.push(data);
    }

    getData() {
        return this.data;
    }

    isSuccess() {
        return this.success;
    }
}

module.exports = {AddResult};