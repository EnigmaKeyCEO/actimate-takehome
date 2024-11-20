import { Button, VStack } from "native-base";
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

export type ModalConfigObject = {
  title: string;
  body: React.ReactNode;
  actions: {
    label: string;
    onPress: () => void;
  }[];
};

export type ModalType = "success" | "error" | "info";

export type ModalContextType = {
  isVisible: boolean;
  showModal:
    | ((message: string, type: ModalType) => void)
    | ((config: ModalConfigObject) => void);
  hideModal: () => void;
};

export interface ModalElementType extends ModalContextType {
  body: React.ReactNode;
  actions: {
    label: string;
    onPress: () => void;
  }[];
}

export interface ModalMessageType extends ModalContextType {
  message: string;
  type: ModalType;
}

export type ModalConfigType = ModalContextType &
  (ModalConfigObject | ModalMessageType);

const ModalContext = createContext<ModalConfigType>({
  isVisible: false,
  showModal: () => {},
  hideModal: () => {},
  message: "",
  type: "info",
} as ModalConfigType);

export const useModal = <T extends ModalContextType>() => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context as unknown as T;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string | React.ReactNode>("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const showModal = useCallback(
    (
      message: string | ModalConfigObject,
      type: "success" | "error" | "info"
    ) => {
      if (typeof message === "string") {
        setMessage(message);
        setType(type);
      } else {
        const { title, body, actions } = message as ModalConfigObject;
        setMessage(
          <VStack>
            <Text>{title}</Text>
            {body}
            {actions.map((action) => (
              <Button onPress={action.onPress}>{action.label}</Button>
            ))}
          </VStack>
        );
        setType("info");
      }
      setIsVisible(true);
    },
    []
  );

  const hideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <ModalContext.Provider
      value={
        { isVisible, message, type, showModal, hideModal } as ModalConfigType
      }
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const Modal = () => {
  const { isVisible, message, type, hideModal } = useModal<ModalMessageType>();

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      default:
        return "#2196F3";
    }
  };

  return (
    <RNModal
      transparent
      visible={isVisible}
      onRequestClose={hideModal}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: getBackgroundColor() },
          ]}
        >
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalText: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
  },
});
