import { isMobile } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

/*
	data-fp – оболочка
	data-fp-section – секции

	переход на определенный слайд
	fpage.switchingSection(id);

	установка z-index
	fPage.init();
	fPage.destroy();
	fPage.setZIndex();

	id активного слайда
	fPage.activeSectionId
	активный слайд
	fPage.activeSection

	события
	fpinit
	fpdestroy
	fpswitching
*/

// класс FullPage
export class FullPage {
	constructor(element, options) {
		let config = {
			//===============================
			// селектор, на котором не работает событие свайпа/колеса
			noEventSelector: "[загрузка]",
			//===============================
			// настройка оболочки
			// класс при инициализации плагина
			classInit: "fp-init",
			// класс для врапера во время пролистывания
			wrapperAnimatedClass: "fp-switching",
			//===============================
			// настройка секций
			// СЕЛЕКТОР для секций
			selectorSection: "[data-fp-section]",
			// класс для активной секции
			activeClass: "active-section",
			// класс для Предыдущей секции
			previousClass: "предыдущий раздел",
			// класс для следующей секции
			nextClass: "next-section",
			// id начально активного класса
			idActiveSection: 0,
			//===============================
			// другие настройки
			// ввайп мышью
			// touchSimulator: false,
			//===============================
			// эффекты
			// эффекты: fade, cards, slider
			mode: element.dataset.fpEffect ? element.dataset.fpEffect : "slider",
			//===============================
			// буллеты
			// активация буллетов
			bullets: element.hasAttribute("data-fp-bullets") ? true : false,
			// класс оболочки буллетов
			bulletsClass: "fp-bullets",
			// класс буллета
			bulletClass: "fp-bullet",
			// класс активного буллета
			bulletActiveClass: "fp-bullet-active",
			//===============================
			// события
			// событие создания
			onInit: function () {},
			// событие перелистывания секции
			onSwitching: function () {},
			// событие разрушения плагина
			onDestroy: function () {},
		};
		this.options = Object.assign(config, options);
		// родительский элемент
		this.wrapper = element;
		this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
		// активный слайд
		this.activeSection = false;
		this.activeSectionId = false;
		// предыдущий слайд
		this.previousSection = false;
		this.previousSectionId = false;
		// следующий слайд
		this.nextSection = false;
		this.nextSectionId = false;
		// оболочка буллетов
		this.bulletsWrapper = false;
		// вспомогательная переменная
		this.stopEvent = false;
		if (this.sections.length) {
			// инициализация элементов
			this.init();
		}
	}
	//===============================
	// начальная инициализация
	init() {
		if (this.options.idActiveSection > this.sections.length - 1) return;
		// расставляем id
		this.setId();
		this.activeSectionId = this.options.idActiveSection;
		// присвоение классов с разными эффектами
		this.setEffectsClasses();
		// установка классов
		this.setClasses();
		// установка стилей
		this.setStyle();
		// установка булетов
		if (this.options.bullets) {
			this.setBullets();
			this.setActiveBullet(this.activeSectionId);
		}
		// установка событий
		this.events();
		// устанавливаем init класс
		setTimeout(() => {
			document.documentElement.classList.add(this.options.classInit);
			// создание кастомного события
			this.options.onInit(this);
			document.dispatchEvent(
				new CustomEvent("fpinit", {
					detail: {
						fp: this,
					},
				})
			);
		}, 0);
	}
	//===============================
	// удалить
	destroy() {
		// удаление событий
		this.removeEvents();
		// удаление классов у секций
		this.removeClasses();
		// удаление класса инициализации
		document.documentElement.classList.remove(this.options.classInit);
		// удаление класса анимации
		this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
		// удаление классов эффектов
		this.removeEffectsClasses();
		// удаление z-index у секций
		this.removeZIndex();
		// удаление стилей
		this.removeStyle();
		// удаление ID
		this.removeId();
		// создание кастомного события
		this.options.onDestroy(this);
		document.dispatchEvent(
			new CustomEvent("fpdestroy", {
				detail: {
					fp: this,
				},
			})
		);
	}
	//===============================
	// установка ID для секций
	setId() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.setAttribute("data-fp-id", index);
		}
	}
	//===============================
	// удаление ID для секций
	removeId() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.removeAttribute("data-fp-id");
		}
	}
	//===============================
	// функция установки классов для первой, активной и следующей секций
	setClasses() {
		// сохранение id для ПРЕДЫДУЩЕГО слайда (если таковой есть)
		this.previousSectionId =
			this.activeSectionId - 1 >= 0 ? this.activeSectionId - 1 : false;

		// сохранение id для СЛЕДУЮЩЕГО слайда (если таковой есть)
		this.nextSectionId =
			this.activeSectionId + 1 < this.sections.length
				? this.activeSectionId + 1
				: false;

		// установка класса и присвоение элемента для активного слайда
		this.activeSection = this.sections[this.activeSectionId];
		this.activeSection.classList.add(this.options.activeClass);

		for (let index = 0; index < this.sections.length; index++) {
			document.documentElement.classList.remove(`fp-section-${index}`);
		}
		document.documentElement.classList.add(
			`fp-section-${this.activeSectionId}`
		);

		// установка класса и присвоение элемента для ПРЕДЫДУЩЕГО слайда
		if (this.previousSectionId !== false) {
			this.previousSection = this.sections[this.previousSectionId];
			this.previousSection.classList.add(this.options.previousClass);
		} else {
			this.previousSection = false;
		}

		// установка класса и присвоение элемента для СЛЕДУЮЩЕГО слайда
		if (this.nextSectionId !== false) {
			this.nextSection = this.sections[this.nextSectionId];
			this.nextSection.classList.add(this.options.nextClass);
		} else {
			this.nextSection = false;
		}
	}
	//===============================
	// присвоение классов с разными эффектами
	removeEffectsClasses() {
		switch (this.options.mode) {
			case "slider":
				this.wrapper.classList.remove("slider-mode");
				break;

			case "cards":
				this.wrapper.classList.remove("cards-mode");
				this.setZIndex();
				break;

			case "fade":
				this.wrapper.classList.remove("fade-mode");
				this.setZIndex();
				break;

			default:
				break;
		}
	}
	//===============================
	// присвоение классов с разными эффектами
	setEffectsClasses() {
		switch (this.options.mode) {
			case "slider":
				this.wrapper.classList.add("slider-mode");
				break;

			case "cards":
				this.wrapper.classList.add("cards-mode");
				this.setZIndex();
				break;

			case "fade":
				this.wrapper.classList.add("fade-mode");
				this.setZIndex();
				break;

			default:
				break;
		}
	}
	//===============================
	// блокировка направлений скролла
	//===============================
	// функция установки стилей
	setStyle() {
		switch (this.options.mode) {
			case "slider":
				this.styleSlider();
				break;

			case "cards":
				this.styleCards();
				break;

			case "fade":
				this.styleFade();
				break;
			default:
				break;
		}
	}
	// slider-mode
	styleSlider() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index === this.activeSectionId) {
				section.style.transform = "translate3D(0,0,0)";
			} else if (index < this.activeSectionId) {
				section.style.transform = "translate3D(0,-100%,0)";
			} else if (index > this.activeSectionId) {
				section.style.transform = "translate3D(0,100%,0)";
			}
		}
	}
	// cards mode
	styleCards() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index >= this.activeSectionId) {
				section.style.transform = "translate3D(0,0,0)";
			} else if (index < this.activeSectionId) {
				section.style.transform = "translate3D(0,-100%,0)";
			}
		}
	}
	// fade style
	styleFade() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index === this.activeSectionId) {
				section.style.opacity = "1";
				section.style.pointerEvents = "all";
				//section.style.visibility = 'visible';
			} else {
				section.style.opacity = "0";
				section.style.pointerEvents = "none";
				//section.style.visibility = 'hidden';
			}
		}
	}
	//===============================
	// удаление стилей
	removeStyle() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.opacity = "";
			section.style.visibility = "";
			section.style.transform = "";
		}
	}
	//===============================
	// функция проверки полностью ли прокручен элемент
	checkScroll(yCoord, element) {
		this.goScroll = false;

		// есть ли элемент и готов ли к работе
		if (!this.stopEvent && element) {
			this.goScroll = true;
			// если высота секции не равна высоте окна
			if (this.haveScroll(element)) {
				this.goScroll = false;
				const position = Math.round(element.scrollHeight - element.scrollTop);
				// проверка на то, полностью ли прокручена секция
				if (
					(Math.abs(position - element.scrollHeight) < 2 && yCoord <= 0) ||
					(Math.abs(position - element.clientHeight) < 2 && yCoord >= 0)
				) {
					this.goScroll = true;
				}
			}
		}
	}
	//===============================
	// проверка высоты
	haveScroll(element) {
		return element.scrollHeight !== window.innerHeight;
	}
	//===============================
	// удаление классов
	removeClasses() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.classList.remove(this.options.activeClass);
			section.classList.remove(this.options.previousClass);
			section.classList.remove(this.options.nextClass);
		}
	}
	//===============================
	// сборник событий
	events() {
		this.events = {
			// колесо мыши
			wheel: this.wheel.bind(this),

			// свайп
			touchdown: this.touchDown.bind(this),
			touchup: this.touchUp.bind(this),
			touchmove: this.touchMove.bind(this),
			touchcancel: this.touchUp.bind(this),

			// конец анимации
			transitionEnd: this.transitionend.bind(this),

			// клик для буллетов
			click: this.clickBullets.bind(this),
		};
		if (isMobile.iOS()) {
			document.addEventListener("touchmove", (e) => {
				e.preventDefault();
			});
		}
		this.setEvents();
	}
	setEvents() {
		// событие колеса мыши
		this.wrapper.addEventListener("wheel", this.events.wheel);
		// событие нажатия на экран
		this.wrapper.addEventListener("touchstart", this.events.touchdown);
		// событие клика по булетам
		if (this.options.bullets && this.bulletsWrapper) {
			this.bulletsWrapper.addEventListener("click", this.events.click);
		}
	}
	removeEvents() {
		this.wrapper.removeEventListener("wheel", this.events.wheel);
		this.wrapper.removeEventListener("touchdown", this.events.touchdown);
		this.wrapper.removeEventListener("touchup", this.events.touchup);
		this.wrapper.removeEventListener("touchcancel", this.events.touchup);
		this.wrapper.removeEventListener("touchmove", this.events.touchmove);
		if (this.bulletsWrapper) {
			this.bulletsWrapper.removeEventListener("click", this.events.click);
		}
	}
	//===============================
	// функция клика по булетам
	clickBullets(e) {
		// нажатый буллет
		const bullet = e.target.closest(`.${this.options.bulletClass}`);
		if (bullet) {
			// массив всех буллетов
			const arrayChildren = Array.from(this.bulletsWrapper.children);

			// id Нажатого буллета
			const idClickBullet = arrayChildren.indexOf(bullet);

			// переключение секции
			this.switchingSection(idClickBullet);
		}
	}
	//===============================
	// установка стилей для буллетов
	setActiveBullet(idButton) {
		if (!this.bulletsWrapper) return;
		// Все буллеты
		const bullets = this.bulletsWrapper.children;

		for (let index = 0; index < bullets.length; index++) {
			const bullet = bullets[index];
			if (idButton === index)
				bullet.classList.add(this.options.bulletActiveClass);
			else bullet.classList.remove(this.options.bulletActiveClass);
		}
	}
	//===============================
	// функция нажатия тач/пера/курсора
	touchDown(e) {
		// сменно для свайпа
		this._yP = e.changedTouches[0].pageY;
		this._eventElement = e.target.closest(`.${this.options.activeClass}`);
		if (this._eventElement) {
			// вешаем событие touchmove и touchup
			this._eventElement.addEventListener("touchend", this.events.touchup);
			this._eventElement.addEventListener("touchcancel", this.events.touchup);
			this._eventElement.addEventListener("touchmove", this.events.touchmove);
			// тач случился
			this.clickOrTouch = true;

			//==============================
			if (isMobile.iOS()) {
				if (
					this._eventElement.scrollHeight !== this._eventElement.clientHeight
				) {
					if (this._eventElement.scrollTop === 0) {
						this._eventElement.scrollTop = 1;
					}
					if (
						this._eventElement.scrollTop ===
						this._eventElement.scrollHeight - this._eventElement.clientHeight
					) {
						this._eventElement.scrollTop =
							this._eventElement.scrollHeight -
							this._eventElement.clientHeight -
							1;
					}
				}
				this.allowUp = this._eventElement.scrollTop > 0;
				this.allowDown =
					this._eventElement.scrollTop <
					this._eventElement.scrollHeight - this._eventElement.clientHeight;
				this.lastY = e.changedTouches[0].pageY;
			}
			//===============================
		}
	}
	//===============================
	// событие движения тач/пера/курсора
	touchMove(e) {
		// получение секции, на которой срабатывает событие
		const targetElement = e.target.closest(`.${this.options.activeClass}`);
		//===============================
		if (isMobile.iOS()) {
			let up = e.changedTouches[0].pageY > this.lastY;
			let down = !up;
			this.lastY = e.changedTouches[0].pageY;
			if (targetElement) {
				if ((up && this.allowUp) || (down && this.allowDown)) {
					e.stopPropagation();
				} else if (e.cancelable) {
					e.preventDefault();
				}
			}
		}
		//===============================
		// проверка на завершение анимации и наличие НЕ СОБЫТАННОГО блока
		if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector))
			return;
		// получение направления движения
		let yCoord = this._yP - e.changedTouches[0].pageY;
		// разрешен ли переход?
		this.checkScroll(yCoord, targetElement);
		// переход
		if (this.goScroll && Math.abs(yCoord) > 20) {
			this.choiceOfDirection(yCoord);
		}
	}
	//===============================
	// событие отпуска от экрана тач/пера/курсора
	touchUp(e) {
		// удаление событий
		this._eventElement.removeEventListener("touchend", this.events.touchup);
		this._eventElement.removeEventListener("touchcancel", this.events.touchup);
		this._eventElement.removeEventListener("touchmove", this.events.touchmove);
		return (this.clickOrTouch = false);
	}
	//===============================
	// конец срабатывания перехода
	transitionend(e) {
		//if (e.target.closest(this.options.selectorSection)) {
		this.stopEvent = false;
		document.documentElement.classList.remove(
			this.options.wrapperAnimatedClass
		);
		this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
		//}
	}
	//===============================
	// событие прокрутки колесом мыши
	wheel(e) {
		// проверка на наличие НЕ СОБЫТАННОГО блока
		if (e.target.closest(this.options.noEventSelector)) return;
		// получение направления движения
		const yCoord = e.deltaY;
		// получение секции, на которой срабатывает событие
		const targetElement = e.target.closest(`.${this.options.activeClass}`);
		// разрешен ли переход?
		this.checkScroll(yCoord, targetElement);
		// переход
		if (this.goScroll) this.choiceOfDirection(yCoord);
	}
	//===============================
	// функция выбора направления
	choiceOfDirection(direction) {
		// установка нужных id
		if (direction > 0 && this.nextSection !== false) {
			this.activeSectionId =
				this.activeSectionId + 1 < this.sections.length
					? ++this.activeSectionId
					: this.activeSectionId;
		} else if (direction < 0 && this.previousSection !== false) {
			this.activeSectionId =
				this.activeSectionId - 1 >= 0
					? --this.activeSectionId
					: this.activeSectionId;
		}
		// смена слайдов
		this.switchingSection(this.activeSectionId, direction);
	}
	//===============================
	// функция переключения слайдов
	switchingSection(idSection = this.activeSectionId, direction) {
		if (!direction) {
			if (idSection < this.activeSectionId) {
				direction = -100;
			} else if (idSection > this.activeSectionId) {
				direction = 100;
			}
		}

		this.activeSectionId = idSection;

		// останавливаем работу событий
		this.stopEvent = true;
		// если слайд крайние, то разрешаем события
		if (
			(this.previousSectionId === false && direction < 0) ||
			(this.nextSectionId === false && direction > 0)
		) {
			this.stopEvent = false;
		}

		if (this.stopEvent) {
			// установка события окончания воспроизведения анимации
			document.documentElement.classList.add(this.options.wrapperAnimatedClass);
			this.wrapper.classList.add(this.options.wrapperAnimatedClass);
			//this.wrapper.addEventListener('transitionend', this.events.transitionEnd);
			// удаление классов
			this.removeClasses();
			// смена классов
			this.setClasses();
			// смена стилей
			this.setStyle();
			// установка стилей для буллетов
			if (this.options.bullets) this.setActiveBullet(this.activeSectionId);

			// устанавливаем задержку переключения
			// добавляем классы направления движения
			let delaySection;
			if (direction < 0) {
				delaySection = this.activeSection.dataset.fpDirectionUp
					? parseInt(this.activeSection.dataset.fpDirectionUp)
					: 500;
				document.documentElement.classList.add("fp-up");
				document.documentElement.classList.remove("fp-down");
			} else {
				delaySection = this.activeSection.dataset.fpDirectionDown
					? parseInt(this.activeSection.dataset.fpDirectionDown)
					: 500;
				document.documentElement.classList.remove("fp-up");
				document.documentElement.classList.add("fp-down");
			}

			setTimeout(() => {
				this.events.transitionEnd();
			}, delaySection);

			// создание события
			this.options.onSwitching(this);
			document.dispatchEvent(
				new CustomEvent("fpswitching", {
					detail: {
						fp: this,
					},
				})
			);
		}
	}
	//===============================
	// установка булетов
	setBullets() {
		// поиск оболочки буллетов
		this.bulletsWrapper = document.querySelector(
			`.${this.options.bulletsClass}`
		);

		// если нет создаем
		if (!this.bulletsWrapper) {
			const bullets = document.createElement("div");
			bullets.classList.add(this.options.bulletsClass);
			this.wrapper.append(bullets);
			this.bulletsWrapper = bullets;
		}

		// создание буллетов
		if (this.bulletsWrapper) {
			for (let index = 0; index < this.sections.length; index++) {
				const span = document.createElement("span");
				span.classList.add(this.options.bulletClass);
				this.bulletsWrapper.append(span);
			}
		}
	}
	//===============================
	// Z-INDEX
	setZIndex() {
		let zIndex = this.sections.length;
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.zIndex = zIndex;
			--zIndex;
		}
	}
	removeZIndex() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.zIndex = "";
		}
	}
}
// запускаем и добавляем в объект модулей
if (document.querySelector("[data-fp]")) {
	flsModules.fullpage = new FullPage(document.querySelector("[data-fp]"), "");
}
