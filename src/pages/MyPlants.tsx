import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';

import { Header } from '../components/Header';
import { SecondaryPlantCard } from '../components/SecondaryPlantCard';

import { loadPlant, PlantProps } from '../libs/strorage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { isIphoneSE } from 'react-native-iphone-se-helper';

import waterdrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
	const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [nextWatered, setNextWatered] = useState<string>();

	useEffect(() => {
		async function loadStorageData() {
			const plantStorage = await loadPlant();

			const nextTime = formatDistance(
				new Date(plantStorage[0].dateTimeNotification).getTime(),
				new Date().getTime(),
				{ locale: ptBR }
			);

			setNextWatered(
				`Não esqueça de regar a ${plantStorage[0].name} à ${nextTime}`
			);
			setMyPlants(plantStorage);
			setLoading(false);
		}
		loadStorageData();
	}, []);

	return (
		<View style={styles.container}>
			<Header />
			<View style={styles.spotlight}>
				<Image source={waterdrop} style={styles.spotlightImage} />
				<Text style={styles.spotlightText}>{nextWatered}</Text>
			</View>

			<View style={styles.plants}>
				<Text style={styles.plantsTitle}>Próximas regadas</Text>

				<FlatList
					data={myPlants}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => <SecondaryPlantCard data={item} />}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ flex: 1 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		paddingTop: 50,
		backgroundColor: colors.background,
	},
	spotlight: {
		backgroundColor: colors.blue_light,
		paddingHorizontal: 20,
		borderRadius: 20,
		height: 110,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 15,
	},
	spotlightImage: {
		width: isIphoneSE() ? 50 : 60,
		height: isIphoneSE() ? 50 : 60,
	},
	spotlightText: {
		flex: 1,
		fontSize: isIphoneSE() ? 13 : 15,
		color: colors.blue,
		paddingHorizontal: 20,
		textAlign: 'justify',
	},
	plants: {
		flex: 1,
		width: '100%',
	},
	plantsTitle: {
		fontSize: 24,
		fontFamily: fonts.heading,
		color: colors.heading,
		marginVertical: 20,
	},
});
