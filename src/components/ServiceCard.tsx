import Image from "next/image";
import Link from "next/link";
import { excerpt } from "@/lib/text";
import type { Service } from "@/types/content";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.id}`}
      className={styles.card}
      aria-label={`${service.title} hizmetini incele`}
    >
      {/* Görseli olmayan hizmetler için yer tutucu; yerel varsayılan görsel yok. */}
      <div className={styles.imageContainer}>
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 700px) 100vw, 400px"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
      <h2 className={styles.title}>{service.title}</h2>
      <p className={styles.description}>{excerpt(service.description)}</p>
    </Link>
  );
}
