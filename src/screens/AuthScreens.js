import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("EventList");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Text onPress={() => navigation.navigate("SignIn")}>Already have an account? Sign In</Text>
    </View>
  );
};

export const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("EventList");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Text onPress={() => navigation.navigate("SignUp")}>Don't have an account? Sign Up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { marginBottom: 10, borderBottomWidth: 1, padding: 10 },
});
