import actions from '@/shared/actions'
import EventBus from './eventBus'

function addVisitedView(view) {
  let visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
  if (visitedViews && visitedViews.some(v => v.fullPath === view.fullPath)) return
  if (visitedViews && visitedViews.some(v => v.path === view.path)) {
    visitedViews.forEach(v => {
      if (v.path === view.path) {
        v.fullPath = view.fullPath
      }
    })
  } else {
    sessionStorage.setItem('visitedViews', JSON.stringify([]))
    visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
    const handleView = {
      name: view.name,
      path: view.path,
      query: view.query,
      params: view.params,
      fullPath: view.fullPath,
      meta: view.meta
    }
    visitedViews.push(handleView)
  }

  actions.setGlobalState({ visitedViews })
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
  EventBus.$emit('setRouteCache')
}

function delVisitedView(view) {
  const visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
  for (const [i, v] of visitedViews.entries()) {
    if (v.path === view.path) {
      visitedViews.splice(i, 1)
      break
    }
  }
  actions.setGlobalState({ visitedViews })
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
  EventBus.$emit('setRouteCache')
}

function updateVisitedView(view) {
  const visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
  for (let v of visitedViews) {
    if (v.path === view.path) {
      v = Object.assign(v, view)
      break
    }
  }
  sessionStorage.setItem('visitedViews', JSON.stringify(visitedViews))
}

export const routeCache = {
  addVisitedView,
  delVisitedView,
  updateVisitedView
}
