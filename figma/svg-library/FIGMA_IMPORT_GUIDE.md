# Hướng dẫn Nhập Design Tokens & Thư viện P&ID SVG vào Figma

## Bước 1: Nhập Design Tokens bằng Plugin Tokens Studio for Figma
1. Mở tệp dự án mới trên **Figma** (`T-761 Digital Twin HMI`).
2. Mở plugin **Tokens Studio for Figma** (Plugins -> Tokens Studio).
3. Chọn **Load from file/folder** (hoặc đồng bộ trực tiếp với GitHub Repository tại nhánh `main`, đường dẫn `figma/tokens`).
4. Trỏ tới tệp `figma/tokens/tokens.json` và `figma/tokens/$themes.json`.
5. Nhấn **Apply to page / Create Styles & Variables** để sinh toàn bộ bảng màu ISA-101 (`processFluid`, `hmi_dark`, `hmi_light`), font chữ `JetBrains Mono` và kích thước nhãn van lớn (`18px`).

## Bước 2: Nhập Thư viện Ký hiệu & Sơ đồ P&ID Chuẩn
1. Kéo thả tệp `figma/svg-library/ISA101_Symbols_Kit.svg` vào trang **01. Components Library** trong Figma.
2. Chọn từng nhóm ký hiệu (`SYM_Distillation_Tower`, `SYM_Horizontal_Drum`, `SYM_Centrifugal_Pump`, `SYM_Valves_Kit`), nhấn `Ctrl + Alt + K` (Create Component) và thêm Variants (`Open`, `Close`, `Running`, `Stopped`, `Alarm`).
3. Kéo thả tệp `figma/svg-library/T761_PID_Master_Figma.svg` vào trang **02. P&ID Master Screen**.
4. Kiểm tra bảng Layer bên trái:
   - `Layer_Startup_Valves`: Chứa toàn bộ van khởi động (`SU-V1` đến `SU-V48` theo SOP `HD-W-7500-02-001`).
   - `Layer_Shutdown_Valves`: Chứa toàn bộ van dừng cụm (`SD-V1` đến `SD-V21` theo SOP `HD-W-7500-06-001`).
   - `Layer_Control_Valves`: Chứa các van điều khiển DCS (`FV-764`, `FV-766`, `LV-788`, `LV-789`, `LV-790`, `LV-791`, `LV-797`, `PV-748`, `PV-749`, `PV-763-1/2`, `TV-787`).

## Bước 3: Xuất ngược từ Figma lên GitHub
Khi chỉnh sửa giao diện trên Figma:
- Chọn Frame chính -> **Export -> SVG** -> Tích chọn **Include "id" attribute** -> Lưu đè vào `figma/svg-library/T761_PID_Master_Figma.svg` và `git push` lên GitHub. Vercel sẽ tự động cập nhật bản mô phỏng trực tuyến sau ~20 giây.
