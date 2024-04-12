import LazyLoad from "vanilla-lazyload";

// работает с объектами с классом ._lazy
const lazyMedia = new LazyLoad({
	elements_selector: "[data-src],[data-srcset]",
	class_loaded: "_lazy-loaded",
	use_native: true,
});

// обновить модуль
// lazyMedia.update();
