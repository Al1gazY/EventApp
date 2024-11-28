import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { auth, firestore } from "../services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const FavouritesScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);

  const fetchFavourites = async () => {
    try {
      const eventsRef = collection(firestore, "events");
      const snapshot = await getDocs(eventsRef);
      const favouriteEvents = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.favourites && event.favourites.includes(auth.currentUser.uid));
      setFavourites(favouriteEvents);
    } catch (error) {
      alert("Error fetching favourites: " + error.message);
    }
  };

  const removeFromFavourites = async (eventId) => {
    try {
      const eventDoc = doc(firestore, "events", eventId);
      await updateDoc(eventDoc, {
        favourites: favourites.find(event => event.id === eventId)?.favourites.filter(
          uid => uid !== auth.currentUser.uid
        ),
      });
      fetchFavourites();
    } catch (error) {
      alert("Error removing from favourites: " + error.message);
    }
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
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Remove from Favourites" onPress={() => removeFromFavourites(item.id)} />
          </View>
        )}
      />
      <Button title="Back to Events" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  eventItem: { marginBottom: 15 },
  eventTitle: { fontSize: 18, fontWeight: "bold" },
});

export default FavouritesScreen;
