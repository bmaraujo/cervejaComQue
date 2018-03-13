'use strict';

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
};

// actions
define('COMIDA_ACTION', 'procurar_comida');
define('MUDAR_ESTILO_ACTION',  'mudar_estilo');
define('CERVEJA_ACTION', 'procurar_cerveja');
define('FALLBACK_ACTION', 'input.unknown');
define('ABOUT_ACTION',  'about');
define('SUGERE_LOJA_ACTION', 'sugerir_loja');
define('SUGGESTION_ACCEPTED_ACTION', 'suggestion_accepted');
define('HC_ACTION',  'help_choose');
define('HC_STP2_MAIS_ACTION', 'help_choose.step2_mais');
define('HC_STP2_MENOS_ACTION', 'help_choose.step2_menos');
define('HC_STP2_MEDIO_ACTION', 'help_choose.step2_medio');
define('HC_STP2_TANTOFAZ_ACTION', 'help_choose.step2_tantofaz');
define('HC_STP3_MAIS_ACTION', 'help_choose.step3_mais');
define('HC_STP3_MENOS_ACTION', 'help_choose.step3_menos');
define('HC_STP3_MEDIO_ACTION', 'help_choose.step3_medio');
define('HC_STP3_TANTOFAZ_ACTION', 'help_choose.step3_tantofaz');
define('HC_STP4_MAIS_ACTION', 'help_choose.step4_mais');
define('HC_STP4_MENOS_ACTION', 'help_choose.step4_menos');
define('HC_STP4_MEDIO_ACTION', 'help_choose.step4_medio');
define('HC_STP4_TANTOFAZ_ACTION', 'help_choose.step4_tantofaz');
define('HC_ACCEPTED_ACTION', 'help_choose.accepted');
define('HC_REJECTED_ACTION', 'help_choose.rejected');
define('WELCOME_ACTION','input.welcome');
define('FINISH_APP_ACTION','finish_conversation');
define('HANDLE_PERMISSION','handlePermission');
define('PROCUROU_MARCA','procurou_marca');

