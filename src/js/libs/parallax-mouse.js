// модуль параллакса мышью
// документация:

import { isMobile, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

/*
предмету, двигающемуся за мышью, указать атрибут data-prlx-mouse.

// =========
если требуется дополнительная настройка - указать

атрибут											значение по умолчанию
-------------------------------------------------------------------------------------------------------------------
data-prlx-cx="коэффициент_х"					100							значение больше – меньше процент сдвига
data-prlx-cy="коэффициент_y"					100							значение больше – меньше процент сдвига
data-prlx-dxr																		против оси X
data-prlx-dyr																		против оси Y
data-prlx-a="скорость_анимации"				50								большее значение – больше скорость

// =========
если нужно считывать движение мыши в блоке-родителе – то тому отцу указать атрибут data-prlx-mouse-wrapper

если в параллаксе картинка - растянуть ее на >100%.
к примеру:
	width: 130%;
	height: 130%;
	top: -15%;
	left: -15%;
*/
class MousePRLX {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
		};
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll("[data-prlx-mouse]");
			if (paralaxMouse.length) {
				this.paralaxMouseInit(paralaxMouse);
				this.setLogging(`Слежу за объектами: (${paralaxMouse.length})`);
			} else {
				this.setLogging("Ни одного объекта.");
			}
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach((el) => {
			const paralaxMouseWrapper = el.closest("[data-prlx-mouse-wrapper]");

			// коэф. X
			const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
			// коэф. У
			const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
			// ось. Х
			const directionX = el.hasAttribute("data-prlx-dxr") ? -1 : 1;
			// ось. У
			const directionY = el.hasAttribute("data-prlx-dyr") ? -1 : 1;
			// скорость анимации
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;

			// объявление переменных
			let positionX = 0,
				positionY = 0;
			let coordXprocent = 0,
				coordYprocent = 0;

			setMouseParallaxStyle();

			// проверяю наличие отца, в котором будет считываться положение мыши
			if (paralaxMouseWrapper) {
				mouseMoveParalax(paralaxMouseWrapper);
			} else {
				mouseMoveParalax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation) / 1000;
				positionY = positionY + (distY * paramAnimation) / 1000;
				el.style.cssText = `transform: translate3D(${
					(directionX * positionX) / (paramСoefficientX / 10)
				}%,${
					(directionY * positionY) / (paramСoefficientY / 10)
				}%,0) rotate(0.02deg);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (
						offsetTop >= window.scrollY ||
						offsetTop + el.offsetHeight >= window.scrollY
					) {
						// получение ширины и высоты блока
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;

						// ноль посередине
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;

						// получаем проценты
						coordXprocent = (coordX / parallaxWidth) * 100;
						coordYprocent = (coordY / parallaxHeight) * 100;
					}
				});
			}
		});
	}

	// логинг в консоль
	setLogging(message) {
		this.config.logging ? FLS(`[PRLX Mouse]: ${message}`) : null;
	}
}

// запускаем и добавляем в объект модулей
flsModules.mousePrlx = new MousePRLX({});
