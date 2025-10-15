import useAuthStore from "@/store/auth.store";
import {
  Category,
  CreateUserPrams,
  GetMenuParams,
  MenuItem,
  SignInParams,
} from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.jsm.foorordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "68e013b0001676fe3e9d",
  bucketId: "68e53eef000a066fe40d",
  userCollectionId: "user",
  categoriesCollectionId: "categories",
  menuCollectionId: "menu",
  customizationsCollectionId: "customizations",
  menuCustomizationsCollectionId: "menu_customizations",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, name, avatar: avatarUrl }
    );

    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    await useAuthStore.getState().fetchAuthenticatedUser();
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentAccount) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

// lib/appwrite.ts
export const getMenuById = async ({ id }: { id: string }) => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      [
        Query.equal("$id", id),
        Query.limit(1),
        Query.select(["*"]), // Select all fields
      ]
    );

    // Assuming 'categories' is a relation field
    const item = result.documents[0];
    if (item && item.categories) {
      // Fetch the related categories document
      const category = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        item.categories
      );
      item.categories = category;
    }

    return item;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );
    return categories.documents as unknown as Category[];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateUser = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    homeAddress?: string;
    workAddress?: string;
  }
) => {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      data
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error as string);
  }
};
