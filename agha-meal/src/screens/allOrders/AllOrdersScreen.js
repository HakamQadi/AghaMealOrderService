import { useContext, useState, useEffect } from "react"
import { View, Text, TextInput, ScrollView, SafeAreaView } from "react-native"
import { OrderContext } from "../../context/OrderContext"
import Button from "../../components/button/Button"
import OrderItem from "../../components/orderItem/OrderItem"
import Style from "./style"
import SomethingWentWrong from "../../components/UI/wentWrong/SomethingWentWrong"

export default function AllOrdersScreen({ navigation }) {
  const { state } = useContext(OrderContext)
  const [deliveryCost, setDeliveryCost] = useState("")
  const [deliveryCostPerName, setDeliveryCostPerName] = useState("")
  const [totalPrices, setTotalPrices] = useState({})
  const [isEmptyOrders, setIsEmptyOrders] = useState(false)

  const nameCount = state.names.length

  const handleDeliveryCost = (cost) => {
    setDeliveryCostPerName(Number.parseFloat(cost) / nameCount)
    setDeliveryCost(cost)
  }

  const handleCompleteOrder = () => {
    navigation.navigate("Checkout", { deliveryCost: deliveryCost })
  }

  useEffect(() => {
    const calculateTotalPrices = () => {
      const ordersByName = {}
      state.order.forEach((order) => {
        if (!ordersByName[order.name]) {
          ordersByName[order.name] = []
        }
        ordersByName[order.name].push(order)
      })
      const updatedTotalPrices = {}
      Object.entries(ordersByName).forEach(([name, orders]) => {
        let totalPriceForName = 0
        orders.forEach((order) => {
          const totalItemPrice = order.item.price * order.count
          totalPriceForName += totalItemPrice
        })
        if (!isNaN(Number.parseFloat(deliveryCostPerName))) {
          totalPriceForName += Number.parseFloat(deliveryCostPerName)
        }
        updatedTotalPrices[name] = totalPriceForName
      })
      setTotalPrices(updatedTotalPrices)
    }

    calculateTotalPrices()
  }, [state.order, nameCount, deliveryCostPerName])

  return (
    <SafeAreaView style={Style.container}>
      <View style={Style.headerContainer}>
        <View style={Style.headerContent}>
          <Text style={Style.headerIcon}>🚚</Text>
          <View>
            <Text style={Style.headerText}>Delivery Cost</Text>
            <Text style={Style.headerSubtext}>Enter total delivery fee</Text>
          </View>
        </View>
      </View>

      <View style={Style.inputContainer}>
        <View style={Style.inputWrapper}>
          <Text style={Style.currencyIcon}>💰</Text>
          <TextInput
            style={Style.input}
            placeholder="0 JD"
            placeholderTextColor="#999"
            value={deliveryCost}
            onChangeText={handleDeliveryCost}
            keyboardType="numeric"
          />
        </View>
      </View>

      {isEmptyOrders ? (
        <SomethingWentWrong message={"There is no orders yet"} />
      ) : (
        <ScrollView style={Style.scrollView} showsVerticalScrollIndicator={false}>
          {Object.entries(totalPrices).map(([name, totalPriceForName], index) => (
            <View style={Style.orderCard} key={index}>
              <View style={Style.nameHeader}>
                <View style={Style.avatarContainer}>
                  <Text style={Style.avatarText}>{name.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={Style.nameText}>{name}</Text>
              </View>

              <View style={Style.orderItemsContainer}>
                {state.order
                  .filter((order) => order.name === name)
                  .map((order, index) => (
                    <OrderItem
                      key={index}
                      item={order.item}
                      count={order.count}
                      totalItemPrice={order.item.price * order.count}
                    />
                  ))}
              </View>

              <View style={Style.totalSection}>
                <View style={Style.divider} />
                <View style={Style.totalContainer}>
                  <View style={Style.totalRow}>
                    <Text style={Style.totalLabel}>Delivery Fee:</Text>
                    <Text style={Style.totalValue}>
                      {deliveryCostPerName ? `${deliveryCostPerName.toFixed(2)} JD` : "0 JD"}
                    </Text>
                  </View>
                  <View style={Style.totalRowFinal}>
                    <Text style={Style.totalLabelFinal}>Total:</Text>
                    <Text style={Style.totalValueFinal}>{totalPriceForName.toFixed(2)} JD</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={Style.buttonContainer}>
        <Button style={Style.button} text={"Complete Order"} onPress={handleCompleteOrder} />
      </View>
    </SafeAreaView>
  )
}
