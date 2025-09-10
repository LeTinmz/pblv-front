import { Platform } from "react-native";

export const globalStyles = {
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  goNextButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: Platform.OS === "android" ? 30 : 0,
  },
  lightText: {
    color: "#555",
    textAlign: "center",
  },
};
