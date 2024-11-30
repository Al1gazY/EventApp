import React from "react";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import { auth } from "./src/services/firebase";
import EventDetailsScreen from "./src/screens/EventDetailsScreen";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#512da8",
    accent: "#03dac4",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
    error: "#B00020",
    onSurface: "#000000",
  },
};

const App = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
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
                name="EventDetails"
                component={EventDetailsScreen}
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
