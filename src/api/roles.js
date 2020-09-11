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
