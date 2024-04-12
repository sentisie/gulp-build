// подключение списка активных модулей
import { flsModules } from "./modules.js";

/* проверка поддержки webp, добавление класса webp или no-webp для HTML */
export function isWebp() {
	// проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	// добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? "webp" : "no-webp";
		document.documentElement.classList.add(className);
	});
}

/* проверка мобильного браузера */
export let isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows()
		);
	},
};

/* добавление класса touch для HTML, если мобильный браузер */
export function addTouchClass() {
	// добавление класса _touch для HTML, если мобильный браузер
	if (isMobile.any()) document.documentElement.classList.add("touch");
}

// добавление loaded для HTML после полной загрузки страницы
export function addLoadedClass() {
	if (!document.documentElement.classList.contains("loading")) {
		window.addEventListener("load", function () {
			setTimeout(function () {
				document.documentElement.classList.add("loaded");
			}, 0);
		});
	}
}

// получение хеша по адресу сайта
export function getHash() {
	if (location.hash) {
		return location.hash.replace("#", "");
	}
}

// указание хеша по адресу сайта
export function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split("#")[0];
	history.pushState("", "", hash);
}

// учет плавающей панели на мобильных устройствах при 100vh
export function fullVHfix() {
	const fullScreens = document.querySelectorAll("[data-fullscreen]");
	if (fullScreens.length && isMobile.any()) {
		window.addEventListener("resize", fixHeight);
		function fixHeight() {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		}
		fixHeight();
	}
}

// вспомогательные модули плавного раскрытия и закрытия объекта
export let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty("height") : null;
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore ? target.style.removeProperty("overflow") : null;
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");

			// создаем событие
			document.dispatchEvent(
				new CustomEvent("slideUpDone", {
					detail: {
						target: target,
					},
				})
			);
		}, duration);
	}
};
export let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty("height") : null;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");

			// создаем событие
			document.dispatchEvent(
				new CustomEvent("slideDownDone", {
					detail: {
						target: target,
					},
				})
			);
		}, duration);
	}
};
export let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};

// вспомогательные модули блокировки прокрутки и прыжка
export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains("lock")) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
};
export let bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = "0px";
			}
			body.style.paddingRight = "0px";
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};
export let bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight =
				window.innerWidth -
				document.querySelector(".wrapper").offsetWidth +
				"px";
		}
		body.style.paddingRight =
			window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
};

// модуль работы со спойлерами
export function spollers() {
	const spollersArray = document.querySelectorAll("[data-spollers]");
	if (spollersArray.length > 0) {
		// событие клика
		document.addEventListener("click", setSpollerAction);

		// получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (
			item,
			index,
			self
		) {
			return !item.dataset.spollers.split(",")[0];
		});

		// инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}

		// получение слойлеров с медиа-запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}

		// инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("_spoller-init");
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove("_spoller-init");
					initSpollerBody(spollersBlock, false);
				}
			});
		}

		// работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll("details");
			if (spollerItems.length) {
				//spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerItems.forEach((spollerItem) => {
					let spollerTitle = spollerItem.querySelector("summary");
					if (hideSpollerBody) {
						spollerTitle.removeAttribute("tabindex");
						if (!spollerItem.hasAttribute("data-open")) {
							spollerItem.open = false;
							spollerTitle.nextElementSibling.hidden = true;
						} else {
							spollerTitle.classList.add("_spoller-active");
							spollerItem.open = true;
						}
					} else {
						spollerTitle.setAttribute("tabindex", "-1");
						spollerTitle.classList.remove("_spoller-active");
						spollerItem.open = true;
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("summary") && el.closest("[data-spollers]")) {
				e.preventDefault();
				if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
					const spollerTitle = el.closest("summary");
					const spollerBlock = spollerTitle.closest("details");
					const spollersBlock = spollerTitle.closest("[data-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
					const scrollSpoller = spollerBlock.hasAttribute(
						"data-spoller-scroll"
					);
					const spollerSpeed = spollersBlock.dataset.spollersSpeed
						? parseInt(spollersBlock.dataset.spollersSpeed)
						: 500;
					if (!spollersBlock.querySelectorAll("._slide").length) {
						if (oneSpoller && !spollerBlock.open) {
							hideSpollersBody(spollersBlock);
						}

						!spollerBlock.open
							? (spollerBlock.open = true)
							: setTimeout(() => {
									spollerBlock.open = false;
							  }, spollerSpeed);

						spollerTitle.classList.toggle("_spoller-active");
						_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

						if (
							scrollSpoller &&
							spollerTitle.classList.contains("_spoller-active")
						) {
							const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
							const scrollSpollerOffset = +scrollSpollerValue
								? +scrollSpollerValue
								: 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute(
								"data-spoller-scroll-noheader"
							)
								? document.querySelector(".header").offsetHeight
								: 0;

							//setTimeout(() => {
							window.scrollTo({
								top:
									spollerBlock.offsetTop -
									(scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: "smooth",
							});
							//}, spollerSpeed);
						}
					}
				}
			}

			// закрытие при клике вне спойлера
			if (!el.closest("[data-spollers]")) {
				const spollersClose = document.querySelectorAll("[data-spoller-close]");
				if (spollersClose.length) {
					spollersClose.forEach((spollerClose) => {
						const spollersBlock = spollerClose.closest("[data-spollers]");
						const spollerCloseBlock = spollerClose.parentNode;
						if (spollersBlock.classList.contains("_spoller-init")) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed
								? parseInt(spollersBlock.dataset.spollersSpeed)
								: 500;
							spollerClose.classList.remove("_spoller-active");
							_slideUp(spollerClose.nextElementSibling, spollerSpeed);
							setTimeout(() => {
								spollerCloseBlock.open = false;
							}, spollerSpeed);
						}
					});
				}
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector("details[open]");
			if (
				spollerActiveBlock &&
				!spollersBlock.querySelectorAll("._slide").length
			) {
				const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
				const spollerSpeed = spollersBlock.dataset.spollersSpeed
					? parseInt(spollersBlock.dataset.spollersSpeed)
					: 500;
				spollerActiveTitle.classList.remove("_spoller-active");
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => {
					spollerActiveBlock.open = false;
				}, spollerSpeed);
			}
		}
	}
}

