import {
	isMobile,
	_slideUp,
	_slideDown,
	_slideToggle,
	FLS,
} from "../files/functions.js";
import { flsModules } from "../files/modules.js";
import { formValidate } from "../files/forms/forms.js";

// подключение файла стилей
// базовые стили состоят в src/scss/forms.scss
// файл базовых стилей src/scss/forms/select.scss

/*
Документация:
сниппет (HTML): sel
*/
/*
// настройка
для селектора (select):
class="имя класса" - модификатор к конкретному селекту
multiple – мультивыбор
data-class-modif= "имя модификатора"
data-tags – режим тегов, только для (только для multiple)
data-scroll - включить прокрутку для выпадающего списка дополнительно можно подключить кастомный скролл simplebar в app.js. Указанное число для атрибута ограничит высоту
data-checkbox – стилизация элементов по checkbox (только для multiple)
data-show-selected – выключает сокрытие выбранного элемента
data-search - позволяет искать по выпадающему списку
data-open – селект открыт сразу
data-submit – отправляет форму при смене селекта
data-one-select - селекты внутри оболочки с атрибутом будут показываться только по одному
data-pseudo-label – добавляет псевдоэлемент к заголовку селекта с указанным текстом

для плейсхолдера (плейсхолдер – это option из value=""):
data-label для плейсхолдера, добавляет label к селектору.
data-show для плейсхолдера, показывает его в списке (только для единичного выбора)

для элемента (option):
data-class="имя класса" - добавляет класс
data-asset="путь к картинке или текст" - добавляет структуру 2х колонок и данным
data-href="адрес ссылки" - добавляет ссылку в элемент списка
data-href-blank – откроет ссылку в новом окне
*/

/*
// возможные доработки:
попап на мобилке
*/

