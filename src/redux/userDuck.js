import { loginWithGoogle } from '../firebase';

// constants
const initialData = {
	loggedIn: false,
	fetching: false
};
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

// reducer
export default function reducer(state = initialData, action) {
	switch (action.type) {
		case LOGIN:
			return { ...state, fetching: true };
		case LOGIN_SUCCESS:
			return { ...state, fetching: false, ...action.payload };
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
export const doGoogleLoginAction = () => (dispatch, getState) => {
	dispatch({
		type: LOGIN
	});
	return loginWithGoogle()
		.then(user => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: { ...user }
			});
			saveStorage(getState);
		})
		.catch(err => {
			dispatch({
				type: LOGIN_ERROR,
				payload: err.message
			});
		});
};
