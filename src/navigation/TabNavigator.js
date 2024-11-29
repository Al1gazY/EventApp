import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventListScreen from "../screens/EventListScreen";
import AddEditEventScreen from "../screens/AddEditEventScreen";
import FavouritesScreen from "../screens/FavouritesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "EventList") {
            iconName = "format-list-bulleted";
          } else if (route.name === "AddEvent") {
            iconName = "plus-circle";
          } else if (route.name === "Favourites") {
            iconName = "heart";
          } else if (route.name === "Profile") {
            iconName = "account-circle";
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
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
};

export default TabNavigator;
