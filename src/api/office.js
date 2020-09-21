import request from "@/utils/request";

export function getAllOfficeList(params) {
  return request({
    url: "/api/office/all",
    method: "get",
    params
  });
}
