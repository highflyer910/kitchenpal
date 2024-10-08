import { Client, Account, ID } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);

export { client, account, ID };

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