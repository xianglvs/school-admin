import request from "@/utils/request";

export function getRolesList(params) {
  return request({
    url: "/api/role/all",
    method: "get",
    params
  });
}

export function getRolesPage(params) {
  return request({
    url: "/api/role/page",
    method: "get",
    params
  });
}

export function addRole(data) {
  return request({
    url: "/api/role",
    method: "post",
    data
  });
}

export function updateRole(data) {
  return request({
    url: "/api/role",
    method: "put",
    data
  });
}

export function delRole(params) {
  return request({
    url: "/api/role",
    method: "delete",
    params
  });
}

export function getRole(roleId) {
  return request({
    url: `/api/menu/role/${roleId}`,
    method: "get"
  });
}
