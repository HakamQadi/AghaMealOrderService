// TODO future apdate : add more than one resturant

import { useState, useEffect } from "react"
import { View, Text, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Category from "../../components/category/Category"
import Button from "../../components/button/Button"
import Style from "./style"
import { API_URL } from "@env"
import axios from "axios"

const HomeScreen = ({ navigation, route }) => {
  const { names } = route.params
  const [currentIndex, setCurrentIndex] = useState(0)
  const [categories, setCategories] = useState([])

  const handleNextName = () => {
    if (names.length == currentIndex + 1) {
      // navigate to ALl orders screen
      navigation.navigate("Orders")
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/categories`)
        setCategories(response.data.categories) // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <SafeAreaView style={Style.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={Style.headerContainer}>
        <View style={Style.progressContainer}>
          <View style={Style.progressBar}>
            <View style={[Style.progressFill, { width: `${((currentIndex + 1) / names.length) * 100}%` }]} />
          </View>
          <Text style={Style.progressText}>
            {currentIndex + 1} of {names.length}
          </Text>
        </View>

        <View style={Style.nameContainer}>
          <View style={Style.avatarContainer}>
            <Text style={Style.avatarText}>{names[currentIndex].charAt(0).toUpperCase()}</Text>
          </View>
          <View style={Style.nameTextContainer}>
            <Text style={Style.nameText}>{names[currentIndex]}'s Order</Text>
            <View style={Style.subTextContainer}>
              <Ionicons name="restaurant-outline" size={16} color="#6b7280" />
              <Text style={Style.subText}>Choose your favorite category</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={Style.categoryContainer}>
        <Category navigation={navigation} name={names[currentIndex]} categories={categories} />
      </View>

      <View style={Style.buttonContainer}>
        <Button
          text={names.length == currentIndex + 1 ? "Finish Order" : "Continue"}
          onPress={handleNextName}
          style={Style.continueButton}
        />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
