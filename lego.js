'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var functionsPriority = ['filterIn', 'sortBy', 'select', 'format', 'limit'];

function getSortedFunctions(funcs) {

    return funcs.sort(function (function1, function2) {

        return functionsPriority.indexOf(function1.name) <
        functionsPriority.indexOf(function2.name) ? -1 : 1;
    });
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var newCollection = JSON.parse(JSON.stringify(collection));
    if (arguments.length === 1) {
        return newCollection;
    }
    var operators = [].slice.call(arguments).slice(1);
    var sortedFunctions = getSortedFunctions(operators);
    newCollection = sortedFunctions.map(function (sortedFunction) {
        newCollection = sortedFunction(newCollection);

        return newCollection;
    });

    return newCollection[newCollection.length - 1];
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);

    var select = function select(collection) {
        var newCollection = [];
        collection.forEach(function (person) {
            var newField = {};
            fields.forEach(function (field) {
                if (person[field]) {
                    newField[field] = person[field];
                }
            });
            newCollection.push(newField);
        });

        return newCollection;
    };

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

    var filterIn = function filterIn(collection) {
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
        if (i[property] === j[property]) {
            return 0;
        }
        if (order === 'asc') {

            return i[property] < j[property] ? -1 : 1;
        }

        return i[property] > j[property] ? -1 : 1;
    };

    var sortBy = function sortBy(collection) {
        return collection.sort(sorter);
    };

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

    var format = function format(collection) {
        collection.forEach(function (contact) {
            if (contact[property]) {
                contact[property] = formatter(contact[property]);
            }
        });

        return collection;
    };

    return format;
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    console.info(count);

    var limit = function limit(collection) {

        return collection.slice(0, count);
    };

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
