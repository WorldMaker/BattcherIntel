export import router = require('plugins/router');
import app = require('durandal/app');

export function search() {
    //It's really easy to show a message box.
    //You can add custom options too. Also, it returns a promise for the user's response.
    app.showMessage('Search not yet implemented...');
}

export function activate() {
    router.map([
        { route: '', title: 'Welcome', moduleId: 'viewmodels/welcome', nav: true },
        { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true }
    ]).buildNavigationModel();

    return router.activate();
}