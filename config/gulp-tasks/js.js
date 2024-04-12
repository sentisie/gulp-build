import webpack from "webpack-stream";
import webPackConfig from '../webpack.prod.js';

export const js = () => {
	return app.gulp.src(app.path.src.js)
		.pipe(app.lp.plumber(
			app.lp.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			config: webPackConfig
		}))
		.pipe(app.gulp.dest(app.path.build.js));
}