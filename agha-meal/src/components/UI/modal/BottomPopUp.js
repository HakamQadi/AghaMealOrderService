import React, { useState } from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import Button from "../../../components/button/Button";
import Style from "./style";

export default function BottomPopUp({
  selectedItem,
  hideModal,
  name,
  getOrderData,
}) {
  const [itemCount, setItemCount] = useState(0);
  const increaseCount = () => {
    setItemCount(itemCount + 1);
  };
  const decreaseCount = () => {
    itemCount > 0 ? setItemCount(itemCount - 1) : setItemCount(0);
  };

  const addItem = (data) => {
    const { count } = data;

    if (count != 0) {
      console.log("COUNT ::: ", data);
      getOrderData(data);
    } else console.log("THERE IS NO ITEM SELECTED");

    // RESET STATES
    setItemCount(0);
    hideModal();
  };

  const cancel = () => {
    setItemCount(0);
    hideModal();
  };

  return (
    <Modal visible={!!selectedItem} animationType="fade" transparent={true}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={cancel} style={Style.backgroundContainer} />
        <View style={Style.container}>
          <View style={Style.itemDetailsContainer}>
            <View style={{ gap: 10 }}>
              <Text style={Style.itemNameText}>{selectedItem?.name}</Text>
              <Text style={Style.itemPriceText}>{selectedItem?.price} JOD</Text>
            </View>
            <Image source={selectedItem?.image} style={Style.itemImage} />
          </View>
          <View style={Style.counterContainer}>
            <TouchableOpacity onPress={decreaseCount}>
              <Image
                resizeMode="contain"
                style={Style.icon}
                source={require("../../../assets/icon/Minus.jpg")}
              />
            </TouchableOpacity>
            <Text>{itemCount}</Text>
            <TouchableOpacity onPress={increaseCount}>
              <Image
                resizeMode="contain"
                style={Style.icon}
                source={require("../../../assets/icon/Plus.jpg")}
              />
            </TouchableOpacity>
          </View>
          <Button
            style={Style.addButton}
            text="Add"
            onPress={() =>
              addItem({ count: itemCount, item: selectedItem, name })
            }
          />
        </View>
      </View>
    </Modal>
  );
}
