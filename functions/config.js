'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

// suggestions
define('API_KEY', '');
define('FIREBASE_DB_USER','');
define('FIREBASE_DB_PASS','');
define('CHATBASE_API_KEY','');