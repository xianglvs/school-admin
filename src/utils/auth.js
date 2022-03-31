import Cookies from "js-cookie";

const TokenKey = "token";
const TicketKey = "ticket";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function setTicket(ticket) {
  return Cookies.set(TicketKey, ticket);
}

export function getTicket() {
  return Cookies.get(TicketKey);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
