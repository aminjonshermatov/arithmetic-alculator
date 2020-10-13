'use strict';

const buttons = document.querySelector('.calculator-buttons'),
    inputWindow = document.querySelector('input'),
    audioClick = document.querySelector('#click'),
    audioAlert = document.querySelector('#alert'),
    methods = new Map();

audioClick.volume = 0.5;

methods.set('/', (a = 1, b = 1) => +a / +b );

methods.set('*', (a = 1, b = 1) => +a * +b);

methods.set('-', (a = 0, b = 0) => +a - +b);

methods.set('+', (a = 0, b = 0) => +a + +b);

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

const validate = () => {
    const el = document.querySelector('.alert');

    if (/[^0-9+\-\=\*\/]/g.test(inputWindow.value)) {
        if (/\w/g.test(inputWindow.value) && /[!@#$%^&()]/g.test(inputWindow.value)) {
            renderAlert(el, 'букв, символов');
            return true;
        }
        
        if (/[!@#$%^&()]/g.test(inputWindow.value)) {
            renderAlert(el, 'символов');
            return true;
        }

        renderAlert(el, 'букв');
        return true;
    }
    return false;
};

inputWindow.addEventListener('input', validate);

buttons.addEventListener('click', async event => {
    const target = event.target.closest('button');

    if (target == null) return;
    
    await audioClick.play();

    const inputRe = /([-]*)*(\d+([.]*)*\d*)*([+-/*]*)*(\d+([.]*)*\d*)*/g;

    let res, a, b, signFirst, sign, dotsFirstGroup, dotsSecondGroup;

    const renderVariables = () => {
        signFirst = res[1];
        a = res[2] == undefined ? '' : signFirst === '-' ? `-${res[2]}` : res[2];
        dotsFirstGroup = res[3] || '';
        sign = res[4];
        b = res[5] || '';
        dotsSecondGroup = res[6] || '';
    };

    res = inputRe.exec(inputWindow.value);
    renderVariables();

    switch (target.dataset.action) {
        case 'backspace':
            inputWindow.value = inputWindow.value.slice(0, -1);
            break;
        case 'clear':
            inputWindow.value = '';
            break;
        case 'equal':
            if (validate()) return;

            const method = methods.get(sign);

            if (method == undefined) return;

            inputWindow.value = method(a, b);
            break;
        default:
            if (validate()) return;

            if (signFirst && signFirst.length >= 1 && target.classList.contains('sign') && a == '') {
                inputWindow.value = inputWindow.value.slice(0, -1);
            }

            if (sign && sign.length >= 1 && target.classList.contains('sign') && b == '') {
                inputWindow.value = inputWindow.value.slice(0, -1);
            }

            if (dotsFirstGroup.length >= 1 && dotsSecondGroup.length >= 1 && target.dataset.action === 'dot') return;

            inputWindow.value += target.textContent;
            break;
    }
});
