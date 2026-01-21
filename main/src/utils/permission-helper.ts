export const getPermissionData = (user: any) => {
  return {
    userId: user.userId,
    personId: user.personId,
    roleId: user.userRole ? user.userRole.roleId : null,
    departmentId: user.employeeKey ? user.employeeKey.departmentId : null,
    employeeId: user.employeeKey ? user.employeeKey.employeeId : null,
    employeeKeyId: user.employeeKey ? user.employeeKey.employeeKeyId : null,
  }
}

export const getPermissionFilter = (departmentId: number, alias: string, filterCol) => {
  let where = null;
  if (departmentId) {
    where = ` ${alias}.${filterCol} = ${departmentId} `
  }
  return where;
}