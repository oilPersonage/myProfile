import { createStore } from 'redux';

import reducer from '../utils/reducer';

const store = createStore(reducer);

export default store;
