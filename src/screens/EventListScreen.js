import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { CommonActions } from "@react-navigation/native";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const eventsRef = collection(firestore, "events");
    const snapshot = await getDocs(eventsRef);
    const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(eventsList);
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(firestore, "events", eventId));
      fetchEvents();
    } catch (error) {
      alert("Failed to delete event: " + error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
  
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        })
      );
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate("AddEditEvent")}>
        Add Event
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate("Favourites")}>
        View Favourites
      </Button>
      <Button mode="contained" onPress={handleLogout}>
        Log Out
      </Button>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text>{item.description}</Text>
            </Card.Content>
            {item.creatorId === auth.currentUser.uid && (
              <Card.Actions>
                <IconButton
                  icon="delete"
                  onPress={() => deleteEvent(item.id)}
                />
              </Card.Actions>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginVertical: 10,
  },
});

export default EventListScreen;
