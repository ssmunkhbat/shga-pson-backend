const moment = require("moment");
export function getSortFieldAndOrder (mainAlias, sortParam) {
  const sort = JSON.parse(sortParam)
  if (!sort?.field) {
    return { field: null, }
  }
  const field : string = `${!sort.field.includes('.') ? mainAlias+'.' : ''}${sort.refField ? sort.refField : sort.field}`
  const order : 'ASC' | 'DESC' = ['desc', 'descending'].includes(sort.order?.toLowerCase()) ? 'DESC' : 'ASC'
  return {
    field,
    order
  }
}
export function getFilterAndParameters (mainAlias, searchParam: string) {
  const searches = JSON.parse(searchParam)
  const whereStrs = []
  const parameters = {}
  for (const item of searches.filter(c => c.value)) {
    const field : string = `${!item.field.includes('.') ? mainAlias+'.' : ''}${item.refField ? item.refField : item.field}`
    const val : any = item.value
    const type : string = item.type
    if (type === 'string') {
      whereStrs.push(`UPPER(${field}) LIKE :${field}`)
      parameters[field] = `%${val.trim().toUpperCase()}%`
    } else if (['date', 'datetime'].includes(type)) {
      if (Array.isArray(val)) {
        const startDate = moment(val[0]).format('YYYY-MM-DD')
        const endDate = moment(val[1]).format('YYYY-MM-DD')
        whereStrs.push(`TRUNC(${field}) BETWEEN TO_DATE(:${field}1, 'YYYY-MM-DD') AND TO_DATE(:${field}2, 'YYYY-MM-DD')`)
        parameters[field + '1'] = startDate
        parameters[field + '2'] = endDate
      } else {
        const date = moment(val).format('YYYY-MM-DD')
        whereStrs.push(`TRUNC(${field}) = TO_DATE(:${field}, 'YYYY-MM-DD')`)
        parameters[field] = date
      }
    } else if (item.type == 'number') {
      if (Array.isArray(val)) {
        whereStrs.push(`${field} BETWEEN :${field}1 AND :${field}2`)
        parameters[field + '1'] = val[0]
        parameters[field + '2'] = val[1]
      } else {
        whereStrs.push(`${field} = :${field}`)
        parameters[field] = val[0]
      }
    }
  }
  return {
    filter: whereStrs.join(' AND '),
    parameters
  }
}
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
          result += ` ${field} = '${val}' `
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