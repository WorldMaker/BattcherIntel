import dataModel = require('../../account/model');
import elp = require('../../account/externalLoginProvider');
import ko = require('ko-validation');

class LoginVM {
    // Private state
    private validationTriggered = ko.observable(false);
    private returnUrl: string = null;
    externalLoginProviders = ko.observableArray<elp.ExternalLoginProviderViewModel>();
    hasExternalLogin = ko.computed(() => this.externalLoginProviders().length > 0);

    userName = ko.observable<string>('').extend({ required: true });
    password = ko.observable<string>('').extend({ required: true });
    rememberMe = ko.observable(false);

    errors = ko.observableArray();
    validationErrors = ko.validation.group([this.userName, this.password]);
    loggingIn = ko.observable(false);

    activate(splat: any) {
        if (splat && splat.returnUrl) {
            this.returnUrl = splat.returnUrl;
        }

        return dataModel.getExternalLogins(this.returnUrl, true /* generateState */)
            .done(function (data) {
                if (typeof (data) === "object") {
                    for (var i = 0; i < data.length; i++) {
                        this.externalLoginProviders.push(new elp.ExternalLoginProviderViewModel(data[i]));
                    }
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            }).fail(function () {
                this.errors.push("An unknown error occurred.");
            });
    }

    // Operations
    login() {
        this.errors.removeAll();

        if (this.validationErrors().length > 0) {
            this.validationErrors.showAllMessages();
            return;
        }

        this.loggingIn(true);

        dataModel.login({
            grant_type: "password",
            username: this.userName(),
            password: this.password()
        }).done(function (data) {
                this.loggingIn(false);

                if (data.userName && data.access_token) {
                    // TODO: app.navigateToLoggedIn(data.userName, data.access_token, this.rememberMe());
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            }).fail(function (data) {
                this.loggingIn(false);

                if (data && data.error_description) {
                    this.errors.push(data.error_description);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            });
    }

    register() {
        // TODO: app.navigateToRegister();
    }
}

export = LoginVM;