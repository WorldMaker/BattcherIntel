import dataModel = require('../../account/model');
import ko = require('ko-validation');
import RemoveLoginViewModel = require('./removelogin');

class SetPasswordViewModel {
    constructor(private parent) {
    }

    // Data
    newPassword = ko.observable("").extend({ required: true });
    confirmPassword = ko.observable("").extend({ required: true, equal: this.newPassword });

    // Other UI state
    setting = ko.observable(false);
    errors = ko.observableArray();
    validationErrors = ko.validation.group([this.newPassword, this.confirmPassword]);

    // Operations
    set() {
        this.errors.removeAll();
        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
            return;
        }
        this.setting(true);

        dataModel.setPassword({
            newPassword: this.newPassword(),
            confirmPassword: this.confirmPassword()
        }).done(data => {
                this.setting(false);
                this.parent.logins.push(new RemoveLoginViewModel({
                    loginProvider: this.parent.localLoginProvider(),
                    providerKey: this.parent.userName()
                }, this.parent));
                this.parent.message("Your password has been set.");
            }).fail(data => {
                var errors;

                this.setting(false);
                errors = dataModel.toErrorsArray(data);

                if (errors) {
                    this.errors(errors);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            });
    }
}

export = SetPasswordViewModel;