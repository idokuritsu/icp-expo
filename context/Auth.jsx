import "react-native-get-random-values";
import React, { createContext, useState, useContext, useEffect } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
} from "@dfinity/identity";
import { expoEnv } from "../config/expo-env";
import { rootNavigate } from "../config/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeDelegation } from "../config/AuthStorage";
import { toHex } from "@dfinity/agent";
import * as SecureStore from "expo-secure-store";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}
// Create the AuthContext
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [baseKey, setBaseKey] = useState();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @type {[DelegationIdentity | null, React.Dispatch<DelegationIdentity | null>]} state
   */
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    assignBaseKey();
  }, []);

  const assignBaseKey = async () => {
    const storedKey = await SecureStore.getItemAsync("baseKey");
    if (storedKey) {
      setBaseKey(Ed25519KeyIdentity.fromJSON(storedKey));
    } else {
      const key = Ed25519KeyIdentity.generate();
      setBaseKey(key);
      await save("baseKey", JSON.stringify(key.toJSON()));
    }

    const storedDelegation = await AsyncStorage.getItem("delegation");
    if (storedDelegation) {
      const chain = DelegationChain.fromJSON(JSON.parse(storedDelegation));
      if (isDelegationValid(chain)) {
        const id = new DelegationIdentity(
          Ed25519KeyIdentity.fromJSON(storedKey),
          DelegationChain.fromJSON(JSON.parse(storedDelegation))
        );
        setIdentity(id);
      } else {
        await AsyncStorage.removeItem("delegation");
      }
    }
    setIsReady(true);
  };

  const login = async (requestFor) => {
    const subscription = Linking.addEventListener("url", handleRedirect);
    try {
      setIsLoading(true);

      if (baseKey === undefined) {
        await assignBaseKey();
      }

      const derKey = toHex(baseKey.getPublicKey().toDer());

      const redirectUri = Linking.createURL("Auth/home");

      console.log(redirectUri, " ......");

      const authUrl = `https://icpfe.vercel.app?redirect_uri=${encodeURIComponent(
        redirectUri
      )}&requestFor="internetidentity"&pubkey=${derKey}`;

      console.log(authUrl, " authUrl");

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
        {
          showInRecents: true,
          createTask: true,
          showTitle: true,
          enableDefaultShare: false,
          ephemeralWebSession: false,
        }
      );

      console.log("Browser session result:", result);

      if (result.type !== "success") {
        console.log(
          "Browser was closed. Checking if we received delegation..."
        );

        // if (!identity) {
        //   console.log(
        //     "No delegation received. Authentication may have failed."
        //   );
        // }
      }
    } catch (error) {
      console.error("Error with authentication session:", error);
    } finally {
      subscription.remove();
      setIsLoading(false);
    }
  };

  // Handle redirect from browser
  const handleRedirect = async (event) => {
    console.log("Received redirect URL:", event.url);

    // Get the URL that was used for redirection
    const url = event.url;

    if (url) {
      try {
        const token = extractTokenFromUrl(url);
        setUser(token); // Store the token

        const search = new URLSearchParams(url?.split("?")[1]);
        const delegation = search.get("delegation");

        if (delegation) {
          console.log("Delegation found in URL, processing...");

          const chain = DelegationChain.fromJSON(
            JSON.parse(decodeURIComponent(delegation))
          );

          const id = DelegationIdentity.fromDelegation(baseKey, chain);

          setIdentity(id);
          await storeDelegation(id);

          console.log("Authentication successful, navigating to home");
          rootNavigate("Auth", { screen: "home" });
          return true;
        } else {
          console.log("No delegation found in redirect URL");
        }
      } catch (error) {
        console.error("Error processing redirect:", error);
      }
    }
    return false;
  };

  const extractTokenFromUrl = (url) => {
    const match = url.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <AuthContext.Provider value={{ login, user, identity, isReady, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
