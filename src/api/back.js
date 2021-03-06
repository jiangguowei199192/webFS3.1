// 后台管理系统
export const backApi = {
  getDeptTree: '/cloud-fms/dept/getDeptTree', // 查询组织树
  getPeoplePage: '/cloud-fms/employee/selectPage', // 查询人员列表
  addPeople: '/cloud-fms/employee/add', // 新增人员
  peopleInfo: '/cloud-fms/employee/selectDetail', // 查看人员信息
  deletePeople: '/cloud-fms/employee/del', // 批量删除人员
  editPeople: '/cloud-fms/employee/update', // 编辑人员信息
  deleteDept: '/cloud-fms/dept/del', // 删除组织
  addDept: '/cloud-fms/dept/add',
  deptInfo: '/cloud-fms/dept/selectDetail',
  editDept: '/cloud-fms/dept/update'
}
