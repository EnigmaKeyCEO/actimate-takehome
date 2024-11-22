import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Folder } from "#/types/Folder";
import { FileItem } from "#/types/File";
// import Icon from "#/components/common/Icon";
import { HStack, Icon, VStack } from "native-base";

type ItemType = "folder" | "file";

interface LineItemProps {
  item: Folder | FileItem;
  type: ItemType;
  onPress: (item: Folder | FileItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (item: Folder | FileItem) => void;
  onCreate?: (parentId: string) => void;
}

export const LineItem: React.FC<LineItemProps> = React.memo(
  ({ item, type, onPress, onDelete, onUpdate, onCreate }) => {
    const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

    const toggleActionMenu = () => {
      setIsActionMenuVisible(!isActionMenuVisible);
    };

    const handleEdit = () => {
      onUpdate(item);
      setIsActionMenuVisible(false);
    };

    const handleDelete = () => {
      onDelete(item.id);
      setIsActionMenuVisible(false);
    };

    const handleCreateSubfolder = () => {
      if (type === "folder" && onCreate) {
        onCreate((item as Folder).id);
        setIsActionMenuVisible(false);
      }
    };

    const name = "name" in item ? item.name : "";
    const createdAt = new Date(item.createdAt).toLocaleDateString();
    const updatedAt = new Date(item.updatedAt).toLocaleDateString();

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.content} onPress={() => onPress(item)}>
          <VStack space={2}>
            <View style={styles.nameColumn}>
              <Text style={styles.name}>{name}</Text>
            </View>
            <HStack style={styles.dateColumns} space={2} justifyContent="space-between">
              <View style={styles.dateColumn}>
                <Text style={styles.dateText}>{updatedAt}</Text>
                <Text style={styles.labelText}>Updated</Text>
              </View>
              <View style={styles.dateColumn}>
                <Text style={styles.dateText}>{createdAt}</Text>
                <Text style={styles.labelText}>Created</Text>
              </View>
            </HStack>
          </VStack>
        </TouchableOpacity>

        {/* Action Menu Button */}
        <TouchableOpacity
          onPress={toggleActionMenu}
          style={styles.actionButton}
          accessibilityLabel="Action Menu"
          accessibilityRole="button"
        >
          {typeof Icon === "function" ? (
            <Icon as={MaterialIcons} name="more-vert" size="sm" />
          ) : (
            <Text style={styles.notActuallyAnIcon}>{`⋮`}</Text>
          )}
        </TouchableOpacity>

        {/* Action Menu Modal */}
        <Modal
          transparent
          visible={isActionMenuVisible}
          animationType="fade"
          onRequestClose={toggleActionMenu}
        >
          <TouchableWithoutFeedback onPress={toggleActionMenu}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleEdit}
                    accessibilityLabel="Edit"
                    accessibilityRole="button"
                  >
                    <Text style={styles.menuText}>Edit</Text>
                  </TouchableOpacity>
                  {type === "folder" && onCreate && (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={handleCreateSubfolder}
                      accessibilityLabel="New Subfolder"
                      accessibilityRole="button"
                    >
                      <Text style={styles.menuText}>New Subfolder</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleDelete}
                    accessibilityLabel="Delete"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.menuText, styles.deleteText]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={toggleActionMenu}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button"
                  >
                    <Text style={styles.menuCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: "column",
    flex: 1,
  },
  nameColumn: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
  },
  dateColumns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#cccccc66",
  },
  dateColumn: {
    marginLeft: 16,
  },
  dateText: {
    fontSize: 10,
  },
  labelText: {
    fontSize: 8,
    color: "#666",
    textAlign: "right",
  },
  actionButton: {
    padding: 8,
    paddingRight: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 8,
  },
  notActuallyAnIcon: {
    fontSize: 22,
    textAlign: "right",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
  },
  deleteText: {
    color: "#F44336",
  },
  menuCancelText: {
    color: "#666",
    textAlign: "right",
    marginRight: 16,
    marginTop: 4,
    marginBottom: 16,
  },
});
