import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'trekops_token';
const USER_KEY = 'trekops_user';

const isWeb = Platform.OS === 'web';

async function setItem(key, value) {
  if (isWeb) return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}
async function getItem(key) {
  if (isWeb) return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}
async function removeItem(key) {
  if (isWeb) return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export const storage = {
  async getToken() {
    return getItem(TOKEN_KEY);
  },
  async setToken(token) {
    return setItem(TOKEN_KEY, token);
  },
  async clearToken() {
    return removeItem(TOKEN_KEY);
  },
  async getUser() {
    const raw = await getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async setUser(user) {
    return setItem(USER_KEY, JSON.stringify(user));
  },
  async clearUser() {
    return removeItem(USER_KEY);
  },
  async clearAll() {
    await removeItem(TOKEN_KEY);
    await removeItem(USER_KEY);
  },
};

let cachedToken = null;
export function setCachedToken(token) {
  cachedToken = token;
}
export function getCachedToken() {
  return cachedToken;
}
