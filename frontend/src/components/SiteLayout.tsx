import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import EmergencyBanner from "@/components/EmergencyBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Shared chrome for every public page: emergency strip, glass navbar, footer.
// Honors the OS reduced-motion preference for all entrance animations.
export default function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}