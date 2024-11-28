import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { auth, firestore } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddEditEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddEvent = async () => {
    try {
      const eventsRef = collection(firestore, "events");
      await addDoc(eventsRef, {
        title,
        description,
        creatorId: auth.currentUser.uid,
      });
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Add Event" onPress={handleAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { marginBottom: 10, borderBottomWidth: 1, padding: 10 },
});

export default AddEditEventScreen;
