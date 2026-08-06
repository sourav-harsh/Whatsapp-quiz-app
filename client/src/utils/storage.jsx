/** Safe localStorage / sessionStorage helpers. */
const canUse = (store) => {
  try {
    const key = "__quizchat_probe__";
    store.setItem(key, "1");
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const read = (store, key, fallback) => {
  if (!canUse(store)) return fallback;
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (store, key, value) => {
  if (!canUse(store)) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
};

const remove = (store, key) => {
  if (!canUse(store)) return;
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
};

export const local = {
  get: (key, fallback = null) => read(window.localStorage, key, fallback),
  set: (key, value) => write(window.localStorage, key, value),
  remove: (key) => remove(window.localStorage, key),
};

export const session = {
  get: (key, fallback = null) => read(window.sessionStorage, key, fallback),
  set: (key, value) => write(window.sessionStorage, key, value),
  remove: (key) => remove(window.sessionStorage, key),
};

export const STORAGE_KEYS = {
  authUser: "quizchat:auth-user",
  lastResult: "quizchat:last-result",
};
