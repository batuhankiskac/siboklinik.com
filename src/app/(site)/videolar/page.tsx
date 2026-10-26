import { Suspense, type CSSProperties } from "react";
import LoadingState from "@/components/LoadingState";
import PublicContentList from "@/components/PublicContentList";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Videolar",
  description: "Sağlıklı yaşam rehberi videoları.",
  path: "/videolar",
});

export default function VideosPage() {
  return (
    <main id="main-content" className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow} data-enter style={{ "--i": 0 } as CSSProperties}>
          Rehber
        </p>
        <h1 className={styles.title} data-enter style={{ "--i": 1 } as CSSProperties}>
          Videolar
        </h1>
      </header>
      <div className={styles.body}>
        <Suspense fallback={<LoadingState />}>
          <PublicContentList
            load={getVideos}
            emptyText="Henüz yayınlanmış bir video bulunmuyor."
            renderItem={(video) => <VideoCard video={video} />}
          />
        </Suspense>
      </div>
    </main>
  );
}
