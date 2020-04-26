import {$axios} from "../axios";

/*****************************用户管理，用户列表相关接口**************************/
//用户数据列表数据
export function UserListData(query, pagenum, pagesize) {
  return $axios({
    url: '/users',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

//用户用户状态
export function UpdataUserState(uid, type) {
  return $axios({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}

//添加用户
export function AddUserInfo(obj) {
  return $axios({
    url: '/users',
    method: 'post',
    data: {
      username: obj.username,
      password: obj.password,
      email: obj.email,
      mobile: obj.mobile
    }
  })
}

//根据用户id查询用户信息
export function IdGetUserData(id) {
  return $axios({
    url: `users/${id}`,
    method: 'get',
  })
}

//编辑修改用户信息提交
export function ModifyUserData(id, email, mobile) {
  return $axios({
    url: `users/${id}`,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

//删除单个用户
export function DeleteUser(id) {
  return $axios({
    url: `users/${id}`,
    method: 'delete'
  })
}


//分配角色
export function FenpeiRole(userID, rid) {
  return $axios({
    url: `users/${userID}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}

/*****************************用户权限，角色列表相关接口**************************/
//获取角色列表数据
export function getRolesData() {
  return $axios({
    url: '/roles',
    method: 'get'
  })
}

//删除角色指定权限
export function removeRolesPerId(roleId, rightId) {
  return $axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}


//删除角色
export function removeRole(id) {
  return $axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}


//角色授权
export function RolesAuthor(roleId, rids) {
  return $axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}


//根据ID查询角色
export function IdgetRoleData(id) {
  return $axios({
    url: `roles/${id}`,
    method: 'get'
  })
}


//提交编辑
export function IdsetRoleData(id, roleName, roleDesc) {
  return $axios({
    url: `roles/${id}`,
    method: 'put',
    data: {
      roleName,
      roleDesc
    }
  })
}

//添加角色
export function addRolesList(roleName, roleDesc) {
  return $axios({
    url: '/roles',
    method: 'post',
    data: {
      roleName,
      roleDesc
    }
  })
}

/*****************************用户权限，权限列表相关接口**************************/
//获取权限列表数据
export function getRightsData(type) {
  return $axios({
    url: `rights/${type}`,
    method: 'get'
  })
}


/*****************************数据统计，数据报表相关接口**************************/
//获取数据报表数据
export function getReportsData() {
  return $axios({
    url: 'reports/type/1',
    method: 'get'
  })
}

/*****************************商品管理，商品列表相关接口**************************/
//获取商品列表数据
export function getGoodsListData(query, pagenum, pagesize) {
  return $axios({
    url: 'goods',
    method: 'get',
    params: {
      query,//查询参数
      pagenum,//当前页码
      pagesize //每页显示条数
    }
  })
}

//删除商品
export function removeGoods(id) {
  return $axios({
    url: `goods/${id}`,
    method: 'delete'
  })
}

/*****************************商品管理，商品分类相关接口**************************/
//获取商品分类数据列表
export function getGoodCateGoriesData(type, pagenum, pagesize) {
  return $axios({
    url: 'categories',
    method: 'get',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}

//获取父级分类数据列表
export function getParentCateData(type) {
  return $axios({
    url: 'categories',
    method: 'get',
    params: {
      type
    }
  })
}

//添加分类
export function addCate(cat_pid, cat_name, cat_level) {
  return $axios({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}

//删除分类
export function removeCate(id) {
  return $axios({
    url: `categories/${id}`,
    method: 'delete'
  })
}

//根据 id 查询分类
export function idGetCate(id) {
  return $axios({
    url: `categories/${id}`,
    method: 'get'
  })
}

//提交编辑
export function submitCate(id, cat_name) {
  return $axios({
    url: `categories/${id}`,
    method: 'put',
    data: {
      cat_name
    }
  })
}


/*****************************商品管理，分类参数相关接口**************************/
//获取参数列表数据
export function getParamsData(id, sel) {
  return $axios({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: {
      sel
    }
  })
}

//添加动态参数或者静态属性
export function addFormData(id, attr_name, attr_sel) {
  return $axios({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name,
      attr_sel
    }
  })
}

//根据 ID 查询参数
export function idGetParamsData(id, attrId, attr_sel) {
  return $axios({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'get',
    params: {
      attrId,
      attr_sel
    }
  })
}

// 编辑提交参数
export function submitParamsData(id, attrId, attr_name, attr_sel) {
  return $axios({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: {
      attr_name,
      attr_sel
    }
  })
}

// 删除参数
export function removeParamsList(id, attrId) {
  return $axios({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete',
    
  })
}


//Tag标签编辑提交参数
export function addTagParamsData(id, attrId, attr_name, attr_sel, attr_vals) {
  return $axios({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}