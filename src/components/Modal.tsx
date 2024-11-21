import { Button, VStack } from "native-base";
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";

export type ModalConfigObject = {
  title: string;
  body: React.ReactNode;
  actions: {
    label: string;
    onPress: () => void;
  }[];
};

export type ModalConfigFunction = (config: ModalConfigObject) => void;
export type ModalMessageFunction = (message: string, type: ModalType) => void;

export type ModalType = "success" | "error" | "info";

export type ModalContextBaseType = {
  isVisible: boolean;
  hideModal: () => void;
};

export interface ModalElementType extends ModalContextBaseType {
  showConfigModal: ModalConfigFunction;
}

export interface ModalMessageType extends ModalContextBaseType {
  showMessageModal: ModalMessageFunction;
  message: string | React.ReactNode;
  type: ModalType;
}

export interface ModalContextType extends ModalElementType, ModalMessageType {
  showModal: (messageOrConfig: string | ModalConfigObject, type?: ModalType) => void;
}

const ModalContext = createContext<ModalContextType>({
  isVisible: false,
  showConfigModal: () => {},
  showMessageModal: () => {},
  showModal: () => {},
  hideModal: () => {},
  message: "",
  type: "info",
});

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<string | React.ReactNode>("");
  const [type, setType] = useState<ModalType>("info");
  const modalRef = useRef<View>(null);

  const showConfigModal: ModalConfigFunction = useCallback(
    (config) => {
      setMessage(
        <VStack>
          <Text accessibilityRole="header" style={styles.modalTitle}>
            {config.title}
          </Text>
          {config.body}
          {config.actions.map((action, index) => (
            <Button key={index} onPress={action.onPress} accessible>
              {action.label}
            </Button>
          ))}
        </VStack>
      );
      setType("info");
      setIsVisible(true);
    },
    []
  );

  const showMessageModal: ModalMessageFunction = useCallback(
    (msg, msgType) => {
      setMessage(msg);
      setType(msgType);
      setIsVisible(true);
    },
    []
  );

  const showModal: ModalContextType["showModal"] = useCallback(
    (messageOrConfig, msgType) => {
      if (typeof messageOrConfig === "string") {
        showMessageModal(messageOrConfig, msgType || "info");
      } else {
        showConfigModal(messageOrConfig);
      }
    },
    [showConfigModal, showMessageModal]
  );

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setMessage("");
    setType("info");
  }, []);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      const reactTag = findNodeHandle(modalRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [isVisible]);

  return (
    <ModalContext.Provider
      value={{
        isVisible,
        hideModal,
        showConfigModal,
        showMessageModal,
        showModal,
        message,
        type,
      }}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const Modal = () => {
  const { isVisible, message, type, hideModal } = useModal();
  const modalRef = useRef<View>(null);

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
      accessibilityViewIsModal
      accessibilityLabel="Modal"
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: getBackgroundColor() },
          ]}
          accessibilityRole="alert"
          accessibilityLabel="Modal Content"
          ref={modalRef}
        >
          <Text style={styles.modalText}>
            {typeof message === "string" ? message : <>{message}</>}
          </Text>
          <TouchableOpacity
            onPress={hideModal}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close Modal"
          >
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
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
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
