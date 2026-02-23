const translations = {
    // Общие элементы
    appTitle: {
        kaa: 'Qaraqalpaq ekzogamiyası',
        ru: 'Қарақалпақ экзогамиясы'
    },
    subtitle: {
        kaa: 'Úyleniw ushın urıwlıq tekseriw', // Ваш перевод
        ru: 'Проверка родовой принадлежности для брака'
    },
    
    // Кнопки
    clearButton: {
        kaa: 'Tazalaw',
        ru: 'Очистить'
    },
    collapseAll: {
        kaa: 'Jıynastırıw',
        ru: 'Свернуть'
    },
    expandAll: {
        kaa: 'Jayıw',
        ru: 'Развернуть'
    },
    
    // Результаты
    resultPending: {
        kaa: 'Tańlawdı kútip atırmız',
        ru: 'Ожидание выбора'
    },
    resultAllowed: {
        kaa: 'NEKEGE RUQSAT',
        ru: 'БРАК РАЗРЕШЁН'
    },
    resultForbidden: {
        kaa: 'NEKE QADAǴAN',
        ru: 'БРАК ЗАПРЕЩЁН'
    },
    
    // Причины
    reasonSame: {
        kaa: 'Birdey tuwıslar tan\'landı',
        ru: 'Выбраны одинаковые роды'
    },
    reasonKoshe: {
        kaa: 'Bir qoshe ishinde',
        ru: 'Внутри одного коша'
    },
    // ... и так далее для всех текстов
};

// Функция для получения перевода
function t(key, lang = 'kaa') {
    return translations[key] ? (translations[key][lang] || translations[key]['ru']) : key;
}