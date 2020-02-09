import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer, { restoreSessionAction } from './userDuck';
import Charsreducers, { getCharactersAction } from './charsDuck';

const rootReducer = combineReducers({
	user: userReducer,
	characters: Charsreducers
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
	const store = createStore(
		rootReducer,
		composeEnhancers(applyMiddleware(thunk))
	);
	getCharactersAction()(store.dispatch, store.getState);
	restoreSessionAction()(store.dispatch);
	return store;
}
