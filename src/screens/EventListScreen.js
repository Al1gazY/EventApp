import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";
import { format } from "date-fns";

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = collection(firestore, "events");

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    });

    return () => unsubscribe(); 
  }, []);

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetails", { event: item })}
    >
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
          </Card.Content>
        </Card>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  list: {
    paddingHorizontal: 16,
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
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
  },
});

export default EventListScreen;
