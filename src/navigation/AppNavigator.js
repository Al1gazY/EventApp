import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SignInScreen, SignUpScreen } from "../screens/AuthScreens";
import EventListScreen from "../screens/EventListScreen";
import AddEditEventScreen from "../screens/AddEditEventScreen";
import FavouritesScreen from "../screens/FavouritesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EventList" component={EventListScreen} />
        <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} />
        <Stack.Screen name="Favourites" component={FavouritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
