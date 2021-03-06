import request from "@/utils/request";

export async function login(data) {
  try {
    const res = await request({
      url: "/api/user/login",
      method: "post",
      data
    });
    if (res.code !== 0) {
      return Promise.resolve(res);
    }
    const res1 = await request({
      url: "/api/user/token",
      method: "post",
      data: {
        ticket: res.data.ticket
      }
    });
    return Promise.resolve(res1);
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getInfo(token) {
  return request({
    url: "/api/user/info",
    method: "get",
    params: {
      token
    }
  });
}

export function updateUser(data) {
  return request({
    url: "/api/user",
    method: "put",
    data
  });
}

export function getUserList(params) {
  return request({
    url: "/api/user/list",
    method: "get",
    params
  });
}

export function addUser(data) {
  return request({
    url: "/api/user",
    method: "post",
    data
  });
}

export function delUser(params) {
  return request({
    url: "/api/user",
    method: "DELETE",
    params
  });
}

export function updatePassword(data) {
  return request({
    url: "/api/user/password",
    method: "put",
    data
  });
}