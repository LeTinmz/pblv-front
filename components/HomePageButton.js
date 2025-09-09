import { React } from "react";
import { globalStyles } from "../utils/globalStyles";
import { TouchableOpacity } from "react-native";

export const HomePageButton = ({ onPress, img }) => {
  return (
    <TouchableOpacity style={globalStyles.homePageButton} onPress={onPress}>
      <Image source={img}></Image>
    </TouchableOpacity>
  );
};
