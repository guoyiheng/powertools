import Vue from 'vue'

export const setLocalVariable = function(name, value) {
  localStorage.setItem(name, value)
}

export const getLocalVariable = function(name) {
  return localStorage.getItem(name)
}

export const removeLocalVariable = function(name) {
  return localStorage.removeItem(name)
}

Vue.prototype.$setLocal = setLocalVariable
Vue.prototype.$getLocal = getLocalVariable
Vue.prototype.$rmLocal = removeLocalVariable
