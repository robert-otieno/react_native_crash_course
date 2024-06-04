import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.rovertos.aura",
  projectId: "661d0d9532d361bb59f9",
  databaseId: "661d0fb86effee11b6c7",
  userCollectionId: "661d0fd9a54c68474642",
  videoCollectionId: "661d0ff871b4206c9151",
  storageId: "661d116651a43228baf5",
};

const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = config;

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const registerUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(databaseId, userCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(databaseId, userCollectionId, [Query.equal("accountId", currentAccount.$id)]);

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const fetchVideos = async () => {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc("$createdAt")]);

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchLatestVideos = async () => {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc("$createdAt", Query.limit(7))]);

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchVideos = async (query) => {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId, [Query.search("title", query)]);

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserVideos = async (userId) => {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId, [Query.equal("creator", userId), Query.orderDesc("$createdAt")]);

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100);
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.filesize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const likeVideo = async (userId, videoId) => {
  let likedVideos = userData.likes || [];

  if (likedVideos.includes(videoId)) {
    // Remove from likes array
    likedVideos = likedVideos.filter((item) => item !== videoId);
  } else {
    likedVideos.push(videoId);
  }

  userData = await users.updateUserField(userId, "likes", likedVideos);

  return !userData.likes.includes(videoId);
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([uploadFile(form.thumbnail, "image"), uploadFile(form.video, "video")]);

    const newVideo = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId,
    });

    return newVideo;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLikedVideos = async (userId) => {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId, [Query.equal("creator", userId), Query.orderDesc("$createdAt")]);

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
};
