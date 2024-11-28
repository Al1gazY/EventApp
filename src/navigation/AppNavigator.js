import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import EventListScreen from "../screens/EventListScreen";
import AddEditEventScreen from "../screens/AddEditEventScreen";
import FavouritesScreen from "../screens/FavouritesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "Sign Up" }} />
      <Stack.Screen name="EventList" component={EventListScreen} options={{ title: "Events" }} />
      <Stack.Screen name="AddEditEvent" component={AddEditEventScreen} options={{ title: "Add/Edit Event" }} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} options={{ title: "Favourites" }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
