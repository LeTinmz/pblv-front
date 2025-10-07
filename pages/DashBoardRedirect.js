import { useUserStore } from "../stores/userStore";

export const DashBoardRedirect = ({ navigation }) => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const loadUser = async () => {
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
    loadUser();
  }, []);
};

switch (user.roleName) {
  case "ADMIN":
    navigation.navigate("AdminDashboard");
    break;
  case "USER":
    navigation.navigate("Home");
    break;
  case "COMMUNITY_MANAGER":
    console.log("wesh");
    break;
}
