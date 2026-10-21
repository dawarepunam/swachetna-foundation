import type { ReactNode } from "react";
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <AnnouncementBar />
      <Header />

      <div className={styles.main}>{children}</div>

      <Footer />
    </div>
  );
}
