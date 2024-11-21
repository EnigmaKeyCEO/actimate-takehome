import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ModalProvider, useModal } from '../Modal';
import { Button, Text, VStack } from 'native-base';

const TestModalContent = () => {
  const { showModal, hideModal, isVisible, message, type } = useModal();

  return (
    <VStack space={4} alignItems="center">
      <Button onPress={() => showModal('Test Modal Message', 'info')}>
        Open Modal
      </Button>
      <Button onPress={hideModal}>
        Close Modal
      </Button>
      {isVisible && (
        <Text accessibilityRole="header" testID="modal-message">{message}</Text>
      )}
    </VStack>
  );
};

describe('Modal Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ModalProvider>
        <TestModalContent />
      </ModalProvider>
    );

    expect(getByText('Open Modal')).toBeTruthy();
    expect(getByText('Close Modal')).toBeTruthy();
  });

  it('opens the modal when Open Modal button is pressed', async () => {
    const { getByText, getByTestId } = render(
      <ModalProvider>
        <TestModalContent />
      </ModalProvider>
    );

    fireEvent.press(getByText('Open Modal'));

    await waitFor(() => {
      expect(getByTestId('modal-message')).toBeTruthy();
      expect(getByTestId('modal-message').props.children).toBe('Test Modal Message');
    });
  });

  it('closes the modal when Close Modal button is pressed', async () => {
    const { getByText, queryByTestId } = render(
      <ModalProvider>
        <TestModalContent />
      </ModalProvider>
    );

    fireEvent.press(getByText('Open Modal'));

    await waitFor(() => {
      expect(queryByTestId('modal-message')).toBeTruthy();
    });

    fireEvent.press(getByText('Close Modal'));

    await waitFor(() => {
      expect(queryByTestId('modal-message')).toBeNull();
    });
  });

  it('displays the correct modal type style', async () => {
    const { getByText, getByTestId } = render(
      <ModalProvider>
        <TestModalContent />
      </ModalProvider>
    );

    fireEvent.press(getByText('Open Modal'));

    await waitFor(() => {
      const modalMessage = getByTestId('modal-message');
      expect(modalMessage).toBeTruthy();
      // Add assertions based on the modal type styling, e.g., color
      // This requires accessing the component's styles or props
    });
  });

  // Additional tests for accessibility roles, focus management, etc.
});
