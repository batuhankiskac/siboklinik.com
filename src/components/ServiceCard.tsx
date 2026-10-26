import Link from "next/link";
import { excerpt } from "@/lib/text";
import type { Service } from "@/types/content";
import CardMedia from "./CardMedia";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.id}`}
      className={styles.card}
      aria-label={`${service.title} hizmetini incele`}
    >
      {/* Görseli olmayan hizmetler için yer tutucu; yerel varsayılan görsel yok. */}
      <CardMedia
        className={styles.imageContainer}
        src={service.imageUrl}
      />
      <h2 className={styles.title}>{service.title}</h2>
      <p className={styles.description}>{excerpt(service.description)}</p>
    </Link>
  );
}
