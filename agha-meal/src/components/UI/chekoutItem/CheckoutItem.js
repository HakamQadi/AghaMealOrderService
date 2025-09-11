import { View, Text } from "react-native";
import Style from "./style";

export default function CheckoutItem({ name, count, price }) {
  return (
    <View style={Style.container}>
      <View style={Style.itemContainer}>
        <View style={Style.itemDetailsContainer}>
          <View style={Style.countContainer}>
            <Text style={Style.countText}>{count}</Text>
          </View>
          <View style={Style.itemInfoContainer}>
            <Text style={Style.itemName}>{name}</Text>
            <Text style={Style.itemPrice}>{price} JOD each</Text>
          </View>
        </View>
        <View style={Style.totalContainer}>
          <Text style={Style.totalPrice}>
            {(count * price).toFixed(2)} JOD
          </Text>
        </View>
      </View>
      <View style={Style.sectionDivider} />
    </View>
  );
}
