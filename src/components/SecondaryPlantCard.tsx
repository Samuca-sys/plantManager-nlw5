import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { isIphoneSE } from 'react-native-iphone-se-helper';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface SecondaryPlantCardProps extends RectButtonProps {
	data: {
		name: string;
		photo: string;
		hour: string;
	};
}
export const SecondaryPlantCard = ({
	data,
	...rest
}: SecondaryPlantCardProps) => {
	return (
		<RectButton style={styles.container} {...rest}>
			<SvgFromUri uri={data.photo} width={50} height={50} />
			<Text style={styles.title}>{data.name}</Text>

			<View style={styles.details}>
				<Text style={styles.timeLabel}>Regar às</Text>

				<Text style={styles.time}>{data.hour}</Text>
			</View>
		</RectButton>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: 10,
		paddingVertical: 25,
		borderRadius: 20,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.shape,
		marginVertical: 5,
	},
	title: {
		flex: 1,
		marginLeft: 10,
		fontFamily: fonts.heading,
		fontSize: isIphoneSE() ? 15 : 17,
		color: colors.heading,
	},
	details: {
		alignItems: 'flex-end',
	},
	timeLabel: {
		fontSize: isIphoneSE() ? 14 : 16,
		fontFamily: fonts.text,
		color: colors.body_light,
	},
	time: {
		marginTop: 5,
		fontSize: isIphoneSE() ? 14 : 16,
		fontFamily: fonts.heading,
		color: colors.body_light,
	},
});
