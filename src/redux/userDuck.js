// constanst
const initialData = {
	loggedIn: false
};
const LOGIN = 'LOGIN';
// reducer
export default function reducer(state = initialData, action) {
	switch (action.type) {
		case LOGIN:
			return state;
		default:
			return state;
	}
}
// action (action creator)
