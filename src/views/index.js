import React from 'react';
		import { Image, ScrollView,  Text, View} from 'react-native';
		import {style_01} from '../styles/style_01';

		const data = [
			{codigo : 'ITI-121',
				nombre : 'Fundamentos de Programación',
				nivel  : 1,
				creditos : 6},
			{codigo : 'ITI-122',
				nombre : 'Comunicación Oral y Escrita',
				nivel  : 1,
				creditos : 2},
			{codigo : 'ITI-123',
				nombre : 'Fundamentos de Bases de Datos',
				nivel  : 1,
				creditos : 3},
			{codigo : 'ITI-124',
				nombre : 'Matemáticas para Computación I',
				nivel  : 1,
				creditos : 6},
			{codigo : 'ID-TEC-1',
				nombre : 'Inglés I',
				nivel  : 1,
				creditos : 0},
			{codigo : 'IIT-221',
				nombre : 'Programación I',
				nivel  : 2,
				creditos : 6},
			{codigo : 'IIT-222',
				nombre : 'Plataformas Tecnológicas I',
				nivel  : 2,
				creditos : 3},
			{codigo : 'IIT-223',
				nombre : 'Administración de Bases de Datos',
				nivel  : 2,
				creditos : 3},
			{codigo : 'IIT-224',
				nombre : 'Matemáticas para Computación II',
				nivel  : 2,
				creditos : 3},
			{codigo : 'ID-TEC-2',
				nombre : 'Inglés II',
				nivel  : 2,
				creditos : 0},
			{codigo : 'ITI-321',
				nombre : 'Programación II',
				nivel  : 3,
				creditos : 3},
			{codigo : 'ITI-322',
				nombre : 'Diseño de Experiencias de Usuario',
				nivel  : 3,
				creditos : 3},
			{codigo : 'ITI-323',
				nombre : 'Plataformas Tecnológicas II',
				nivel  : 3,
				creditos : 3},
			{codigo : 'ITI-324',
				nombre : 'Cálculo y Algebra Lineal I',
				nivel  : 3,
				creditos : 3},	
			{codigo : 'ITI-325',
				nombre : 'Fundamentos de las Organizaciones',
				nivel  : 3,
				creditos : 2},
			{codigo : 'ID-TEC-3',
				nombre : 'Inglés III',
				nivel  : 2,
				creditos : 0}	
				
		];

		const Index = () => {
			return(
				<View>
					<View style={style_01.divHeader}>
						<Image source={require('../imgs/logos/logo_universidad.png')} />
					</View>

					<View style={style_01.divMain}>
						<Text style={style_01.h1}>Demostración 01</Text>
						<Text style={style_01.p1}>Desde el 2019, se está realizando el proceso de rediseño de la carrera, el cual implica la actualización de los contenidos en las asignaturas, así como las formas de mediación mas actuales, todo esto tomando en cuenta tambien diversas recomendaciones derivadas del proceso de autoevalación y acreditación de la carrera.</Text>

						<ScrollView style={{marginTop:8}}>
							{data.map(item => <View style={style_01.tarjeta} key={item.codigo} >
								<Text>Código: {item.codigo}</Text>
								<Text>Nombre: {item.nombre}</Text>
								<Text>Nivel: {item.nivel}</Text>
								<Text>Créditos: {item.creditos}</Text>
							</View>)}
						</ScrollView>
					</View>

					<View style={style_01.divFooter}>
						<Text style={style_01.textFooter}>Carrera de Tecnologías de Información</Text>
						<Text style={style_01.textFooter}>Sede del Pacífico</Text>
					</View>
				</View>
			);
		}

		export default Index;