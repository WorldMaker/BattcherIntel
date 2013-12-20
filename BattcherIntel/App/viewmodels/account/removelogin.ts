/// <amd-dependency path="knockout.validation"/>
import dataModel = require('../../account/model');
import ko = require('knockout');

class RemoveLoginViewModel {
    constructor(private data, private parent) {
    }

    providerKey = ko.observable(this.data.providerKey);

    // Data
    loginProvider = ko.observable(this.data.loginProvider);

    // Other UI state
    removing = ko.observable(false);

    // Operations
    remove() {
        this.parent.errors.removeAll();
        this.removing(true);
        dataModel.removeLogin({
            loginProvider: this.loginProvider(),
            providerKey: this.providerKey()
        }).done(data => {
                this.removing(false);
                this.parent.logins.remove(self);
                this.parent.message("The login was removed.");
            }).fail(data => {
                var errors;

                this.removing(false);
                errors = dataModel.toErrorsArray(data);

                if (errors) {
                    this.parent.errors(errors);
                } else {
                    this.parent.errors.push("An unknown error occurred.");
                }
            });
    }
}

export = RemoveLoginViewModel;