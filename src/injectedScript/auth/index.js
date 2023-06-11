import "./auth.scss";
import Logo from "./components/Logo";
import SignInButton from "./components/SignInButton";
import GoogleOAuthProvider from "./utils/GoogleOAuthProvider";

const AuthScript = () => {
  return (
    <div className="yaba-auth">
      <div className="yaba-auth-container">
        <div className="yaba-auth__header">
          <div className="yaba-auth__header-logo">
            <Logo color="#fff" bg="#1e1e1e" />
          </div>

          <div className="yaba-auth__header-text">
            <h1>
              Welcome to{" "}
              <span className="yaba-auth__header-text--bold">Yaba</span>
            </h1>
            <p>Sign in to continue</p>
          </div>
        </div>

        <div className="yaba-auth__descrption">
          <p>
            Enhance your browsing experience with feature-rich bookmark
            management.
          </p>
        </div>
        <GoogleOAuthProvider
          clientId={
            "88393377888-nhdq23mi0eq1n8mdof0acj2k6h84qrvi.apps.googleusercontent.com"
          }
        >
          <SignInButton />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default AuthScript;
