"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, HeartHandshake, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./Admin.module.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (!email.trim() || !password.trim()) { event.preventDefault(); setError("Enter your email and password to continue."); return; }
    setError("");
  };

  return <main className={styles.loginPage}>
    <div className={styles.loginTop}><Link href="/" className={styles.loginBrand}><Image src="/images/swachetna-purple.webp" alt="Swachetna Foundation" width={320} height={120} priority className={styles.loginLogo} /></Link><span className={styles.secureLabel}><LockKeyhole size={14} /> ADMIN PORTAL</span></div>
    <div className={styles.loginGrid}>
      <section className={styles.loginAside}><span className={styles.loginEyebrow}><Sparkles size={14} /> YOUR WORKSPACE, IN ONE PLACE</span><h1>Good work<br />starts with <em>good care.</em></h1><p>Manage your storefront and community stories with clarity, care and purpose.</p>
        <div className={styles.loginArtwork} aria-hidden="true"><div className={styles.artHalo} /><div className={styles.artCircle}><HeartHandshake size={47} strokeWidth={1.1} /></div><span className={styles.artLeafOne}>✳</span><span className={styles.artLeafTwo}>✳</span><div className={styles.artCaption}><span>SWACHETNA FOUNDATION</span><strong>Care in action.</strong></div></div>
        <div className={styles.loginValues}><span><i /> Thoughtful administration</span><span><i /> Community-led impact</span><span><i /> Built for your team</span></div>
      </section>
      <section className={styles.loginPanel}><div className={styles.loginPanelHead}><span className={styles.loginIcon}><ShieldCheck size={21} /></span><span className={styles.loginWelcome}>WELCOME BACK</span><h2>Sign in to your<br /><em>admin workspace.</em></h2><p>Enter your workspace details to continue.</p></div>
        <form action="/admin/dashboard" method="get" className={styles.loginForm} onSubmit={submit} noValidate><label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organization.org" required /></label><label>Password<span className={styles.passwordField}><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
          <div className={styles.loginOptions}><label><input type="checkbox" defaultChecked /> Keep me signed in</label><button type="button" onClick={() => setError("Password recovery is not connected.")}>Forgot password?</button></div>{error && <p className={styles.loginError} role="alert">{error}</p>}<button type="submit" className={styles.loginSubmit}>Continue to workspace <ArrowRight size={17} /></button>
        </form>
        <div className={styles.demoCredentials}><span className={styles.demoKey}>WORKSPACE ACCESS</span><p>Enter any email address and password to continue.</p><small>Sign-in is not connected to an authentication service.</small></div>
        <p className={styles.loginBack}><Link href="/">← Back to storefront</Link><span>Need help? Contact your workspace owner.</span></p>
      </section>
    </div><footer className={styles.loginFooter}><span>© 2026 Swachetna Foundation</span><span>Private workspace · Local access</span></footer>
  </main>;
}
