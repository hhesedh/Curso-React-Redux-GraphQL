import { updateDB, getFavs } from '../firebase';
import ApolloClient, { gql } from 'apollo-boost';

// constants
const initialData = {
	fetching: false,
	fetchingFavorites: false,
	array: [],
	current: {},
	favorites: [],
	nextPage: 1
};
const client = new ApolloClient({
	uri: 'https://rickandmortyapi.com/graphql'
});

const UPDATE_PAGE = 'UPDATE_PAGE';

const GET_CHARACTERS = 'GET_CHARACTERS';
const GET_CHARACTERS_SUCCESS = 'GET_CHARACTERS_SUCCESS';
const GET_CHARACTERS_ERROR = 'GET_CHARACTERS_ERROR';

const REMOVE_CHARACTER = 'REMOVE_CHARACTER';
const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';

const GET_FAVS = 'GET_FAVS';
const GET_FAVS_SUCCESS = 'GET_FAVS_SUCCESS';
const GET_FAVS_ERROR = 'GET_FAVS_ERROR';

// reducer
export default function reducer(state = initialData, action) {
	switch (action.type) {
		case UPDATE_PAGE:
			return { ...state, nextPage: action.payload };
		case GET_FAVS:
			return { ...state, fetchingFavorites: true };
		case GET_FAVS_ERROR:
			return {
				...state,
				fetchingFavorites: false,
				error: action.payload
			};
		case GET_FAVS_SUCCESS:
			return {
				...state,
				fetchingFavorites: false,
				favorites: action.payload
			};
		case ADD_TO_FAVORITES:
			return { ...state, ...action.payload };
		case REMOVE_CHARACTER:
			return { ...state, array: action.payload };
		case GET_CHARACTERS:
			return { ...state, fetching: true };
		case GET_CHARACTERS_ERROR:
			return { ...state, fetching: false, error: action.payload };
		case GET_CHARACTERS_SUCCESS:
			return { ...state, array: action.payload, fetching: false };
		default:
			return state;
	}
}
// actions (thunks)
export const retrieveFavs = () => (dispath, getState) => {
	dispath({
		type: GET_FAVS
	});
	const { uid } = getState().user;

	return getFavs(uid)
		.then(array => {
			dispath({
				type: GET_FAVS_SUCCESS,
				payload: [...array]
			});
		})
		.catch(err => {
			console.log(err);
			dispath({
				type: GET_FAVS_ERROR,
				payload: err.message
			});
		});
};
export const addToFavoritesAction = () => (dispatch, getState) => {
	const { array, favorites } = getState().characters;
	const { uid } = getState().user;
	const char = array.shift();

	favorites.push(char);
	updateDB(favorites, uid);

	dispatch({
		type: ADD_TO_FAVORITES,
		payload: { array: [...array], favorites: [...favorites] }
	});

	if (!array.length) {
		getCharactersAction()(dispatch, getState);
	}
};

export const removeCharacterAction = () => (dispatch, getState) => {
	const { array } = getState().characters;
	array.shift();

	if (!array.length) {
		getCharactersAction()(dispatch, getState);
		return;
	}

	dispatch({
		type: REMOVE_CHARACTER,
		payload: [...array]
	});
};

export const getCharactersAction = () => (dispatch, getState) => {
	const query = gql`
		query($page: Int) {
			characters(page: $page) {
				info {
					pages
					next
					prev
				}

				results {
					name
					image
				}
			}
		}
	`;

	dispatch({
		type: GET_CHARACTERS
	});

	const { nextPage } = getState().characters;

	return client
		.query({ query, variables: { page: nextPage } })
		.then(({ data, error }) => {
			if (error) {
				dispatch({
					type: GET_CHARACTERS_ERROR,
					payload: error
				});
				return;
			}

			dispatch({
				type: GET_CHARACTERS_SUCCESS,
				payload: data.characters.results
			});

			dispatch({
				type: UPDATE_PAGE,
				payload: data.characters.info.next
					? data.characters.info.next
					: 1
			});
		});

	/* 	dispatch({
		type: GET_CHARACTERS
	});
	return axios
		.get(URL)
		.then(res => {
			dispatch({
				type: GET_CHARACTERS_SUCCESS,
				payload: res.data.results
			});
		})
		.catch(err => {
			console.log(err);
			dispatch({
				type: GET_CHARACTERS_ERROR,
				payload: err.response.message
			});
		}); */
};
