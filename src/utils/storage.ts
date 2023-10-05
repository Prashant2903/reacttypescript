
const KEY = {
  LANG: '@i18nextLng'
}

/**
 * Unify here to define how all local information on the website is accessed.
 * Avoid subsequent changes in access locations that may affect too many programs
 */

export default {

  /**
   * Website language
   */
  get lang() {
    return window.localStorage.getItem(KEY.LANG) || ''
  },
  set lang(value) {
    if (value) window.localStorage.setItem(KEY.LANG, value)
    else window.localStorage.removeItem(KEY.LANG)
  }

}
