import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.courtkings.arcade",
  appName: "Court Kings 3v3",
  webDir: "dist",
  backgroundColor: "#0b1020",
  ios: {
    contentInset: "always",
    backgroundColor: "#0b1020",
  },
  android: {
    backgroundColor: "#0b1020",
  },
};

export default config;
