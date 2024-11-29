import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Button, Card, IconButton } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { SafeAreaView } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const [myEvents, setMyEvents] = useState([]);

  const fetchMyEvents = async () => {
    const eventsRef = collection(firestore, "events");
    const q = query(eventsRef, where("creatorId", "==", auth.currentUser.uid));
    const snapshot = await getDocs(q);
    const eventsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMyEvents(eventsList);
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(firestore, "events", eventId));
      fetchMyEvents();
    } catch (error) {
      alert("Failed to delete event: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>My Events</Text>
      <FlatList
        data={myEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text>{item.description}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="delete"
                onPress={() => deleteEvent(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
      />
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Log Out
      </Button>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
