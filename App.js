// In App.js in a new project

import * as React from 'react';
import MainNavigation from './navigation/MainNavigation';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import Auth from './store/reducer/Auth';
import user from './store/reducer/user';
import Debt from './store/reducer/Debt';

export const LINKBASE =
  'https://ghino-a0fa1-default-rtdb.asia-southeast1.firebasedatabase.app/';

const rootReducer = combineReducers({
  auth: Auth,
  user: user,
  debt: Debt,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
function App() {
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
  );
}

export default App;
