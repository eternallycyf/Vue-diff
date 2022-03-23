import {
  ATTR,
  TEXT,
  REPLACE,
  REMOVE
} from './patchTypes.js';
import { setAttrs, render } from './virtualDom.js';
import Element from "./Element.js";
let finalPatches = {},//储存patches
  rnIndex = 0;//真实节点index
function doPatch(rDom, patches) {
  finalPatches = patches;
  rNodeWalk(rDom)
}
// 处理真实节点
function rNodeWalk(rNode) {
  const rnPath = finalPatches[rnIndex++],
    childNodes = rNode.childNodes;
  //子节点为类数组
  [...childNodes].map((childrenNode) => {
    rNodeWalk(childrenNode)
  })
  // 判断是否需要更新节点
  if (rnPath) {
    patchAction(rNode, rnPath);//当前节点所对应的需要更新的内容
  }
}
function patchAction(rNode, rnPath) {
  rnPath.map(path => {
    switch (path.type) {
      case ATTR:
        for (let key in path.attrs) {
          const value = path.attrs[key];
          // 之前有的，现在有的->添加更新
          if (value) {
            setAttrs(rNode, key, value)
          } else {
            // 之前有的，现在没了 ->删除
            rNode.removeAttribute(key)
          }
        }
        break
      case TEXT:
        // 设置节点文本内容
        rNode.textContent = path.text
        break
      case REPLACE:
        // 判断是否被Element构造出来的，不是那会是文本节点，是的话直接给render转换成真实节点
        const newNode = (path.newNode instanceof Element)
          ? render(path.newNode)
          : document.createTextNode(path.newNode);
        // 替换真实节点
        rNode.parentNode.replaceChild(newNode, rNode);
        break
      case REMOVE:
        // 找到父亲杀儿子
        rNode.parentNode.removeChild(rNode);
        break
      default:
        break
    }
  })
}
export default doPatch;
