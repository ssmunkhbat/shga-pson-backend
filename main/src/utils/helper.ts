const moment = require("moment");

export function getFilter(mainAlias, searches: any[]) {
  let result = ''
  const filterCount = searches.length
  for (let filterIndex = 0; filterIndex < filterCount; filterIndex++) {
    const item = searches[filterIndex]
    if (item.value) {
      const val = item.type === 'string' ? item.value.trim() : item.value
      const field = `${!item.field.includes('.') ? mainAlias+'.' : ''}${item.refField ? item.refField : item.field}`

      if (item.type === 'number') {
        result += ` ${field} = ${val} `
      } else if (item.type === 'string') {
        result += ` UPPER(${field}) like UPPER('%${val}%') `
      } else if (item.type === 'date') {
        result += ` ${field} BETWEEN TO_DATE('${moment(val[0]).format('YYYY-MM-DD')}', 'YYYY-MM-DD') AND TO_DATE('${moment(val[1]).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`
      } else if (item.type === 'ref') {
        if(Array.isArray(val)) {
          result += ` ${field} in (${val}) `
        } else {
          result += ` ${field} = ${val} `
        }
      } else {
        result += ` ${field} like '${val}' `
      }
      const lastIndex = filterCount - 1
      if (filterCount > 1 && filterIndex < lastIndex) {
        result += ' and'
      }
    }
  }
  return result
}