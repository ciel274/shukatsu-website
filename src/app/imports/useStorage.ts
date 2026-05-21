import { useState, useEffect } from 'react';

declare const chrome: any;

// For development outside of Chrome Extension environment
const mockStorage = {
  get: (keys: string[]) => {
    return new Promise((resolve) => {
      const data: any = {};
      keys.forEach(k => {
        const val = localStorage.getItem(`shukatsu_${k}`);
        data[k] = val ? JSON.parse(val) : null;
      });
      resolve(data);
    });
  },
  set: (data: any) => {
    return new Promise((resolve) => {
      Object.entries(data).forEach(([k, v]) => {
        localStorage.setItem(`shukatsu_${k}`, JSON.stringify(v));
      });
      resolve(true);
    });
  }
};

const storage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage.local : mockStorage;

export function useStorage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Migration: Move data from sync to local if local is empty
    const migrate = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const local = await chrome.storage.local.get(null);
        if (Object.keys(local).length === 0) {
          const sync = await chrome.storage.sync.get(null);
          if (Object.keys(sync).length > 0) {
            await chrome.storage.local.set(sync);
          }
        }
      }
    };

    const loadData = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await migrate();
      }
      const res = await storage.get(['selections', 'activities', 'profile', 'darkMode', 'esNotebooks', 'settings']);
      setData(res);
      setLoading(false);
    };

    loadData();
  }, []);

  const saveData = (newData: any) => {
    const updated = { ...data, ...newData };
    setData(updated);
    storage.set(newData);
  };

  return { data, saveData, loading };
}
