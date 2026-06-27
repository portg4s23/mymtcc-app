import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  /**
   * Save value (stringified automatically if object)
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error(`[Storage setItem] ${key}`, error);
    }
  }

  /**
   * Get parsed value (auto JSON parse if possible)
   */
  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error(`[Storage getItem] ${key}`, error);
      return null;
    }
  }

  /**
   * Remove single item
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage removeItem] ${key}`, error);
    }
  }

  /**
   * Clear all storage (use carefully)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage clear]', error);
    }
  }

  /**
   * Get multiple keys
   */
  async multiGet<T = any>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const entries = await AsyncStorage.multiGet(keys);

      const result: Record<string, T | null> = {};

      for (const [key, value] of entries) {
        if (!value) {
          result[key] = null;
          continue;
        }

        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value as T;
        }
      }

      return result;
    } catch (error) {
      console.error('[Storage multiGet]', error);
      return {};
    }
  }

  /**
   * Multi set
   */
  async multiSet(items: Record<string, any>): Promise<void> {
    try {
      const pairs = Object.entries(items).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('[Storage multiSet]', error);
    }
  }
}

export const storage = new StorageService();