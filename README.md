# T-761 Oligomer Cut Tower — Real-Time OTS & 2D/3D Digital Twin

Bộ mã nguồn mô phỏng vận hành cụm tháp tách Oligomer (**T-761 — Section 700 Hexane Recovery**) được chuẩn hóa để:
1. Đẩy trực tiếp lên **GitHub** và triển khai tức thì qua **Vercel** (`vercel.json` + cấu trúc ES6 Module không cần bước biên dịch phức tạp).
2. Đồng bộ hai chiều với **Figma** thông qua bộ **Design Tokens (`figma/tokens/tokens.json`)** và thư viện **P&ID SVG phân lớp (`figma/svg-library/`)**.

## Cấu trúc Thư mục Chuẩn

```text
t761-ots-digital-twin/
├── .github/workflows/ci-ots-validation.yml   # Tự động kiểm tra JSON Tokens, SVG XML & cú pháp JS
├── figma/
│   ├── tokens/
│   │   ├── tokens.json                       # Bảng màu ISA-101, font chữ, ngưỡng cảnh báo cho Tokens Studio
│   │   └── $themes.json                      # Chủ đề Control Room Dark & Field Light
│   └── svg-library/
│       ├── T761_PID_Master_Figma.svg         # Sơ đồ P&ID phân lớp (Layer_Startup_Valves & Layer_Shutdown_Valves)
│       ├── ISA101_Symbols_Kit.svg            # Thư viện ký hiệu thiết bị, bơm, van cho Figma Component Set
│       └── FIGMA_IMPORT_GUIDE.md             # Hướng dẫn nhập Tokens & SVG vào Figma
├── src/
│   ├── data/                                 # Dữ liệu thiết bị, 21 tag DCS, danh mục van V1..V48, quy trình SOP & sự cố
│   ├── engine/                               # Lõi nhiệt động lực học, công thức thể tích D-763, khóa liên động ESD & âm thanh
│   ├── ui/                                   # Bộ dựng P&ID 2D Pan/Zoom, mô hình 3D Three.js & bảng Tuning DCS
│   └── main.js                               # Điểm khởi chạy chính & đồng hồ thời gian thực
├── index.html
├── package.json
└── vercel.json
```

## Hướng dẫn Đẩy lên GitHub và Triển khai trên Vercel

1. **Tạo Repository trên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial T-761 OTS Digital Twin & Figma Token Library"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/t761-ots-digital-twin.git
   git push -u origin main
   ```
2. **Import vào Vercel:**
   - Truy cập [vercel.com/new](https://vercel.com/new), chọn kho lưu trữ `t761-ots-digital-twin`.
   - Framework Preset chọn **Other**, giữ nguyên thư mục gốc `./` và nhấn **Deploy**.
   - Ứng dụng chạy trực tiếp trên trình duyệt với đầy đủ sơ đồ P&ID 2D, mô hình 3D, đồng hồ thời gian thực, bảng cấu hình ngưỡng cảnh báo DCS/ESD và xuất báo cáo PDF.
