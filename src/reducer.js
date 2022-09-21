const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return {
        user: null,
        token: null,
        isLogged: false,
        site: '',
      }
    }
    return JSON.parse(serializedState)
  } catch (e) {
    return undefined
  }
}

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (e) {
    // Ignore write errors;
  }
}

export const initialState = loadState()

const reducer = (state, action) => {
  console.log(action)

  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      }
    case 'SET_TOKEN':
      saveState({
        ...state,
        token: action.token,
      })
    case 'SET_SITE':
      saveState({
        ...state,
        site: action.site,
      })
      return {
        ...state,
        token: action.token,
      }
    default:
      return state
  }
}

export default reducer
