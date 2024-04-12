const buildFolder = `./dist`; // также можно использовать app.rootFolder
const srcFolder = `./src`;

export const path = {
	build: {
		html: `${buildFolder}/`,
		js: `${buildFolder}/js/`,
		css: `${buildFolder}/css/`,
		images: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
		files: `${buildFolder}/files/`
	},
	src: {
		html: `${srcFolder}/*.html`,
		pug: `${srcFolder}/pug/*.pug`,
		js: `${srcFolder}/js/app.js`,
		scss: [`${srcFolder}/scss/style.scss`, `${srcFolder}/scss/fonts.scss`],
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
		svg: `${srcFolder}/img/**/*.svg`,
		fonts: `${srcFolder}/fonts/*.*`,
		files: `${srcFolder}/files/**/*.*`,
		svgicons: `${srcFolder}/svgicons/*.svg`,
	},
	watch: {
		html: `${srcFolder}/**/*.html`,
		pug: `${srcFolder}/pug/**/*.pug`,
		js: `${srcFolder}/js/**/*.js`,
		scss: `${srcFolder}/scss/**/*.scss`,
		images: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`
	},
	clean: buildFolder,
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	ftp: `` // путь к нужной папке на удаленном сервере
};

// настройка FTP соединения
export const configFTP = {
	host: "", // адрес FTP сервера
	user: "", // имя пользователя
	password: "", // пароль
	parallel: 5 // кол-во одновременных потоков
}