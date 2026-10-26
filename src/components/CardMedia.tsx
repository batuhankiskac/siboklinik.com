import Image from "next/image";
import type { ReactNode } from "react";
import cardStyles from "../styles/card.module.css";
import styles from "./CardMedia.module.css";

const SIZES = "(max-width: 700px) 100vw, 400px";

type CardMediaProps = {
  src?: string | null;
  // Görsel yoksa gösterilecek etiket.
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  // Verilirse medya tıklanabilir buton olarak render edilir (video önizlemesi).
  onClick?: () => void;
  buttonLabel?: string;
};

export default function CardMedia({
  src,
  placeholder,
  className,
  children,
  onClick,
  buttonLabel,
}: CardMediaProps) {
  const classes = [cardStyles.imageContainer, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          className={cardStyles.image}
          sizes={SIZES}
        />
      ) : (
        placeholder && (
          <div className={styles.placeholder} aria-hidden="true">
            {placeholder}
          </div>
        )
      )}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={buttonLabel}
      >
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
