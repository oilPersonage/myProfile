const scroll = {
  from: 1,
  to: 1,
};

export default function reducer(state = scroll, action) {
  if (action.type === 'SCROLL') {
    return { ...state, from: action.payload.from, to: action.payload.to };
  }
  return state;
}
