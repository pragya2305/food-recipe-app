import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import CachedImage from "../helpers/image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ChevronLeftIcon,
  ClockIcon,
  FireIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/Loading";
import YoutubePlayer from "react-native-youtube-iframe";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const RecipeDetailScreen = ({ route }) => {
  const item = route.params;
  const navigation = useNavigation();
  const [isFavourite, setIsFavourite] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/lookup.php",
          { params: { i: item.idMeal } }
        );
        if (data && data.meals) {
          setMealData(data.meals[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ingredientsIndicies = useCallback(() => {
    let indices = [];
    if (mealData) {
      for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
          indices.push(i);
        }
      }
    }
    return indices;
  }, [mealData]);

  const getYoutubeVideoId = useCallback((url) => {
    const regex = /[?&]v=([^&]+)/;
    const match = url.match(regex);
    return (match && match[1]) || null;
  }, []);

  return (
    <ScrollView
      className='bg-white flex-1'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style='light' />

      {/* recipe image */}
      <View className='flex-row justify-center'>
        <CachedImage
          uri={item.strMealThumb}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
          // sharedTransitionTag={item.strMeal}
        />
      </View>

      {/* back button */}
      <Animated.View
        entering={FadeIn.delay(200).duration(1000)}
        className='w-full absolute flex-row justify-between items-center pt-14'
      >
        <TouchableOpacity
          className='p-2 rounded-full ml-5 bg-white'
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color='#fbbf24' />
        </TouchableOpacity>
        <TouchableOpacity
          className='p-2 rounded-full mr-5 bg-white'
          onPress={() => setIsFavourite(!isFavourite)}
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavourite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* meal description */}
      {loading ? (
        <Loading />
      ) : (
        <View className='px-4 flex justify-between space-y-4 pt-8'>
          {/* name and area */}
          <Animated.View
            entering={FadeInDown.duration(700).springify().damping(12)}
            className='space-y-2'
          >
            <Text
              style={{ fontSize: hp(3) }}
              className='font-bold flex-1 text-neutral-700'
            >
              {mealData?.strMeal}
            </Text>
            <Text
              style={{ fontSize: hp(3) }}
              className='font-medium flex-1 text-neutral-500'
            >
              {mealData?.strArea}
            </Text>
          </Animated.View>

          {/* misc */}
          <Animated.View
            entering={FadeInDown.delay(100)
              .duration(700)
              .springify()
              .damping(12)}
            className='flex-row justify-around'
          >
            {/* time to cook */}
            <View className='flex rounded-full bg-amber-300 p-2'>
              <View
                style={{ height: hp(6.5), width: hp(6.5) }}
                className='bg-white rounded-full flex items-center justify-center'
              >
                <ClockIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
              </View>
              <View className='flex items-center py-2 space-y-1'>
                <Text
                  style={{ fontSize: hp(2) }}
                  className='font-bold text-neutral-700'
                >
                  35
                </Text>
                <Text
                  style={{ fontSize: hp(1.3) }}
                  className='font-bold text-neutral-700'
                >
                  mins
                </Text>
              </View>
            </View>

            {/* servings */}
            <View className='flex rounded-full bg-amber-300 p-2'>
              <View
                style={{ height: hp(6.5), width: hp(6.5) }}
                className='bg-white rounded-full flex items-center justify-center'
              >
                <UsersIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
              </View>
              <View className='flex items-center py-2 space-y-1'>
                <Text
                  style={{ fontSize: hp(2) }}
                  className='font-bold text-neutral-700'
                >
                  03
                </Text>
                <Text
                  style={{ fontSize: hp(1.3) }}
                  className='font-bold text-neutral-700'
                >
                  Servings
                </Text>
              </View>
            </View>

            {/* calories */}
            <View className='flex rounded-full bg-amber-300 p-2'>
              <View
                style={{ height: hp(6.5), width: hp(6.5) }}
                className='bg-white rounded-full flex items-center justify-center'
              >
                <FireIcon size={hp(4)} strokeWidth={2.5} color='#525252' />
              </View>
              <View className='flex items-center py-2 space-y-1'>
                <Text
                  style={{ fontSize: hp(2) }}
                  className='font-bold text-neutral-700'
                >
                  103
                </Text>
                <Text
                  style={{ fontSize: hp(1.3) }}
                  className='font-bold text-neutral-700'
                >
                  Calories
                </Text>
              </View>
            </View>

            {/* easy to cook */}
            <View className='flex rounded-full bg-amber-300 p-2'>
              <View
                style={{ height: hp(6.5), width: hp(6.5) }}
                className='bg-white rounded-full flex items-center justify-center'
              >
                <Square3Stack3DIcon
                  size={hp(4)}
                  strokeWidth={2.5}
                  color='#525252'
                />
              </View>
              <View className='flex items-center py-2 space-y-1'>
                <Text
                  style={{ fontSize: hp(2) }}
                  className='font-bold text-neutral-700'
                ></Text>
                <Text
                  style={{ fontSize: hp(1.3) }}
                  className='font-bold text-neutral-700'
                >
                  Easy
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ingredients */}
          <Animated.View
            entering={FadeInDown.delay(200)
              .duration(700)
              .springify()
              .damping(12)}
            className='space-y-4'
          >
            <Text
              style={{ fontSize: hp(2.5) }}
              className='font-bold flex-1 text-neutral-700'
            >
              Ingredients
            </Text>
            <View className='space-y-2 ml-3'>
              {ingredientsIndicies().map((i) => (
                <View className='flex-row space-x-4' key={i}>
                  <View
                    style={{ height: hp(1.5), width: hp(1.5) }}
                    className='bg-amber-300 rounded-full'
                  />
                  <View className='flex-row space-x-2'>
                    <Text
                      className='font-extrabold text-neutral-700'
                      style={{ fontSize: hp(1.7) }}
                    >
                      {mealData["strMeasure" + i]}
                    </Text>
                    <Text
                      className='font-medium text-neutral-600'
                      style={{ fontSize: hp(1.7) }}
                    >
                      {mealData["strIngredient" + i]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* instructions */}
          <Animated.View
            entering={FadeInDown.delay(300)
              .duration(700)
              .springify()
              .damping(12)}
            className='space-y-4'
          >
            <Text
              style={{ fontSize: hp(2.5) }}
              className='font-bold flex-1 text-neutral-700'
            >
              Instructions
            </Text>
            <Text style={{ fontSize: hp(1.6) }} className='text-neutral-700'>
              {mealData.strInstructions}
            </Text>
          </Animated.View>

          {/* recipe video */}
          {mealData?.strYoutube && (
            <Animated.View
              entering={FadeInDown.delay(400)
                .duration(700)
                .springify()
                .damping(12)}
              className='space-y-4'
            >
              <Text
                style={{ fontSize: hp(2.5) }}
                className='font-bold flex-1 text-neutral-700'
              >
                Recipe Video
              </Text>
              <View>
                <YoutubePlayer
                  videoId={getYoutubeVideoId(mealData.strYoutube)}
                  height={hp(30)}
                />
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default RecipeDetailScreen;