// модуль работы с табами
export function tabs() {
	const tabs = document.querySelectorAll("[data-tabs]");
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) {
			tabsActiveHash = hash.replace("tab-", "").split("-");
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("_tab-init");
			tabsBlock.setAttribute("data-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		// получение слойлеров с медиа-запросами
		let mdQueriesArray = dataMediaQueries(tabs, "tabs");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
	}

	// установка позиций заголовков
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
			let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
			let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter(
				(item) => item.closest("[data-tabs]") === tabsMediaItem
			);
			tabsContentItems = Array.from(tabsContentItems).filter(
				(item) => item.closest("[data-tabs]") === tabsMediaItem
			);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add("_tab-spoller");
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove("_tab-spoller");
				}
			});
		});
	}

	// работа с контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector(
				"[data-tabs-titles]>._tab-active"
			);
			tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
		}
		if (tabsContent.length) {
			//tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			//tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute("data-tabs-title", "");
				tabsContentItem.setAttribute("data-tabs-item", "");

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add("_tab-active");
				}
				tabsContentItem.hidden =
					!tabsTitles[index].classList.contains("_tab-active");
			});
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-tabs-animate")) {
				return tabsBlock.dataset.tabsAnimate > 0
					? Number(tabsBlock.dataset.tabsAnimate)
					: 500;
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-tabs-hash");
			tabsContent = Array.from(tabsContent).filter(
				(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsTitles = Array.from(tabsTitles).filter(
				(item) => item.closest("[data-tabs]") === tabsBlock
			);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains("_tab-active")) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest(".popup")) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-tabs-title]")) {
			const tabTitle = el.closest("[data-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-tabs]");
			if (
				!tabTitle.classList.contains("_tab-active") &&
				!tabsBlock.querySelector("._slide")
			) {
				let tabActiveTitle = tabsBlock.querySelectorAll(
					"[data-tabs-title]._tab-active"
				);
				tabActiveTitle.length
					? (tabActiveTitle = Array.from(tabActiveTitle).filter(
							(item) => item.closest("[data-tabs]") === tabsBlock
					  ))
					: null;
				tabActiveTitle.length
					? tabActiveTitle[0].classList.remove("_tab-active")
					: null;
				tabTitle.classList.add("_tab-active");
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}

// модуль работы по меню (бургер)
export function menuInit() {
	if (document.querySelector(".icon-menu")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest(".icon-menu")) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
			}
		});
	}
}
export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");
}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
}

