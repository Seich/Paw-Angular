var handlebars = require('./handlebars');

var addslashes = function(str) {
	return ("" + str).replace(/[\\"]/g, '\\$&')
					 .replace(/\n/g, '');
};

var AngularGenerator = function() {
	this.generate = function(context, requests, options) {
		var request = context.getCurrentRequest();

		var headers = [];
		var method = request.method;
		var jsonContent = false;
		var body = addslashes(request.body);

		for(var key in request.headers) {
			headers.push({
				name: key,
				value: request.headers[key]
			});
		}

		if (typeof request.jsonBody === 'object') {
			body = [];
			jsonContent = true;

			for(var j in request.jsonBody) {
				body.push({
					name: j,
					value: request.jsonBody[j]
				});
			}
		}

		var view = {
			headers: headers,
			body: body,
			jsonContent: jsonContent,
			method: request.method,
			url: request.url
		};

		var template = handlebars.compile(readFile('./AngularTemplate.hbs'));

		return template(view);
	};
};

AngularGenerator.identifier = 'com.martianwabbit.PawExtensions.AngularGenerator';
AngularGenerator.title = 'Angular $http';
AngularGenerator.languageHighlighter = 'coffeescript'; // The Javascript highlighter doesn't highlight :(
AngularGenerator.fileExtension = 'js';

registerCodeGenerator(AngularGenerator);
