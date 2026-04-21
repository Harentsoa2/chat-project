import { Outlet } from "react-router-dom";
import LandingPage from "@/components/landing-page/landingPage";

const BaseLayout = () => {
  const isLandingPage = true; 
  
  if(isLandingPage) {
    return <LandingPage/>
  }

  return (
    <div className="flex flex-col w-full h-auto">
      <div
        className="w-full h-full flex items-center
      justify-center
    "
      >
        <div className="w-full mx-auto h-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
