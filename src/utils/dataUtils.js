'use strict';
/* global define */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('dataUtils', factory);
    } else if (typeof exports === 'object') {
        exports = module.exports = factory();
    } else {
        root.dataUtils = factory();
    }
})(this, function() {
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
        jsonToTree: function(config) {
            var jsonToTreeByRoot = function(config) {
                var defaultConfig = {
                    rootId: 0,
                    json: [],
                    idKey: 'id',
                    pidKey: 'parentId',
                    childKey: 'children',
                    keepChild: true,
                    validate: function(row) {
                        return true;
                    }
                };
                config = Object.assign(defaultConfig, config);
                var array = [];
                if (config.json) {
                    config.json = JSON.parse(JSON.stringify(config.json));
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

            var hasParent = function(pid, idKey, json) {
                for (var index = 0; index < json.length; index++) {
                    var element = json[index];
                    if (element[idKey] == pid) {
                        return true;
                    }
                }
                return false;
            };
            var defaultConfig = {
                json: [],
                idKey: 'id',
                pidKey: 'parentId',
                keepChild: true,
                childKey: 'children',
                validate: function(row) {
                    return true;
                }
            };
            config = Object.assign(defaultConfig, config);
            if (config.rootId !== null && config.rootId !== undefined) {
                return jsonToTreeByRoot(config);
            }
            var array = [];
            if (config.json) {
                for (var i = 0; i < config.json.length; i++) {
                    var element = config.json[i];
                    var pid = element[config.pidKey];
                    if (!config.validate(element)) {
                        return;
                    }
                    if (pid == null || pid.toString().trim().length == 0) {
                        array.push(element);
                        return;
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
            if (!config.keepChild && array.length == 0) {
                array = null;
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
        objectArrayToFieldArray: function(objectArray, fields) {
            if (!objectArray) {
                objectArray = [];
            }
            var resultArray = {};
            for (var x = 0; x < objectArray.length; x++) {
                var element = objectArray[x];
                for (var i = 0; i < fields.length; i++) {
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
        changeObjectArrayFieldName: function(objectArray, fieldMap, isDelete) {
            objectArray = JSON.parse(JSON.stringify(objectArray));
            for (var i = 0; i < objectArray.length; i++) {
                var element = objectArray[i];
                for (var key in fieldMap) {
                    if (fieldMap.hasOwnProperty(key)) {
                        element[fieldMap[key]] = element[key];
                        isDelete && delete element[key];
                    }
                }
            }
            return objectArray;
        },
        /**
         * @param number 要格式化的数字
         * @param decimals 要保留的数字位数 不传表示不处理小数位原样输出,0表示只保留整数
         * @param model zerofill 不足指定小数位用0补足, removeDecimalsZerofill 去除小数点后面多余的0(默认值)
         * 例如:number = 100000,decimals=4,则结果100,000.0000
         */
        toLocaleString: function(number, decimals, model) {
            if (number == null || isNaN(number)) {
                return null;
            }
            number += '';
            var array = number.split('.');
            var before = array[0];
            var after = array.length > 1 ? array[1] : '';
            before = Number(before).toLocaleString();
            var j = before.indexOf('.');
            // fix ie9,10 two decimals bug
            if (j > -1) {
                before = before.substring(0, i);
            }
            var removeLastZero = function(str) {
                if (str == null) {
                    return '';
                }
                str += '';
                while (str.length > 0 && str.lastIndexOf('0') == str.length - 1) {
                    str = str.substring(0, str.length - 1);
                }
                return str;
            };
            if (decimals == null) {
                return before + (after.length > 0 ? '.' + after : '');
            }
            if (model != 'zerofill') {
                after = removeLastZero(after);
            }
            if (after.length > decimals) {
                after = after.substring(0, decimals);
                if (model != 'zerofill') {
                    after = removeLastZero(after);
                }
                return before + (after.length > 0 ? '.' + after : '');
            }
            if (model == 'zerofill') {
                var length = after.length;
                for (var i = 0; i < decimals - length; i++) {
                    after += '0';
                }
            }
            if (after.length == 0) {
                return before + '';
            }
            return before + '.' + after;
        },
        html2Escape: function(html) {
            if (typeof html != 'string' || html == null || html.length == 0) {
                return html;
            }
            return html.replace(/[<>&"]/g, function(c) {
                return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
            });
        },

        escape2Html: function(str) {
            if (typeof str != 'string' || str == null || str.length == 0) {
                return str;
            }
            var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
            return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
                return arrEntities[t];
            });
        }
    };
});
