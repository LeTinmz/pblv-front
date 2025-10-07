import { useUserStore } from "../stores/userStore";

export const loadUser = async () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  if (!user) {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    }
  }
};
