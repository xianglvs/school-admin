import request from "@/utils/request";

export function getRolesList(params) {
  return request({
    url: "/api/role/all",
    method: "get",
    params
  });
}
