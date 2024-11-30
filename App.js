import React, { useState, useEffect } from "react";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "./src/services/firebase";

import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import EventListScreen from "./src/screens/EventListScreen";
import AddEditEventScreen from "./src/screens/AddEditEventScreen";
import FavouritesScreen from "./src/screens/FavouritesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EventDetailsScreen from "./src/screens/EventDetailsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#512da8",
    accent: "#03dac4",
  },
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          EventList: "format-list-bulleted",
          AddEvent: "plus-circle",
          Favourites: "heart",
          Profile: "account-circle",
        };
        return (
          <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />
        );
      },
      tabBarActiveTintColor: "#6200ea",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="EventList" component={EventListScreen} />
    <Tab.Screen name="AddEvent" component={AddEditEventScreen} />
    <Tab.Screen name="Favourites" component={FavouritesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Back"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditEvent"
                component={AddEditEventScreen}
                options={{ title: "Edit Event" }}
              />
              <Stack.Screen
                name="EventDetails"
                component={EventDetailsScreen}
                options={{ title: "Event Details" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
