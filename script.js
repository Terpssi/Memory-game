'use strict';

(function () {

    let scene = document.getElementById('scene'); //поле с карточками
    let card = document.querySelector('.card'); //карточки li []

    clone(scene, card); //делаем 12 карточек из одной

    let arrBack = scene.querySelectorAll('.back'); //массив с карточками (с эмозди)

    randomEmoji(arrBack); //рандомизирует картинки на карточках

    let turn = 0; //количество перевернутых неопределенных карточек
    let arrSymbol = []; //сюда записываем перевернутые эмодзи
    let arrTarget = []; //для записи перевернутых карточек (эмодзи вверх)
    let timerHTML = document.getElementById('timer'); //таймер в HTML
    let playField = 0; //чтобы записывать сколько карт всего перевернуто
    let popup = document.getElementById('popup'); //всплывашка
    let play = document.getElementById('play'); //кнопка Play again
    let head = document.getElementById('head'); //блок с прыгающими буквами

    scene.addEventListener('click', function (event) {

        let target = event.target;

        if (target.classList.contains('front')) {
            if (timerHTML.innerHTML=== '01:00')  {
                clock(timerHTML, popup);
            }
            target.parentNode.classList.add('flipped');
            turn += 1; //увеличиваем число перевернутых карточек
            arrSymbol.push(target.parentNode.querySelector('.back').innerHTML); //добавляем в массив перевернутых неопределенных карточек
            arrTarget.push(target.parentNode.querySelector('.back'));
        }
        if (target.classList.contains('back')) {
            if (!target.classList.contains('wrong')) {
                target.parentNode.classList.remove('flipped');
                turn -= 1; //уменьшаем число перевернутых карточек
                let index = arrSymbol.indexOf(target.parentNode.querySelector('.back').innerHTML); //находим позицию перевернутого символа
                arrSymbol.splice(index,1);
                arrTarget.splice(index,1);
            }
        }

        if (turn === 2) { //если на поле открыто 2 карточки, то...
            if (arrSymbol[0] === arrSymbol[1]) { //сравниваем символы, если они равны..
                right(arrTarget); //делаем их зелеными
                stopClick(arrTarget); //блокируем клик
                turn = 0; //количество перевернутых карточек сбрасываем
                arrSymbol = []; //очищаем массивы со списком открытых символов и карточек
                arrTarget = [];
                playField = playField + 1;
            }
            if (arrSymbol[0] !== arrSymbol[1]) { //сравниваем символы, если они не равны..
                wrong(arrTarget, 'add'); //делаем их красными
            }
        }
        if (turn === 3) { //когда открываем третью карточку..
            wrong(arrTarget, 'remove'); //у первой и второй карточек убираем красноту
            flipped(arrTarget); //и переворачиваем их
            turn = 1; //кол-во открытых карточек сбрасываем на 1.
            arrSymbol = [arrSymbol[arrSymbol.length-1]];
            arrTarget = [arrTarget[arrTarget.length-1]];
            turn = 1;
        }
        
        if (playField === 6) { //когда на поле 6 открытых пар..
            popup.classList.remove('hidden'); //выигрыш
            bounce('Win', head, play);
        }
    });

    play.addEventListener('focus', function () { //работа кнопки play again
        popup.classList.add('hidden'); //закрываем окно
        playField = 0; //сбрасываем все переменные на стартовые значения
        arrSymbol = [];
        arrTarget = [];
        turn = 0;
        timerHTML.innerHTML = '01:00';
        head.innerHTML = '';
        arrBack.forEach(function (item) { //переворачиваем все карты и убираем зеленый
            item.parentNode.classList.remove('flipped');
            item.classList.remove('right');
        });
        setTimeout(function () {
            randomEmoji(arrBack); //как только все карточки перевернулись мешаем колоду
        },1000)
    },true);





})();

function clone (place, element) { //клонируем карточки
    for (let i = 1; i < 12; i++) {
        let cloneCard = element.cloneNode(true);
        place.append(cloneCard);
    }
}

function shuffle(arr){ //функция перемешивания элементов массива
    let j, temp;
    for(let i = arr.length - 1; i > 0; i--){
        j = Math.floor(Math.random()*(i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function randomEmoji(arrBack) {
    let arrEmoji = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🐵', '🦄', '🐞', '🦀', '🐟', '🐊', '🐓', '🦃'];
    shuffle(arrEmoji); //мешаем исходный массив
    arrEmoji.splice(6, arrEmoji.length-6); //забираем из помешанног массива первые 6 элементов
    arrEmoji.forEach(function (item, i) {
        arrEmoji.push(arrEmoji[i]); //задваиваем эмодзи
    });
    shuffle(arrEmoji); //получаенный массив еще раз мешаем. теперь у нас есть массив с 12 парными эмодзи
    arrBack.forEach(function (item, i) {
        item.innerHTML = arrEmoji[i]; //размещаем эмодзи по карточкам
    })
}

function stopClick(arrElements) {
    arrElements[0].onclick = function (event) { //блокируем клик
        event.stopPropagation();
    };
    arrElements[1].onclick = function (event) { //блокируем клик
        event.stopPropagation();
    };
}

function wrong(arrElements, command) { //убирать или накладывать красное
    if (command === 'add') {
        arrElements[0].classList.add('wrong');
        arrElements[1].classList.add('wrong');
    }
    if (command === 'remove') {
        arrElements[0].classList.remove('wrong');
        arrElements[1].classList.remove('wrong');
    }

}

function right(arrElements) { //для добавления зеленого
    arrElements[0].classList.add('right');
    arrElements[1].classList.add('right');
}

function flipped(arrElements) { //для переворачивания карточек
    arrElements[0].parentNode.classList.remove('flipped');
    arrElements[1].parentNode.classList.remove('flipped');
}



function bounce (result, element, button) {  //прописывает буквы в Html и заставляет их прыгать
    if (result === 'Lose') {
        button.innerHTML = 'Try again'; //при проигрыше меняет play на try
    }

    let arrResult = result.split(''); //полученное слово разбиваем на массив букв
    arrResult.forEach(function (item, index) { //для каждой буквы..
        let letter = document.createElement('s'); // создаем новый элемент
        letter.className = 'animation'; //добавляем анимацию
        letter.classList.add('delay_' + index); //добавляем задержку анимации
        letter.textContent = item; // каждую буквы записываем в элемент
        element.append(letter); //закидываем в DOM
    });

}

function clock(timer, element) { //таймер
    timer.innerHTML = '00:59'; //запуск таймера меняет его значение
    let time = timer.innerHTML.split(':'); //получаем массив ['00', '59]
    let timeId = setInterval(function () {
        time[1] -= 1; //вычитаем по 1 каждую секунду
        if (time[1] >= 10) {
            timer.innerHTML = '00:' + time[1]; //выводим полученное число в DOM
        }
        if (time[1] < 10) {
            timer.innerHTML = '00:0' + time[1]; //когда начинаются 1значиные числа, добавляем 0 впереди.
        }
        if (time[1] === 0) { //если таймер дошел до 0
            element.classList.remove('hidden'); //выводим всплывашку
            bounce('Lose', head, play); //проигрыш
            clearInterval(timeId); //таймер останавливается
        }
        if (!element.classList.contains('hidden')) { //если есть всплывшее окно
            clearInterval(timeId); //останавливает таймер
        }
    },1000)
}