import { Dimensions, StyleSheet} from 'react-native';

		const alto = Dimensions.get('window').height - 150

		// crea paleta de colores
		const principal = '#1B2E66';
		const naranja = '#FF9900';
		const blanco = '#FFFFFF';
		const gris_1 = '#B2BDD5';

		// crea la hoja de estilos
		export const style_01 = StyleSheet.create({
			body:{
				flex: 1,
				flexDirection: 'column',
			},
			divHeader:{
				backgroundColor : principal,
				flexDirection: 'row',
				flexWrap: 'wrap',
				height: 80,
			},
			divMain:{
				backgroundColor: gris_1,
				height: alto,
				padding: 8,
			},
			divFooter:{
				paddingTop: 5,
				backgroundColor : principal,
				alignItems: 'center',
				height: 50,
			},
			textFooter:{
				color: naranja,
				fontSize: 11,
				fontWeight: '300',
			},
			h1:{
				color: principal,
				marginTop:5,
				marginBottom: 5,
				fontSize: 24,
				fontWeight: 'bold',
			},
			h2:{
				color: principal,
				marginTop:5,
				marginBottom: 5,
				fontSize: 20,
				fontWeight: 'bold',
			},
			h3:{
				color: principal,
				marginTop:5,
				marginBottom: 5,
				fontSize: 16,
				fontWeight: 'bold',
			},
			p1:{
				color: principal,
				textAlign: 'justify',
				lineHeight: 14,
				fontSize: 12,
			},
			tarjeta:{
				backgroundColor: blanco,
				borderRadius: 10,
				margin: 5,
				padding: 10,
			}
		});