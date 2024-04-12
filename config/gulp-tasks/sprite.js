export const sprite = () => {
	return app.gulp.src(`${app.path.src.svgicons}`, {})
		.pipe(app.lp.plumber(
			app.lp.notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.lp.svgSprite({
			mode: {
				stack: {
					sprite: `../icons/icons.svg`,
					// создавать страницу с перечнем иконок
					example: true
				}
			},
		}
		))
		.pipe(app.gulp.dest(`${app.path.build.images}`));
}