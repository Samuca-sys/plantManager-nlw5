import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import { SvgFromUri } from 'react-native-svg';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface PrimaryPlantCardProps extends RectButtonProps {
	data: {
		name: string;
		photo: string;
	};
}
export const PrimaryPlantCard = ({ data, ...rest }: PrimaryPlantCardProps) => {
	return (
		<RectButton style={styles.container} {...rest}>
			<SvgFromUri uri={data.photo} width={70} height={70} />
			<Text style={styles.text}>{data.name}</Text>
		</RectButton>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		maxWidth: '45%',
		backgroundColor: colors.shape,
		borderRadius: 20,
		paddingVertical: 10,
		alignItems: 'center',
		margin: 5,
	},
	text: {
		color: colors.green_dark,
		fontFamily: fonts.heading,
		fontSize: 13,
		marginVertical: 15,
	},
});
