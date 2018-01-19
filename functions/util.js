class Util{

	define(name, value) {
	    Object.defineProperty(exports, name, {
	        value:      value,
	        enumerable: true
	    });
	};

}

module.exports = Util;