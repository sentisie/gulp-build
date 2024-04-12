/* маски для полей (в работе) */

// подключение списка активных модулей
import { flsModules } from "../modules.js";

// подключение модуля
import "inputmask/dist/inputmask.min.js";

const inputMasks = document.querySelectorAll("input");
if (inputMasks.length) {
	flsModules.inputmask = Inputmask().mask(inputMasks);
}
