import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const eventsRef = collection(firestore, "events");
    const snapshot = await getDocs(eventsRef);
    const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsList);
  };

  const addToFavourites = async (eventId) => {
    try {
      const eventDoc = doc(firestore, "events", eventId);
      const event = events.find(event => event.id === eventId);
      const updatedFavourites = event.favourites
        ? [...event.favourites, auth.currentUser.uid]
        : [auth.currentUser.uid];
      await updateDoc(eventDoc, { favourites: updatedFavourites });
      fetchEvents();
    } catch (error) {
      alert("Error adding to favourites: " + error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Button title="Add Event" onPress={() => navigation.navigate("AddEditEvent")} />
      <Button title="Favourites" onPress={() => navigation.navigate("Favourites")} />
      <Button title="Logout" onPress={handleLogout} />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Add to Favourites" onPress={() => addToFavourites(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  eventItem: { marginBottom: 15 },
  eventTitle: { fontSize: 18, fontWeight: "bold" },
});

export default EventListScreen;
