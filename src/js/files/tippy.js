import { isMobile, FLS } from "./functions.js";

// подключение списка активных модулей
import { flsModules } from "./modules.js";

// подключение с node_modules
import tippy from "tippy.js";

// подключение стилей с src/scss/libs
import "../../scss/libs/tippy.scss";

// подключение стилей с node_modules
//import 'tippy.js/dist/tippy.css';

// запускаем и добавляем в объект модулей
flsModules.tippy = tippy("[data-tippy-content]", {});
