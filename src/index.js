import { createElement, render, renderDOM } from './virtualDom.js'
import domDiff from './domDiff.js'
import doPatch from './doPatch.js'

const vDomOld = createElement('ul', {
  class: 'list1',
  style: 'width: 300px;height: 300px; background-color: orange',
}, [
  createElement('li', {
    class: 'item',
    'data-index': 0
  }, [
    createElement('p', { class: 'text' }, ['第1个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 1
  }, [
    createElement('p', { class: 'text' }, ['第2个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 2
  }, [
    createElement('p', { class: 'text' }, ['第3个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 3
  }, [
    createElement('p', { class: 'text' }, ['第4个列表项'])
  ])
]
)

const rDom = render(vDomOld)
renderDOM(rDom, document.getElementById('app'))

var vDomNew = createElement('ul', {
  class: 'list2',
  style: 'width: 300px;height: 300px; background-color: orange',
}, [
  createElement('li', {
    class: 'item',
    'data-index': 0
  }, [
    createElement('p', { class: 'text' }, ['第1个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 1
  }, [
    createElement('p', { class: 'text' }, ['第2个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 2
  }, [
    createElement('p', { class: 'text' }, ['第3个列表项'])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 3
  }, [
    createElement('h1', { class: 'text' }, ['越难越爱', '---'])
  ])
])

const patches = domDiff(vDomOld, vDomNew)
console.log(patches);
doPatch(rDom, patches)

