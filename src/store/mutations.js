// 初始化用户基本信息
export const setUserInfo = (state, val) => {
  state.userInfo = val
}

// 修改当前笔记标识
export const setActiveNote = (state, val) => {
  state.activeNote = val
}
// 修改当前笔记信息
export const setActiveNoteInfo = (state, val) => {
  state.activeNoteInfo = val
}
// 修改当前分区标识
export const setActiveArea = (state, val) => {
  state.activeArea = val
}
// 修改当前分区信息
export const setActiveAreaInfo = (state, val) => {
  state.activeAreaInfo = val
}
// 修改当前页面标识
export const setActivePage = (state, val) => {
  state.activePage = val
}
// 修改当前页面信息
export const setActivePageInfo = (state, val) => {
  state.activePageInfo = val
}
// 修改页面颜色
export const setPageBackground = (state, val) => {
  state.pageBackground = val
}

// 修改页面缩放
export const setPageScale = (state, val) => {
  state.pageScale = val
}