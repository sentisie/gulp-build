import { configFTP } from '../gulp-settings.js';
import vinylFTP from 'vinyl-ftp';

export const ftp = () => {
	configFTP.log = app.lp.util.log;
	const ftpConnect = vinylFTP.create(configFTP);
	return app.gulp.src(`${app.path.buildFolder}/**/*.*`, {})
		.pipe(app.lp.plumber(
			app.lp.notify.onError({
				title: "FTP",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(ftpConnect.dest(`/${app.path.ftp}/${app.rootFolder}`));
}