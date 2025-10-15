import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { getMenuById } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { appwriteConfig } from "@/lib/appwrite";
import CustomHeader from "@/components/CustomHeader";
import { images, sides, toppings } from "@/constants";
import Customization from "@/components/Customization";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { Image as ExpoImage } from "expo-image";

const MenuDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCartStore();

  // Fetch the specific menu item by ID
  const { data: item, loading } = useAppwrite({
    fn: getMenuById,
    params: { id }, // You'll adjust your getMenu function to support fetching by id
  });

  if (loading || !item)
    return (
      <SafeAreaView className="items-center justify-center h-full">
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  const imageUrl = item.image_url.startsWith("http")
    ? item.image_url
    : `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${item.image_url}/view?project=${appwriteConfig.projectId}`;

  const toggleSelection = (
    name: string,
    selectedList: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedList.includes(name)) {
      setList(selectedList.filter((n) => n !== name));
    } else {
      setList([...selectedList, name]);
    }
  };

  const toppingsTotal = toppings
    .filter((t) => selectedToppings.includes(t.name))
    .reduce((sum, t) => sum + t.price, 0);

  const sidesTotal = sides
    .filter((s) => selectedSides.includes(s.name))
    .reduce((sum, s) => sum + s.price, 0);

  const total = (item.price + toppingsTotal + sidesTotal) * quantity;

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="p-5">
        <CustomHeader title={item.name} />
        <View className="flex-row items-start  mt-5">
          <View className="flex-1 ">
            <Text className="text-3xl font-quicksand-bold mb-6">
              {item.name}
            </Text>
            <Text className="text-xl font-quicksand-medium text-gray-200 mb-2">
              {Array.isArray(item.categories)
                ? item.categories.map((c) => c.name).join(", ")
                : item.categories?.name || "Uncategorized"}
            </Text>
            <View className="flex-row pb-5">
              <Image source={images.star} className="size-7" />
              <Image source={images.star} className="size-7" />
              <Image source={images.star} className="size-7" />
              <Image source={images.star} className="size-7" />
              <Image source={images.star} className="size-7" />
              <Text className="text-gray-200 mt-1 pl-2">{item.rating}/5</Text>
            </View>

            <Text className="text-3xl font-quicksand-bold mb-4">
              <Text className="text-primary">$</Text>
              {item.price.toFixed(2)}
            </Text>

            <Text className="text-gray-700 leading-6">
              {item.ingredients || "No description available."}
            </Text>
          </View>

          <ExpoImage
            source={{ uri: imageUrl }}
            style={{
              width: "50%",
              height: 220,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
            }}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={500}
          />
        </View>
        <View className="flex-row px-4 py-2 bg-gray-50 justify-between mt-2 rounded-3xl ">
          <View className="flex-row">
            <Image
              source={images.dollar}
              className="size-7"
              resizeMode="contain"
            />
            <Text className="font-quicksand-bold mt-1 text-sm">
              Free Delivery
            </Text>
          </View>
          <View className="flex-row">
            <Image
              source={images.clock}
              className="size-4 mt-1"
              resizeMode="contain"
            />
            <Text className="font-quicksand-bold mt-1 text-sm pl-1">
              20-25 mins
            </Text>
          </View>
          <View className="flex-row pr-5">
            <Image
              source={images.star}
              className="size-7"
              resizeMode="contain"
            />
            <Text className="font-quicksand-bold mt-1 text-sm ">
              {item.rating}
            </Text>
          </View>
        </View>
        <View className="px-5 mt-9 mb-8">
          <Text className="font-quicksand-semibold text-gray-600">
            {item.description}
          </Text>
        </View>
        <Text className="font-quicksand-bold text-xl py-4 ml-4">Toppings</Text>
        <FlatList
          data={toppings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                toggleSelection(
                  item.name,
                  selectedToppings,
                  setSelectedToppings
                )
              }
            >
              <Customization
                item={item}
                selected={selectedToppings.includes(item.name)}
              />
            </TouchableOpacity>
          )}
          contentContainerClassName="gap-7 px-5"
        />
        <Text className="font-quicksand-bold text-xl py-4 ml-4">Sides</Text>
        <FlatList
          data={sides}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                toggleSelection(item.name, selectedSides, setSelectedSides)
              }
            >
              <Customization
                item={item}
                selected={selectedSides.includes(item.name)}
              />
            </TouchableOpacity>
          )}
          contentContainerClassName="gap-7 px-5"
        />
        <View className="mt-8 bg-white p-5 border-t border-gray-200 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-[#3C2F2F] rounded-full w-8 h-8 items-center justify-center"
            >
              <Text className="text-white text-lg">-</Text>
            </TouchableOpacity>

            <Text className="mx-4 text-lg font-quicksand-semibold">
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              className="bg-[#3C2F2F] rounded-full w-8 h-8 items-center justify-center"
            >
              <Text className="text-white text-lg">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-3xl px-5 py-3"
            onPress={() => {
              addItem({
                id: item.$id,
                name: item.name,
                price: item.price,
                image_url: imageUrl,
              });
              setAddedToCart(true);

              setTimeout(() => setAddedToCart(false), 2000);
            }}
          >
            <Text className="text-white font-quicksand-bold text-base">
              {addedToCart
                ? "Added to Cart ✔️"
                : `Add to Cart (${total.toFixed(2)})`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuDetails;
