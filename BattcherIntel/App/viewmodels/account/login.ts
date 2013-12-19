import dataModel = require('../../account/model');
import elp = require('../../account/externalLoginProvider');
import ko = require('ko-validation');
import security = require('../../account/security');

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
        } else {
            this.returnUrl = '';
        }

        return dataModel.getExternalLogins(dataModel.siteUrl, true /* generateState */)
            .done(data => {
                if (typeof (data) === "object") {
                    for (var i = 0; i < data.length; i++) {
                        this.externalLoginProviders.push(new elp.ExternalLoginProviderViewModel(data[i]));
                    }
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            }).fail(() => {
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
        }).done(data => {
                this.loggingIn(false);

            if (data.userName && data.access_token) {
                security.login(data.userName, data.access_token, this.rememberMe(), this.returnUrl);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            }).fail(data => {
                this.loggingIn(false);

                if (data && data.error_description) {
                    this.errors.push(data.error_description);
                } else {
                    this.errors.push("An unknown error occurred.");
                }
            });
    }
}

export = LoginVM;