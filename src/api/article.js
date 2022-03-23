import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/api/article/list",
    method: "get",
    params
  });
}
export function getDetail(id) {
  return request({
    url: `/api/article/${id}`,
    method: "get"
  });
}
export function updateArticle(data) {
  return request({
    url: "/api/article",
    method: "put",
    data
  });
}

export function addArticle(data) {
  return request({
    url: "/api/article",
    method: "post",
    data
  });
}

export function delArticle(params) {
  return request({
    url: "/api/article",
    method: "DELETE",
    params
  });
}

export function setImageIds(data) {
  return request({
    url: "/api/file/set/paths",
    method: "put",
    data
  });
}
