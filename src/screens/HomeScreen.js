import { View, Text, ScrollView, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Recipes from "../components/Recipes";
import Categories from "../components/Categories";
import Loading from "../components/Loading";

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        if (data) {
          setCategories(data.categories);
          getRecipes(data.categories[activeCategory]?.strCategory);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleChangeCategory = (categoryIndex) => {
    getRecipes(categories[categoryIndex]?.strCategory);
    setActiveCategory(categoryIndex);
  };

  const getRecipes = async (category) => {
    try {
      const { data } = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/filter.php",
        { params: { c: category } }
      );
      console.log(data);
      if (data && data.meals) {
        setRecipes(data.meals);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className='space-y-6 pt-14'
      >
        {/* avatar and bell icon */}
        <View className='mx-4 flex-row justify-between items-center mb-2'>
          <Image
            source={require("../../assets/avatar.jpeg")}
            style={{ height: hp(5), width: hp(5.5) }}
            className='rounded-full'
          />
          <BellIcon size={hp(4)} color='gray' />
        </View>

        {/* greetings and punchline */}
        <View className='mx-4 space-y-2 mb-2'>
          <Text style={{ fontSize: hp(1.7) }} className='text-neutral-600'>
            Hello, Pragya!
          </Text>
          <View>
            <Text
              style={{ fontSize: hp(3.8) }}
              className='text-neutral-600 font-semibold'
            >
              Make Your own food,
            </Text>
          </View>
          <Text
            style={{ fontSize: hp(3.8) }}
            className='text-neutral-600 font-semibold'
          >
            stay at <Text className='text-amber-400'>home</Text>
          </Text>
        </View>

        {/* search bar */}
        <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
          <TextInput
            placeholder='Search any recipe'
            placeholderTextColor={"gray"}
            style={{ fontSize: hp(1.7) }}
            className='flex-1 text-base mb-1 pl-3 tracking-wider'
          />
          <View className='bg-white rounded-full p-3'>
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color='gray' />
          </View>
        </View>

        {/* categories */}
        <View>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* recipes */}
        <View>
          {recipes?.length > 0 ? (
            <Recipes recipes={recipes} />
          ) : (
            <Loading size='large' className='mt-20' />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
