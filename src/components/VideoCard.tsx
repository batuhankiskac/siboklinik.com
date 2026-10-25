"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { videoThumbnail } from "@/lib/youtube";
import type { Video } from "@/types/content";
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
        <button
          type="button"
          className={styles.imageContainer}
          onClick={() => setIsPlaying(true)}
          aria-label={`${video.title} videosunu oynat`}
        >
          <Image
            src={thumbnail}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 700px) 100vw, 400px"
          />
          <span className={styles.playOverlay} aria-hidden="true">
            <span className={styles.playButton}>▶</span>
          </span>
        </button>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{video.title}</h2>
      </div>
    </article>
  );
}
