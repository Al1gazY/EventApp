import React, { useState, useEffect } from "react";
import { SafeAreaView, View, FlatList, StyleSheet } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const EventListScreen = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const eventsRef = collection(firestore, "events");
    const snapshot = await getDocs(eventsRef);
    const eventsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  return (
    <SafeAreaView style={styles.container}>
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
                <IconButton icon="delete" onPress={() => deleteEvent(item.id)} />
              </Card.Actions>
            )}
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 10,
  },
});

export default EventListScreen;
