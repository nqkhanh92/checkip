# Spec — IP Checker Landing Page

> Trang web tra cứu IP public của thiết bị, hiển thị thông tin địa lý và mạng kèm theo.

---

## 1. Mục Tiêu

Người dùng truy cập trang → **ngay lập tức thấy IP public** của họ mà không cần nhấn nút hay điền form. Thông tin hiển thị đầy đủ, đẹp, có thể copy nhanh.

---

## 2. Tech Stack

| Layer | Lựa chọn | Lý do |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API Routes trong 1 project |
| Styling | Tailwind CSS + shadcn/ui | Nhanh, đẹp, accessible |
| IP Detection | Server-side (Next.js API Route) | Tránh CORS, chính xác hơn client-side |
| Geo/ISP data | `ip-api.com` (free, không cần key) | Trả JSON đầy đủ, 45 req/min free |
| Deploy | Vercel | Zero-config, tự detect IP thật qua headers |
| Language | TypeScript | Type-safe |

---

## 3. Tính Năng

### 3.1 Core (bắt buộc)

- **Hiển thị IP public** — to, rõ, ngay giữa màn hình
- **Copy IP** — click vào IP → copy vào clipboard + toast "Copied!"
- **Thông tin địa lý** từ IP:
  - Quốc gia + flag emoji
  - Thành phố / Tỉnh
  - Múi giờ
- **Thông tin mạng**:
  - ISP / Tổ chức (vd: "Viettel", "FPT Telecom")
  - ASN (Autonomous System Number)
- **Phát hiện VPN / Proxy / Tor** — badge cảnh báo nếu có

### 3.2 Nice-to-have (nếu có thời gian)

- Dark/Light mode toggle
- Hiển thị IPv4 và IPv6 riêng biệt (nếu có cả 2)
- Bản đồ nhỏ pin vị trí (leaflet.js)
- Nút "Refresh" để kiểm tra lại

---

## 4. UI Layout

```
┌─────────────────────────────────────────────┐
│           🌐  What's My IP?                 │
│                                             │
│         ┌─────────────────────┐             │
│         │   113.161.xxx.xxx   │ [Copy]      │
│         │       IPv4          │             │
│         └─────────────────────┘             │
│                                             │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ 🇻🇳 Location  │  │ 🏢 Network            │ │
│  │──────────────│  │──────────────────────│ │
│  │ Vietnam      │  │ Viettel Group        │ │
│  │ Ho Chi Minh  │  │ AS7552               │ │
│  │ Asia/Ho_Chi  │  │ ISP: Viettel         │ │
│  └──────────────┘  └──────────────────────┘ │
│                                             │
│  ⚠️  VPN Detected  (badge nếu có)           │
│                                             │
│         [↻ Refresh]                         │
└─────────────────────────────────────────────┘
```

---

## 5. API Design

### `GET /api/ip`

Được gọi từ client-side sau khi page load (hoặc SSR).

**Logic lấy IP (theo priority):**
```
1. Header: CF-Connecting-IP     (Cloudflare)
2. Header: X-Real-IP            (Nginx proxy)
3. Header: X-Forwarded-For      (load balancer)
4. req.socket.remoteAddress     (direct)
```

**Response:**
```json
{
  "ip": "113.161.68.1",
  "version": "IPv4",
  "location": {
    "country": "Vietnam",
    "countryCode": "VN",
    "city": "Ho Chi Minh City",
    "region": "Ho Chi Minh",
    "timezone": "Asia/Ho_Chi_Minh",
    "lat": 10.8231,
    "lon": 106.6297
  },
  "network": {
    "isp": "Viettel Group",
    "org": "Viettel Corporation",
    "asn": "AS7552"
  },
  "security": {
    "isProxy": false,
    "isVpn": false,
    "isTor": false
  }
}
```

**Error response:**
```json
{ "error": "Unable to determine IP" }
```

---

## 6. Data Source

