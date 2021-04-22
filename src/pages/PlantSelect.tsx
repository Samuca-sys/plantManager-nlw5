import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	FlatList,
	ActivityIndicator,
} from 'react-native';

import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PrimaryPlantCard } from '../components/PrimaryPlantCard';
import { Load } from '../components/Load';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
	key: string;
	title: string;
}
interface PlantProps {
	id: 1;
	name: string;
	about: string;
	water_tips: string;
	photo: string;
	environments: [string];
	frequency: {
		times: number;
		repeat_every: string;
	};
}

export function PlantSelect() {
	const [environment, setEnvironment] = useState<EnvironmentProps[]>([]);
	const [plants, setPlants] = useState<PlantProps[]>([]);

	const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
	const [environmentSelected, setEnvironmentSelected] = useState('all');

	const [isLoading, setIsLoading] = useState(true);

	const [page, setPage] = useState(1);
	const [loadingMore, setLoadingMore] = useState(false);

	function handleEnvironmentSelected(environment: string) {
		setEnvironmentSelected(environment);

		if (environment == 'all') return setFilteredPlants(plants);

		const filtered = plants.filter((plant) =>
			plant.environments.includes(environment)
		);

		setFilteredPlants(filtered);
	}

	async function fetchPlants() {
		const { data } = await api.get('plants', {
			params: {
				_sort: 'name',
				_order: 'asc',
				_page: `${page}`,
				_limit: 4,
			},
		});

		if (!data) return setIsLoading(true);

		if (page > 1) {
			setPlants((oldValue) => [...oldValue, ...data]);
			setFilteredPlants((oldValue) => [...oldValue, ...data]);
		} else {
			setPlants(data);
			setFilteredPlants(data);
		}

		setIsLoading(false);
		setLoadingMore(false);
	}

	function handleFetchMore(distance: number) {
		if (distance < 1) return;

		setLoadingMore(true);
		setPage((oldValue) => oldValue + 1);

		fetchPlants();
	}

	useEffect(() => {
		async function fetchEnvironment() {
			const { data } = await api.get('plants_environments', {
				params: {
					_sort: 'title',
					_order: 'asc',
				},
			});
			setEnvironment([
				{
					key: 'all',
					title: 'Todos',
				},
				...data,
			]);
		}
		fetchEnvironment();
	}, []);

	useEffect(() => {
		fetchPlants();
	}, []);

	if (isLoading) return <Load />;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Header />
				<Text style={styles.title}>Em qual ambiente</Text>
				<Text style={styles.subtitle}>você quer colocar sua planta?</Text>
			</View>

			<View>
				<FlatList
					data={environment}
					renderItem={({ item }) => (
						<EnvironmentButton
							title={item.title}
							active={item.key === environmentSelected}
							onPress={() => handleEnvironmentSelected(item.key)}
						/>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.environmentList}
				/>
			</View>

			<View style={styles.plants}>
				<FlatList
					data={filteredPlants}
					renderItem={({ item }) => <PrimaryPlantCard data={item} />}
					showsVerticalScrollIndicator={false}
					numColumns={2}
					onEndReachedThreshold={0.1}
					onEndReached={({ distanceFromEnd }) =>
						handleFetchMore(distanceFromEnd)
					}
					ListFooterComponent={
						loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
					}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: 30,
	},
	title: {
		fontSize: 17,
		color: colors.heading,
		fontFamily: fonts.heading,
		lineHeight: 20,
		marginTop: 15,
	},
	subtitle: {
		fontFamily: fonts.text,
		fontSize: 17,
		lineHeight: 20,
		color: colors.heading,
	},
	environmentList: {
		height: 40,
		justifyContent: 'center',
		paddingBottom: 5,
		marginLeft: 30,
		marginVertical: 30,
		paddingRight: 30,
	},
	plants: {
		flex: 1,
		paddingHorizontal: 30,
		justifyContent: 'center',
	},
});
