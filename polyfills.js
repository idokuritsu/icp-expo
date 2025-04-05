// polyfills.js

import "react-native-get-random-values";
import { TextDecoder, TextEncoder } from "text-encoding";
import * as Crypto from "expo-crypto";

// Make sure TextDecoder is available globally
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.crypto.getRandomValues !== "function") {
  global.crypto.getRandomValues = getRandomValues;
}

if (typeof global.crypto === "undefined") {
  global.crypto = Crypto;
}

function getRandomValues(array) {
  return crypto.webcrypto.getRandomValues(array);
}
