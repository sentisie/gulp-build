/*

*/

import { isMobile, FLS } from "./functions.js";
// подключение списка активных модулей
import { flsModules } from "./modules.js";

import Isotope from "isotope-layout/js/isotope.js";

const items = document.querySelector("[data-iso-items]");
if (items) {
	const itemsGrid = new Isotope(items, {
		itemSelector: "[data-iso-item]",
		masonry: {
			fitWidth: true,
			gutter: 20,
		},
	});
}
