import { loginWithGoogle, signOutGoogle } from '../firebase';
import { retrieveFavs } from './charsDuck';

// constants
const initialData = {
	loggedIn: false,
	fetching: false
};
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT = 'LOGOUT';

// reducer
export default function reducer(state = initialData, action) {
	switch (action.type) {
		case LOGOUT:
			return { ...initialData };
		case LOGIN:
			return { ...state, fetching: true };
		case LOGIN_SUCCESS:
			return {
				...state,
				fetching: false,
				...action.payload,
				loggedIn: true
			};
		case LOGIN_ERROR:
			return { ...state, fetching: false, error: action.payload };

		default:
			return state;
	}
}

// aux
function saveStorage(storage) {
	localStorage.storage = JSON.stringify(storage);
}

// action (action creator)

export const logOutAction = () => (dispatch, getState) => {
	signOutGoogle();
	dispatch({
		type: LOGOUT
	});

	localStorage.removeItem('storage');
};
export const restoreSessionAction = () => dispatch => {
	const stringStorage = localStorage.getItem('storage');
	const storage = JSON.parse(stringStorage);
	console.log('storage', storage);
	if (storage && storage.user) {
		dispatch({
			type: LOGIN_SUCCESS,
			payload: storage.user
		});
	}
};

export const doGoogleLoginAction = () => (dispatch, getState) => {
	dispatch({
		type: LOGIN
	});
	return loginWithGoogle()
		.then(user => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: {
					uid: user.uid,
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL
				}
			});
			saveStorage(getState());
			retrieveFavs()(dispatch, getState);
		})
		.catch(err => {
			dispatch({
				type: LOGIN_ERROR,
				payload: err.message
			});
		});
};
