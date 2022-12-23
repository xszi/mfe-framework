const getters = {
  sidebar: state => state.app?.sidebar,
  device: state => state.app?.device,
  globalLoading: state => state.app.globalLoading,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
