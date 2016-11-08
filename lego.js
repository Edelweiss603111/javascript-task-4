'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var functionsPriority = ['filterIn', 'sortBy', 'select', 'format', 'limit'];

function getSortedFunctions(funcs) {

    return funcs.sort(function (function1, function2) {
        return functionsPriority.indexOf(function1.functionName) <
        functionsPriority.indexOf(function2.functionName) ? -1 : 1;
    });
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var newCollection = collection.slice();
    if (arguments.length === 1) {
        return newCollection;
    }
    var operators = [].slice.call(arguments).slice(1);
    var sortedFunctions = getSortedFunctions(operators);
    newCollection = sortedFunctions.map(function (sortedFunction) {
        newCollection = sortedFunction(newCollection);

        return newCollection;
    });

    return newCollection.pop();
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    var select = function (collection) {
        var newCollection = [];
        collection.forEach(function (person) {
            var newField = {};
            fields.forEach(function (field) {
                newField[field] = person[field];
            });
            newCollection.push(newField);
        });

        return newCollection;
    };
    select.functionName = 'select';

    return select;
};


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
        collection.forEach(function (person) {
            var filteredCollection = [];
            values.forEach(function (value) {
                if (person[property] === value) {
                    filteredCollection.push(person);
                }
            });
            newCollection = newCollection.concat(filteredCollection);
        });

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
