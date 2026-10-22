"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, HeartHandshake, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import styles from "./Admin.module.css";

const ADMIN_SESSION_KEY = "swachetna-admin-session";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    return session === "authenticated";
  } catch {
    return false;
  }
}

export function adminLogout() {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch { /* ignore */ }
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@swachetna.org";
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Swachetna@2026";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Enter your email and password to continue."); return; }
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        try {
          window.sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
        } catch { /* ignore */ }
        router.replace("/admin/dashboard");
      } else {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
      }
    }, 600);
  };

  return <main className={styles.loginPage}>
    <div className={styles.loginTop}><Link href="/" className={styles.loginBrand}><Image src="/images/swachetna-purple.webp" alt="Swachetna Foundation" width={320} height={120} priority className={styles.loginLogo} /></Link><span className={styles.secureLabel}><LockKeyhole size={14} /> ADMIN PORTAL</span></div>
    <div className={styles.loginGrid}>
      <section className={styles.loginAside}><span className={styles.loginEyebrow}><Sparkles size={14} /> YOUR WORKSPACE, IN ONE PLACE</span><h1>Good work<br />starts with <em>good care.</em></h1><p>Manage your storefront and community stories with clarity, care and purpose.</p>
        <div className={styles.loginArtwork} aria-hidden="true"><div className={styles.artHalo} /><div className={styles.artCircle}><HeartHandshake size={47} strokeWidth={1.1} /></div><span className={styles.artLeafOne}>✳</span><span className={styles.artLeafTwo}>✳</span><div className={styles.artCaption}><span>SWACHETNA FOUNDATION</span><strong>Care in action.</strong></div></div>
        <div className={styles.loginValues}><span><i /> Thoughtful administration</span><span><i /> Community-led impact</span><span><i /> Built for your team</span></div>
      </section>
      <section className={styles.loginPanel}><div className={styles.loginPanelHead}><span className={styles.loginIcon}><ShieldCheck size={21} /></span><span className={styles.loginWelcome}>WELCOME BACK</span><h2>Sign in to your<br /><em>admin workspace.</em></h2><p>Enter your workspace credentials to continue.</p></div>
        <form className={styles.loginForm} onSubmit={submit} noValidate>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@swachetna.org" required /></label>
          <label>Password<span className={styles.passwordField}><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
          <div className={styles.loginOptions}><label><input type="checkbox" defaultChecked /> Keep me signed in</label></div>
          {error && <p className={styles.loginError} role="alert">{error}</p>}
          <button type="submit" className={styles.loginSubmit} disabled={loading}>{loading ? "Signing in…" : <>Continue to workspace <ArrowRight size={17} /></>}</button>
        </form>
        <p className={styles.loginBack}><Link href="/">← Back to storefront</Link><span>Need help? Contact your workspace owner.</span></p>
      </section>
    </div><footer className={styles.loginFooter}><span>© {new Date().getFullYear()} Swachetna Foundation</span><span>Private workspace · Secure access</span></footer>
  </main>;
}

