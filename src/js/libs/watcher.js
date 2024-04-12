import { isMobile, uniqArray, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

// наблюдатель объектов [всевидящее око]
// data-watch – можно писать значение для применения кастомного кода
// data-watch-root – родительский элемент внутри которого наблюдать за объектом
// data-watch-margin -отступление
// data-watch-threshold – процент показа объекта для срабатывания
// data-watch-once – наблюдать только один раз
// _watcher-view – класс добавляемый при появлении объекта

class ScrollWatcher {
	constructor(props) {
		let defaultConfig = {
			logging: true,
		};
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.classList.contains("watcher")
			? this.scrollWatcherRun()
			: null;
	}
	// обновляем конструктор
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	// запускаем конструктор
	scrollWatcherRun() {
		document.documentElement.classList.add("watcher");
		this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
	}
	// конструктор наблюдателей
	scrollWatcherConstructor(items) {
		if (items.length) {
			this.scrollWatcherLogging(`Слежу за объектами(${items.length})...`);
			// уникализируем параметры
			let uniqParams = uniqArray(
				Array.from(items).map(function (item) {
					return `${
						item.dataset.watchRoot ? item.dataset.watchRoot : null
					}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
				})
			);
			// получаем группы объектов с одинаковыми параметрами,
			// создаем настройки, инициализируем наблюдатель
			uniqParams.forEach((uniqParam) => {
				let uniqParamArray = uniqParam.split("|");
				let paramsWatch = {
					root: uniqParamArray[0],
					margin: uniqParamArray[1],
					threshold: uniqParamArray[2],
				};
				let groupItems = Array.from(items).filter(function (item) {
					let watchRoot = item.dataset.watchRoot
						? item.dataset.watchRoot
						: null;
					let watchMargin = item.dataset.watchMargin
						? item.dataset.watchMargin
						: "0px";
					let watchThreshold = item.dataset.watchThreshold
						? item.dataset.watchThreshold
						: 0;
					if (
						String(watchRoot) === paramsWatch.root &&
						String(watchMargin) === paramsWatch.margin &&
						String(watchThreshold) === paramsWatch.threshold
					) {
						return item;
					}
				});

				let configWatcher = this.getScrollWatcherConfig(paramsWatch);

				// инициализация наблюдателя со своими настройками
				this.scrollWatcherInit(groupItems, configWatcher);
			});
		} else {
			this.scrollWatcherLogging("Нет объектов для слежки");
		}
	}
	// функция создания настроек
	getScrollWatcherConfig(paramsWatch) {
		// создаем настройки
		let configWatcher = {};
		// отец, на котором ведется наблюдение
		if (document.querySelector(paramsWatch.root)) {
			configWatcher.root = document.querySelector(paramsWatch.root);
		} else if (paramsWatch.root !== "null") {
			this.scrollWatcherLogging(
				`Родительского объекта ${paramsWatch.root} на странице`
			);
		}
		// отступление срабатывания
		configWatcher.rootMargin = paramsWatch.margin;
		if (
			paramsWatch.margin.indexOf("px") < 0 &&
			paramsWatch.margin.indexOf("%") < 0
		) {
			this.scrollWatcherLogging(
				`Настройку data-watch-margin нужно задавать в PX или %`
			);
			return;
		}
		// точки срабатывания
		if (paramsWatch.threshold === "prx") {
			// режим параллакса
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1.0; i += 0.005) {
				paramsWatch.threshold.push(i);
			}
		} else {
			paramsWatch.threshold = paramsWatch.threshold.split(",");
		}
		configWatcher.threshold = paramsWatch.threshold;

		return configWatcher;
	}
	// функция создания нового наблюдателя со своими настройками
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	// функция инициализации наблюдателя со своими настройками
	scrollWatcherInit(items, configWatcher) {
		// создание нового наблюдателя со своими настройками
		this.scrollWatcherCreate(configWatcher);
		// передача наблюдателю элементов
		items.forEach((item) => this.observer.observe(item));
	}
	// функция обработки базовых действий точек срабатывания
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) {
			// видим объект
			// добавляем класс
			!targetElement.classList.contains("_watcher-view")
				? targetElement.classList.add("_watcher-view")
				: null;
			this.scrollWatcherLogging(
				`Я вижу ${targetElement.classList}, добавил класс _watcher-view`
			);
		} else {
			// не видим объект
			// забираем класс
			targetElement.classList.contains("_watcher-view")
				? targetElement.classList.remove("_watcher-view")
				: null;
			this.scrollWatcherLogging(
				`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`
			);
		}
	}
	// функция отключения слежения за объектом
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
		this.scrollWatcherLogging(
			`Я перестал следить за ${targetElement.classList}`
		);
	}
	// функция вывода в консоль
	scrollWatcherLogging(message) {
		this.config.logging ? FLS(`[Наблюдатель]: ${message}`) : null;
	}
	// Функция обработки наблюдения
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		// обработка базовых действий точек срабатывания
		this.scrollWatcherIntersecting(entry, targetElement);
		// если есть атрибут data-watch-once убираем слежку
		targetElement.hasAttribute("data-watch-once") && entry.isIntersecting
			? this.scrollWatcherOff(targetElement, observer)
			: null;
		// создаем свое событие обратной связи
		document.dispatchEvent(
			new CustomEvent("watcherCallback", {
				detail: {
					entry: entry,
				},
			})
		);

		/*
		// выбираем нужные объекты
		if (targetElement.dataset.watch === 'some value') {
		// пишем уникальную специфику
		}
		if (entry.isIntersecting) {
		//видим объект
		} else {
		//не видим объект 
		*/
	}
}
// запускаем и добавляем в объект модулей
flsModules.watcher = new ScrollWatcher({});
