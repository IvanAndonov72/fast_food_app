import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "@/constants";
import { Feather } from "@expo/vector-icons";
import cn from "clsx";

type CustomizationProps = {
  item: {
    name: string;
    image: any; // or ImageSourcePropType if you want stricter typing
    price: number;
  };
  selected?: boolean;
};

const Customization = ({ item, selected }: CustomizationProps) => {
  return (
    <View
      className={cn(
        "w-[90px] h-[99px] rounded-3xl bg-[#3C2F2F] overflow-hidden shadow-lg",
        selected ? "bg-[#909090]" : "bg-[#3C2F2F]"
      )}
    >
      {/* Top white section */}
      <View className="bg-white flex-[1.2] items-center justify-center rounded-3xl">
        <Image source={item.image} className="w-20 h-20" resizeMode="contain" />
      </View>

      {/* Bottom brown “drip” section */}
      <View
        className={cn(
          "flex-[0.8] flex-row items-center justify-between px-2  rounded-t-3xl",
          selected ? "bg-[#909090]" : "bg-[#3C2F2F]"
        )}
      >
        <Text
          className="text-white font-quicksand-semibold text-xs "
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <View className="  bg-red-600 rounded-full p-1 ">
          <Feather name="plus" size={10} color="white" />
        </View>
      </View>
    </View>
  );
};

export default Customization;
