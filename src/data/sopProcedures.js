export const SOP_PROCEDURES = {
  STARTUP: [
    { id: 'SU-01', phase: '1. Preparation', role: 'BM/FO', valveRef: 'SU-V34', text: 'Xác nhận hoàn tất thổi khí Nitơ (N2 purging), kiểm tra mức dầu làm kín cơ khí (LG-7115A/B..7118A/B) và RESET toàn bộ khóa liên động.' },
    { id: 'SU-02', phase: '2. Line up', role: 'FO', valveRef: 'SU-V1', text: 'Cấp nước làm mát CW cho E-762 (mở V1, xả khí vent, mở V2, kiểm tra PG-7602), E-765 (mở V18/V19) và E-764 (mở V20/V21).' },
    { id: 'SU-03', phase: '2. Line up', role: 'BM/FO', valveRef: 'SU-V3', text: 'Cấp dung dịch tải lạnh Brine cho E-763 (mở V3, xả khí vent), đặt TIC-787.SV = 5 °C chế độ AUTO và theo dõi chống đóng băng qua PIC-763.' },
    { id: 'SU-04', phase: '2. Line up', role: 'FO', valveRef: 'SU-V4', text: 'Mở nhẹ 20% van V4 tại U-Seal của E-762 và kiểm tra thông tuyến từ D-761 -> D-762 -> T-761 -> D-763 / D-764.' },
    { id: 'SU-05', phase: '3. Feed DW Boot', role: 'BM/FO', valveRef: 'SU-V17', text: 'Cấp MN2 vào D-762 (mở V10, V15, đặt PIC-763.SV = 1.5 kg/cm2g AUTO). Nối ống mềm cấp nước khử khoáng DW qua V17 tới mức Boot Leg ~50% (LIC-789) rồi đóng V17.' },
    { id: 'SU-06', phase: '4. Feed Hexane', role: 'BM/FO', valveRef: 'SU-V8', text: 'Mở nhẹ V8 cấp Hexane sạch HHX từ TK-702 (P-708A/B) vào D-761. Khi LI-787 đạt 30%, khởi động P-761A/B và đặt FIC-764.SV = 0.8 t/h AUTO.' },
    { id: 'SU-07', phase: '5. Heat up T-761', role: 'BM/FO', valveRef: 'FV-766', text: 'Khi LIC-788 đạt 50%, chạy P-762A/B cấp lên T-761. Khi mức đáy T-761 (LIC-790) đạt 25%, xả đọng hơi qua V23 và tăng dần FV-766.MV (3%/2 phút) tới TI-792 = 155–160 °C.' },
    { id: 'SU-08', phase: '6. Circulation', role: 'BM/FO', valveRef: 'SU-V46', text: 'Khi T-761 ổn định (PZI-753 = 1.5 kg/cm2g), mở nhẹ V46 tại khay số 10 cấp HX qua E-765 sang D-764. Khi LI-791 đạt 30%, chạy P-764A/B tuần hoàn và mở V24 (D-718), V5 (E-882).' },
    { id: 'SU-09', phase: '7. Product Transfer', role: 'BM/FO', valveRef: 'SU-V32', text: 'Lấy mẫu qua V30 kiểm tra Oligomer ≤ 2.5 wt% & Butene-1 ≤ 0.03 mol%. Nếu đạt chuẩn, mở V32 xuất sang TK-703; mở V42 chuyển Oligomer từ D-763 sang Package A.' }
  ],
  SHUTDOWN: [
    { id: 'SD-01', phase: '1. Preparation', role: 'FO', valveRef: 'SD-V1', text: 'Xác nhận cụm Low Polymer đã dừng. Báo Package A1 cắt nhận Waste Hexane. Mở dần V1 chuyển Hexane từ D-718 sang D-763.' },
    { id: 'SD-02', phase: '2. Dump D-718', role: 'BM/FO', valveRef: 'SD-V8', text: 'Khi LIC-782 đạt 10%, đặt MV = 0%, dừng P-718A/B, đóng V1. Nối ống mềm từ V19 vào V8 (kiểm tra V9, V10, V11 MỞ) xả phần lỏng còn lại từ D-718 về bình D-752.' },
    { id: 'SD-03', phase: '3. Dump D-761', role: 'BM/FO', valveRef: 'SD-V3', text: 'Đóng hoàn toàn V4 và mở V3 chuyển hướng Hexane từ E-882 sang TK-703. Dùng P-761A/B chuyển Hexane từ D-761 sang D-762 tới khi LI-787 = 10% thì dừng bơm, đóng FV-764.' },
    { id: 'SD-04', phase: '4. Dump D-762', role: 'BM/FO', valveRef: 'SD-V21', text: 'Mở V21 xả lỏng từ E-762 về D-762. Giảm dần FV-766 về 0% cắt hơi HS vào E-761. Chuyển Hexane từ D-762 sang T-761 tới LIC-788 = 5.9% thì dừng P-762A/B.' },
    { id: 'SD-05', phase: '4. Drain Boot D-762', role: 'BM/FO', valveRef: 'SD-V7', text: 'Giám sát AZIG-74 và hé mở V7 kiểm tra nước thải Boot Leg D-762. Khi phát hiện Hydrocarbon, đóng LV-789, nối ống mềm từ V7 sang V8 xả nước lẫn Hexane về D-752.' },
    { id: 'SD-06', phase: '5. Dump T-761 & E-761', role: 'BM/FO', valveRef: 'SD-V17', text: 'Xả đáy T-761 sang D-763 tới LIC-790 = 13.3%, sau đó nối ống mềm V12 -> V8 xả về D-752. Mở V20 xả E-765 sang D-764. Khi E-761 nguội, cấp Nitơ LN qua V17 thổi đẩy lỏng qua V18 -> V8 về D-752.' },
    { id: 'SD-07', phase: '6. Dump D-764 & D-763', role: 'BM/FO', valveRef: 'SD-V13', text: 'Chuyển D-764 sang TK-703 tới LI-791 = 25%, nối ống mềm V13 -> V8 xả về D-752. Xuất D-763 tới LI-792 = 4.3%, nối ống mềm V14 -> V8 xả nốt về D-752.' },
    { id: 'SD-08', phase: '7. Cut Utility & Finish', role: 'BM/FO', valveRef: 'SD-V15', text: 'Bật MOS cho FZALL-763 (tránh kích hoạt liên động I-705), đóng V15 (CW E-762), xả D-765 sang D-851, đóng V16 (Brine E-763) và duy trì đệm khí Nitơ LN 0.1 kg/cm2g.' }
  ]
};
