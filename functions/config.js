'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

// suggestions
define('API_KEY', '');
define('AUTH_DOMAIN','');
define('DATABASE_URL','');
define('STORAGE_BUCKET','');
define('FIREBASE_DB_USER','');
define('FIREBASE_DB_PASS','');
