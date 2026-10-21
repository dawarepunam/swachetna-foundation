import type { Metadata } from "next";
import AccountScreen from "../../../components/account/AccountScreen/AccountScreen";
import styles from "./forgot-password.module.css";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return <div className={styles.page}><AccountScreen mode="forgot" /></div>;
}
