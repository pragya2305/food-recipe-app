import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import CachedImage from "../helpers/image";

const Categories = ({ categories, activeCategory, handleChangeCategory }) => {
  console.log(categories);
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className='space-x-4'
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categories.map((cat, index) => {
          let isActive = index == activeCategory;
          let activeButtonClass = isActive ? "bg-amber-400" : "bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(index)}
              className='flex flex-col space-y-1 items-center justify-center '
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                <CachedImage
                  uri={cat.strCategoryThumb}
                  style={{ width: hp(6), height: hp(6) }}
                  className='rounded-full'
                />
              </View>
              <Text className='text-neutral-600' style={{ fontSize: hp(1.6) }}>
                {cat.strCategory}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default Categories;
