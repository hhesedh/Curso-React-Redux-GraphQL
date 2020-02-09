import React, { useEffect, useState } from 'react';
import Card from '../card/Card';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

export default function GraphHome() {
	const [chars, setChars] = useState([]);
	const query = gql`
		{
			characters {
				results {
					name
					image
				}
			}
		}
	`;

	const { data, loading, error } = useQuery(query);

	useEffect(() => {
		if (data && !loading && !error) {
			setChars([...data.characters.results]);
		}
	}, [data, error, loading, setChars]);

	function nextCharacter() {
		chars.shift();
		setChars([...chars]);
	}

	if (loading) {
		return <h2>Carregando...</h2>;
	}
	return (
		<Card
			//rightClick={addFav}
			leftClick={nextCharacter}
			{...chars[0]}
		/>
	);
}
