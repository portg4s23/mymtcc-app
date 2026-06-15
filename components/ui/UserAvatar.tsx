import { API_URLS } from "@/constants/urls";
import { User } from "@/models/User.model";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

type UserAvatarProps = {
  user?: User | null;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 32,
  onPress,
  style,
}) => {

  const hasImage = !!user?.rcno;

  const imageUri = user?.rcno
    ? `${API_URLS.avatar}${user.rcno}`
    : null;

  return (
    <Pressable onPress={onPress} style={style}>
      <Image
        source={hasImage ? { uri: `${API_URLS.avatar}${user.rcno}` } : undefined}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={400}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    </Pressable>
  );
};

export default UserAvatar;