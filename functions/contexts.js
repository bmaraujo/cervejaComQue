function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

define('CTX_COMIDA', 'procurarComida');
define('CTX_SUGGESTED', 'suggestionMade');
define('CTX_BITTERNESS', 'bitternessSelected');
define('CTX_ALCOHOLIC_LVL', 'alcoholicLvlSelected');
define('CTX_COLOR', 'colorSelected');
define('CTX_HC_1st_SUG','hc1stSuggestion');
define('CTX_PERMISSION','askPermission');