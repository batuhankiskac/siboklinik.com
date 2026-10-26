"use client";

import { useEffect, useRef, useState } from "react";
import { videoThumbnail } from "@/lib/youtube";
import type { Video } from "@/types/content";
import CardMedia from "./CardMedia";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video }: { video: Video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const thumbnail = videoThumbnail(video);

  // Oynat butonu kaldırıldığında klavye odağı kaybolmasın diye iframe'e taşınır.
  useEffect(() => {
    if (isPlaying) iframeRef.current?.focus();
  }, [isPlaying]);

  return (
    <article className={styles.card}>
      {isPlaying ? (
        <div className={styles.videoContainer}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className={styles.iframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <CardMedia
          className={styles.imageContainer}
          src={thumbnail}
          onClick={() => setIsPlaying(true)}
          buttonLabel={`${video.title} videosunu oynat`}
        >
          <span className={styles.playOverlay} aria-hidden="true">
            <span className={styles.playButton}>▶</span>
          </span>
        </CardMedia>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{video.title}</h2>
      </div>
    </article>
  );
}
