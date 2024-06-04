import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { searchVideos } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { StatusBar } from "expo-status-bar";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: videos, refetch } = useAppwrite(() => searchVideos(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard key={item.$id} video={item} />}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
            <Text className='text-2xl font-psemibold text-white'>{query}</Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='No Videos Found' subtitle='No videos found for this search query' />}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

export default Search;
