import React from "react";
import { View, Text, Modal, Button } from "react-native";

export default function BottomPopUp({ selectedItem, hideModal }) {
  return (
    <Modal visible={!!selectedItem} animationType="fade" transparent={true}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <View
          style={{
            backgroundColor: "white",
            height: "30%",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: -20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{selectedItem?.name}</Text>
          <Text>{selectedItem?.price} JOD</Text>
          <Button title="Close" onPress={hideModal} />
        </View>
      </View>
    </Modal>
  );
}
