import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { CommonActions } from "@react-navigation/native";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const theme = useTheme();

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
  
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "EventList" }],
        })
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      {error && <Text style={{ color: theme.colors.error, marginBottom: 10 }}>{error}</Text>}
      <Button mode="contained" onPress={handleSignUp}>
        Sign Up
      </Button>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#6200ea",
  },
});

export default SignUpScreen;
