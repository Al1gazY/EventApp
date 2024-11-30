import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, Chip, IconButton } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { format } from "date-fns"; 

const FavouritesScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "events"), (snapshot) => {
      const favouriteEvents = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((event) => event.favourites?.includes(auth.currentUser.uid));
      setFavourites(favouriteEvents);
    });

    return () => unsubscribe();
  }, []);

  const removeFromFavourites = async (eventId) => {
    const eventDoc = doc(firestore, "events", eventId);
    const event = favourites.find((event) => event.id === eventId);
    await updateDoc(eventDoc, {
      favourites: event.favourites.filter((uid) => uid !== auth.currentUser.uid),
    });
  };

  const formatEventDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy hh:mm a");
    } catch {
      return dateString;
    }
  };

  const renderFavouriteItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetails", { event: item })}
    >
      <View style={{ overflow: "hidden", borderRadius: 12, marginVertical: 8 }}>
        <Card style={styles.card} mode="elevated">
          {item.image && (
            <Card.Cover source={{ uri: item.image }} style={styles.image} />
          )}
          <Card.Title
            title={item.title}
            titleStyle={styles.title}
            subtitle={item.location}
            subtitleStyle={styles.subtitle}
          />
          <Card.Content>
            <Chip style={styles.chip}>
              Date: {formatEventDate(item.date)}
            </Chip>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <IconButton
              icon="heart-broken"
              color="#e63946"
              size={28}
              onPress={() => removeFromFavourites(item.id)}
            />
          </Card.Actions>
        </Card>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavouriteItem}
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
  actions: {
    justifyContent: "flex-end",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
});

export default FavouritesScreen;
