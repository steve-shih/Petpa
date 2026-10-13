<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 環境規則：展示站 (staging) vs 正式站 (production)

- 每次開發前，先寫清楚這次改的是「展示站」還是「正式站」的功能。目前所有開發都是**展示站**。
- 環境由建置時的 `NEXT_PUBLIC_APP_ENV` 決定（預設 staging）；兩個環境 = 兩個網址、兩個 Docker image、兩個資料庫（`PETPA` / `PETPA_PROD`）。
- 所有測試捷徑（一鍵登入、預填帳號、模擬付款、手填單號、mock 資料備援）都要經過 `src/lib/env.ts` 的 `envFeatures` / `isCapabilityReady` 判斷，不可以寫死。
- 正式站功能還沒完成時要「鎖住並說明原因」，不能退回展示站的假流程。完成後到 `config.json` 的 `productionReadiness` 改成 `ready: true`。
- 伺服器端守門在 `src/proxy.ts`：正式站登入沒完成前，後台頁面與寫入 API 一律擋下。