// модуль "показать еще"
export function showMore() {
	window.addEventListener("load", function (e) {
		const showMoreBlocks = document.querySelectorAll("[data-showmore]");
		let showMoreBlocksRegular;
		let mdQueriesArray;
		if (showMoreBlocks.length) {
			// получение обычных объектов
			showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (
				item,
				index,
				self
			) {
				return !item.dataset.showmoreMedia;
			});
			// инициализация обычных объектов
			showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

			document.addEventListener("click", showMoreActions);
			window.addEventListener("resize", showMoreActions);

			// получение объектов с медиа-запросами
			mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
			if (mdQueriesArray && mdQueriesArray.length) {
				mdQueriesArray.forEach((mdQueriesItem) => {
					// событие
					mdQueriesItem.matchMedia.addEventListener("change", function () {
						initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
					});
				});
				initItemsMedia(mdQueriesArray);
			}
		}
		function initItemsMedia(mdQueriesArray) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		function initItems(showMoreBlocks, matchMedia) {
			showMoreBlocks.forEach((showMoreBlock) => {
				initItem(showMoreBlock, matchMedia);
			});
		}
		function initItem(showMoreBlock, matchMedia = false) {
			showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
			let showMoreContent = showMoreBlock.querySelectorAll(
				"[data-showmore-content]"
			);
			let showMoreButton = showMoreBlock.querySelectorAll(
				"[data-showmore-button]"
			);
			showMoreContent = Array.from(showMoreContent).filter(
				(item) => item.closest("[data-showmore]") === showMoreBlock
			)[0];
			showMoreButton = Array.from(showMoreButton).filter(
				(item) => item.closest("[data-showmore]") === showMoreBlock
			)[0];
			const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
			if (matchMedia.matches || !matchMedia) {
				if (hiddenHeight < getOriginalHeight(showMoreContent)) {
					_slideUp(
						showMoreContent,
						0,
						showMoreBlock.classList.contains("_showmore-active")
							? getOriginalHeight(showMoreContent)
							: hiddenHeight
					);
					showMoreButton.hidden = false;
				} else {
					_slideDown(showMoreContent, 0, hiddenHeight);
					showMoreButton.hidden = true;
				}
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight);
				showMoreButton.hidden = true;
			}
		}
		function getHeight(showMoreBlock, showMoreContent) {
			let hiddenHeight = 0;
			const showMoreType = showMoreBlock.dataset.showmore
				? showMoreBlock.dataset.showmore
				: "size";
			const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap)
				? parseFloat(getComputedStyle(showMoreContent).rowGap)
				: 0;
			if (showMoreType === "items") {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent
					? showMoreContent.dataset.showmoreContent
					: 3;
				const showMoreItems = showMoreContent.children;
				for (let index = 1; index < showMoreItems.length; index++) {
					const showMoreItem = showMoreItems[index - 1];
					const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop)
						? parseFloat(getComputedStyle(showMoreItem).marginTop)
						: 0;
					const marginBottom = parseFloat(
						getComputedStyle(showMoreItem).marginBottom
					)
						? parseFloat(getComputedStyle(showMoreItem).marginBottom)
						: 0;
					hiddenHeight += showMoreItem.offsetHeight + marginTop;
					if (index == showMoreTypeValue) break;
					hiddenHeight += marginBottom;
				}
				rowGap ? (hiddenHeight += (showMoreTypeValue - 1) * rowGap) : null;
			} else {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent
					? showMoreContent.dataset.showmoreContent
					: 150;
				hiddenHeight = showMoreTypeValue;
			}
			return hiddenHeight;
		}

		function getOriginalHeight(showMoreContent) {
			let parentHidden;
			let hiddenHeight = showMoreContent.offsetHeight;
			showMoreContent.style.removeProperty("height");
			if (showMoreContent.closest(`[hidden]`)) {
				parentHidden = showMoreContent.closest(`[hidden]`);
				parentHidden.hidden = false;
			}
			let originalHeight = showMoreContent.offsetHeight;
			parentHidden ? (parentHidden.hidden = true) : null;
			showMoreContent.style.height = `${hiddenHeight}px`;
			return originalHeight;
		}
		function showMoreActions(e) {
			const targetEvent = e.target;
			const targetType = e.type;
			if (targetType === "click") {
				if (targetEvent.closest("[data-showmore-button]")) {
					const showMoreButton = targetEvent.closest("[data-showmore-button]");
					const showMoreBlock = showMoreButton.closest("[data-showmore]");
					const showMoreContent = showMoreBlock.querySelector(
						"[data-showmore-content]"
					);
					const showMoreSpeed = showMoreBlock.dataset.showmoreButton
						? showMoreBlock.dataset.showmoreButton
						: "500";
					const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
					if (!showMoreContent.classList.contains("_slide")) {
						showMoreBlock.classList.contains("_showmore-active")
							? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
							: _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
						showMoreBlock.classList.toggle("_showmore-active");
					}
				}
			} else if (targetType === "resize") {
				showMoreBlocksRegular && showMoreBlocksRegular.length
					? initItems(showMoreBlocksRegular)
					: null;
				mdQueriesArray && mdQueriesArray.length
					? initItemsMedia(mdQueriesArray)
					: null;
			}
		}
	});
}

