/**
 * 展示站標示條
 * 只在展示站 (staging) 顯示，讓所有人一眼知道「這是展示站，資料與付款都是模擬的」。
 * 正式站 (production) 完全不渲染。
 */
import { envFeatures } from '@/lib/env';

export default function EnvBanner() {
  if (!envFeatures.showEnvBanner) return null;

  return (
    <div className="env-banner" role="note" aria-label="展示站提示">
      <span className="env-banner-tag">🧪 {envFeatures.label}</span>
      <span className="env-banner-text">此為展示站：登入、付款、物流皆為模擬流程，請勿輸入真實個資或匯款</span>
    </div>
  );
}
