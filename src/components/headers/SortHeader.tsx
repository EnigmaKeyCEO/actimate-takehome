import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Icon } from "native-base";
import { SortField, SortOptions } from "#/types";
import { Ionicons } from "@expo/vector-icons";

interface SortHeaderProps {
  sortOptions: SortOptions;
  onSortChange: (field: SortField) => void;
}

export const SortHeader: React.FC<SortHeaderProps> = ({
  sortOptions,
  onSortChange,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSortChange = (field: SortField) => {
    if (sortOptions.field === field) {
      // Toggle direction if the same field is selected
      onSortChange(field);
    } else {
      // Set to ascending if a new field is selected
      onSortChange(field);
    }
    setMenuVisible(false);
  };

  const sortFields: SortField[] = ["name", "createdAt", "updatedAt"];

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Actimate Take Home Challenge</Text>
        <TouchableOpacity
          onPress={toggleMenu}
          style={styles.menuButton}
          accessibilityLabel="Sort Options Menu"
          accessibilityRole="button"
        >
          {typeof Icon === "function" ? (
            <Icon as={Ionicons} name="menu" size="sm" />
          ) : (
            <Text style={styles.notActuallyAnIcon}>{`☰`}</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        supportedOrientations={["portrait", "landscape"]}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  {sortFields.map((field) => (
                    <TouchableOpacity
                      key={field}
                      style={styles.menuItem}
                      onPress={() => handleSortChange(field)}
                      accessibilityLabel={`Sort by ${field}`}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.menuText,
                          sortOptions.field === field && styles.selectedText,
                        ]}
                      >
                        {capitalize(field)}
                      </Text>
                      {sortOptions.field === field &&
                        (Platform.OS !== "ios" ? (
                          <Ionicons
                            name={
                              sortOptions.direction === "asc"
                                ? "chevron-up"
                                : "chevron-down"
                            }
                            size={16}
                            color="black"
                            style={styles.chevron}
                          />
                        ) : (
                          sortOptions.direction === "asc"
                            ? <Text style={styles.notActuallyAnIcon}>{`⬆️`}</Text>
                            : <Text style={styles.notActuallyAnIcon}>{`⬇️`}</Text>
                        ))}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

// Helper function to capitalize the first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Removed zIndex to prevent layering issues
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    // Removed zIndex
  },
  modalContainer: {
    // Added container to manage modal content positioning
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: 200,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
    // Removed zIndex here as well
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    fontWeight: "bold",
  },
  chevron: {
    marginLeft: 8,
  },
  notActuallyAnIcon: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },
});
