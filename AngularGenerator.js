var handlebars = require('./handlebars');

var AngularGenerator = function() {
	this.generate = function(context, requests, options) {
		var request = context.getCurrentRequest();

		var headers = [];
		var method = request.method;
		var jsonContent = false;
		var body = addslashes(request.body);

		for (var key in request.headers) {
			headers.push({
				name: key,
				value: request.headers[key]
			});
		}

		if (typeof request.jsonBody === 'object') {
			body = jsonBodyObject(request.jsonBody);
			jsonContent = true;
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

// I stole these from the jQuery Generator :(
var addslashes = function(str) {
	return ('' + str).replace(/[\\"]/g, '\\$&').replace(/\n/g, '');
};

var jsonBodyObject = function(object, indent) {
	var s;

	indent = indent ? indent : 0;

	if (object === null) {
		s = 'null';
	} else if (typeof object === 'string') {
		s = `'${addslashes(object)}'`;
	} else if (typeof object === 'number') {
		s = `${object}`;
	} else if (typeof object === 'boolean') {
		s = `${object}`;
	} else if (typeof object === 'object') {
		var indentStr = Array(indent + 2).join('    ');
		var indentStrChildren = Array(indent + 3).join('    ');

		if (object.length != null) {
			s = '[\n';

			for (var i = 0, len = object.length; i < len; i++) {
				s += `${indentStrChildren}${jsonBodyObject(object[i], indent + 1)}`;
				s += ',\n';
			}

			s += `${indentStr}]`;
		} else {
			s = '{\n';

			for (var key in object) {
				var value = object[key];
				s += `${indentStrChildren}'${addslashes(key)}': ${jsonBodyObject(value, indent + 1)},\n`;
			}

			s += `${indentStr}}`;
		}
	}

	return s;
};
