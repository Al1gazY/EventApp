import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Card, IconButton, Button, Chip } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { format } from "date-fns";

const ProfileScreen = ({ navigation }) => {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const eventsRef = collection(firestore, "events");
    const q = query(eventsRef, where("creatorId", "==", auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyEvents(eventsList);
    });

    return () => unsubscribe();
  }, []);

  const deleteEvent = async (eventId) => {
    await deleteDoc(doc(firestore, "events", eventId));
  };

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  const renderMyEventItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        {item.image && <Card.Cover source={{ uri: item.image }} style={styles.image} />}
        <Card.Title
          title={item.title}
          titleStyle={styles.title}
          subtitle={item.location}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content>
          <Chip style={styles.chip}>Date: {formatEventDate(item.date)}</Chip>
          <Text style={styles.description}>{item.description}</Text>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="pencil"
            color="#6200ea"
            size={24}
            onPress={() => navigation.navigate("EditEvent", { eventId: item.id })}
          />
          <IconButton
            icon="delete"
            color="#e63946"
            size={24}
            onPress={() => deleteEvent(item.id)}
          />
        </Card.Actions>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Events</Text>
      <FlatList
        data={myEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderMyEventItem}
        contentContainerStyle={styles.list}
      />
      <Button
        mode="contained"
        onPress={() => auth.signOut()}
        style={styles.logoutButton}
      >
        Log Out
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  cardContainer: {
    overflow: "hidden",
    borderRadius: 12,
    marginVertical: 8,
  },
  card: {
    elevation: 4,
  },
  image: {
    height: 180,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
  chip: {
    marginVertical: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#6200ea",
  },
});

export default ProfileScreen;
