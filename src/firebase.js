import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCjyVXdVCt8HfwPN-nmJTWXBU3G0MwWHfI',
	authDomain: 'curso-react-redux-firebase.firebaseapp.com',
	databaseURL: 'https://curso-react-redux-firebase.firebaseio.com',
	projectId: 'curso-react-redux-firebase',
	storageBucket: 'curso-react-redux-firebase.appspot.com',
	messagingSenderId: '919786378030',
	appId: '1:919786378030:web:8196b5b3c35ee7168520bf',
	measurementId: 'G-9F132GVHB7'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore().collection('favs');

export function getFavs(uid) {
	return db
		.doc(uid)
		.get()
		.then(snap => {
			return snap.data().array;
		});
}

export function updateDB(array, uid) {
	return db.doc(uid).set({ array });
}

export function signOutGoogle() {
	firebase.auth().signOut();
}

export function loginWithGoogle() {
	const provider = new firebase.auth.GoogleAuthProvider();
	return firebase
		.auth()
		.signInWithPopup(provider)
		.then(snap => snap.user);
}
