const menu = {
  show: false,
  animation: false,
};

export default function reducer(state = menu, action) {
  if (action.type === 'MENU') {
    return { ...state, show: !state.show};
  }
  if (action.type === 'AnimationFadeIn') {
    return { ...state,  animation: !state.animation};
  }
  return state;
}
