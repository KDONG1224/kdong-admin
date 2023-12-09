const StorageBuilder = (storage: Storage) => ({
  setItem: (key: string, value: string) => storage.setItem(key, value),
  getItem: (key: string) => storage.getItem(key),
  removeItem: (key: string) => storage.removeItem(key)
});

const STORAGE_BASE_NAME = 'kdong';

// session
export const STORAGE_SESSION_ICT = `${STORAGE_BASE_NAME}_ict`;

// local
export const STORAGE_LOCAL_COLLAPSED = `${STORAGE_BASE_NAME}_collapsed`;

export const storageService = {
  local: StorageBuilder(window.localStorage),
  session: StorageBuilder(window.sessionStorage)
};
