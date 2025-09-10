import { View, Text, StyleSheet } from "react-native"
import Style from "./style"

export default function CheckoutItem({ order, name }) {
  const renderUserHeader = () => (
    <View style={Style.userHeaderContainer}>
      <View style={Style.avatarContainer}>
        <Text style={Style.avatarText}>{name?.charAt(0)?.toUpperCase()}</Text>
      </View>
      <Text style={Style.userName}>{name}</Text>
    </View>
  )

  return (
    <View style={Style.container}>
      {renderUserHeader()}
      {order.map((item, index) => (
        <View key={index}>
          <View style={Style.itemContainer}>
            <View style={Style.itemDetailsContainer}>
              <View style={Style.countContainer}>
                <Text style={Style.countText}>{item.count}</Text>
              </View>
              <View style={Style.itemInfoContainer}>
                <Text style={Style.itemName}>{item.item.name.en}</Text>
                <Text style={Style.itemPrice}>{item.item.price} JOD each</Text>
              </View>
            </View>
            <View style={Style.totalContainer}>
              <Text style={Style.totalPrice}>{item.count * item.item.price} JOD</Text>
            </View>
          </View>
          {index < order.length - 1 && <View style={Style.itemDivider} />}
        </View>
      ))}
      <View style={Style.sectionDivider} />
    </View>
  )
}