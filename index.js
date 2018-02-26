import './styles/main.css';
import './styles/fonts/Druk-Wide-Bold.otf';
import './styles/fonts/Graphik-Regular.otf';
import Markup from './raw.html';

let O = {
    start: function (options) {
        console.log('===================== INDEX START =====================');
        var el = options.el;

        el.innerHTML = Markup;

        return Promise.resolve({
            stop: function () {
                console.log('===================== MAIN STOP =====================');
                return Promise.resolve();
            }
        });
    }
};

export default O;
