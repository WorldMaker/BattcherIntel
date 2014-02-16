/// <amd-dependency path="knockout.validation"/>
import dataModel = require('../../account/model');
import elp = require('../../account/externalLoginProvider');
import ko = require('knockout');
import ChangePasswordViewModel = require('./changepassword');
import RemoveLoginViewModel = require('./removelogin');
import SetPasswordViewModel = require('./addpassword');

class ManageViewModel {
    private startedLoad = false;

    // UI state used by private state
    logins = ko.observableArray<any>();

    // Private state
    hasLocalPassword = ko.computed(() => {
        var logins = this.logins();

        for (var i = 0; i < logins.length; i++) {
            if (logins[i].loginProvider() === this.localLoginProvider()) {
                return true;
            }
        }

        return false;
    });

    // Data
    userName = ko.observable();
    localLoginProvider = ko.observable();

    // UI state
    externalLoginProviders = ko.observableArray();
    message = ko.observable();
    errors = ko.observableArray();

    changePassword = new ChangePasswordViewModel(this, this.userName);

    setPassword = new SetPasswordViewModel(this);

    hasExternalLogin = ko.computed(() => {
        return this.externalLoginProviders().length > 0;
    });

    canRemoveLogin = ko.computed(() => {
        return this.logins().length > 1;
    });

    // Operations
    load() { // Load user management data
        if (!this.startedLoad) {
            this.startedLoad = true;

            return dataModel.getManageInfo(dataModel.siteUrl, true /* generateState */)
                .done(data => {
                    if (typeof (data.localLoginProvider) !== "undefined" &&
                        typeof (data.userName) !== "undefined" &&
                        typeof (data.logins) !== "undefined" &&
                        typeof (data.externalLoginProviders) !== "undefined") {
                        this.userName(data.userName);
                        this.localLoginProvider(data.localLoginProvider);

                        for (var i = 0; i < data.logins.length; i++) {
                            this.logins.push(new RemoveLoginViewModel(data.logins[i], self));
                        }

                        for (var i = 0; i < data.externalLoginProviders.length; i++) {
                            this.externalLoginProviders.push(new elp.ExternalLoginProviderViewModel(data.externalLoginProviders[i]));
                        }
                    } else {
                        this.errors.push("Error retrieving user information.");
                    }

                }).fail(data => {
                    var errors;

                    errors = dataModel.toErrorsArray(data);

                    if (errors) {
                        this.errors(errors);
                    } else {
                        this.errors.push("Error retrieving user information.");
                    }
                });
        } else {
            return $.Deferred().resolve();
        }
    }

    addExternalLogin(externalAccessToken, externalError) {
        if (externalError !== null || externalAccessToken === null) {
            this.errors.push("Failed to associated external login.");
            return this.load();
        } else {
            return dataModel.addExternalLogin({
                externalAccessToken: externalAccessToken
            }).done(data => {
                    this.load();
                }).fail(data => {
                    var errors = dataModel.toErrorsArray(data);

                    if (errors) {
                        this.errors(errors);
                    } else {
                        this.errors.push("An unknown error occurred.");
                    }

                    this.load();
                });
        }
    }

    activate(externalAccessToken, externalError) {
        if (typeof (externalAccessToken) !== "undefined" || typeof (externalError) !== "undefined") {
            return this.addExternalLogin(externalAccessToken, externalError);
        } else {
            return this.load();
        };
    }
}

export = ManageViewModel;