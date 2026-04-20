import BaseLayout from "@/layouts/base-layout";
import { Route, Routes } from "react-router-dom";
import { authRoutesPaths, protectedRoutesPaths } from "./routes";
import AppLayout from "@/layouts/app-layout";
import RouteGuard from "./route-guard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth / Public routes */}
      {/* 
        Par rapport Autth sa affiche l un ou l autre

        puis le outlet change par rapport au balise dans les routePath.
      */}
      <Route path="/" element={<RouteGuard requireAuth={false} />}> 
        <Route element={<BaseLayout />}>
          {authRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<RouteGuard requireAuth={true} />}>
        <Route element={<AppLayout />}>
          {protectedRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
