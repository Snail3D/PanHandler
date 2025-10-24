const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const path = require("node:path");
const os = require("node:os");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable Watchman for file watching.
config.resolver.useWatchman = false;

// Get environment variables for Metro cache configuration.
const metroCacheVersion = process.env.METRO_CACHE_VERSION || "1";
const metroCacheHttpEndpoint = process.env.METRO_CACHE_HTTP_ENDPOINT;
const metroCacheDir = process.env.METRO_CACHE_DIR || path.join(os.homedir(), ".metro-cache");

// Configure Metro's cache stores.
config.cacheStores = ({ FileStore, HttpStore }) => {
  const stores = [new FileStore({ root: metroCacheDir })];

  if (metroCacheHttpEndpoint) {
    stores.push(new HttpStore({ endpoint: metroCacheHttpEndpoint }));
  }
  return stores;
};

// Set the cache version for Metro, which can be incremented
// to invalidate existing caches.
config.cacheVersion = metroCacheVersion;

// Integrate NativeWind with the Metro configuration.
module.exports = withNativeWind(config, { input: "./global.css" });