// модуль "Ripple effect"
export function rippleEffect() {
	// событие клика на кнопке
	document.addEventListener("click", function (e) {
		const targetItem = e.target;
		if (targetItem.closest("[data-ripple]")) {
			// константы
			const button = targetItem.closest("[data-ripple]");
			const ripple = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			// формирование элемента
			ripple.style.width = ripple.style.height = `${diameter}px`;
			ripple.style.left = `${
				e.pageX - (button.getBoundingClientRect().left + scrollX) - radius
			}px`;
			ripple.style.top = `${
				e.pageY - (button.getBoundingClientRect().top + scrollY) - radius
			}px`;
			ripple.classList.add("ripple");

			// удаление существующего элемента (опционально)
			button.dataset.ripple === "once" && button.querySelector(".ripple")
				? button.querySelector(".ripple").remove()
				: null;

			// добавление элемента
			button.appendChild(ripple);

			// получение времени действия анимации
			const timeOut = getAnimationDuration(ripple);

			// удаление элемента
			setTimeout(() => {
				ripple ? ripple.remove() : null;
			}, timeOut);

			// функция получения времени действия анимации
			function getAnimationDuration() {
				const aDuration = window.getComputedStyle(ripple).animationDuration;
				return aDuration.includes("ms")
					? aDuration.replace("ms", "")
					: aDuration.replace("s", "") * 1000;
			}
		}
	});
}
// модуль "Сustom сursor"
export function customCursor(isShadowTrue) {
	const wrapper = document.querySelector("[data-custom-cursor]")
		? document.querySelector("[data-custom-cursor]")
		: document.documentElement;
	if (wrapper && !isMobile.any()) {
		// создаем и добавляем объект курсора
		const cursor = document.createElement("div");
		cursor.classList.add("fls-cursor");
		cursor.style.opacity = 0;
		cursor.insertAdjacentHTML(
			"beforeend",
			`<span class="fls-cursor__pointer"></span>`
		);
		isShadowTrue
			? cursor.insertAdjacentHTML(
					"beforeend",
					`<span class="fls-cursor__shadow"></span>`
			  )
			: null;
		wrapper.append(cursor);

		const cursorPointer = document.querySelector(".fls-cursor__pointer");
		const cursorPointerStyle = {
			width: cursorPointer.offsetWidth,
			height: cursorPointer.offsetHeight,
		};
		let cursorShadow, cursorShadowStyle;
		if (isShadowTrue) {
			cursorShadow = document.querySelector(".fls-cursor__shadow");
			cursorShadowStyle = {
				width: cursorShadow.offsetWidth,
				height: cursorShadow.offsetHeight,
			};
		}
		function mouseActions(e) {
			if (e.type === "mouseout") {
				cursor.style.opacity = 0;
			} else if (e.type === "mousemove") {
				cursor.style.removeProperty("opacity");
				if (
					e.target.closest("button") ||
					e.target.closest("a") ||
					e.target.closest("input") ||
					(window.getComputedStyle(e.target).cursor !== "none" &&
						window.getComputedStyle(e.target).cursor !== "default")
				) {
					cursor.classList.add("_hover");
				} else {
					cursor.classList.remove("_hover");
				}
			} else if (e.type === "mousedown") {
				cursor.classList.add("_active");
			} else if (e.type === "mouseup") {
				cursor.classList.remove("_active");
			}
			cursorPointer
				? (cursorPointer.style.transform = `translate3d(${
						e.clientX - cursorPointerStyle.width / 2
				  }px, ${e.clientY - cursorPointerStyle.height / 2}px, 0)`)
				: null;
			cursorShadow
				? (cursorShadow.style.transform = `translate3d(${
						e.clientX - cursorShadowStyle.width / 2
				  }px, ${e.clientY - cursorShadowStyle.height / 2}px, 0)`)
				: null;
		}

		window.addEventListener("mouseup", mouseActions);
		window.addEventListener("mousedown", mouseActions);
		window.addEventListener("mousemove", mouseActions);
		window.addEventListener("mouseout", mouseActions);
	}
}

// другие полезные функции

// FLS (Full Logging System)
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message);
		}
	}, 0);
}

// получить цифры из строки
export function getDigFromString(item) {
	return parseInt(item.replace(/[^\d]/g, ""));
}

// форматирование цифр типа 100 000 000
export function getDigFormat(item, sepp = " ") {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}

// убрать класс из всех элементов массива
export function removeClasses(array, className) {
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className);
	}
}

// уникализация массива
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

// функция получения индекса внутри родительского элемента
export function indexInParent(parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
}

// функция проверяет, видим ли объект видимый
export function isHidden(el) {
	return el.offsetParent === null;
}

// обработка медиа запросов по атрибутам
export function dataMediaQueries(array, dataSetValue) {
	// получение объектов с медиа-запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});

	// инициализация объектов с медиа-запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach((item) => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// получаем уникальные брейк-поинты
		let mdQueries = breakpointsArray.map(function (item) {
			return (
				"(" +
				item.type +
				"-width: " +
				item.value +
				"px)," +
				item.value +
				"," +
				item.type
			);
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// работа с каждым брейк-поинтом
			mdQueries.forEach((breakpoint) => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);

				// объекты с необходимыми условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia,
				});
			});
			return mdQueriesArray;
		}
	}
}
