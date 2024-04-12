// подключение плагина с node_modules
import SimpleBar from "simplebar";

// подключение стилей с node_modules
import "simplebar/dist/simplebar.css";

// добавляем в блок атрибут data-simplebar

// также можно инициализировать следующим кодом, используя настройки
/*
if (document.querySelectorAll('[data-simplebar]').length) {
	document.querySelectorAll('[data-simplebar]').forEach(scrollBlock => {
		new SimpleBar(scrollBlock, {
			autoHide: false
		});
	});
}
*/
