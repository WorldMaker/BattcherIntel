/// <amd-dependency path="knockout.validation"/>
import dataModel = require('../../account/model');
import ko = require('knockout');

class ChangePasswordViewModel {
    constructor(private parent, name) {
        this.name = name;
    }

    // Private operations
    private reset() {
        this.errors.removeAll();
        this.oldPassword(null);
        this.newPassword(null);
        this.confirmPassword(null);
        this.changing(false);
        this.validationErrors.showAllMessages(false);
    }

    // Data
    name = ko.observable();
    oldPassword = ko.observable("").extend({ required: true });
    newPassword = ko.observable("").extend({ required: true });
    confirmPassword = ko.observable("").extend({ required: true, equal: this.newPassword });

    // Other UI state
    changing = ko.observable(false);
    errors = ko.observableArray();
    validationErrors = ko.validation.group([this.oldPassword, this.newPassword, this.confirmPassword]);

    // Operations
    change() {
        this.errors.removeAll();
        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
            return;
        }
        this.changing(true);

        dataModel.changePassword({
            oldPassword: this.oldPassword(),
            newPassword: this.newPassword(),
            confirmPassword: this.confirmPassword()
        }).done(data => {
                this.changing(false);
                this.reset();
                this.parent.message("Your password has been changed.");
            }).fail(data => {
                var errors;

                this.changing(false);
                errors = dataModel.toErrorsArray(data);

                if (errors) {
                    this.errors(errors);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            });
    }
}

export = ChangePasswordViewModel;