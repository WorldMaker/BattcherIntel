import NProgress = require('nprogress');

// Take errors as json
export function failAsJson(...results: any[]): JQueryGenericPromise<any> {
    if (results.length <= 0 || !results[0]) {
        return $.Deferred().reject();
    }
    var xhr: JQueryXHR = results[0];
    if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
        var result = JSON.parse(xhr.responseText);
        result.xhr = xhr;
        return $.Deferred().reject(result);
    }
    return $.Deferred().reject({ xhr: xhr });
}

export function subscribeProgress(obs: KnockoutObservable<boolean>) {
    obs.subscribe(newValue => {
        if (newValue) {
            NProgress.start();
        } else {
            NProgress.done();
        }
    });
}