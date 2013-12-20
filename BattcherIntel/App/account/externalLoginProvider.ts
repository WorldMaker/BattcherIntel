import app = require('./model');

export interface ExternalLoginProvider {
    name: string;
    state: any;
    url: string;
}

export class ExternalLoginProviderViewModel {
    // Data
    name: string;
    state: any;
    url: string;

    get faIconClass(): string {
        if (/Microsoft/i.test(this.name)) {
            return "fa fa-windows";
        }
        return "fa fa-user";
    }

    constructor(data: ExternalLoginProvider) {
        this.name = data.name;
        this.state = data.state;
        this.url = data.url;
    }

    // Operations
    login() {
        sessionStorage["state"] = this.state;
        sessionStorage["loginUrl"] = this.url;
        // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage temporarily
        // to localStorage to work around this problem.
        app.archiveSessionStorageToLocalStorage();
        window.location.href = this.url;
    }
}