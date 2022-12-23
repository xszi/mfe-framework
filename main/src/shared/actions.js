// micro-app-main/src/shared/actions.js
import { initGlobalState } from 'qiankun'

const initialState = {
  visitedViews: []
}

const actions = initGlobalState(initialState)

export default actions
