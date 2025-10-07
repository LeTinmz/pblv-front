import { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native"; // ✅ bon import
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

export const CalendarHome = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get("calendars", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Calendars data:", response.data);
        setCalendarData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCalendarData();
  }, []);

  return (
    <SafeAreaView>
      {calendarData.length > 0 ? (
        <Text>{calendarData[0].id}</Text>
      ) : (
        <Text>Chargement...</Text>
      )}
    </SafeAreaView>
  );
};
