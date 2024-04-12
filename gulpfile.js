// Основные модули
import gulp from "gulp";
import loadPlugins from "load-plugins";

// Импорт путей
import { path } from "./config/gulp-settings.js";

// Получаем имя папки проекта
import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

// Передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
	isWebP: !process.argv.includes('--nowebp'),
	isFontsReW: process.argv.includes('--rewrite'),
	gulp: gulp,
	path: path,
	lp: loadPlugins('gulp-*'),
	rootFolder: rootFolder,
}

// Импорт задач
import { reset } from "./config/gulp-tasks/reset.js";
import { html } from "./config/gulp-tasks/html.js";
import { css } from "./config/gulp-tasks/css.js";
import { js } from "./config/gulp-tasks/js.js";
import { images } from "./config/gulp-tasks/images.js";
import { ftp } from "./config/gulp-tasks/ftp.js";
import { zip } from "./config/gulp-tasks/zip.js";
import { sprite } from "./config/gulp-tasks/sprite.js";
import { gitignore } from "./config/gulp-tasks/gitignore.js";
import { otfToTtf, ttfToWoff, fontsStyle } from "./config/gulp-tasks/fonts.js";

// Последовательная обработака шрифтов
const fonts = gulp.series(reset, otfToTtf, ttfToWoff, fontsStyle);

// Основные задачи будем выполнять параллельно после обработки шрифтов
const devTasks = gulp.parallel(fonts, gitignore);

// Основные задачи будем выполнять параллельно после обработки шрифтов
const buildTasks = gulp.series(fonts, js, gulp.parallel(html, css, images, gitignore));

// Экспорт задач
export { html }
export { css }
export { js }
export { images }
export { fonts }
export { sprite }
export { ftp }
export { zip }

// Построение сценариев выполнения задач
const dev = gulp.series(devTasks);
const build = gulp.series(buildTasks);
const deployFTP = gulp.series(buildTasks, ftp);
const deployZIP = gulp.series(buildTasks, zip);

// Экспорт сценариев
export { dev }
export { build }
export { deployFTP }
export { deployZIP }

// Выполнение сценария по умолчанию
gulp.task('default', dev);






