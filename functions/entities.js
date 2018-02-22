'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

// Entities
define('ALC_VOL_MUITO_ALTO', 'MUITO_MAIS_ALTO');
define('ALC_VOL_MUITO_BAIXO', 'MUITO_MAIS_BAIXO');
define('ALC_VOL_BAIXO', 'MAIS_BAIXO');
define('ALC_VOL_MEDIO', 'MEDIO');
define('ALC_VOL_ALTO', 'MAIS_ALTO');
define('BITT_MUITO_MAIS', 'MUITO_MAIS');
define('BITT_MENOS', 'MENOS');
define('BITT_MUITO_MENOS', 'MUITO_MENOS');
define('BITT_MEDIO', 'MEDIO');
define('BITT_MAIS', 'MAIS');
define('COLOR_CLARA', 'CLARA');
define('COLOR_MEDIO', 'MEDIO');
define('COLOR_MUITO_ESCURA', 'MUITO_ESCURA');
define('COLOR_MUITO_CLARA', 'MUITO_CLARA');
define('COLOR_ESCURA', 'ESCURA');