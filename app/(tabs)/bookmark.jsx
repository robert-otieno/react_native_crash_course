import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyState, SearchInput, VideoCard } from '../../components'
import { StatusBar } from 'expo-status-bar'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getLikedVideos } from '../../lib/appwrite'

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: videos } = useAppwrite(() => getLikedVideos(user.$id));

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard key={item.$id} video={item} />}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            {/* <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text> */}
            <Text className='text-2xl font-psemibold text-white'>Saved Videos</Text>

            <View className='mt-6 mb-8'>
              <SearchInput placeholder="Search your saved videos" />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title='No Videos Found' subtitle='Like a video to see it appear here.' />}
      />
      <StatusBar style='light' />
    </SafeAreaView>
  )
}

export default Bookmark