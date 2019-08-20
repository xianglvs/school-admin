'use strict';
/* global define */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('dataUtils', factory);
    } else if (typeof exports === 'object') {
        exports = module.exports = factory();
    } else {
        root.dataUtils = factory();
    }
})(this, function () {
    return {
        /**
         * 一维对象数组打包树型
         * @param {object} config 
         *      {
         *          rootId:0,//根节点值,如果设定该值,则目标数据中父类属性为该值的数据作为树型的顶级父类
         *          json:{},//要打包的数据
         *          idKey:"id",//数据唯一标识属性
         *          pidKey: "parentId",//数据父类属性
         *          keepChild: true, //生成树型结构后如果无子类是否生成空数组
         *          validate: row => { //生成树型结构时校验回调,返回false则该数据将会被排除,不会出现在生成的树型结构数据中
         *              return true;
         *        }
         *      }
         */
        jsonToTree: function (config) {
            var jsonToTreeByRoot = function (config) {
                let defaultConfig = {
                    rootId: 0,
                    json: [],
                    idKey: "id",
                    pidKey: "parentId",
                    childKey: "children",
                    keepChild: true,
                    validate: function (row) {
                        return true;
                    }
                };
                config = Object.assign(defaultConfig, config);
                let array = [];
                if (config.json) {
                    for (var i = 0; i < config.json.length; i++) {
                        var element = config.json[i];
                        if (element[config.pidKey] == config.rootId && config.validate(element)) {
                            array.push(element);
                        }
                    }
                }
                for (var x = 0; x < array.length; x++) {
                    element = array[x];
                    config.rootId = element[config.idKey];
                    element[config.childKey] = jsonToTreeByRoot(config);
                }
                if (!config.keepChild && array.length == 0) {
                    array = null;
                }
                return array;
            };

            var hasParent = function (pid, idKey, json) {
                for (var index = 0; index < json.length; index++) {
                    var element = json[index];
                    if (element[idKey] == pid) {
                        return true;
                    }
                }
                return false;
            };
            let defaultConfig = {
                json: [],
                idKey: "id",
                pidKey: "parentId",
                keepChild: true,
                childKey: "children",
                validate: row => {
                    return true;
                }
            };
            config = Object.assign(defaultConfig, config);
            if (config.rootId !== null && config.rootId !== undefined) {
                return jsonToTreeByRoot(config);
            }
            let array = [];
            if (config.json) {
                for (var i = 0; i < config.json.length; i++) {
                    var element = config.json[i];
                    let pid = element[config.pidKey];
                    if (!config.validate(element)) {
                        continue;
                    }
                    if (pid == null || pid.toString().trim().length == 0) {
                        array.push(element);
                        continue;
                    }
                    if (!hasParent(element[config.pidKey], config.idKey, config.json)) {
                        array.push(element);
                    }
                }
            }
            for (var x = 0; x < array.length; x++) {
                var ele = array[x];
                config.rootId = ele[config.idKey];
                ele[config.childKey] = jsonToTreeByRoot(config);
            }
            return array;
        },

        /**
         * 一维数组对象属性转属性数组
         * var arr = [{b:1,c:2},{b:2,c:3},{b:3,c:4}];
         * var result = objectArrayToFieldArray(arr,["b","c"]);
         * console.log(result);
         * // result:{"b":[1,2,3],"c":[2,3,4]}
         * @param {Array} objectArray 要转化的对象数组
         * @param {Array} fields 需要转化的字段名列表
         * @return objectArray中的fields指定属性变为数组属性
         */
        objectArrayToFieldArray: function (objectArray, fields) {
            if (!objectArray) {
                objectArray = [];
            }
            let resultArray = {};
            for (var x = 0; x < objectArray.length; x++) {
                var element = objectArray[x];
                for (let i = 0; i < fields.length; i++) {
                    if (resultArray[fields[i]] == null) {
                        resultArray[fields[i]] = [];
                    }
                    resultArray[fields[i]].push(element[fields[i]]);
                }
            }
            return resultArray;
        },


        /**
         * 改变一维数组对象字段名方法
         * @param {*} objectArray 要改变的数组对象
         * @param {*} fieldMap 要改变的列名映射,{"dataId":"id","dataName":"name"}
         * 则是把objectArray中对象的 dataId属性和dataName属性变为id和name
         */
        changeObjectArrayFieldName: function (objectArray = [], fieldMap = {}) {
            for (var i = 0; i < objectArray.length; i++) {
                var element = objectArray[i];
                for (let key in fieldMap) {
                    if (fieldMap.hasOwnProperty(key)) {
                        element[fieldMap[key]] = element[key];
                        delete element[key];
                    }
                }
            }
            return objectArray;
        }
    };
});