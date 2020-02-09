import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/home/HomePage';
import FavPage from './components/favs/FavPage';
import LoginPage from './components/login/LoginPage';

function PrivateRoute({ path, component, ...rest }) {
	const stringStorage = localStorage.getItem('storage');
	const storage = JSON.parse(stringStorage);

	if (storage && storage.user) {
		return <Route path={path} component={component} {...rest} />;
	}
	return <Redirect to="/login" {...rest} />;
}
export default function Routes() {
	return (
		<Switch>
			<PrivateRoute exact path="/" component={Home} />
			<PrivateRoute path="/favs" component={FavPage} />
			<Route path="/login" component={LoginPage} />
		</Switch>
	);
}
