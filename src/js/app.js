/*
(i) код попадает в итоговый файл,
только когда вызвана функция,
например flsFunctions.spollers();
Или когда импортирован весь файл,
например, import "files/script.js";
Неиспользуемый (не вызываемый)
код в итоговый файл не попадает.

Если мы хотим добавить модуль
следует его раскомментировать
*/

// включить/выключить FLS (Full Logging System) (в работе)
//window["FLS"] = true;

// подключение основного файла стилей
import "../scss/style.scss";

// функционал

import * as flsFunctions from "./files/functions.js";

/* проверка поддержки webp, добавление класса webp или no-webp для HTML */
/* (i) необходимо для корректного отображения webp из css */
flsFunctions.isWebp();

/* добавление класса touch для HTML если браузер мобильный */
// flsFunctions.addTouchClass();

/* добавление loaded для HTML после полной загрузки страницы */
// flsFunctions.addLoadedClass();

/* модуль для работы из меню (Бургер) */
//flsFunctions.menuInit();

/* учет плавающей панели на мобильных устройствах при 100vh */
// flsFunctions.fullVHfix();

/* форматирование чисел */
// import './libs/wNumb.min.js';

/*
модуль "Спойлеры"
сниппет (HTML): spollers
*/
//flsFunctions.spollers();

/*
модуль "Табы"
сниппет (HTML): tabs
*/
//flsFunctions.tabs();

/*
модуль "Показать еще"
сниппет (HTML): showmore
*/
// flsFunctions.showMore();

/*
модуль "К/После"
сниппет (HTML): ba
*/
// import './libs/beforeafter.js';

/*
модуль "Эффект волн"
сниппет (HTML):
*/
// flsFunctions.rippleEffect();

/*
модуль "Кастомный курсор"
сниппет (HTML):
*/
// flsFunctions.customCursor(true);

/*
модуль "Попапы"
документация: https://template.fls.guru/template-docs/funkcional-popup.html
сниппет (HTML): pl, pop
*/
//import "./libs/popup.js";

/*
модуль 'параллакс мышью'
*/
// import './libs/parallax-mouse.js'

// ----------- работа с формами -------------- //
import * as flsForms from "./files/forms/forms.js";

/* работа с полями формы */
/*
flsForms.formFieldsInit({
	viewPass: false,
	autoHeight: false
});
*/

/* отправка формы */
// flsForms.formSubmit();

/* модуль формы "количество" */
// flsForms.formQuantity();

/* модуль звездного рейтинга */
// flsForms.formRating();

/* модуль работы по select. */
// import './libs/select.js'

/* модуль работы с календарем */
// import './files/forms/datepicker.js'

/* (В работе) модуль работы с масками.*/
/*
подключение и настройка выполняется в файле js/files/forms/inputmask.js
документация по работе в шаблоне:
документация плагина: https://github.com/RobinHerbots/inputmask
сниппет(HTML):
*/
// import "./files/forms/inputmask.js";

/* модуль работы с ползунком */
/*
подключение и настройка выполняется в файле js/files/forms/range.js
документация по работе в шаблоне:
документация плагина: https://refreshless.com/nouislider/
сниппет (HTML): range
*/
// import "./files/forms/range.js";

/* модуль работы с подсказками (tippy)*/
/*
подключение плагина Tippy.js и настройки производится в файле js/files/tippy.js
документация по работе в шаблоне:
документация плагина: https://atomiks.github.io/tippyjs/
сниппет (HTML): tip (добавляет атрибут с подсказкой для html тега)
*/
// import "./files/tippy.js";

// работа со слайдером (Swiper)
/*
настройка подключения плагина слайдера Swiper и новых слайдеров выполняется в файле js/files/sliders.js
документация плагина: https://swiperjs.com/
сниппет(HTML): swiper
*/
import "./files/sliders.js";

// модули работы с прокруткой страницы

/*
изменение дизайна скроллбара
документация по работе в шаблоне: В HTML добавляем в блок атрибут data-simplebar
документация плагина: https://github.com/Grsmto/simplebar/tree/master/packages/simplebar
сниппет(HTML):
*/
// import './files/scroll/simplebar.js';

// ленивая (отложенная) загрузка картинок
// документация плагина: https://github.com/verlok/vanilla-lazyload
// сниппет(HTML):
// import './files/scroll/lazyload.js';

// наблюдатель за объектами с атрибутом data-watch
// сниппет(HTML):
// import './libs/watcher.js'

// модуль поэкранной прокрутки
// сниппет(HTML):
// import './libs/fullpage.js'

// модуль параллакса
// сниппет(HTML):
// import './libs/parallax.js'

// функции работы скролом
import * as flsScroll from "./files/scroll/scroll.js";

// плавная навигация по странице
//flsScroll.pageNavigation();

// функционал добавления классов к хедеру во время прокрутки
// flsScroll.headerScroll();

// модуль анимации цифрового счетчика
// сниппет(HTML):
// flsScroll.digitsCounter();

// галерея
/*

документация плагина: https://www.lightgalleryjs.com/docs/
сниппет(HTML):
*/
// import "./files/gallery.js";

// масонри сетка
/*
документация плагина:
сниппет(HTML):
*/
// import "./files/isotope.js";

// ------------ другие плагины ------------ //

/* динамический адаптив */
import "./libs/dynamic_adapt.js";

// -------------- другое ------------ //
/* подключаем файлы со своим кодом */
import "./files/script.js";
