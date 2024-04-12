/*
документация по работе с шаблоном: https://www.lightgalleryjs.com/docs/
документация плагина: https://www.lightgalleryjs.com/docs/
сниппет(HTML):
*/

import { isMobile, FLS } from "./functions.js";
// подключение списка активных модулей
import { flsModules } from "./modules.js";

// подключение базового набора функционала
import lightGallery from "lightgallery";

// плагины
// lgZoom, lgAutoplay, lgComment, lgFullscreen, lgHash, lgPager, lgRotate, lgShare, lgThumbnail, lgVideo, lgMediumZoom
// import lgThumbnail from 'lightgallery/plugins/thumbnail/lg-thumbnail.min.js'
//import lgZoom from 'lightgallery/plugins/zoom/lg-zoom.min.js'

// базовые стили
import "@scss/libs/gallery/lightgallery.scss";
// стили дополнений
// import '@scss/libs/gallery/lg-thumbnail.scss';
// import '@scss/libs/gallery/lg-video.scss';
// import '@scss/libs/gallery/lg-autoplay.scss';
// import '@scss/libs/gallery/lg-zoom.scss';
// import '@scss/libs/gallery/lg-pager.scss';
// import '@scss/libs/gallery/lg-fullscreen.scss';
// import '@scss/libs/gallery/lg-share.scss';
// import '@scss/libs/gallery/lg-comments.scss';s
// import '@scss/libs/gallery/lg-rotate.scss';
// import '@scss/libs/gallery/lg-medium-zoom.scss';
// import '@scss/libs/gallery/lg-relative-caption.scss';

// все стили
// import '@scss/libs/gallery/lightgallery-bundle.scss';

// запуск
const galleries = document.querySelectorAll("[data-gallery]");
if (galleries.length) {
	let galleyItems = [];
	galleries.forEach((gallery) => {
		galleyItems.push({
			gallery,
			galleryClass: lightGallery(gallery, {
				// plugins: [lgZoom, lgThumbnail],
				licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
				speed: 500,
			}),
		});
	});
	// добавляем в объект модулей
	flsModules.gallery = galleyItems;
}
