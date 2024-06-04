import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
            <Image source={{ uri: avatar }} className='w-full h-full rounded-md' resizeMode='cover' />
          </View>
          <View className='justify-center flex-1 ml-3 gap-y-1'>
            <Text className='text-white font-pbold text-sm' numberOfLines={1}>
              {title}
            </Text>
            <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>

        <View className='flex-row gap-3'>
          <Ionicons onPress={() => setLiked(!liked)} name={liked ? "heart-sharp" : "heart-outline"} size={30} color='#FF9C01' />
          <MaterialCommunityIcons name='dots-vertical' size={30} color='white' />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className='w-full h-60 rounded-xl mt-3'
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity activeOpacity={0.7} onPress={() => setPlay(true)} className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
          <Image source={{ uri: thumbnail }} className='w-full h-full rounded-xl mt-3' resizeMode='cover' />
          <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
