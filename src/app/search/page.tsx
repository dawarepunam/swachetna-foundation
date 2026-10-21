import type { Metadata } from "next";
import CatalogBrowser from "../../components/products/CatalogBrowser/CatalogBrowser";
import styles from "./search.module.css";
export const metadata:Metadata={title:"Search the collection"};
export default function SearchPage(){return <main className={styles.page}><div className="container"><span className={styles.eyebrow}>A LITTLE LOOK AROUND</span><h1>What are you <em>looking for?</em></h1><p>Search by product name, collection, or description.</p><CatalogBrowser mode="search"/></div></main>}
