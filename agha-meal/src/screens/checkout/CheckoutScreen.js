// // import React, { useContext, useState, useEffect } from "react";
// // import { View, Text, TextInput, ScrollView } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { OrderContext } from "../../context/OrderContext";
// // import Button from "../../components/button/Button";
// // import OrderItem from "../../components/orderItem/OrderItem";
// // import Style from "./style";
// // import CheckoutItem from "../../components/UI/modal/chekoutItem/CheckoutItem";

// // const CheckoutScreen = () => {
// //   const items = [
// //     {
// //       id: 1,
// //       name: "shawarma double",
// //       price: 10,
// //       count: 12,
// //     },
// //     {
// //       id: 2,
// //       name: "shawarma regular",
// //       price: 12,
// //       count: 14,
// //     },
// //     {
// //       id: 3,
// //       name: "shawarma super",
// //       price: 13,
// //       count: 11,
// //     },
// //   ];

// //   return (
// //     <View style={{ flex: 1 }}>
// //       {/* <Text style={Style.headerText}>Delivery Cost</Text> */}
// //       <ScrollView style={Style.listContainer}>
// //         {/* checkout item */}
// //         {items.map((item) => {
// //           return (
// //             <CheckoutItem
// //               key={item.id}
// //               //   id={item.id}
// //               name={item.name}
// //               count={item.count}
// //               price={item.price}
// //             />
// //           );
// //         })}
// //       </ScrollView>
// //       <View style={Style.detailsContainer}>
// //         <View style={Style.detailsRowContainer}>
// //           <Text>Subtotal</Text>
// //           <Text>123 JOD</Text>
// //         </View>
// //         <View style={Style.detailsRowContainer}>
// //           <Text>Subtotal</Text>
// //           <Text>123 JOD</Text>
// //         </View>
// //         <View style={Style.detailsRowContainer}>
// //           <Text>Subtotal</Text>
// //           <Text>123 JOD</Text>
// //         </View>
// //       </View>
// //       <Button
// //         style={Style.button}
// //         text={"Complete Order"}
// //         onPress={async () => {
// //           try {
// //             await AsyncStorage.removeItem("orders");
// //             console.log("Orders cleared from AsyncStorage");
// //           } catch (error) {
// //             console.error("Error clearing orders from AsyncStorage:", error);
// //           }
// //         }}
// //       />
// //     </View>
// //   );
// // };

// // export default CheckoutScreen;

// import React, { useContext, useState, useEffect } from "react";
// import { View, Text, TextInput, ScrollView } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { OrderContext } from "../../context/OrderContext";
// import Button from "../../components/button/Button";
// import OrderItem from "../../components/orderItem/OrderItem";
// import Style from "./style";
// import CheckoutItem from "../../components/UI/modal/chekoutItem/CheckoutItem";

// const CheckoutScreen = () => {
//   const { state } = useContext(OrderContext);

//   // Function to group orders by item name
//   const groupOrdersByName = () => {
//     const ordersByName = {};
//     state.order.forEach((order) => {
//       const itemName = order.item.name;
//       if (!ordersByName[itemName]) {
//         ordersByName[itemName] = [];
//       }
//       ordersByName[itemName].push(order);
//     });
//     return ordersByName;
//   };

//   // Get grouped orders
//   const ordersByName = groupOrdersByName();

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView style={Style.listContainer}>
//         {/* Display checkout items grouped by name */}
//         {Object.entries(ordersByName).map(([itemName, orders]) => (
//           <View key={itemName}>
//             {orders.map((order, index) => (
//               <CheckoutItem
//                 key={index}
//                 name={order.item.name}
//                 count={order.count}
//                 price={order.item.price}
//               />
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//       {/* Calculate and display subtotal */}
//       <View style={Style.detailsContainer}>
//         <View style={Style.detailsRowContainer}>
//           <Text>Subtotal</Text>
//           {/* Calculate subtotal based on orders */}
//           <Text>calculateSubtotal</Text>
//           {/* <Text>{calculateSubtotal()}</Text> */}
//         </View>
//       </View>
//       <Button
//         style={Style.button}
//         text={"Complete Order"}
//         onPress={async () => {
//           try {
//             await AsyncStorage.removeItem("orders");
//             console.log("Orders cleared from AsyncStorage");
//           } catch (error) {
//             console.error("Error clearing orders from AsyncStorage:", error);
//           }
//         }}
//       />
//     </View>
//   );
// };

// export default CheckoutScreen;

import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderContext } from "../../context/OrderContext";
import Button from "../../components/button/Button";
import Style from "./style";
import CheckoutItem from "../../components/UI/modal/chekoutItem/CheckoutItem";

const CheckoutScreen = ({ navigation }) => {
  const { state } = useContext(OrderContext);

  // Function to group orders by item name
  const groupOrdersByName = () => {
    const ordersByName = {};
    state.order.forEach((order) => {
      const itemName = order.item.name;
      if (!ordersByName[itemName]) {
        ordersByName[itemName] = { ...order, count: 0 };
      }
      ordersByName[itemName].count += order.count;
    });
    return ordersByName;
  };

  // Get grouped orders
  const ordersByName = groupOrdersByName();

  // Calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    Object.values(ordersByName).forEach((order) => {
      subtotal += order.count * order.item.price;
    });
    return subtotal;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={Style.listContainer}>
        {/* Display checkout items grouped by name */}
        {Object.entries(ordersByName).map(([itemName, order]) => (
          <CheckoutItem
            key={itemName}
            name={itemName}
            count={order.count}
            // price={order.item.price }
            price={order.item.price * order.count}
          />
        ))}
      </ScrollView>
      {/* Calculate and display subtotal */}
      <View style={Style.detailsContainer}>
        <View style={Style.detailsRowContainer}>
          <Text>Subtotal</Text>
          <Text>{calculateSubtotal()} JOD</Text>
        </View>
      </View>
      <Button
        style={Style.button}
        text={"Complete Order"}
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("orders");
            console.log("Orders cleared from AsyncStorage");
            navigation.navigate("Names");
          } catch (error) {
            console.error("Error clearing orders from AsyncStorage:", error);
          }
        }}
      />
    </View>
  );
};

export default CheckoutScreen;
