'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var functionsPriority = {
    'filterIn': 1,
    'sortBy': 2,
    'select': 3,
    'format': 4,
    'limit': 5
};

function sortFunctions(funcs) {

    return funcs.sort(function (function1, function2) {
        return functionsPriority[function1.functionName] <
        functionsPriority[function2.functionName] ? -1 : 1;
    });

}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var newCollection = collection;
    if (arguments.length === 1) {
        return newCollection;
    }
    var argFunctions = [].slice.call(arguments).slice(1);
    var sortedFunctions = sortFunctions(argFunctions);
    for (var i = 0; i < sortedFunctions.length; i++) {
        var sortedFunction = sortedFunctions[i];
        newCollection = sortedFunction(newCollection);
    }

    return newCollection;
};

function selectField(collection, fields, i) {
    var newField = {};
    for (var j = 0; j < fields.length; j++) {
        if (collection[i][fields[j]] !== undefined) {
            newField[fields[j]] = collection[i][fields[j]];
        }
    }

    return newField;
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = arguments;

    var select = function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            newCollection.push(selectField(collection, fields, i));
        }

        return newCollection;
    };
    select.functionName = 'select';

    return select;
};


function filterFields(collection, property, values, i) {
    var newCollection = [];
    for (var j = 0; j < values.length; j++) {
        if (collection[i][property] === values[j]) {
            newCollection.push(collection[i]);
        }
    }

    return newCollection;
}


/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    console.info(property, values);

    var filterIn = function (collection) {
        var newCollection = [];
        for (var i = 0; i < collection.length; i++) {
            newCollection = newCollection.concat(filterFields(collection, property, values, i));
        }

        return newCollection;
    };
    filterIn.functionName = 'filterIn';

    return filterIn;
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    var sorter = function (i, j) {
        return order === 'asc' ? i[property] > j[property] : i[property] < j[property];
    };

    var sortBy = function (collection) {
        return collection.sort(sorter);
    };
    sortBy.functionName = 'sortBy';

    return sortBy;
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    var format = function (collection) {
        for (var contact = 0; contact < collection.length; contact++) {
            if (collection[contact][property]) {
                collection[contact][property] = formatter(collection[contact][property]);
            }
        }

        return collection;
    };
    format.functionName = 'format';

    return format;
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    console.info(count);

    var limit = function (collection) {
        if (count > collection.length) {
            count = collection.length;
        }
        if (count < 0) {
            return [];
        }

        return collection.slice(0, count);
    };
    limit.functionName = 'limit';

    return limit;
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
