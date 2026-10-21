import type { Metadata } from "next";
import AccountScreen from "../../../components/account/AccountScreen/AccountScreen";
import styles from "./register.module.css";

export const metadata: Metadata = { title: "Create your account" };

export default function Page() {
  return <div className={styles.page}><AccountScreen mode="register" /></div>;
}
