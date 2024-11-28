import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
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
      <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleAddEvent}>
        Add Event
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
});

export default AddEditEventScreen;
