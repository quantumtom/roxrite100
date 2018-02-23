import './styles/main.css';
import './styles/fonts/Druk-Wide-Bold.otf';
import './styles/fonts/Graphik-Regular.otf';
import Markup from './raw.html';
import './main.js';

let O = {
    start: function (options) {
        console.log('===================== START =====================');
        var el = options.el;

        el.innerHTML = Markup;

        return Promise.resolve({
            stop: function () {
                console.log('===================== STOP =====================');
                return Promise.resolve();
            }
        });
    }
};

export default O;
