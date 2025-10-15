import { SafeAreaView } from "react-native-safe-area-context";
import "../globals.css";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images, offers } from "@/constants";
import { Fragment, useState } from "react";
import cn from "clsx";
import CartButton from "@/components/CartButton";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState("Macedonia");
  const [modalVisible, setModalVisible] = useState(false);
  const countries = ["Macedonia", "Greece", "Serbia", "Slovenia", "Bulgaria"];
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven: boolean = index % 2 === 0;

          return (
            <View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/search",
                    params: { category: item.id },
                  })
                }
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row"
                )}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View className={"h-full w-1/2"}>
                      <Image
                        source={item.image}
                        className={"size-full"}
                        resizeMode={"contain"}
                      />
                    </View>

                    <View
                      className={cn(
                        "offer-card_info flex-1",
                        isEven ? "pl-10" : "pr-10"
                      )}
                    >
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="flex-between flex-row w-full my-5 px-5 ">
            <View className="flex-start">
              <Text className="small-bold text-primary">DELIVER TO</Text>
              <TouchableOpacity
                className="flex-center flex-row gap-x-1"
                onPress={() => setModalVisible(true)}
              >
                <Text className="paragraph-bold text-dark-100">
                  {selectedCountry}
                </Text>
                <Image
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <CartButton />
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 rounded-2xl p-5">
            <Text className="h2-bold mb-3 text-center font-quicksand-bold bg-gray-300 py-3 rounded-3xl">
              Select Country
            </Text>

            {countries.map((country) => (
              <TouchableOpacity
                key={country}
                onPress={() => {
                  setSelectedCountry(country);
                  setModalVisible(false);
                }}
                className="py-3 border-b border-gray-200"
              >
                <Text
                  className={cn(
                    "text-center text-lg font-quicksand-bold",
                    country === selectedCountry
                      ? "text-primary font-bold"
                      : "text-dark-100"
                  )}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 py-2 rounded-xl bg-primary"
            >
              <Text className="text-center text-dark-100 font-quicksand-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