Dùng `ip-api.com` để enrich IP thành thông tin geo/ISP:

```
GET http://ip-api.com/json/{IP}?fields=status,country,countryCode,city,regionName,timezone,isp,org,as,proxy,hosting&lang=en
```

> **Lưu ý:** `ip-api.com` free tier không hỗ trợ HTTPS → gọi từ server-side (Next.js API Route), không gọi trực tiếp từ browser.

**Rate limit free:** 45 requests/phút → đủ cho traffic nhỏ. Nếu scale cần cache Redis hoặc nâng lên paid plan.

**Caching:** Cache kết quả 60 giây per IP bằng Next.js `fetch` cache hoặc in-memory Map để tránh hit rate limit.

---

## 7. Cấu Trúc File

```
ip-checker/
├── app/
│   ├── page.tsx              # Landing page (client component)
│   ├── layout.tsx            # Root layout, metadata
│   ├── globals.css
│   └── api/
│       └── ip/
│           └── route.ts      # API Route lấy + enrich IP
├── components/
│   ├── IpCard.tsx            # Card hiển thị IP + copy button
│   ├── InfoGrid.tsx          # Grid Location + Network cards
│   ├── SecurityBadge.tsx     # VPN/Proxy badge
│   └── RefreshButton.tsx
├── lib/
│   └── get-ip.ts             # Utility đọc IP từ headers
├── types/
│   └── ip-info.ts            # TypeScript interfaces
├── public/
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 8. Sequence Flow

```
Browser load page
      │
      ▼
Next.js render page.tsx (skeleton UI)
      │
      ▼ useEffect / SWR fetch
GET /api/ip
      │
      ▼ (server-side)
Read IP from request headers
      │
      ▼
GET http://ip-api.com/json/{IP}?fields=...
      │
      ▼
Return enriched JSON to browser
      │
      ▼
Render IpCard + InfoGrid + SecurityBadge
```

---

## 9. Non-Functional Requirements

| Tiêu chí | Yêu cầu |
|---|---|
| Time to First Paint | < 500ms |
| IP hiển thị sau | < 1 giây |
| Mobile responsive | ✅ 375px trở lên |
| Không cần đăng nhập | ✅ Public, no auth |
| Không lưu IP vào DB | ✅ Stateless hoàn toàn |
| HTTPS | ✅ Bắt buộc |

---

## 10. Các Trường Hợp Đặc Biệt

| Tình huống | Xử lý |
|---|---|
| IP private (localhost, 192.168.x.x) | Hiển thị "Local Network — No public IP detected" |
| `ip-api.com` timeout / lỗi | Vẫn hiển thị IP, các trường geo/ISP hiển thị "—" |
| IPv6 | Hiển thị đầy đủ, label "IPv6", truncate nếu quá dài |
| User dùng Tor | Badge đỏ "Tor Network Detected" |
| Rate limit hit | Cache fallback, không crash trang |

---

## 11. Checklist Triển Khai

- [ ] Khởi tạo Next.js 14 project (`npx create-next-app@latest --typescript --tailwind --app`)
- [ ] Cài shadcn/ui (`npx shadcn@latest init`)
- [ ] Viết `app/api/ip/route.ts` — đọc IP từ headers + gọi ip-api.com
- [ ] Viết `lib/get-ip.ts` — utility parse headers
- [ ] Viết `components/IpCard.tsx` — hiển thị IP + copy button
- [ ] Viết `components/InfoGrid.tsx` — cards Location + Network
- [ ] Viết `components/SecurityBadge.tsx` — VPN/Proxy/Tor badge
- [ ] Viết `app/page.tsx` — kết hợp các components
- [ ] Test localhost: `npm run dev` → kiểm tra IP trả về
- [ ] Deploy lên Vercel → kiểm tra IP thật (khác localhost)
- [ ] Test trên mobile (responsive)
- [ ] Test bật VPN → badge có xuất hiện không
