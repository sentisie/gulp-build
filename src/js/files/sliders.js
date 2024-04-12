/*
документация по работе в шаблоне: 
документация слайдера: https://swiperjs.com/
сниппет(HTML): swiper
*/

// подключаем слайдер Swiper из node_modules
// при необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// пример: { Navigation, Autoplay }
import Swiper, {
	Navigation,
	Pagination,
	Parallax,
	Autoplay,
	Thumbs,
} from "swiper";

/*
основные модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
подробнее смотреть по https://swiperjs.com/
*/

// стили Swiper
// базовые стили
import "../../scss/base/swiper.scss";
// полный набор стилей из scss/libs/swiper.scss
import "../../scss/libs/swiper.scss";
// полный набор стилей из node_modules
// import 'swiper/css';

// добавление классов слайдерам
// swiper главному блоку, swiper-wrapper оболочке, swiper-slide для слайдов

function bildSliders() {
	// bildslider
	let sliders = document.querySelectorAll(
		'[class*="__swiper"]:not(.swiper-wrapper)'
	);
	if (sliders) {
		sliders.forEach((slider) => {
			slider.parentElement.classList.add("swiper");
			slider.classList.add("swiper-wrapper");
			for (const slide of slider.children) {
				slide.classList.add("swiper-slide");
			}
		});
	}
}
// инициализация слайдеров
function initSliders() {
	// добавление классов слайдера
	// при необходимости отключить
	bildSliders();

	// перечень слайдеров
	if (document.querySelector(".review-block__slider")) {
		new Swiper(".review-block__slider", {
			// подключаем модули слайдера
			// для конкретного случая
			modules: [Navigation, Pagination, Parallax, Autoplay],

			//effect: 'fade',
			//autoplay: {
			// delay: 3000,
			// disableOnInteraction: false,
			// },

			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 200,
			parallax: true,
			autoHeight: true,
			speed: 800,
			//touchRatio: 0,
			//simulateTouch: false,
			loop: true,
			//preloadImages: false,
			//lazy: true,

			// dotts
			pagination: {
				el: ".fraction-controll",
				type: "fraction",
				clickable: true,
				dynamicBullets: true,
			},
			navigation: {
				prevEl: ".swiper-button-prev",
				nextEl: ".swiper-button-next",
			},

			/*
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/

			on: {
				init: function (swiper) {
					const allSlides = document.querySelector(".fraction-controll__all");
					const allSlidesItems = document.querySelectorAll(
						".slide-main-block:not(.swiper-slide-duplicate)"
					);
					allSlides.innerHTML =
						allSlidesItems.length < 10
							? `0${allSlidesItems.length}`
							: allSlidesItems.length;
				},
				slideChange: function (swiper) {
					const currentSlide = document.querySelector(
						".fraction-controll__current"
					);
					currentSlide.innerHTML =
						swiper.realIndex + 1 < 10
							? `0${swiper.realIndex + 1}`
							: swiper.realIndex + 1;
				},
			},
		});
	}
}

// cкролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	// добавление классов слайдера
	// при необходимости отключить
	bildSliders();

	let sliderScrollItems = document.querySelectorAll(".swiper_scroll");
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar =
				sliderScrollItem.querySelector(".swiper-scrollbar");
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: "vertical",
				slidesPerView: "auto",
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false,
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// запуск инициализации слайдеров
	initSliders();

	// запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});
