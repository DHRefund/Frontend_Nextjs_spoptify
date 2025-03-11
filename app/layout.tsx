import { Figtree } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

import Sidebar from "@/components/Sidebar";
import ToasterProvider from "@/providers/ToasterProvider";
import { UserProvider } from "@/providers/UserProvider";
// import { FetchUser } from "@/providers/FetchUser";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "Listen to music!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <UserProvider>
          {/* <FetchUser> */}
          <Sidebar>{children}</Sidebar>
          {/* </FetchUser> */}
        </UserProvider>
      </body>
    </html>
  );
}
