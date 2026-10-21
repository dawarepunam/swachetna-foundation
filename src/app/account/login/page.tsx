import type { Metadata } from "next";
import AccountScreen from "../../../components/account/AccountScreen/AccountScreen";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Sign in to your account" };

export default function Page() {
  return <div className={styles.page}><AccountScreen mode="login" /></div>;
}
