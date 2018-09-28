const menu = {
  active: 1,
};

export default function reducer(state = menu, action) {
  if (action.type === 'MENU') {
    return { ...state, active: action.payload };
  }
  return state;
}
