/* eslint-disable import/export */
import { useCallback, useEffect, useRef } from "react";

import { useGoogleOAuth } from "./GoogleOAuthProvider";

export default function useGoogleLogin(options) {
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();
  const clientRef = useRef();

  const onSuccessRef = useRef(options.onSuccess);
  onSuccessRef.current = options.onSuccess;

  const onErrorRef = useRef(options.onError);
  onErrorRef.current = options.onError;

  const onNonOAuthErrorRef = useRef(options.onNonOAuthError);
  onNonOAuthErrorRef.current = options.onNonOAuthError;

  useEffect(() => {
    if (!scriptLoadedSuccessfully) return;

    const clientMethod =
      options.flow === "implicit" ? "initTokenClient" : "initCodeClient";

    const client = window?.google?.accounts.oauth2[clientMethod]({
      client_id: clientId,
      scope: options.overrideScope
        ? options.scope
        : `openid profile email ${options.scope}`,
      callback: response => {
        if (response.error) return onErrorRef.current?.(response);

        onSuccessRef.current?.(response);
      },
      error_callback: nonOAuthError => {
        onNonOAuthErrorRef.current?.(nonOAuthError);
      },
      state: options.state,
      ...options,
    });

    clientRef.current = client;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clientId,
    scriptLoadedSuccessfully,
    options.flow,
    options.scope,
    options.state,
  ]);

  const loginImplicitFlow = useCallback(overrideConfig => {
    clientRef.current?.requestAccessToken(overrideConfig);
  }, []);

  const loginAuthCodeFlow = useCallback(
    () => clientRef.current?.requestCode(),
    []
  );

  return options.flow === "implicit" ? loginImplicitFlow : loginAuthCodeFlow;
}
