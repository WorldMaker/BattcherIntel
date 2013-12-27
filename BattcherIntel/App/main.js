requirejs.config({
    baseUrl: '/App/',
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions',
        'bootstrap': '../Scripts/bootstrap',
        'jquery': '../Scripts/jquery-2.0.3',
        'knockout': '../Scripts/knockout-3.0.0',
        'knockout.validation': '../Scripts/knockout.validation',
        'lodash.underscore': '../Scripts/lodash.underscore',
        'markdowndeep': '../Scripts/markdowndeep',
        'markdowndeep-ko': '../Scripts/markdowndeep-ko',
        'moment': '../Scripts/moment',
        'nprogress': '../Scripts/nprogress',
        'toastr': '../Scripts/toastr',
        'underscore-ko': '../Scripts/underscore-ko'
    },
    map: {
        '*': {
            'underscore': 'lodash.underscore'
        },
    },
    noGlobal: true, // For moment.js deprecation warning
    shim: {
        'bootstrap': ['jquery'],
        'jquery': {
            exports: "$"
        },
        'nprogress': {
            deps: ['jquery'],
            exports: 'NProgress'
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'account/security'],  function (system, app, viewLocator, security) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Battcher Intelligence Agency';

    app.configurePlugins({
        router: true,
        //dialog: true,
        widget: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        security.initializeAuth()
            .then(function () {
                app.setRoot('viewmodels/shell', 'entrance')
            });
    });
});