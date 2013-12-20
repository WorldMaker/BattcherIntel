/// <amd-dependency path="knockout.validation"/>
import dataModel = require('../../account/model');
import ko = require('knockout');

class RegisterExternalViewModel {
    // Data
    loginProvider = ko.observable();
    userName = ko.observable(null).extend({ required: true });

    // Other UI state
    registering = ko.observable(false);
    externalAccessToken = null;
    state = null;
    loginUrl = null;
    errors = ko.observableArray();
    validationErrors = ko.validation.group([this.userName]);

    // data-bind click
    register() {
        this.errors.removeAll();

        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
            return;
        }

        this.registering(true);
        dataModel.registerExternal(this.externalAccessToken, {
            userName: this.userName()
        }).done(data => {
                sessionStorage["state"] = this.state;
                // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage
                // temporarily to localStorage to work around this problem.
                dataModel.archiveSessionStorageToLocalStorage();
                window.location.href = this.loginUrl;
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

    activate(userName, loginProvider, externalAccessToken, loginUrl, state) {
        this.userName(userName);
        this.loginProvider(loginProvider);
        this.externalAccessToken = externalAccessToken;
        this.loginUrl = loginUrl;
        this.state = state;
    }
}

export = RegisterExternalViewModel;