"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../context/StoreContext";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlist } = useStore();

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 48);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return <>
    <header className={`${styles.header} ${isHomePage ? styles.overHero : styles.inFlow} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Swachetna Foundation home">
          <Image src="/images/swachetna-purple.webp" alt="Swachetna Foundation" width={320} height={120} priority className={styles.logoImage} />
        </Link>
        <nav className={styles.desktopNavigation} aria-label="Main navigation">
          <Link href="/shop">Shop</Link><Link href="/categories">Collections</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/search" className={`${styles.actionButton} ${styles.mobileHidden}`} aria-label="Search"><Search size={19} /></Link>
          <Link href="/account/login" className={`${styles.actionButton} ${styles.mobileHidden}`} aria-label="Account"><UserRound size={19} /></Link>
          <Link href="/wishlist" className={styles.actionButton} aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={19} />{wishlist.length > 0 && <span className={styles.cartCount}>{wishlist.length}</span>}</Link>
          <Link href="/cart" className={`${styles.actionButton} ${styles.cartButton}`} aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span className={styles.cartCount}>{cartCount}</span></Link>
        </div>
        <button type="button" className={styles.mobileMenuButton} onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}><span /><span /><span /></button>
      </div>
    </header>
    <MobileNavigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
  </>;
}
