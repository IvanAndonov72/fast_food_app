import { appwriteConfig } from "@/lib/appwrite";
import { MenuItem } from "@/type";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";

const MenuCard = ({ item: { image_url, name, price } }: { item: MenuItem }) => {
  const imageUrl = image_url.startsWith("http")
    ? image_url
    : `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files/${image_url}/view?project=${appwriteConfig.projectId}`;

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 128, height: 128, marginTop: -50 }}
        placeholder={require("@/assets/images/logo.png")}
        contentFit="contain"
        transition={500} // fade-in
        cachePolicy="memory-disk"
      />
      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
      <TouchableOpacity onPress={() => {}}>
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
