import { useContext, createContext, useMemo } from "react";

import useLoadGsiScript from "./useLoadGsiScript";

const GoogleOAuthContext = createContext(null);

const GoogleOAuthProvider = ({
  clientId,
  nonce,
  onScriptLoadSuccess,
  onScriptLoadError,
  children,
}) => {
  const scriptLoadedSuccessfully = useLoadGsiScript({
    nonce,
    onScriptLoadSuccess,
    onScriptLoadError,
  });

  const contextValue = useMemo(
    () => ({
      clientId,
      scriptLoadedSuccessfully,
    }),
    [clientId, scriptLoadedSuccessfully]
  );

  return (
    <GoogleOAuthContext.Provider value={contextValue}>
      {children}
    </GoogleOAuthContext.Provider>
  );
};

export default GoogleOAuthProvider;

export function useGoogleOAuth() {
  const context = useContext(GoogleOAuthContext);
  if (!context) {
    throw new Error(
      "Google OAuth components must be used within GoogleOAuthProvider"
    );
  }
  return context;
}
