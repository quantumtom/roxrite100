/**
 * options:
 * The options object contains all properties to render a custom script:
 * - el: The DOM element to append elements to
 * - config: The config object for the script as configured in the experience center
 *
 * start():
 * The start function is called when the custom script panel is rendered (e.g. when the user navigates to a page where the customscript is configured)
 * This method must return a Promise that yields and object with a stop function.
 *
 * stop():
 * The stop function is called when the custom script panel is stopped (e.g. when the user navigates to a new page).
 * please do any cleanup necessary so all traces that you were here are gone.
 */
define([], function () {
    function start(options) {
        console.log(options.config); // log the config which is set in the scriptConfig tag in the experience center (see codeblock below)
        var el = options.el;

        // you code goes here....
        // e.g. el.innerHTML = '<div>This div is created by a custom script</div>';


        return Promise.resolve({
            stop: function () {
                return Promise.resolve();
            }
        });
    }

    return {
        start: start
    };
});
