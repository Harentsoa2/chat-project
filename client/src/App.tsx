import { useEffect } from "react";
import { useAuth } from "./hooks/use-auth";
import AppRoutes from "./routes";
import { Spinner } from "./components/ui/spinner";
import Logo from "./components/logo";
import { useLocation } from "react-router-dom";
import { isAuthRoute } from "./routes/routes";

function App() {
  const { pathname } = useLocation(); // Get the current pathname ex:  "/login", "/dashboard/123", etc.
  const { user, isAuthStatus, isAuthStatusLoading } = useAuth(); // Custom hook to check authentication status and get user info
  const isAuth = isAuthRoute(pathname); // Check if the current route is an authentication route (like "/login" or "/signup") (custom)

  useEffect(() => {
    if (isAuth) return;
    isAuthStatus();
  }, [isAuthStatus, isAuth]); // Run the authentication status check when the component mounts or when the pathname changes, but only if it's not an auth route

  if (isAuthStatusLoading && !user) {
    return (
      <div
        className="flex flex-col items-center
       justify-center h-screen
      "
      >
        <Logo imgClass="size-20" showText={false} />
        <Spinner className="w-6 h-6" />
      </div>
    );
  }
  
  return <AppRoutes />;
}

export default App;
