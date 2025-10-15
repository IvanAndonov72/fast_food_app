import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { account, getCurrentUser, updateUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const profile_edit = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // ✅ updates Zustand immediately
    router.replace("/sign-in"); // redirect
  };

  const { data: user, loading } = useAppwrite({
    fn: getCurrentUser,
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [workAddress, setWorkAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setHomeAddress(user.homeAddress || "");
      setWorkAddress(user.workAddress || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const hasChanges =
      name !== user.name ||
      phone !== user.phone ||
      homeAddress !== user.homeAddress ||
      workAddress !== user.workAddress;

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    try {
      await updateUser(user.$id, {
        name,
        phone,
        homeAddress,
        workAddress,
      });
      await useAuthStore.getState().fetchAuthenticatedUser();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  if (!user) {
    // If there's no user data (e.g. not logged in)
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">No user data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="custom-header px-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={images.arrowBack}
              className="size-7"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text className="base-bold text-dark-100 text-2xl">Profile</Text>

          <TouchableOpacity onPress={handleLogout}>
            <Image
              source={images.logout}
              className="size-7"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View className="flex items-center">
          <Image
            source={{ uri: user.avatar }}
            className="w-24 h-24 rounded-full "
          />
          <TouchableOpacity>
            <Text className="mt-3 font-quicksand-bold text-primary">
              Change Profile Picture
            </Text>
          </TouchableOpacity>
        </View>
        <View className="pt-20 pl-5 ">
          <View className="flex flex-row pb-7">
            <Image source={images.user} className="w-10 h-10 rounded-full " />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={user.name}
              placeholderTextColor="#9CA3AF"
              className=" w-3/4 bg-gray-50 rounded-lg px-4 py-2 text-gray-800 border border-gray-300 focus:border-primary placeholder-gray-400 ml-6"
            />
          </View>

          <View className="flex flex-row pb-7">
            <Image source={images.phone} className="w-10 h-10 rounded-full " />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={user.phone || "Enter your phone number"}
              placeholderTextColor="#9CA3AF"
              className=" w-3/4 bg-gray-50 rounded-lg px-4 py-2 text-gray-800 border border-gray-300 focus:border-primary placeholder-gray-400 ml-6"
            />
          </View>

          <View className="flex flex-row pb-7">
            <Image
              source={images.location}
              className="w-10 h-10 rounded-full "
            />
            <TextInput
              value={homeAddress}
              onChangeText={setHomeAddress}
              placeholder={user.homeAddress || "Enter your home address"}
              placeholderTextColor="#9CA3AF"
              className=" w-3/4 bg-gray-50 rounded-lg px-4 py-2 text-gray-800 border border-gray-300 focus:border-primary placeholder-gray-400 ml-6"
            />
          </View>

          <View className="flex flex-row pb-7">
            <Image
              source={images.location}
              className="w-10 h-10 rounded-full "
            />
            <TextInput
              value={workAddress}
              onChangeText={setWorkAddress}
              placeholder={user.workAddress || "Enter your work address"}
              placeholderTextColor="#9CA3AF"
              className=" w-3/4 bg-gray-50 rounded-lg px-4 py-2 text-gray-800 border border-gray-300 focus:border-primary placeholder-gray-400 ml-6"
            />
          </View>
        </View>

        <TouchableOpacity
          className="w-3/4 self-center bg-[#FE8C000D] rounded-full border border-primary  h-[48] mt-5"
          onPress={handleSave}
        >
          <View className="flex justify-center items-center pt-4 flex-row">
            <Text className="font-quicksand-bold text-primary ">
              Save Changes
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile_edit;
