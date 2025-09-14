import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const InfoDialog = ({
  visible,
  title,
  message,
  buttonText = 'OK',
  onClose,
  type = 'info', // 'info', 'success', 'error'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          button: styles.successButton,
          buttonText: styles.successButtonText,
          titleColor: '#28A745',
        };
      case 'error':
        return {
          button: styles.errorButton,
          buttonText: styles.errorButtonText,
          titleColor: '#DC3545',
        };
      default:
        return {
          button: styles.infoButton,
          buttonText: styles.infoButtonText,
          titleColor: '#007AFF',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.dialog}>
            {title && (
              <Text style={[styles.title, { color: typeStyles.titleColor }]}>
                {title}
              </Text>
            )}
            {message && <Text style={styles.message}>{message}</Text>}
            
            <TouchableOpacity
              style={[styles.button, typeStyles.button]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, typeStyles.buttonText]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: width * 0.8,
    maxWidth: 320,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoButton: {
    backgroundColor: '#007AFF',
  },
  infoButtonText: {
    color: '#FFFFFF',
  },
  successButton: {
    backgroundColor: '#28A745',
  },
  successButtonText: {
    color: '#FFFFFF',
  },
  errorButton: {
    backgroundColor: '#DC3545',
  },
  errorButtonText: {
    color: '#FFFFFF',
  },
});

export default InfoDialog;