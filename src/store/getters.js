const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.info && state.user.info.token,
  user: state => state.user.info,
  menus: state => state.user.info && state.user.info.menus,
  roles: state => state.user.info && state.user.info.roles,
  permission_routes: state => state.permission.routes
}
export default getters;
