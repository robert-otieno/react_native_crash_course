import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import { useState } from "react";
import { fetchLatestVideos, fetchVideos } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { VideoCard, Trending, EmptyState, SearchInput } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  const { data: videos, refetch } = useAppwrite(fetchVideos);
  const { data: latestVideos } = useAppwrite(fetchLatestVideos);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard key={item.$id} video={item} />}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>Welcome back,</Text>
                <Text className='text-2xl font-psemibold text-white'>{user?.username}</Text>
              </View>

              <View className='mt-1.5'>
                <Image source={images.logoSmall} className='w-9 h-10 ' resizeMode='contain' />
              </View>
            </View>

            <SearchInput placeholder='Search for a video topic' />

            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>Latest Videos</Text>

              <Trending videos={latestVideos ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='No Videos Found' subtitle='Be the first one to create a video' />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

export default Home;
