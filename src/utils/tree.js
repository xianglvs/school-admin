/**
 * json数组打包树型,指定根节点值(根节点父类Id的值)
 * @param {*} config
 */
export const jsonToTreeByRoot = (config = {
  rootId: 0,
  json: [],
  idKey: 'id',
  pidKey: 'parentId',
  childKey: 'children',
  keepChild: true,
  validate: row => {
    return true
  }
}) => {
  const defaultConfig = {
    rootId: 0,
    json: [],
    idKey: 'id',
    pidKey: 'parentId',
    childKey: 'children',
    keepChild: true,
    validate: row => {
      return true
    }
  }
  config = Object.assign(defaultConfig, config)
  let array = []
  config.json && config.json.forEach((element) => {
    if (element[config.pidKey] === config.rootId && config.validate(element)) {
      array.push(element)
    }
  })
  array.forEach((element) => {
    config.rootId = element[config.idKey]
    element[config.childKey] = jsonToTreeByRoot(config)
  })
  if (!config.keepChild && array.length === 0) {
    array = null
  }
  return array
}

const hasParent = (pid, idKey, json) => {
  for (var index = 0; index < json.length; index++) {
    var element = json[index]
    if (element[idKey] === pid) {
      return true
    }
  }
  return false
}

/**
 * json数组打包树型,自动计算根节点
 * @param {*} config
 */
export const jsonToTree = (config = {
  json: [],
  idKey: 'id',
  pidKey: 'parentId',
  childKey: 'children',
  keepChild: true,
  validate: row => {
    return true
  }
}) => {
  const defaultConfig = {
    json: [],
    idKey: 'id',
    pidKey: 'parentId',
    keepChild: true,
    childKey: 'children',
    validate: row => {
      return true
    }
  }
  config = Object.assign(defaultConfig, config)
  let array = []
  config.json && config.json.forEach(element => {
    const pid = element[config.pidKey]
    if (!config.validate(element)) {
      return
    }
    if (pid == null || pid.toString().trim().length === 0) {
      array.push(element)
      return
    }
    if (!hasParent(element[config.pidKey], config.idKey, config.json)) {
      array.push(element)
    }
  })
  array.forEach(element => {
    config.rootId = element[config.idKey]
    element[config.childKey] = jsonToTreeByRoot(config)
  })
  if (!config.keepChild && array.length === 0) {
    array = null
  }
  return array
}
