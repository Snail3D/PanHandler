const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const path = require("node:path");
const os = require("node:os");
const fs = require("fs");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable Watchman for file watching.
config.resolver.useWatchman = false;

// Configure Metro's cache.
const metroCacheHttpEndpoint = process.env.METRO_CACHE_HTTP_ENDPOINT;

// Determine the cache directory.
let cacheDir = path.join(os.homedir(), ".metro-cache");
try {
  const stats = fs.statSync("/cache");
  if (stats.isDirectory()) {
    cacheDir = "/cache/metro-cache";
  }
} catch (e) {
  // Ignore errors and use the default cache directory.
}

config.cacheStores = ({ FileStore, HttpStore }) => {
  const stores = [new FileStore({ root: cacheDir })];

  if (metroCacheHttpEndpoint) {
    stores.push(new HttpStore({ endpoint: metroCacheHttpEndpoint }));
  }
  return stores;
};

// Integrate NativeWind with the Metro configuration.
module.exports = withNativeWind(config, { input: "./global.css" });
