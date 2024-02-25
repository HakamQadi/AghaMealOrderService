import { View, Text, ScrollView } from "react-native";
import React from "react";
import Button from "../../components/button/Button";
import Style from "./style";

export default function CheckOutScreen({ navigation }) {
  const items = [
    {
      id: 1,
      name: "شاورما",
      count: 2,
      price: 20,
    },
    {
      id: 2,
      name: "شاورما شاورما",
      count: 2,
      price: 20,
    },
    {
      id: 3,
      name: "شاورما شاورماشاورما",
      count: 2,
      price: 20,
    },
  ];
  return (
    <View
      style={{
        // backgroundColor: "red",
        flex: 1,
      }}
    >
      {/* content */}
      <ScrollView
        style={{
          flex: 1,
          //   backgroundColor: "green",
        }}
      >
        {items.map((item) => {
          return (
            <View style={Style.itemContainer} key={item.id}>
              <Text style={Style.priceText}>{item.price} JOD</Text>
              <View style={Style.itemDetailsContailner}>
                <Text>{item.name}</Text>
                <View style={Style.countContainer}>
                  <Text style={Style.countText}>{item.count}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
      {/* Bottom */}

      <View style={Style.screenBottom}>
        <View style={Style.detailsContainer}>
          <View style={Style.detailsTextContailner}>
            <Text style={Style.detailsText}>1000 JOD</Text>
            <Text style={Style.detailsText}>Subtotal</Text>
          </View>
          <View style={Style.detailsTextContailner}>
            <Text style={Style.detailsText}>1000 JOD</Text>
            <Text style={Style.detailsText}>Delivrey</Text>
          </View>
          <View style={Style.detailsTextContailner}>
            <Text style={Style.totalText}>1000 JOD</Text>
            <Text style={Style.detailsText}>Total</Text>
          </View>
        </View>

        <Button style={{ alignSelf: "center" }} text="Finish and CLEAR" />
      </View>
    </View>
  );
}
