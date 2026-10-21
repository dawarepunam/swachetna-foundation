"use client";

import { useEffect } from "react";
import styles from "./status.module.css";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error(error)},[error]);return <main className={styles.page}><span>OOPS</span><h1>A brief pause<br/><em>Let us try again.</em></h1><p>This demo view ran into a problem.</p><button onClick={()=>reset()}>Try again</button></main>}