// класс постройки Select
class SelectConstructor {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
			speed: 150,
		};
		this.config = Object.assign(defaultConfig, props);
		// CSS классы модуля
		this.selectClasses = {
			classSelect: "select", // главный блок
			classSelectBody: "select__body", // тело селлекта
			classSelectTitle: "select__title", // заголовок Заголовок
			classSelectValue: "select__value", // значение в заголовке
			classSelectLabel: "select__label", // лейбл
			classSelectInput: "select__input", // поле ввода
			classSelectText: "select__text", // оболочка текстовых данных
			classSelectLink: "select__link", // ссылка в элементе
			classSelectOptions: "select__options", // выпадающий список
			classSelectOptionsScroll: "select__scroll", // оболочка при скроле
			classSelectOption: "select__option", // пункт
			classSelectContent: "select__content", // оболочка контента в заголовке
			classSelectRow: "select__row", // ряд
			classSelectData: "select__asset", // дополнительные данные
			classSelectDisabled: "_select-disabled", // запрещено
			classSelectTag: "_select-tag", // класс тега
			classSelectOpen: "_select-open", // список открыт
			classSelectActive: "_select-active", // список выбран
			classSelectFocus: "_select-focus", // список в фокусе
			classSelectMultiple: "_select-multiple", // мультивыбор
			classSelectCheckBox: "_select-checkbox", // стиль чекбокса
			classSelectOptionSelected: "_select-selected", // выбранный пункт
			classSelectPseudoLabel: "_select-pseudo-label", // псевдолейбл
		};
		this._this = this;
		// запуск инициализации
		if (this.config.init) {
			// получение всех select на странице
			const selectItems = data
				? document.querySelectorAll(data)
				: document.querySelectorAll("select");
			if (selectItems.length) {
				this.selectsInit(selectItems);
				this.setLogging(`Построил селектов: (${selectItems.length})`);
			} else {
				this.setLogging("Нет ни одного select");
			}
		}
	}
	// конструктор CSS класса
	getSelectClass(className) {
		return `.${className}`;
	}
	// геттер элементов псевдоселлекта
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector("select"),
			selectElement: selectItem.querySelector(this.getSelectClass(className)),
		};
	}
	// функция инициализации всех селлектов
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			this.selectInit(originalSelect, index + 1);
		});
		// обработчики событий...
		// ...при клике
		document.addEventListener(
			"click",
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при нажатии клавиши
		document.addEventListener(
			"keydown",
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при фокусе
		document.addEventListener(
			"focusin",
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
		// ...при потере фокуса
		document.addEventListener(
			"фокус",
			function (e) {
				this.selectsActions(e);
			}.bind(this)
		);
	}
	// функция инициализации конкретного селекта
	selectInit(originalSelect, index) {
		const _this = this;
		// создаем оболочку
		let selectItem = document.createElement("div");
		selectItem.classList.add(this.selectClasses.classSelect);
		// выводим оболочку перед оригинальным селектом
		originalSelect.parentNode.insertBefore(selectItem, originalSelect);
		// помещаем оригинальный селект в оболочку
		selectItem.appendChild(originalSelect);
		// скрываем оригинальный селект
		originalSelect.hidden = true;
		// присваиваем уникальный ID
		index ? (originalSelect.dataset.id = index) : null;

		// работа с плейсхолдером
		if (this.getSelectPlaceholder(originalSelect)) {
			// запоминаем плейсхолдер
			originalSelect.dataset.placeholder =
				this.getSelectPlaceholder(originalSelect).value;
			// если включен режим label
			if (this.getSelectPlaceholder(originalSelect).label.show) {
				const selectItemTitle = this.getSelectElement(
					selectItem,
					this.selectClasses.classSelectTitle
				).selectElement;
				selectItemTitle.insertAdjacentHTML(
					"afterbegin",
					`<span class="${this.selectClasses.classSelectLabel}">${
						this.getSelectPlaceholder(originalSelect).label.text
							? this.getSelectPlaceholder(originalSelect).label.text
							: this.getSelectPlaceholder(originalSelect).value
					}</span>`
				);
			}
		}
		// конструктор основных элементов
		selectItem.insertAdjacentHTML(
			"beforeend",
			`<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`
		);
		// запускаем конструктор псевдоселлекта
		this.selectBuild(originalSelect);

		// запоминаем скорость
		originalSelect.dataset.speed = originalSelect.dataset.speed
			? originalSelect.dataset.speed
			: this.config.speed;
		this.config.speed = +originalSelect.dataset.speed;

		// событие при изменении оригинального select
		originalSelect.addEventListener("change", function (e) {
			_this.selectChange(e);
		});
	}
	// конструктор псевдоселлекта
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		// добавляем ID селекта
		selectItem.dataset.id = originalSelect.dataset.id;
		// получаем класс оригинального селлекта, создаем модификатор и добавляем его
		originalSelect.dataset.classModif
			? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`)
			: null;
		// если множественный выбор, добавляем класс
		originalSelect.multiple
			? selectItem.classList.add(this.selectClasses.classSelectMultiple)
			: selectItem.classList.remove(this.selectClasses.classSelectMultiple);
		// стилизация элементов под checkbox (только для multiple)
		originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple
			? selectItem.classList.add(this.selectClasses.classSelectCheckBox)
			: selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
		// сеттер значение заголовка селлекта
		this.setSelectTitleValue(selectItem, originalSelect);
		// сеттер элементов списка (options)
		this.setOptions(selectItem, originalSelect);
		// если включена опция поиска data-search, запускаем обработчик
		originalSelect.hasAttribute("data-search")
			? this.searchActions(selectItem)
			: null;
		// если указана настройка data-open, открываем селект
		originalSelect.hasAttribute("data-open")
			? this.selectAction(selectItem)
			: null;
		// обработчик disabled
		this.selectDisabled(selectItem, originalSelect);
	}
	// функция реакций на события
	selectsActions(e) {
		const targetElement = e.target;
		const targetType = e.type;
		if (
			targetElement.closest(
				this.getSelectClass(this.selectClasses.classSelect)
			) ||
			targetElement.closest(
				this.getSelectClass(this.selectClasses.classSelectTag)
			)
		) {
			const selectItem = targetElement.closest(".select")
				? targetElement.closest(".select")
				: document.querySelector(
						`.${this.selectClasses.classSelect}[data-id="${
							targetElement.closest(
								this.getSelectClass(this.selectClasses.classSelectTag)
							).dataset.selectId
						}"]`
				  );
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			if (targetType === "click") {
				if (!originalSelect.disabled) {
					if (
						targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectTag)
						)
					) {
						// обработка клика на тэг
						const targetTag = targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectTag)
						);
						const optionItem = document.querySelector(
							`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`
						);
						this.optionAction(selectItem, originalSelect, optionItem);
					} else if (
						targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectTitle)
						)
					) {
						// обработка клика на заглавие селекта
						this.selectAction(selectItem);
					} else if (
						targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectOption)
						)
					) {
						// обработка клика на элемент селекта
						const optionItem = targetElement.closest(
							this.getSelectClass(this.selectClasses.classSelectOption)
						);
						this.optionAction(selectItem, originalSelect, optionItem);
					}
				}
			} else if (targetType === "focusin" || targetType === "focusout") {
				if (
					targetElement.closest(
						this.getSelectClass(this.selectClasses.classSelect)
					)
				) {
					targetType === "focusin"
						? selectItem.classList.add(this.selectClasses.classSelectFocus)
						: selectItem.classList.remove(this.selectClasses.classSelectFocus);
				}
			} else if (targetType === "keydown" && e.code === "Escape") {
				this.selectsСlose();
			}
		} else {
			this.selectsСlose();
		}
	}
	// функция закрытия всех селлектов
	selectsСlose(selectOneGroup) {
		const selectsGroup = selectOneGroup ? selectOneGroup : document;
		const selectActiveItems = selectsGroup.querySelectorAll(
			`${this.getSelectClass(
				this.selectClasses.classSelect
			)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`
		);
		if (selectActiveItems.length) {
			selectActiveItems.forEach((selectActiveItem) => {
				this.selectСlose(selectActiveItem);
			});
		}
	}
	// функция закрытия конкретного селекта
	selectСlose(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		if (!selectOptions.classList.contains("_slide")) {
			selectItem.classList.remove(this.selectClasses.classSelectOpen);
			_slideUp(selectOptions, originalSelect.dataset.speed);
			setTimeout(() => {
				selectItem.style.zIndex = "";
			}, originalSelect.dataset.speed);
		}
	}
	// функция открытия/закрытия конкретного селекта
	selectAction(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		const selectOpenzIndex = originalSelect.dataset.zIndex
			? originalSelect.dataset.zIndex
			: 3;

		// определяем, где отобразить выпадающий список
		this.setOptionsPosition(selectItem);

		// если селективы размещены в элементе с дата атрибутом data-one-select
		// закрываем все открытые селекты
		if (originalSelect.closest("[data-one-select]")) {
			const selectOneGroup = originalSelect.closest("[data-one-select]");
			this.selectsСlose(selectOneGroup);
		}

		setTimeout(() => {
			if (!selectOptions.classList.contains("_slide")) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				_slideToggle(selectOptions, originalSelect.dataset.speed);

				if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
					selectItem.style.zIndex = selectOpenzIndex;
				} else {
					setTimeout(() => {
						selectItem.style.zIndex = "";
					}, originalSelect.dataset.speed);
				}
			}
		}, 0);
	}
	// сеттер значение заголовка селлекта
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectBody
		).selectElement;
		const selectItemTitle = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectTitle
		).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML(
			"afterbegin",
			this.getSelectTitleValue(selectItem, originalSelect)
		);
		originalSelect.hasAttribute("data-search")
			? this.searchActions(selectItem)
			: null;
	}
	// конструктор значення заголовка
	getSelectTitleValue(selectItem, originalSelect) {
		// получаем выбранные текстовые значения
		let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
		// обработка значений мультивыбора
		// если включен режим тегов (указана настройка data-tags)
		if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
			selectTitleValue = this.getSelectedOptionsData(originalSelect)
				.elements.map(
					(option) =>
						`<span role="button" data-select-id="${
							selectItem.dataset.id
						}" data-value="${
							option.value
						}" class="_select-tag">${this.getSelectElementContent(
							option
						)}</span>`
				)
				.join("");
			// если вывод тегов во внешний блок
			if (
				originalSelect.dataset.tags &&
				document.querySelector(originalSelect.dataset.tags)
			) {
				document.querySelector(originalSelect.dataset.tags).innerHTML =
					selectTitleValue;
				if (originalSelect.hasAttribute("data-search"))
					selectTitleValue = false;
			}
		}
		// значение или плейсхолдер
		selectTitleValue = selectTitleValue.length
			? selectTitleValue
			: originalSelect.dataset.placeholder
			? originalSelect.dataset.placeholder
			: "";
		// если включен режим pseudo
		let pseudoAttribute = "";
		let pseudoAttributeClass = "";
		if (originalSelect.hasAttribute("data-pseudo-label")) {
			pseudoAttribute = originalSelect.dataset.pseudoLabel
				? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"`
				: `data-pseudo-label="Заполните атрибут"`;
			pseudoAttributeClass = `${this.selectClasses.classSelectPseudoLabel}`;
		}
		// если есть значение, добавляем класс
		this.getSelectedOptionsData(originalSelect).values.length
			? selectItem.classList.add(this.selectClasses.classSelectActive)
			: selectItem.classList.remove(this.selectClasses.classSelectActive);
		// возвращаем поле ввода для поиска или текст
		if (originalSelect.hasAttribute("data-search")) {
			// выводим поле ввода для поиска
			return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder= "${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
		} else {
			// если выбран элемент со своим классом
			const customClass =
				this.getSelectedOptionsData(originalSelect).elements.length &&
				this.getSelectedOptionsData(originalSelect).elements[0].dataset.class
					? ` ${
							this.getSelectedOptionsData(originalSelect).elements[0].dataset
								.class
					  }`
					: "";
			// выводим текстовое значение
			return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class=" ${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
		}
	}
	// конструктор данных для значения заголовка
	getSelectElementContent(selectOption) {
		// если для элемента указан вывод картинки или текста, перестраиваем конструкцию
		const selectOptionData = selectOption.dataset.asset
			? `${selectOption.dataset.asset}`
			: "";
		const selectOptionDataHTML =
			selectOptionData.indexOf("img") >= 0
				? `<img src="${selectOptionData}" alt="">`
				: selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData
			? `<span class="${this.selectClasses.classSelectRow}">`
			: "";
		selectOptionContentHTML += selectOptionData
			? `<span class="${this.selectClasses.classSelectData}">`
			: "";
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData
			? `<span class="${this.selectClasses.classSelectText}">`
			: "";
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		selectOptionContentHTML += selectOptionData ? `</span>` : "";
		return selectOptionContentHTML;
	}
	// получение данных плейсхолдера
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find(
			(option) => !option.value
		);
		if (selectPlaceholder) {
			return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute("data-show"),
				label: {
					show: selectPlaceholder.hasAttribute("data-label"),
					text: selectPlaceholder.dataset.label,
				},
			};
		}
	}
	// получение данных из выбранных элементов
	getSelectedOptionsData(originalSelect, type) {
		// получаем все выбранные объекты из select
		let selectedOptions = [];
		if (originalSelect.multiple) {
			// если мультивыбор
			// забираем плейсхолдер, получаем остальные выбранные элементы
			selectedOptions = Array.from(originalSelect.options)
				.filter((option) => option.value)
				.filter((option) => option.selected);
		} else {
			// если единичный выбор
			selectedOptions.push(
				originalSelect.options[originalSelect.selectedIndex]
			);
		}
		return {
			elements: selectedOptions.map((option) => option),
			values: selectedOptions
				.filter((option) => option.value)
				.map((option) => option.value),
			html: selectedOptions.map((option) =>
				this.getSelectElementContent(option)
			),
		};
	}
	// конструктор элементов списка
	getOptions(originalSelect) {
		// настройка скролла элементов
		const selectOptionsScroll = originalSelect.hasAttribute("data-scroll")
			? `data-simplebar`
			: "";
		const customMaxHeightValue = +originalSelect.dataset.scroll
			? +originalSelect.dataset.scroll
			: null;
		// получаем элементы списка
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			// если указана настройка data-show, показываем плейсхолдер в списке
			if (
				(this.getSelectPlaceholder(originalSelect) &&
					!this.getSelectPlaceholder(originalSelect).show) ||
				originalSelect.multiple
			) {
				selectOptions = selectOptions.filter((option) => option.value);
			}
			// строим и выводим основную конструкцию
			selectOptionsHTML += `<div ${selectOptionsScroll} ${
				selectOptionsScroll
					? `style="max-height: ${customMaxHeightValue}px"`
					: ""
			} class="${this.selectClasses.classSelectOptionsScroll}">`;
			selectOptions.forEach((selectOption) => {
				// Получаем конструкцию конкретного элемента списка
				selectOptionsHTML += this.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += `</div>`;
			return selectOptionsHTML;
		}
	}
	// конструктор конкретного элемента списка
	getOption(selectOption, originalSelect) {
		// если элемент выбран и включен режим мультивыбора, добавляем класс
		const selectOptionSelected =
			selectOption.selected && originalSelect.multiple
				? `${this.selectClasses.classSelectOptionSelected}`
				: "";
		// если элемент выбран и нет настройки data-show-selected, скрываем элемент
		const selectOptionHide =
			selectOption.selected &&
			!originalSelect.hasAttribute("data-show-selected") &&
			!originalSelect.multiple
				? `hidden`
				: ``;
		// если для элемента указанный класс добавляем
		const selectOptionClass = selectOption.dataset.class
			? `${selectOption.dataset.class}`
			: "";
		// если указан режим ссылки
		const selectOptionLink = selectOption.dataset.href
			? selectOption.dataset.href
			: false;
		const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank")
			? `target="_blank"`
			: "";
		// строим и возвращаем конструкцию элемента
		let selectOptionHTML = ``;
		selectOptionHTML += selectOptionLink
			? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected} ">`
			: `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
		selectOptionHTML += this.getSelectElementContent(selectOption);
		selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
		return selectOptionHTML;
	}
	// сеттер элементов списка (options)
	setOptions(selectItem, originalSelect) {
		// получаем объект тела псевдоселлекта
		const selectItemOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		// запускаем конструктор элементов списка (options) и добавляем в тело псевдоселекты
		selectItemOptions.innerHTML = this.getOptions(originalSelect);
	}
	// определяем, где отобразить выпадающий список
	setOptionsPosition(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		const selectItemScroll = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptionsScroll
		).selectElement;
		const customMaxHeightValue = +originalSelect.dataset.scroll
			? `${+originalSelect.dataset.scroll}px`
			: ``;
		const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin
			? +originalSelect.dataset.optionsMargin
			: 10;

		if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
			selectOptions.hidden = false;
			const selectItemScrollHeight = selectItemScroll.offsetHeight
				? selectItemScroll.offsetHeight
				: parseInt(
						window
							.getComputedStyle(selectItemScroll)
							.getPropertyValue("max-height")
				  );
			const selectOptionsHeight =
				selectOptions.offsetHeight > selectItemScrollHeight
					? selectOptions.offsetHeight
					: selectItemScrollHeight + selectOptions.offsetHeight;
			const selectOptionsScrollHeight =
				selectOptionsHeight - selectItemScrollHeight;
			selectOptions.hidden = true;

			const selectItemHeight = selectItem.offsetHeight;
			const selectItemPos = selectItem.getBoundingClientRect().top;
			const selectItemTotal =
				selectItemPos +
				selectOptionsHeight +
				selectItemHeight +
				selectOptionsScrollHeight;
			const selectItemResult =
				window.innerHeight - (selectItemTotal + selectOptionsPosMargin);

			if (selectItemResult < 0) {
				const newMaxHeightValue = selectOptionsHeight + selectItemResult;
				if (newMaxHeightValue < 100) {
					selectItem.classList.add("select--show-top");
					selectItemScroll.style.maxHeight =
						selectItemPos < selectOptionsHeight
							? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px`
							: customMaxHeightValue;
				} else {
					selectItem.classList.remove("select--show-top");
					selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
				}
			}
		} else {
			setTimeout(() => {
				selectItem.classList.remove("select--show-top");
				selectItemScroll.style.maxHeight = customMaxHeightValue;
			}, +originalSelect.dataset.speed);
		}
	}
	// обработчик клика на пункт списка
	optionAction(selectItem, originalSelect, optionItem) {
		const selectOptions = selectItem.querySelector(
			`${this.getSelectClass(this.selectClasses.classSelectOptions)}`
		);
		if (!selectOptions.classList.contains("_slide")) {
			if (originalSelect.multiple) {
				// если мультивыбор
				// выделяемый классом элемент
				optionItem.classList.toggle(
					this.selectClasses.classSelectOptionSelected
				);
				// очищаем выбранные элементы
				const originalSelectSelectedItems =
					this.getSelectedOptionsData(originalSelect).elements;
				originalSelectSelectedItems.forEach((originalSelectSelectedItem) => {
					originalSelectSelectedItem.removeAttribute("selected");
				});
				// выбираем элементы
				const selectSelectedItems = selectItem.querySelectorAll(
					this.getSelectClass(this.selectClasses.classSelectOptionSelected)
				);
				selectSelectedItems.forEach((selectSelectedItems) => {
					originalSelect
						.querySelector(
							`option[value = "${selectSelectedItems.dataset.value}"]`
						)
						.setAttribute("selected", "selected");
				});
			} else {
				// если единичный выбор
				// если не указана настройка data-show-selected, скрываем выбранный элемент
				if (!originalSelect.hasAttribute("data-show-selected")) {
					setTimeout(() => {
						// сначала все показать
						if (
							selectItem.querySelector(
								`${this.getSelectClass(
									this.selectClasses.classSelectOption
								)}[hidden]`
							)
						) {
							selectItem.querySelector(
								`${this.getSelectClass(
									this.selectClasses.classSelectOption
								)}[hidden]`
							).hidden = false;
						}
						// скрываем избранную
						optionItem.hidden = true;
					}, this.config.speed);
				}
				originalSelect.value = optionItem.hasAttribute("data-value")
					? optionItem.dataset.value
					: optionItem.textContent;
				this.selectAction(selectItem);
			}
			// обновляем заглавие селекта
			this.setSelectTitleValue(selectItem, originalSelect);
			// вызываем реакцию на смену селлекта
			this.setSelectChange(originalSelect);
		}
	}
	// реакция на изменение оригинального select
	selectChange(e) {
		const originalSelect = e.target;
		this.selectBuild(originalSelect);
		this.setSelectChange(originalSelect);
	}
	// обработчик смены в селекте
	setSelectChange(originalSelect) {
		// мгновенная валидация селлекта
		if (originalSelect.hasAttribute("data-validate")) {
			formValidate.validateInput(originalSelect);
		}
		// при смене селлекта присылаем форму
		if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
			let tempButton = document.createElement("button");
			tempButton.type = "submit";
			originalSelect.closest("form").append(tempButton);
			tempButton.click();
			tempButton.remove();
		}
		const selectItem = originalSelect.parentElement;
		// вызов коллбек функции
		this.selectCallback(selectItem, originalSelect);
	}
	// обработчик disabled
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(this.selectClasses.classSelectDisabled);
			this.getSelectElement(
				selectItem,
				this.selectClasses.classSelectTitle
			).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(this.selectClasses.classSelectDisabled);
			this.getSelectElement(
				selectItem,
				this.selectClasses.classSelectTitle
			).selectElement.disabled = false;
		}
	}
	// обработчик поиска по элементам списка
	searchActions(selectItem) {
		const originalSelect = this.getSelectElement(selectItem).originalSelect;
		const selectInput = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectInput
		).selectElement;
		const selectOptions = this.getSelectElement(
			selectItem,
			this.selectClasses.classSelectOptions
		).selectElement;
		const selectOptionsItems = selectOptions.querySelectorAll(
			`.${this.selectClasses.classSelectOption} `
		);
		const _this = this;
		selectInput.addEventListener("input", function () {
			selectOptionsItems.forEach((selectOptionsItem) => {
				if (
					selectOptionsItem.textContent
						.toUpperCase()
						.includes(selectInput.value.toUpperCase())
				) {
					selectOptionsItem.hidden = false;
				} else {
					selectOptionsItem.hidden = true;
				}
			});
			// если список закрыт открываем
			selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
		});
	}
	// коллбек функция
	selectCallback(selectItem, originalSelect) {
		document.dispatchEvent(
			new CustomEvent("selectCallback", {
				detail: {
					select: originalSelect,
				},
			})
		);
	}
	// логинг в консоль
	setLogging(message) {
		this.config.logging ? FLS(`[select]: ${message} `) : null;
	}
}
// запускаем и добавляем в объект модулей
flsModules.select = new SelectConstructor({});
