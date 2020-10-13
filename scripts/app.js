'use strict';

const buttons = document.querySelector('.calculator-buttons'),
    inputWindow = document.querySelector('input'),
    audioClick = document.querySelector('#click'),
    audioAlert = document.querySelector('#alert'),
    methods = new Map(),
    actions = new Map();

audioClick.volume = 0.5;

inputWindow.focus();

methods.set('/', (a = 1, b = 1) => +a / +b );

methods.set('*', (a = 1, b = 1) => +a * +b);

methods.set('-', (a = 0, b = 0) => +a - +b);

methods.set('+', (a = 0, b = 0) => +a + +b);

actions.set('backspace', () => inputWindow.value = inputWindow.value.slice(0, -1));

actions.set('clear', () => inputWindow.value = '');

actions.set('equal', () => {
    if (validate()) return;

    const method = methods.get(sign);

    if (method == undefined) return;

    inputWindow.value = method(a, b);

    inputWindow.focus();
});

let res, a, b, signFirst, sign, dotsFirstGroup, dotsSecondGroup;

const renderVariables = () => {
    const inputRegExp = /([-]*)*(\d+([.]*)*\d*)*([+-/*]*)*(\d+([.]*)*\d*)*/g;
    res = inputRegExp.exec(inputWindow.value);

    signFirst = res[1] || '+';
    a = res[2] == undefined ? undefined : signFirst === '-' ? `-${res[2]}` : res[2];
    dotsFirstGroup = res[3] || '';
    sign = res[4];
    b = res[5];
    dotsSecondGroup = res[6] || '';
};

const renderAlert = (el, text = 'букв, символов') => {
    const notifMsg = el.querySelector('p');
    notifMsg.textContent = notifMsg.textContent.replace(/sampeText/gi, text);
    el.classList.add('show');
    audioAlert.play();
    setTimeout(() => {
        el.classList.remove('show');
        notifMsg.textContent = 'Не допускается ввод sampeText';
    }, 2000);
};

const validate = e => {

    audioClick.play();

    const el = document.querySelector('.alert');

    if (e && e.type == 'input') {

        renderVariables();

        if (signFirst && signFirst.length >= 2 && a == undefined) {
            inputWindow.value = inputWindow.value.slice(0, -1);
        }
    
        if (sign && sign.length >= 2 && b == undefined) {
            inputWindow.value = inputWindow.value.slice(0, -1);
        }
    }

    if (/[^0-9+\-\=\*\/]/g.test(inputWindow.value)) {
        if (/\w+/g.test(inputWindow.value) && /[!@#$%^&()]/g.test(inputWindow.value)) {
            renderAlert(el, 'букв, символов');
            inputWindow.value = inputWindow.value.slice(0, -1);
            return true;
        }

        if (/[!@#$%^&()]/g.test(inputWindow.value)) {
            renderAlert(el, 'символов');
            inputWindow.value = inputWindow.value.slice(0, -1);
            return true;
        }

        renderAlert(el, 'букв');
        inputWindow.value = inputWindow.value.slice(0, -1);
        return true;
    }
    return false;
};

inputWindow.addEventListener('input', validate);

buttons.addEventListener('click', event => {
    const target = event.target.closest('button');

    if (target == null) return;
    
    audioClick.play();

    renderVariables();

    const methodActions = actions.get(target.dataset.action);

    if (methodActions != undefined) {
        methodActions();
    } else {
        if (validate()) return;

        if (signFirst && signFirst.length >= 1 && target.classList.contains('sign') && a == '') {
            inputWindow.value = inputWindow.value.slice(0, -1);
        }

        if (sign && sign.length >= 1 && target.classList.contains('sign') && b == '') {
            inputWindow.value = inputWindow.value.slice(0, -1);
        }

        if (dotsFirstGroup.length >= 1 && dotsSecondGroup.length >= 1 && target.dataset.action === 'dot') return;

        inputWindow.value += target.textContent;
    }
});

document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        audioClick.play();
        const methodActions = actions.get('equal');
        methodActions();
    }
});