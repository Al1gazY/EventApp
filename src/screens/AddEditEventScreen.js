import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, ScrollView } from "react-native";
import { TextInput, Button, Text, Switch } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import { auth, firestore } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddEditEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleAddEvent = async () => {
    try {
      const eventsRef = collection(firestore, "events");
      await addDoc(eventsRef, {
        title,
        description,
        image,
        category,
        date: date.toISOString(),
        location,
        isPrivate,
        creatorId: auth.currentUser.uid,
      });
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the media library is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create New Event</Text>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <Button mode="contained" onPress={pickImage} style={styles.button}>
          Pick an Image
        </Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button
          mode="contained"
          onPress={() => setShowDatePicker(true)}
          style={styles.button}
        >
          Select Date and Time
        </Button>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode="outlined"
        />
        <Dropdown
          data={[
            { label: "Work", value: "Work" },
            { label: "Personal", value: "Personal" },
            { label: "Social", value: "Social" },
          ]}
          labelField="label"
          valueField="value"
          value={category}
          onChange={(item) => setCategory(item.value)}
          placeholder="Select Category"
          style={styles.dropdown}
        />
        <View style={styles.switchContainer}>
          <Text>Private Event</Text>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            color="#6200ea"
          />
        </View>
        <Button mode="contained" onPress={handleAddEvent} style={styles.addButton}>
          Add Event
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  dropdown: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#512da8",
  },
});

export default AddEditEventScreen;
