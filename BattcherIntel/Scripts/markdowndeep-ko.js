define(['knockout', 'markdowndeep'], function (ko, MarkdownDeep) {
    ko.bindingHandlers.markdown = {
        //init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        //    // This will be called when the binding is first applied to an element
        //    // Set up any initial state, event handlers, etc. here
        //},
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // First get the latest data that we're bound to
            var value = valueAccessor();

            // Next, whether or not the supplied model property is observable, get its current value
            var valueUnwrapped = ko.unwrap(value);
            if (!valueUnwrapped) {
                $(element).html('');
                return;
            }

            var md = new MarkdownDeep.Markdown();

            // Set options
            md.ExtraMode = true;
            md.SafeMode = true;

            $(element).html(md.Transform(valueUnwrapped));
        }
    }
});