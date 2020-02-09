import React from 'react';
import styles from './favs.module.css';
import Card from '../card/Card';
import { connect } from 'react-redux';

function FavPage({ fetchingFavorites, characters }) {
	function renderCharacter(char, i) {
		return <Card hide {...char} key={i} />;
	}
	if (fetchingFavorites) {
		return <h1>Carregando...</h1>;
	}
	console.log('characters', characters);
	return (
		<div className={styles.container}>
			<h2>Favoritos</h2>
			{characters.map(renderCharacter)}
			{!characters.length && <h3>No hay personajes agregados</h3>}
		</div>
	);
}

function mapStateToProps({ characters }) {
	return {
		characters: characters.favorites,
		fetchingFavorites: characters.fetchingFavorites
	};
}
export default connect(mapStateToProps)(FavPage);
