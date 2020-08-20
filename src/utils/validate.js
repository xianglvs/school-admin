/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"]
  return valid_map.indexOf(str.trim()) >= 0
}

export function validPassword(rule, value, callback) {
  const reg = /^(\w){6,20}$/;
  if (!reg.test(value) && value != "") {
    callback(new Error("只能输入6-20个字母、数字、下划线 "));
  } else {
    callback();
  }
}

export function validPhone(rule, value, callback) {
  if (!value) {
    return callback(new Error("请输入手机号"));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的手机号"));
    }
  }
}

export function validQQ(rule, value, callback) {
  const reg = /^[1-9][0-9]{4,14}/;
  if (!reg.test(value) && value != "") {
    callback(new Error("请输入正确的QQ格式"));
  } else {
    callback();
  }
}

export function validEmail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  if (!reg.test(value) && value != "") {
    callback(new Error("请输入正确的邮箱格式"));
  } else {
    callback();
  }
}
