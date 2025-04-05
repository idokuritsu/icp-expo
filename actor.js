import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./declarations/my_canister.did";
import { useAuth } from "./context/Auth";
import { useMemo } from "react";

const CANISTER_ID = "f4rvv-faaaa-aaaag-auacq-cai";
const ICP_HOST = "https://icp0.io";

export const useUserActor = () => {
  const { identity } = useAuth();
  console.log("identity", identity);
  const userActor = useMemo(() => {
    if (!identity) return null;

    const agent = new HttpAgent({
      identity,
      host: ICP_HOST,
    });

    if (process.env.NODE_ENV === "development") {
      agent.fetchRootKey();
    }

    return Actor.createActor(idlFactory, {
      agent,
      canisterId: CANISTER_ID,
      callOptions: {
        reactNative: {
          textStreaming: true, // Performance boost
        },
      },
      fetchOptions: {
        reactNative: {
          __nativeResponseType: "base64",
        },
      },
    });
  }, [identity]);

  return userActor;
};
