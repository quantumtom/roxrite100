import Main './main.js';

let O = {
    start: function (options) {
        console.log('===================== START =====================');
        var el = options.el;

        el.innerHTML = Main;

        return Promise.resolve({
            stop: function () {
                console.log('===================== STOP =====================');
                return Promise.resolve();
            }
        });
    }
};

export default O;
