import { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ImageBackground, Dimensions, StyleSheet } from "react-native"
import Button from "../../button/Button"
import styles from "./style"



const BottomPopUp = ({ selectedItem, hideModal, name, getOrderData }) => {
  const [itemCount, setItemCount] = useState(0)

  const increaseCount = () => {
    setItemCount(itemCount + 1)
  }

  const decreaseCount = () => {
    itemCount > 0 ? setItemCount(itemCount - 1) : setItemCount(0)
  }

  const addItem = (data) => {
    const { count } = data
    if (count != 0) {
      getOrderData(data)
    } else console.log("THERE IS NO ITEM SELECTED")

    // RESET STATES
    setItemCount(0)
    hideModal()
  }

  const cancel = () => {
    setItemCount(0)
    hideModal()
  }

  return (
    <Modal visible={!!selectedItem} transparent={true} animationType="slide" onRequestClose={hideModal}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={hideModal} />

        <View style={styles.modalContainer}>
          {selectedItem && (
            <>
              {/* Item Image */}
              <ImageBackground style={styles.itemImage} source={{ uri: selectedItem.image }} resizeMode="cover">
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{selectedItem.price} JOD</Text>
                </View>
              </ImageBackground>

              {/* Item Details */}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{selectedItem?.name?.en}</Text>
                <Text style={styles.itemDescription}>Delicious meal option</Text>
              </View>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantity</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.quantityButton} onPress={decreaseCount}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{itemCount}</Text>

                  <TouchableOpacity style={styles.quantityButton} onPress={increaseCount}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Button
                  style={styles.addButton}
                  text="Add to Order"
                  onPress={() =>
                    addItem({
                      count: itemCount,
                      item: selectedItem,
                      name,
                    })
                  }
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}


export default BottomPopUp
