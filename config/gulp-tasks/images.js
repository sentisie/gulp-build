export const images = () => {
	return app.gulp.src(app.path.src.images)
		.pipe(app.lp.plumber(
			app.lp.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.lp.newer(app.path.build.images))
		.pipe(
			app.lp.if(
				app.isWebP,
				app.lp.if(
					app.isBuild,
					app.lp.webp()
				)
			)
		)
		.pipe(
			app.lp.if(
				app.isWebP,
				app.lp.if(
					app.isBuild,
					app.gulp.dest(app.path.build.images)
				)
			)
		)
		.pipe(
			app.lp.if(
				app.isWebP,
				app.lp.if(
					app.isBuild,
					app.gulp.src(app.path.src.images)
				)
			)
		)
		.pipe(
			app.lp.if(
				app.isWebP,
				app.lp.if(
					app.isBuild,
					app.lp.newer(app.path.build.images)
				)
			)
		)
		.pipe(
			app.lp.if(
				app.isBuild,
				app.lp.imagemin({
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					interlaced: true,
					optimizationLevel: 3 // 0 to 7
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.images))
		.pipe(app.gulp.src(app.path.src.svg))
		.pipe(app.gulp.dest(app.path.build.images));
}