import {
  ATTR,
  TEXT,
  REPLACE,
  REMOVE
} from './patchTypes.js'

let patches = {};
let vnIndex = 0;

function domDiff(oldVDom, newVDom) {
  let index = 0;
  vNodeWalk(oldVDom, newVDom, index)
  return patches;
}

function vNodeWalk(oldNode, newNode, index) {
  let vnPatch = [];
  if (!newNode) {
    // 被删除
    vnPatch.push({
      type: REMOVE,
      index
    })
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    //两个节点都是文本节点 比较文本内容
    if (oldNode !== newNode) {
      // 更新
      vnPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type === newNode.type) {
    // 组件名一样
    // 对比props
    const attrPath = attrsWalk(oldNode.props, newNode.props);
    // 有差异
    if (Object.keys(attrPath).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPath
      })
    }
    childrenWalk(oldNode.children, newNode.children)
  } else {
    // 替换
    vnPatch.push({
      type: REPLACE,
      newNode
    })
  }
  if (vnPatch.length > 0) {
    patches[index] = vnPatch;
  }
}
// 对比属性异同
function attrsWalk(oldAttrs, newAttrs) {
  let attrPath = {};
  for (let key in oldAttrs) {
    // 修改
    if (oldAttrs[key] !== newAttrs[key]) {
      attrPath[key] = newAttrs[key]
    }
  }
  for (let key in newAttrs) {
    // 添加
    if (!oldAttrs.hasOwnProperty(key)) {
      attrPath[key] = newAttrs[key]
    }
  }
  return attrPath;
}
// 对比儿子异同
function childrenWalk(oldChildren, newChildren) {
  oldChildren.map((children, index) => {
    vNodeWalk(children, newChildren[index], ++vnIndex)
  })
}
export default domDiff;
