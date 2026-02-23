import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlacesListScreen from "../screens/PlacesListScreen";
import PlaceDetailScreen from "../screens/PlaceDetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import WebScreen from "../screens/WebScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Places" component={PlacesListScreen} options={{ title: "Lugares" }} />
        <Stack.Screen name="Detail" component={PlaceDetailScreen} options={{ title: "Detalle" }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "Mis 5 Favoritos" }} />
        <Stack.Screen name="Web" component={WebScreen} options={{ title: "Web" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
