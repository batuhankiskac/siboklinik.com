import StatusMessage from "@/components/StatusMessage";

export default function SymptomNotFound() {
  return (
    <StatusMessage
      eyebrow="404"
      title="Belirti bulunamadı."
      message="Aradığınız belirti sayfası kaldırılmış veya adı değiştirilmiş olabilir."
      actionLabel="Belirtilere dön"
      href="/belirtiler"
    />
  );
}
