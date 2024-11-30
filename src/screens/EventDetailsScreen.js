import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, IconButton, Chip } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const EventDetailsScreen = ({ route }) => {
  const { event } = route.params;
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkIfFavorited = async () => {
      const eventDoc = await getDoc(doc(firestore, "events", event.id));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setIsFavorited(eventData.favourites?.includes(auth.currentUser.uid) || false);
      }
    };
    checkIfFavorited();
  }, [event.id]);

  const toggleFavorite = async () => {
    const eventDoc = doc(firestore, "events", event.id);
    const currentUserId = auth.currentUser.uid;

    if (isFavorited) {
      await updateDoc(eventDoc, {
        favourites: event.favourites.filter((uid) => uid !== currentUserId),
      });
      setIsFavorited(false);
    } else {
      const eventDocData = await getDoc(eventDoc);
      const existingFavourites = eventDocData.data().favourites || [];
      await updateDoc(eventDoc, {
        favourites: [...existingFavourites, currentUserId],
      });
      setIsFavorited(true);
    }
  };

  const formatEventDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString(); 
    } catch {
      return dateString; 
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ overflow: "hidden", borderRadius: 12 }}>
        <Card style={styles.card}>
          {event.image && <Card.Cover source={{ uri: event.image }} style={styles.image} />}
          <Card.Content>
            <Text style={styles.title}>{event.title}</Text>
            <Chip style={styles.chip}>Date: {formatEventDate(event.date)}</Chip>
            <Chip style={styles.chip}>Location: {event.location}</Chip>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <IconButton
              icon={isFavorited ? "heart" : "heart-outline"}
              color={isFavorited ? "#e63946" : "#000"}
              size={28}
              onPress={toggleFavorite}
            />
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  image: {
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  chip: {
    marginVertical: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  sectionHeader: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  actions: {
    justifyContent: "flex-end",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});

export default EventDetailsScreen;
