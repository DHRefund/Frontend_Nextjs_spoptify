import { Figtree } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";
import { Suspense } from "react";

import Sidebar from "@/components/Sidebar";
import ToasterProvider from "@/providers/ToasterProvider";
import { UserProvider } from "@/providers/UserProvider";
import Loading from "@/components/Loading";
import UploadModal from "@/components/UploadModal";
import Player from "@/components/Player";
import ModalProvider from "@/providers/ModalProvider";
import { PlayerProvider } from "@/providers/PlayerContext";
import Header from "@/components/Header";

const font = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Spotify Clone",
  description: "Listen to music!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={font.className} style={{ overflow: "hidden" }}>
        <PlayerProvider>
          <ToasterProvider />
          <UserProvider>
            <Suspense fallback={<Loading />}>
              <Header />
              <Sidebar>
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </Sidebar>
              <Player />
            </Suspense>
            <UploadModal />
          </UserProvider>
        </PlayerProvider>
      </body>
    </html>
  );
}
