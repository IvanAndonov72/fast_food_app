import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { router } from "expo-router";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { account, getCurrentUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const profile = () => {
  const { data: user, loading } = useAppwrite({
    fn: getCurrentUser,
  });

  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // ✅ updates Zustand immediately
    router.replace("/sign-in"); // redirect
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
        </View>
        <View className="pt-20 pl-5 ">
          <View className="flex flex-row pb-7">
            <Image source={images.user} className="w-10 h-10 rounded-full " />
            <View className="pl-6">
              <Text className="text-gray-200 pb-1">Full Name</Text>
              <Text className="font-quicksand-bold ">{user.name}</Text>
            </View>
          </View>
          <View className="flex flex-row  pb-7">
            <Image
              source={images.envelope}
              className="w-10 h-10 rounded-full "
            />
            <View className="pl-6">
              <Text className="text-gray-200 pb-1">Email address</Text>
              <Text className="font-quicksand-bold">{user.email}</Text>
            </View>
          </View>
          {user.phone && (
            <View className="flex flex-row  pb-7">
              <Image
                source={images.phone}
                className="w-10 h-10 rounded-full "
              />
              <View className="pl-6">
                <Text className="text-gray-200 pb-1">Phone number</Text>
                <Text className="font-quicksand-bold">{user.phone}</Text>
              </View>
            </View>
          )}

          {user.homeAddress && (
            <View className="flex flex-row  pb-7">
              <Image
                source={images.location}
                className="w-10 h-10 rounded-full "
              />
              <View className="pl-6">
                <Text className="text-gray-200 pb-1">Address Nr.1 - Home</Text>
                <Text className="font-quicksand-bold">{user.homeAddress}</Text>
              </View>
            </View>
          )}

          {user.workAddress && (
            <View className="flex flex-row  pb-7">
              <Image
                source={images.location}
                className="w-10 h-10 rounded-full "
              />
              <View className="pl-6">
                <Text className="text-gray-200 pb-1">Address Nr.2 - Work</Text>
                <Text className="font-quicksand-bold">{user.workAddress}</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          className="w-3/4 self-center bg-[#FE8C000D] rounded-full border border-primary  h-[48] mt-5"
          onPress={() => router.push("/profile-edit")}
        >
          <View className="flex justify-center items-center pt-4 flex-row">
            <Text className="font-quicksand-bold text-primary ">
              Edit Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-3/4 self-center bg-[#F141410D] rounded-full border border-red-500 h-[48] mt-2"
          onPress={handleLogout}
        >
          <View className="flex justify-center items-center pt-3 flex-row">
            <Image
              source={images.logout}
              className="size-8"
              resizeMode="contain"
            />
            <Text className="font-quicksand-bold text-red-600 pl-3">
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
