import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  sortOrder: "asc" | "desc";
  onToggle: () => void;
};

const SortButton: React.FC<Props> = ({ sortOrder, onToggle }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onToggle}>
      <Text>並び替え ({sortOrder === "asc" ? "昇順" : "降順"})</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
});

export default SortButton;
