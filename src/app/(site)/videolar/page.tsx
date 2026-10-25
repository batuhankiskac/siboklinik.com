import { Suspense } from "react";
import ContentGrid from "@/components/ContentGrid";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import VideoCard from "@/components/VideoCard";
import { getVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "Videolar",
  description: "Sağlıklı yaşam rehberi videoları.",
  path: "/videolar",
});

async function VideoList() {
  const videos = await getVideos();

  return (
    <ContentGrid>
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video.id} video={video} />)
      ) : (
        <EmptyState>Henüz yayınlanmış bir video bulunmuyor.</EmptyState>
      )}
    </ContentGrid>
  );
}

export default function VideosPage() {
  return (
    <main id="main-content" className={styles.container}>
      <h1 className={styles.heading}>Videolar</h1>
      <Suspense fallback={<LoadingState />}>
        <VideoList />
      </Suspense>
    </main>
  );
}
