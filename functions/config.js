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
define('CHATBASE_URL', 'https://chatbase-area120.appspot.com/api/message');
define('CHATBASE_PLATAFORM', 'cervejaComQue');
define('CHATBASE_VERSION', '0.1');
