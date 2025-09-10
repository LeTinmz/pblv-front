import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { useUserStore } from "../stores/userStore";

export const UserDetails = () => {
  const user = useUserStore((state) => state.user);
  const userInfo = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    mail: user.mail,
    bio: user.bio,
  };
  const userDataArray = Object.entries(userInfo).map(([key, value]) => ({
    key,
    value: value || "Non renseigné",
  }));
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User Details</Text>
      <FlatList
        data={userDataArray}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.key}>{item.key}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    paddingVertical: 8,
  },
  key: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
});
