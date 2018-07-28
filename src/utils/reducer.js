import { combineReducers } from 'redux';
import menu from '../reducers/menu';
import scroll from '../reducers/scroll';

export default combineReducers({
  menu,
  scroll,
});
