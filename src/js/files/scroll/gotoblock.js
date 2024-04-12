import { isMobile, menuClose, getHash, FLS } from "../functions.js";
// подключение дополнения для увеличения возможностей
// документация: https://github.com/cferdinandi/smooth-scroll
// import SmoothScroll from 'smooth-scroll';

// модуль плавной прокрутки к блоку
export let gotoBlock = (
	targetBlock,
	noHeader = false,
	speed = 500,
	offsetTop = 0
) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("_header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("_header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("_header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else {
				headerItemHeight = headerElement.offsetHeight;
			}
		}
		let options = {
			speedAsDuration: true,
			speed: speed,
			header: headerItem,
			offset: offsetTop,
			easing: "easeOutQuad",
		};
		// закрываем меню, если оно открыто
		document.documentElement.classList.contains("menu-open")
			? menuClose()
			: null;

		if (typeof SmoothScroll !== "undefined") {
			// прокрутка с использованием дополнения
			new SmoothScroll().animateScroll(targetBlockElement, "", options);
		} else {
			// прокрутка стандартными средствами
			let targetBlockElementPosition =
				targetBlockElement.getBoundingClientRect().top + scrollY;
			targetBlockElementPosition = headerItemHeight
				? targetBlockElementPosition - headerItemHeight
				: targetBlockElementPosition;
			targetBlockElementPosition = offsetTop
				? targetBlockElementPosition - offsetTop
				: targetBlockElementPosition;
			window.scrollTo({
				top: targetBlockElementPosition,
				behavior: "smooth",
			});
		}
		FLS(`[gotoBlock]: Едем до ${targetBlock}`);
	} else {
		FLS(`[gotoBlock]: Такого блока нет на странице: ${targetBlock}`);
	}
};
