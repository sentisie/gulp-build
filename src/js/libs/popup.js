// модуль popup'ов

// сниппет (HTML): pl

import {
	isMobile,
	bodyLockStatus,
	bodyLock,
	bodyUnlock,
	bodyLockToggle,
	FLS,
} from "../files/functions.js";
import { flsModules } from "../files/modules.js";

// класс Popup
class Popup {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			//для кнопок
			attributeOpenButton: "data-popup", // атрибут для кнопки, вызывающей попап
			attributeCloseButton: "data-close", // атрибут для кнопки, закрывающей попап
			// для посторонних объектов
			fixElementSelector: "[data-lp]", // атрибут для элементов с левым паддингом (fixed)
			// для объекта попапа
			youtubeAttribute: "data-popup-youtube", // атрибут для кода youtube
			youtubePlaceAttribute: "data-popup-youtube-place", // атрибут для вставки ролика youtube
			setAutoplayYoutube: true,
			// замена классов
			classes: {
				popup: "popup",
				// popupWrapper: 'popup__wrapper',
				popupContent: "popup__content",
				popupActive: "popup_show", // добавляется для попапа, когда он открывается
				bodyActive: "popup-show", // добавляется для боди, когда попап открыт
			},
			focusCatch: true, // фокус внутри попапа зациклен
			closeEsc: true, // закрытие ESC
			bodyLock: true, // блокировка скролла
			hashSettings: {
				location: true, // хэш в адресной строке
				goHash: true, // переход по наличию в адресной строке
			},
			on: {
				// события
				beforeOpen: function () {},
				afterOpen: function () {},
				beforeClose: function () {},
				afterClose: function () {},
			},
		};
		this.youTubeCode;
		this.isOpen = false;
		// текущее окно
		this.targetOpen = {
			selector: false,
			element: false,
		};
		// предыдущее открытое
		this.previousOpen = {
			selector: false,
			element: false,
		};
		// последнее закрыто
		this.lastClosed = {
			selector: false,
			element: false,
		};
		this._dataValue = false;
		this.hash = false;

		this._reopen = false;
		this._selectorOpen = false;

		this.lastFocusEl = false;
		this._focusEl = [
			"a[href]",
			'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			"button:not([disabled]):not([aria-hidden])",
			"select:not([disabled]):not([aria-hidden])",
			"textarea:not([disabled]):not([aria-hidden])",
			"area[href]",
			"iframe",
			"object",
			"embed",
			"[contenteditable]",
			'[tabindex]:not([tabindex^="-"])',
		];
		//this.options = Object.assign(config, options);
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes,
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings,
			},
			on: {
				...config.on,
				...options?.on,
			},
		};
		this.bodyLock = false;
		this.options.init ? this.initPopups() : null;
	}
	initPopups() {
		this.popupLogging(`Проинициализирован`);
		this.eventsPopup();
	}
	eventsPopup() {
		// клик по всему документу
		document.addEventListener(
			"click",
			function (e) {
				// клик по кнопке "открыть"
				const buttonOpen = e.target.closest(
					`[${this.options.attributeOpenButton}]`
				);
				if (buttonOpen) {
					e.preventDefault();
					this._dataValue = buttonOpen.getAttribute(
						this.options.attributeOpenButton
					)
						? buttonOpen.getAttribute(this.options.attributeOpenButton)
						: "error";
					this.youTubeCode = buttonOpen.getAttribute(
						this.options.youtubeAttribute
					)
						? buttonOpen.getAttribute(this.options.youtubeAttribute)
						: null;
					if (this._dataValue !== "error") {
						if (!this.isOpen) this.lastFocusEl = buttonOpen;
						this.targetOpen.selector = `${this._dataValue}`;
						this._selectorOpen = true;
						this.open();
						return;
					} else
						this.popupLogging(`Не заполнен атрибут в${buttonOpen.classList}`);

					return;
				}
				// закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
				const buttonClose = e.target.closest(
					`[${this.options.attributeCloseButton}]`
				);
				if (
					buttonClose ||
					(!e.target.closest(`.${this.options.classes.popupContent}`) &&
						this.isOpen)
				) {
					e.preventDefault();
					this.close();
					return;
				}
			}.bind(this)
		);
		// закрытие ESC
		document.addEventListener(
			"keydown",
			function (e) {
				if (
					this.options.closeEsc &&
					e.which == 27 &&
					e.code === "Escape" &&
					this.isOpen
				) {
					e.preventDefault();
					this.close();
					return;
				}
				if (this.options.focusCatch && e.which == 9 && this.isOpen) {
					this._focusCatch(e);
					return;
				}
			}.bind(this)
		);

		// открытие по хэшу
		if (this.options.hashSettings.goHash) {
			// проверка смены адресной строки
			window.addEventListener(
				"hashchange",
				function () {
					if (window.location.hash) {
						this._openToHash();
					} else {
						this.close(this.targetOpen.selector);
					}
				}.bind(this)
			);

			window.addEventListener(
				"load",
				function () {
					if (window.location.hash) {
						this._openToHash();
					}
				}.bind(this)
			);
		}
	}
	open(selectorValue) {
		if (bodyLockStatus) {
			// если перед открытием попапа был режим lock
			this.bodyLock =
				document.documentElement.classList.contains("lock") && !this.isOpen
					? true
					: false;

			// если ввести значение селектора (селектор настраивается в options)
			if (
				selectorValue &&
				typeof selectorValue === "string" &&
				selectorValue.trim() !== ""
			) {
				this.targetOpen.selector = selectorValue;
				this._selectorOpen = true;
			}
			if (this.isOpen) {
				this._reopen = true;
				this.close();
			}
			if (!this._selectorOpen)
				this.targetOpen.selector = this.lastClosed.selector;
			if (!this._reopen) this.previousActiveElement = document.activeElement;

			this.targetOpen.element = document.querySelector(
				this.targetOpen.selector
			);

			if (this.targetOpen.element) {
				// youtube
				if (this.youTubeCode) {
					const codeVideo = this.youTubeCode;
					const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
					const iframe = document.createElement("iframe");
					iframe.setAttribute("allowfullscreen", "");

					const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
					iframe.setAttribute("allow", `${autoplay}; encrypted-media`);

					iframe.setAttribute("src", urlVideo);

					if (
						!this.targetOpen.element.querySelector(
							`[${this.options.youtubePlaceAttribute}]`
						)
					) {
						const youtubePlace = this.targetOpen.element
							.querySelector(".popup__text")
							.setAttribute(`${this.options.youtubePlaceAttribute}`, "");
					}
					this.targetOpen.element
						.querySelector(`[${this.options.youtubePlaceAttribute}]`)
						.appendChild(iframe);
				}
				if (this.options.hashSettings.location) {
					// получение хеша и его выставление
					this._getHash();
					this._setHash();
				}

				// к открытию
				this.options.on.beforeOpen(this);
				// создаем свое событие после открытия попапа
				document.dispatchEvent(
					new CustomEvent("beforePopupOpen", {
						detail: {
							popup: this,
						},
					})
				);

				this.targetOpen.element.classList.add(this.options.classes.popupActive);
				document.documentElement.classList.add(this.options.classes.bodyActive);

				if (!this._reopen) {
					!this.bodyLock ? bodyLock() : null;
				} else this._reopen = false;

				this.targetOpen.element.setAttribute("aria-hidden", "false");

				// запомню это открытое окно. Оно будет последним открытым
				this.previousOpen.selector = this.targetOpen.selector;
				this.previousOpen.element = this.targetOpen.element;

				this._selectorOpen = false;

				this.isOpen = true;

				setTimeout(() => {
					this._focusTrap();
				}, 50);

				// после открытия
				this.options.on.afterOpen(this);
				// создаем свое событие после открытия попапа
				document.dispatchEvent(
					new CustomEvent("afterPopupOpen", {
						detail: {
							popup: this,
						},
					})
				);
				this.popupLogging(`Открыл попап`);
			} else
				this.popupLogging(`Такого попапа нет. Проверьте корректность ввода.`);
		}
	}
	close(selectorValue) {
		if (
			selectorValue &&
			typeof selectorValue === "string" &&
			selectorValue.trim() !== ""
		) {
			this.previousOpen.selector = selectorValue;
		}
		if (!this.isOpen || !bodyLockStatus) {
			return;
		}
		// к закрытию
		this.options.on.beforeClose(this);
		// создаем свое событие перед закрытием попапа
		document.dispatchEvent(
			new CustomEvent("beforePopupClose", {
				detail: {
					popup: this,
				},
			})
		);

		// youtube
		if (this.youTubeCode) {
			if (
				this.targetOpen.element.querySelector(
					`[${this.options.youtubePlaceAttribute}]`
				)
			)
				this.targetOpen.element.querySelector(
					`[${this.options.youtubePlaceAttribute}]`
				).innerHTML = "";
		}
		this.previousOpen.element.classList.remove(
			this.options.classes.popupActive
		);
		// aria-hidden
		this.previousOpen.element.setAttribute("aria-hidden", "true");
		if (!this._reopen) {
			document.documentElement.classList.remove(
				this.options.classes.bodyActive
			);
			!this.bodyLock ? bodyUnlock() : null;
			this.isOpen = false;
		}
		// очистка адресной строки
		this._removeHash();
		if (this._selectorOpen) {
			this.lastClosed.selector = this.previousOpen.selector;
			this.lastClosed.element = this.previousOpen.element;
		}
		// после закрытия
		this.options.on.afterClose(this);
		// создаем свое событие после закрытия попапа
		document.dispatchEvent(
			new CustomEvent("afterPopupClose", {
				detail: {
					popup: this,
				},
			})
		);

		setTimeout(() => {
			this._focusTrap();
		}, 50);

		this.popupLogging(`Закрыл попап`);
	}
	// получение хеша
	_getHash() {
		if (this.options.hashSettings.location) {
			this.hash = this.targetOpen.selector.includes("#")
				? this.targetOpen.selector
				: this.targetOpen.selector.replace(".", "#");
		}
	}
	_openToHash() {
		let classInHash = document.querySelector(
			`.${window.location.hash.replace("#", "")}`
		)
			? `.${window.location.hash.replace("#", "")}`
			: document.querySelector(`${window.location.hash}`)
			? `${window.location.hash}`
			: null;

		const buttons = document.querySelector(
			`[${this.options.attributeOpenButton} = "${classInHash}"]`
		)
			? document.querySelector(
					`[${this.options.attributeOpenButton} = "${classInHash}"]`
			  )
			: document.querySelector(
					`[${this.options.attributeOpenButton} = "${classInHash.replace(
						".",
						"#"
					)}"]`
			  );

		this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute)
			? buttons.getAttribute(this.options.youtubeAttribute)
			: null;

		if (buttons && classInHash) this.open(classInHash);
	}
	// установка хеша
	_setHash() {
		history.pushState("", "", this.hash);
	}
	_removeHash() {
		history.pushState("", "", window.location.href.split("#")[0]);
	}
	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.prototype.slice.call(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}
	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (!this.isOpen && this.lastFocusEl) {
			this.lastFocusEl.focus();
		} else {
			focusable[0].focus();
		}
	}
	// функция вывода в консоль
	popupLogging(message) {
		this.options.logging ? FLS(`[попап]: ${message}`) : null;
	}
}
// запускаем и добавляем в объект модулей
flsModules.popup = new Popup({});
