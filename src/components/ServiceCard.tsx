import Link from "next/link";
import { excerpt } from "@/lib/text";
import type { Service } from "@/types/content";
import ArrowIcon from "./ArrowIcon";
import CardMedia from "./CardMedia";
import buttonStyles from "../styles/button.module.css";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.id}`}
      className={styles.card}
      aria-label={`${service.title} hizmetini incele`}
    >
      {service.imageUrl ? (
        <CardMedia className={styles.media} src={service.imageUrl} />
      ) : null}
      <div className={styles.content}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{excerpt(service.description)}</p>
        <span className={styles.more}>
          İncele
          <ArrowIcon className={buttonStyles.icon} />
        </span>
      </div>
    </Link>
  );
}
