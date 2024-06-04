import { FlatList, TouchableOpacity, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserVideos, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: videos } = useAppwrite(() => getUserVideos(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard key={item.$id} video={item} />}
        ListHeaderComponent={() => (
          <View className='f-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity onPress={logout} className='w-full items-end mb-10'>
              <Image source={icons.logout} resizeMode='contain' className='w-6 h6' />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center p-0.5'>
              <Image source={{ uri: user?.avatar }} className='w-full h-full rounded-md' resizeMode='cover' />
            </View>

            <InfoBox title={user?.username} containerStyle='mt-5' titleStyle='text-lg' />

            <View className='mt-5 flex-row'>
              <InfoBox title={videos.length || 0} subtitle='Videos' containerStyle='mr-10' titleStyle='text-xl' />
              <InfoBox title='1.2k' subtitle='Followers' titleStyle='text-xl' />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='No Videos Found' subtitle='No videos found for this search query' />}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

export default Profile;
