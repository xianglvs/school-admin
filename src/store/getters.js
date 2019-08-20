const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user,
  permission_routes: state => state.permission.routes
}
export default getters
