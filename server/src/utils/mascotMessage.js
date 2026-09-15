const MASCOT_MESSAGES = {
    cachorro: [
        'Sua lealdade a si mesmo é o que te mantém firme — orgulho de você por continuar.',
        'Um passo de cada vez, do jeito que um bom cachorro segue o rastro: sem desistir.'
    ],

    capivara: [
        'A capivara enfrenta qualquer situação com calma. Respira, você está indo bem.',
        'Nada abala uma capivara — a tranquilidade que ela tem é a mesma que você está construindo hoje.'
    ],

    coelho: [
        'O coelho é rápido pra fugir do perigo, e você foi corajoso hoje ao encarar o seu.',
        'Cada pulo do coelho é pra frente. Você também está indo pra frente, mesmo que devagar.'
    ],

    gato: [
        'O gato sempre cai de pé. Não importa o tamanho da queda, você também sabe se reerguer.',
        'Independência é a marca do gato — e a sua força de vontade hoje mostrou a mesma coisa.'
    ],

    lontra: [
        'A lontra brinca até nos dias difíceis. Achar um motivo pra sorrir hoje já é uma vitória.',
        'Persistente como uma lontra nadando contra a correnteza — é assim que você está indo.'        
    ],

    sapo: [
        'O sapo passa por uma transformação completa até virar o que é. Você também está se transformando, dia após dia.',
        'Cada metamorfose leva tempo. Confie no processo, assim como o sapo confia no dele.'
    ]
};

const DEFAULT_MESSAGES = [
    'Cada diário escrito é um passo a mais na sua jornada. Continue assim.'
];

function getMotivationalMessage(mascot) {
    const messages = MASCOT_MESSAGES[mascot] || DEFAULT_MESSAGES;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

module.exports = getMotivationalMessage;