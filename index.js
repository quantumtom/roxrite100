import './styles/main.css';
import './styles/fonts/Druk-Wide-Bold.otf';
import './styles/fonts/Graphik-Regular.otf';
import Markup from './raw.html';

function component() {
    let element = document.createElement('div');

    element.innerHTML = Markup;

    return element;
}

document.body.appendChild(component());

var O = {
    start: function () {
        console.log('here');
    },
    stop: function () {

    }
};

export default O;
