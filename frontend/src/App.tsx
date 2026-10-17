import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SiteLayout from "@/components/SiteLayout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Veterinarians from "@/pages/Veterinarians";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Appointments from "@/pages/Appointments";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

// One <Route> per page; BrowserRouter wraps this in main.tsx. Public pages share the
// site chrome via SiteLayout; the admin area renders its own standalone chrome.
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/veterinarios" element={<Veterinarians />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/agendamentos" element={<Appointments />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
