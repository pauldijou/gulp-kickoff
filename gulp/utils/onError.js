var $ = require('./$');

module.exports = function (error) {
	console.log(error);

	message = error.message || '';

	if (error.filename) {
		message += '\n' + error.filename.replace(process.cwd(), "");
		if (error.location) {
			message += ':' + error.location.first_line + ':' + error.location.first_column;
		}
	}

	// if (error.code) {
	// 	message += '\n' + error.code;
	// }

	// Send error to notification center with gulp-notify
	$.notify.onError({
		title: error.name || 'Error',
		message: message
	}).call(this, error);

	console.log(error.stack);
};
