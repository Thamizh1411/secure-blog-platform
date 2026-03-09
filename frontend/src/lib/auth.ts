export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}