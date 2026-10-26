import Link from "next/link";
import styles from "./StatusMessage.module.css";

type StatusAction = { href: string } | { onAction: () => void };

type StatusMessageProps = {
  title: string;
  message: string;
  actionLabel: string;
} & StatusAction;

// Hata ve 404 ekranlarının ortak kabuğu: başlık, mesaj ve tek bir eylem düğmesi.
export default function StatusMessage({
  title,
  message,
  actionLabel,
  ...action
}: StatusMessageProps) {
  return (
    <main id="main-content" className={styles.container}>
      <h1>{title}</h1>
      <p className={styles.message}>{message}</p>
      {"href" in action ? (
        <Link href={action.href} className={styles.action}>
          {actionLabel}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.action}
          onClick={() => action.onAction()}
        >
          {actionLabel}
        </button>
      )}
    </main>
  );
}
