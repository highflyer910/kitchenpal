import { Client, Account, ID, Databases, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, ID, databases };

export const appwriteAuth = {
    createAccount: async (email, password, name) => {
        return await account.create(ID.unique(), email, password, name);
    },
    login: async (email, password) => {
        return await account.createEmailPasswordSession(email, password);
    },
    getCurrentUser: async () => {
        return await account.get();
    },
    logout: async () => {
        return await account.deleteSession('current');
    }
};

export const saveProduct = async (productName, userId) => {
    try {
        const response = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
            ID.unique(),
            { name: [productName], userId: userId }
        );
        return response;
    } catch (error) {
        console.error("Error saving product:", error);
        throw error;
    }
};

export const getProducts = async (userId) => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
        [
          Query.equal('userId', userId)
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
            productId
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

export const saveDietaryProfile = async (userId, dietaryProfile) => {
    try {
      const preferences = Object.entries(dietaryProfile).flatMap(([category, items]) => 
        Object.entries(items)
          .filter(([_, value]) => value === true || (Array.isArray(value) && value.length > 0))
          .map(([key, value]) => Array.isArray(value) ? value.map(v => `${category}:${v}`) : `${category}:${key}`)
      ).flat();
  
      try {
        const response = await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_DIETARY_PREFERENCES_COLLECTION_ID,
          userId,
          { userId, preferences }
        );
        return response;
      } catch (updateError) {
        if (updateError.code === 404) {
          const response = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_DIETARY_PREFERENCES_COLLECTION_ID,
            userId,
            { userId, preferences }
          );
          return response;
        } else {
          throw updateError;
        }
      }
    } catch (error) {
      console.error("Error saving dietary preferences:", error);
      throw error;
    }
  };
  
  export const getDietaryProfile = async (userId) => {
    try {
      const response = await databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_DIETARY_PREFERENCES_COLLECTION_ID,
        userId
      );
      
      const profile = {
        allergens: { customAllergens: [] },
        preferences: {},
        healthGoals: {}
      };
      
      response.preferences.forEach(pref => {
        const [category, item] = pref.split(':');
        if (category === 'allergens' && !['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish'].includes(item)) {
          profile.allergens.customAllergens.push(item);
        } else {
          profile[category] = profile[category] || {};
          profile[category][item] = true;
        }
      });
  
      return profile;
    } catch (error) {
      if (error.code === 404) {
        return {
          allergens: { customAllergens: [] },
          preferences: {},
          healthGoals: {}
        };
      }
      console.error("Error fetching dietary preferences:", error);
      throw error;
    }
  };