import React, { useEffect, useState } from 'react';
import { PATHURL } from './config/config';
import { style_01 } from '../styles/style_01';

import {
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';

const GetPlaces = props => {
    const nav = props.navegar;
    const token = props.token;

    const [data, setData] = useState([]);
    const [comments, setComments] = useState([]);

    const Obtener = async () => {
        try {
            axios.get(`${PATHURL}`).then(response => {
                const json = response.data.data[0];
                setData(json);
            });
        } catch (error) {
            console.error(error);
        }

        setComments(data.comments);
    };

    useEffect(() => {
        Obtener();
    }, []);

    const onPressViewAddComment = token => {
        nav.navigate('InfoComment', { token: token });
    };

    return (
        <SafeAreaView>
            <View style={style_01.card}>
                <Text style={style_01.tit_02}>{data.title}</Text>
                <Text style={style_01.tit_02}>{data.description}</Text>
                <Text style={style_01.tit_03}>{data.body}</Text>
            </View>
            <View>
                <TouchableOpacity
                    style={style_01.itemText2}
                    onPress={() => onPressViewAddComment(data._id)}>
                    <View>
                        <Text style={style_01.tit_04}>Add Comments</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data.comments}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                    <TouchableOpacity key={item.comment} style={style_01.itemText}>
                        <View>
                            <Text style={style_01.tit_02}>{item.comment}</Text>
                            <Text style={style_01.author}>{item.author}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default GetPlaces;