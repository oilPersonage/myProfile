const menu = {
  show: false,
  animation: false,
};

export default function reducer(state = menu, action) {
  if (action.type === 'MENU') {
    return { ...state, show: action.payload};
  }
  if (action.type === 'AnimationFadeIn') {
    console.log(state)
    return { ...state,  animation: !state.animation};
  }
  return state;
}
