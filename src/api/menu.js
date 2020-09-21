import request from "@/utils/request";

export function getAllMenuList(params) {
  return request({
    url: "/api/menu/all",
    method: "get",
    params
  });
}
