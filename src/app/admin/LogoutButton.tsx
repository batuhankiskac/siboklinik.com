"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.css";

export default function LogoutButton() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/session", { method: "DELETE" });
      if (!response.ok) return;
      router.replace("/login");
      router.refresh();
    } catch {
      // Ağ hatasında kullanıcı tekrar deneyebilir.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={submitting}
      className={styles.signOutButton}
    >
      {submitting ? "Çıkış yapılıyor..." : "Çıkış Yap"}
    </button>
  );
}
