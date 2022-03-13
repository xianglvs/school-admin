import request from "@/utils/request";

export async function getHome(token) {
  return request({
    url: "/api/home",
    method: "get",
    params: {}
  });
}

export function updateHome(data) {
  return request({
    url: "/api/home",
    method: "put",
    data
  });
}
