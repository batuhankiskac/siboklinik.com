import { Suspense } from "react";
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
    <main id="main-content" className={styles.container}>
      <h1 className={styles.heading}>Videolar</h1>
      <Suspense fallback={<LoadingState />}>
        <PublicContentList
          load={getVideos}
          emptyText="Henüz yayınlanmış bir video bulunmuyor."
          renderItem={(video) => <VideoCard video={video} />}
        />
      </Suspense>
    </main>
  );
}
