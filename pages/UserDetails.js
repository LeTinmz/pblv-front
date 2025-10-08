import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { useUserStore } from "../stores/userStore";

export const UserDetails = () => {
  const user = useUserStore((state) => state.user);

  const userInfo = {
    "🆔 ID": user?.id,
    "👤 Prénom": user?.firstName,
    "👥 Nom": user?.lastName,
    "💬 Nom d'utilisateur": user?.username,
    "📧 Email": user?.mail,
    "📝 Bio": user?.bio,
  };

  const userDataArray = Object.entries(userInfo).map(([key, value]) => ({
    key,
    value: value || "Non renseigné",
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            style={styles.avatar}
            source={{
              uri:
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
          />
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.mail}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <FlatList
            data={userDataArray}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.key}>{item.key}</Text>
                <Text style={styles.value}>{item.value}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E0ECFF",
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  email: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007BFF",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  key: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1E293B",
    flex: 1.3,
  },
  value: {
    fontSize: 15,
    color: "#475569",
    flex: 2,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 5,
  },
});
