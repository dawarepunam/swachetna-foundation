"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Mail, MessageCircle, Send } from "lucide-react";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2) { setFeedback("Please enter your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFeedback("Please enter a valid email address."); return; }
    if (message.trim().length < 10) { setFeedback("Please add a little more detail to your message."); return; }
    setFeedback("Thanks for writing. This form preview doesn’t send or store messages yet.");
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.layout}>
          <section className={styles.introPanel}>
            <span className={styles.eyebrow}><span /> WE’RE LISTENING</span>
            <h1>A note to<br /><em>Swachetna.</em></h1>
            <p className={styles.intro}>Questions, ideas or a hello—we’d love to hear from you.</p>
            <div className={styles.details}>
              <div className={styles.detailItem}><span className={styles.detailIcon}><Mail aria-hidden="true" /></span><span><strong>A note, your way</strong><small>Share what’s on your mind using the form.</small></span></div>
              <div className={styles.detailItem}><span className={styles.detailIcon}><MessageCircle aria-hidden="true" /></span><span><strong>Every voice matters</strong><small>We value your questions, ideas and feedback.</small></span></div>
            </div>
            <div className={styles.orbit} aria-hidden="true" />
            <div className={styles.orbitInner} aria-hidden="true" />
            <span className={styles.panelWord} aria-hidden="true">hello</span>
          </section>

          <section className={styles.formPanel} aria-labelledby="contact-form-title">
            <div className={styles.formHeading}>
              <span className={styles.formIcon}><Send aria-hidden="true" /></span>
              <div><span className={styles.formEyebrow}>GET IN TOUCH</span><h2 id="contact-form-title">Write us a note</h2></div>
            </div>
            <form className={styles.form} onSubmit={submit} noValidate>
              <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we address you?" required /></label>
              <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
              <label>Your message<textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us what’s on your mind…" required /></label>
              <button className={styles.submitButton}>Send your message<ArrowRight aria-hidden="true" size={17} /></button>
              {feedback && <p className={styles.feedback} role="status"><Check aria-hidden="true" />{feedback}</p>}
            </form>
            <p className={styles.formNote}>This form preview doesn’t send or store messages.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
