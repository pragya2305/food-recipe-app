import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

const CachedImage = (props) => {
  const [cachedSource, setCachedSource] = useState(null);
  const { uri } = props;

  useEffect(() => {
    (async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const res = await fetch(uri);
          const imageBlob = await res.blob();
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onload = () => {
              resolve(reader.result);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error("Error in caching image", error);
      }
    })();
  }, []);

  return <Animated.Image source={cachedSource} {...props} />;
};

export default CachedImage;
