"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, MapPin, PackageCheck, UserRound } from "lucide-react";
import styles from "./AccountScreen.module.css";

type Mode = "login" | "register" | "forgot" | "profile" | "orders" | "addresses";
type User = { name: string; email: string; phone?: string };

export default function AccountScreen({ mode }: { mode: Mode }) {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<{ reference: string; total: number; createdAt: string }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("swachetna-demo-user");
      if (saved) setUser(JSON.parse(saved) as User);
      setOrders(JSON.parse(localStorage.getItem("swachetna-demo-orders") || "[]") as typeof orders);
    } catch {
      setUser(null);
      setOrders([]);
    }
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "forgot") {
      setMessage("Password reset is not available yet because account email delivery has not been connected.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setMessage("Please enter a valid email address."); return; }
    if (mode === "register" && name.trim().length < 2) { setMessage("Please enter your full name."); return; }
    const next = { name: name.trim() || email.split("@")[0], email, phone };
    try {
      localStorage.setItem("swachetna-demo-user", JSON.stringify(next));
      setUser(next);
      setMessage("Your account details have been saved on this device.");
    } catch {
      setMessage("Your browser could not save these details. Check your browser storage settings and try again.");
    }
  };

  const title = mode === "login" ? "Welcome back." : mode === "register" ? "A little more you." : mode === "forgot" ? "Let’s get you back in." : mode === "profile" ? "Your details." : mode === "orders" ? "Your orders." : "Saved addresses.";
  const intro = mode === "login"
    ? "Sign in to pick up where you left off."
    : mode === "register"
      ? "Create your Swachetna account and keep everything close."
      : mode === "forgot"
        ? "Enter your email address and we’ll help you get back to your account."
        : "Your Swachetna account, all in one place.";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.breadcrumb}><Link href="/">Home</Link><span>/</span><span>My account</span></div>
        <div className={styles.grid}>
          <aside className={styles.introPanel}>
            <span className={styles.brandMark}><UserRound aria-hidden="true" /></span>
            <span className={styles.eyebrow}>YOUR SWACHETNA SPACE</span>
            <h1>{title}</h1>
            <p className={styles.intro}>{intro}</p>
            <div className={styles.decorativeOrb} aria-hidden="true" />
          </aside>

          <section className={styles.panel} aria-labelledby="account-form-title">
            {(mode === "login" || mode === "register" || mode === "forgot") ? <>
              <div className={styles.panelHeading}>
                <span className={styles.panelIcon}><KeyRound aria-hidden="true" /></span>
                <div><span className={styles.panelEyebrow}>{mode === "forgot" ? "ACCOUNT SUPPORT" : "MEMBER ACCESS"}</span><h2 id="account-form-title">{mode === "login" ? "Sign in" : mode === "register" ? "Create your account" : "Reset your password"}</h2></div>
              </div>
              <form className={styles.form} onSubmit={submit}>
                {mode === "register" && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="Your name" required /></label>}
                <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required /></label>
                {mode === "register" && <label>Phone <span className={styles.optional}>(optional)</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" inputMode="tel" placeholder="Your phone number" /></label>}
                {mode !== "forgot" && <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={6} placeholder={mode === "register" ? "At least 6 characters" : "Enter your password"} required /></label>}
                {mode === "forgot" && <p className={styles.formHint}>Enter the email associated with your account. We’ll let you know if recovery is available.</p>}
                <button className={styles.submitButton}>{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}<ArrowRight aria-hidden="true" size={17} /></button>
              </form>
              {message && <p className={styles.message} role="status">{message}</p>}
              <div className={styles.links}>
                {mode !== "login" && <span>Already have an account? <Link href="/account/login">Sign in</Link></span>}
                {mode === "login" && <span>New to Swachetna? <Link href="/account/register">Create an account</Link></span>}
                {mode !== "forgot" && <Link href="/account/forgot-password">Forgot password?</Link>}
                {mode === "forgot" && <Link href="/contact">Need help? Contact us</Link>}
              </div>
            </> : mode === "profile" ? <div>
              <div className={styles.panelHeading}><span className={styles.panelIcon}><UserRound aria-hidden="true" /></span><div><span className={styles.panelEyebrow}>ACCOUNT DETAILS</span><h2 id="account-form-title">Profile details</h2></div></div>
              {user ? <div className={styles.detail}><p><span>Name</span>{user.name}</p><p><span>Email</span>{user.email}</p><p><span>Phone</span>{user.phone || "Not added"}</p><button className={styles.secondaryButton} onClick={() => { localStorage.removeItem("swachetna-demo-user"); setUser(null); setMessage("Your saved profile has been removed from this device."); }}>Sign out</button>{message && <p className={styles.message} role="status">{message}</p>}</div> : <><p className={styles.message}>No saved profile found on this device.</p><Link className={styles.cta} href="/account/login">Sign in <ArrowRight size={15} /></Link></>}
            </div> : mode === "orders" ? <div>
              <div className={styles.panelHeading}><span className={styles.panelIcon}><PackageCheck aria-hidden="true" /></span><div><span className={styles.panelEyebrow}>YOUR PURCHASES</span><h2 id="account-form-title">Order history</h2></div></div>
              {orders.length ? orders.map((order) => <article className={styles.order} key={order.reference}><span>{order.reference}</span><strong>₹{order.total.toLocaleString("en-IN")}</strong><small>{new Date(order.createdAt).toLocaleDateString("en-IN")}</small></article>) : <><p className={styles.message}>Your orders will appear here when you’ve placed one.</p><Link className={styles.cta} href="/shop">Explore the collection <ArrowRight size={15} /></Link></>}
            </div> : <div>
              <div className={styles.panelHeading}><span className={styles.panelIcon}><MapPin aria-hidden="true" /></span><div><span className={styles.panelEyebrow}>DELIVERY DETAILS</span><h2 id="account-form-title">Saved addresses</h2></div></div>
              <p className={styles.message}>Your delivery details can be added during checkout.</p><Link className={styles.cta} href="/checkout">Continue to checkout <ArrowRight size={15} /></Link>
            </div>}
          </section>
        </div>
      </div>
    </main>
  );
}
