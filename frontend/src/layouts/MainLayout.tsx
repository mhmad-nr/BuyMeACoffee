import { PropsWithChildren } from "react";
import { Navbar, Footer } from "../components";

export const MainLayout = ({ children }: PropsWithChildren) => (
  <div id="container">
    <Navbar />
    <div className="pt-[91px] md_px-6">{children}</div>
    <Footer />
  </div>
);
