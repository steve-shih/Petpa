/**
 * 環境判斷模組 (基礎 INFRA，前後端共用)
 *
 * 白話說明：
 * - 這個檔案負責回答「現在跑的是展示站 (staging) 還是正式站 (production)？」
 * - 環境由「建置時」的 NEXT_PUBLIC_APP_ENV 決定，Next.js 會把它直接寫死進 JS bundle，
 *   所以展示站與正式站必須「各自 build 一次」，產出兩個不同的 Docker image。
 * - 所有開關都放在 config.json 的 environments 與 productionReadiness，這裡只負責讀取。
 *
 * 開發規則：
 * - 任何「測試捷徑」(一鍵登入、假付款、手動假單號、假資料備援) 都必須經過 envFeatures 判斷，
 *   不可以直接寫死在畫面上。
 * - 正式站若某功能尚未 ready，就要「鎖住並顯示說明」，絕對不能退回展示站的假流程。
 */
import config from '../../config.json';

export type AppEnv = 'staging' | 'production';

// 注意：必須寫成 process.env.NEXT_PUBLIC_APP_ENV 完整字串，Next.js 才會在建置時替換
const rawEnv = process.env.NEXT_PUBLIC_APP_ENV;

export const APP_ENV: AppEnv =
  rawEnv === 'production' ? 'production' : rawEnv === 'staging' ? 'staging' : (config.environments.default as AppEnv);

export const isStaging = APP_ENV === 'staging';
export const isProduction = APP_ENV === 'production';

/** 目前環境的所有開關 (一鍵登入、假付款、假資料備援...) */
export const envFeatures = config.environments[APP_ENV];

export type ReadinessKey = Exclude<keyof typeof config.productionReadiness, '_說明'>;

/**
 * 判斷某個功能在「目前環境」能不能用真實流程。
 * - 展示站：永遠回傳 true (可以用模擬流程展示)
 * - 正式站：只有 config.json 標記 ready=true 才回傳 true
 */
export function isCapabilityReady(key: ReadinessKey): boolean {
  if (isStaging) return true;
  return config.productionReadiness[key].ready === true;
}

/** 取得功能的中文說明 (正式站鎖住時顯示給使用者看) */
export function capabilityLabel(key: ReadinessKey): string {
  return config.productionReadiness[key].label;
}

/** 列出正式站還沒完成的項目 (上線檢查用) */
export function listProductionBlockers(): { key: ReadinessKey; label: string }[] {
  return (Object.keys(config.productionReadiness) as (ReadinessKey | '_說明')[])
    .filter((k): k is ReadinessKey => k !== '_說明')
    .filter(k => config.productionReadiness[k].ready !== true)
    .map(k => ({ key: k, label: config.productionReadiness[k].label }));
}
