import dataModel = require('../../account/model');
import ko = require('ko-validation');

class RegisterViewModel {
    // Data
    userName = ko.observable("").extend({ required: true });
    password = ko.observable("").extend({ required: true });
    confirmPassword = ko.observable("").extend({ required: true, equal: this.password });

    // Other UI state
    registering = ko.observable(false);
    errors = ko.observableArray();
    validationErrors = ko.validation.group([this.userName, this.password, this.confirmPassword]);

    // Operations
    register() {
        this.errors.removeAll();
        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
            return;
        }
        this.registering(true);

        dataModel.register({
            userName: this.userName(),
            password: this.password(),
            confirmPassword: this.confirmPassword()
        }).done(data => {
                dataModel.login({
                    grant_type: "password",
                    username: this.userName(),
                    password: this.password()
                }).done(data => {
                        this.registering(false);

                        if (data.userName && data.access_token) {
                            // TODO: app.navigateToLoggedIn(data.userName, data.access_token, false /* persistent */);
                        } else {
                            this.errors.push("An unknown error occurred.");
                        }
                    }).fail(data => {
                        this.registering(false);

                        if (data && data.error_description) {
                            this.errors.push(data.error_description);
                        } else {
                            this.errors.push("An unknown error occurred.");
                        }
                    });
            }).fail(data => {
                var errors;

                this.registering(false);
                errors = dataModel.toErrorsArray(data);

                if (errors) {
                    this.errors(errors);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            });
    }
}

export = RegisterViewModel;