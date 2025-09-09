import { React } from "react";
import { Button } from "react-native";
import { globalStyles } from "../utils/globalStyles";

export const GoNextButton = ({ label, onPress }) => {
  return (
    <Button style={globalStyles.goNextButton} title={label} onPress={onPress} />
  );
};
