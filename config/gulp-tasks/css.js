export const css = () => {
	return app.gulp.src(`${app.path.build.css}style.css`, {})
		.pipe(app.lp.plumber(
			app.lp.notify.onError({
				title: "CSS",
				message: "Error: <%= error.message %>"
			})))
		.pipe(
			app.lp.if(
				app.isBuild,
				app.lp.groupCssMediaQueries()
			)
		)
		.pipe(
			app.lp.if(
				app.isBuild,
				app.lp.autoprefixer({
					grid: true,
					overrideBrowserslist: ["last 3 versions"],
					cascade: true
				})
			)
		)
		.pipe(
			app.lp.if(
				app.isWebP,
				app.lp.if(
					app.isBuild,
					app.lp.webpcss(
						{
							webpClass: ".webp",
							noWebpClass: ".no-webp"
						}
					)
				)
			)
		)
		// раскомментировать если нужен не сжатый дубль файла стилей
		//.pipe(app.gulp.dest(app.path.build.css))
		.pipe(
			app.lp.if(
				app.isBuild,
				app.lp.cleanCss()
			)
		)
		.pipe(app.lp.rename({ suffix: ".min" }))
		.pipe(app.gulp.dest(app.path.build.css));
}