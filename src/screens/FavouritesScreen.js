import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const FavouritesScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  const fetchFavourites = async () => {
    const eventsRef = collection(firestore, "events");
    const snapshot = await getDocs(eventsRef);
    const favouriteEvents = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(event => event.favourites?.includes(auth.currentUser.uid));
    setFavourites(favouriteEvents);
  };

  const removeFromFavourites = async (eventId) => {
    const eventDoc = doc(firestore, "events", eventId);
    const event = favourites.find(event => event.id === eventId);
    await updateDoc(eventDoc, {
      favourites: event.favourites.filter(uid => uid !== auth.currentUser.uid),
    });
    fetchFavourites();
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text>{item.description}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon="heart-broken"
                onPress={() => removeFromFavourites(item.id)}
              />
            </Card.Actions>
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

export default FavouritesScreen;
