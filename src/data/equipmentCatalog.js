export const EQUIPMENT_CATALOG = [
  {
    id: 'T-761',
    name: 'Oligomer Cut Tower',
    type: 'Distillation Column (20 Valve Trays)',
    specs: 'Dia 800 x 12750 mm | Vol 6.5 m3 | Press 1.7/3.8 & FV kg/cm2g | Temp 180/225 °C | BTL-EL+4450',
    inlet: 'Slop Hexane từ D-762 (qua P-762A/B & LV-788) vào đỉnh tháp; Waste Hexane từ D-718 (qua P-718A/B & V24) vào đáy tháp; Hơi tuần hoàn từ Reboiler E-761.',
    outlet: 'Đỉnh tháp: Hơi Hexane + Butene-1 sang E-762; Khay số 10 (Tray 10): Dòng phụ Hexane sạch (100–105 °C) qua V46 sang E-765; Đáy tháp: Cặn Oligomer (~10 wt% Hexane, 200–210 °C) qua V27 & LV-790 sang E-764.',
    principle: 'Chưng cất phân đoạn 20 mâm van dựa trên chênh lệch nhiệt độ sôi giữa Hexane (~69 °C ở 1 atm, ~89 °C ở 1.5 kg/cm2g), khí nhẹ Butene-1 và sáp Oligomer nặng (155–210 °C) nhằm thu hồi Hexane đạt chuẩn tái sử dụng (Oligomer ≤ 2.5 wt%, Butene-1 ≤ 0.03 mol%).'
  },
  {
    id: 'E-761',
    name: 'Oligomer Cut Tower Reboiler',
    type: 'Shell & Tube Heat Exchanger (AEM)',
    specs: 'Area 22.5 m2 | Duty 790,000 kcal/h | Shell (HS) 42/50 kg/cm2g, 253.3/285 °C | Tube 1.6/3.8 kg/cm2g, 171.6/235 °C | BTL-EL+2464',
    inlet: 'Vỏ (Shell): Hơi nước cao áp HS qua FV-766; Ống (Tube): Lỏng đáy tháp T-761 tuần hoàn đối lưu nhiệt (Thermosyphon).',
    outlet: 'Vỏ: Nước ngưng cao áp HC qua V45 về bình D-765; Ống: Hỗn hợp lỏng-hơi hồi lưu về đáy tháp T-761.',
    principle: 'Cung cấp nhiệt lượng hóa hơi cho đáy tháp T-761 bằng hơi cao áp HS (tăng dần MV 3%/2 phút khi khởi động để tránh búa nước và sốc nhiệt).'
  },
  {
    id: 'D-765',
    name: 'HC Condensate Pot',
    type: 'Vertical Pressure Vessel',
    specs: 'Dia 450 x 1125 mm | Vol 0.202 m3 | Press 42/50 & FV kg/cm2g | Temp 253/285 °C',
    inlet: 'Nước ngưng cao áp từ E-761 qua van V45.',
    outlet: 'Xả nước ngưng qua van điều khiển mức LV-797 (LIC-797 = 50%) sang hệ thống thu hồi D-851.',
    principle: 'Duy trì cột lỏng bịt kín (liquid seal) tránh lọt hơi sống từ E-761 sang đường ống nước ngưng gây hiện tượng búa nước (liquid hammering).'
  },
  {
    id: 'E-762',
    name: 'Hexane Overhead Condenser',
    type: 'Shell & Tube Condenser (BJM)',
    specs: 'Area 68.9 m2 | Duty 576,000 kcal/h | Shell 1.5/6.5 kg/cm2g | Tube (CW) 4/8 kg/cm2g | CL-EL+14550',
    inlet: 'Vỏ: Hơi đỉnh tháp T-761; Ống: Nước làm mát CWS qua van V1 (Start-up) / V15 (Shutdown).',
    outlet: 'Vỏ: Hexane lỏng ngưng tụ chảy tự nhiên về D-762 (qua U-seal V4 / V21); Ống: Nước làm mát hồi CWR qua FZI-763 (80 t/h).',
    principle: 'Ngưng tụ toàn bộ hơi Hexane thoát ra từ đỉnh tháp T-761 bằng nước làm mát tuần hoàn (khóa liên động I-705 kích hoạt khi FZI-763 giảm dưới 37.8 t/h).'
  },
  {
    id: 'D-762',
    name: 'Slop Hexane Reflux Drum',
    type: 'Horizontal Drum with Water Boot Leg',
    specs: 'Dia 1500 x 3000 mm | Vol 6.2 m3 | Press 1.5/3.8 & FV kg/cm2g | Temp 50/85 °C | CL-EL+6850',
    inlet: 'Hexane lỏng từ E-762; Hexane thô từ D-761 (qua P-761A/B & FV-764); Khí Nitơ MN2 bù áp qua PV-763-1.',
    outlet: 'Hexane lỏng qua P-762A/B & LV-788 cấp/hồi lưu lên đỉnh T-761; Hơi nhẹ/Butene-1 lên E-763 & xả Flare qua PV-763-2; Nước tách tại Boot Leg xả qua LV-789 xuống PIT-762.',
    principle: 'Ổn định áp suất vận hành toàn cụm T-761 ở 1.5 kg/cm2g bằng bộ điều khiển chia dải PIC-763 (PV-763-1/2), đồng thời tách nước tự do ở bầu Boot Leg (giám sát hàm lượng HC qua AZIG-74).'
  },
  {
    id: 'E-763',
    name: 'Vent Condenser',
    type: 'Shell & Tube Chilled Condenser (BEM)',
    specs: 'Area 21.7 m2 | Duty 30,300 kcal/h | Shell 1.5/6.5 kg/cm2g | Tube (Brine) 5/8 kg/cm2g | BTL-EL+10550',
    inlet: 'Vỏ: Khí thoát đỉnh D-762; Ống: Dung dịch tải lạnh Brine BRS qua V3 (Start-up) / V16 (Shutdown).',
    outlet: 'Vỏ: Hexane ngưng tụ chảy hồi về D-762, khí Butene-1 đậm đặc xả qua PV-763-2 tới hệ thống đuốc Flare; Ống: Brine hồi BRR qua TV-787 (TIC-787 = 5 °C).',
    principle: 'Làm lạnh sâu dòng khí xả xuống 5 °C bằng Brine để thu hồi tối đa hơi Hexane trước khi thải khí Butene-1 sang Flare, tránh tổn thất dung môi.'
  },
  {
    id: 'D-761',
    name: 'Slop Hexane Drum',
    type: 'Vertical Buffer Drum',
    specs: 'Dia 1050 x 2650 mm | Vol 2.7 m3 | Press 1.5/3.8 & FV kg/cm2g | Temp 5/85 °C | BTL-EL+1720',
    inlet: 'Hexane sạch khởi động HHX từ TK-702 (P-708A/B, V8); Hexane thải từ E-882 (V5); Hexane hồi lưu chưa đạt chuẩn từ D-764 (V33).',
    outlet: 'Cấp liệu qua bơm P-761A/B và van FV-764 (FIC-764 = 0.8 t/h) sang bình D-762.',
    principle: 'Bồn đệm trung gian ổn định lưu lượng đầu vào cụm chưng cất và tiếp nhận dòng Hexane tái chế khi hàm lượng Oligomer vượt ngưỡng 2.5 wt%.'
  },
  {
    id: 'E-765',
    name: 'Hexane Cooler',
    type: 'Shell & Tube Cooler (BEM)',
    specs: 'Area 9 m2 | Duty 61,000 kcal/h | Shell (CW) 4/8 kg/cm2g | Tube 1.6/4 kg/cm2g | CL-EL+13900',
    inlet: 'Ống: Dòng rút phụ Hexane sạch tại Tray 10 của T-761 (100–105 °C) qua van V46; Vỏ: Nước làm mát CWS qua V18.',
    outlet: 'Ống: Hexane làm mát xuống ~43 °C (TI-793) qua V26 sang bình D-764; Vỏ: CWR qua V19.',
    principle: 'Hạ nhiệt độ dòng sản phẩm Hexane sạch rút ngang từ khay 10 xuống 43 °C để tránh bay hơi trong bình chứa D-764.'
  },
  {
    id: 'D-764',
    name: 'Hexane Receiving Drum',
    type: 'Vertical Product Drum',
    specs: 'Dia 800 x 2000 mm | Vol 1.1 m3 | Press 0.5/3.8 & FV kg/cm2g | Temp 43/85 °C | BTL-EL+645',
    inlet: 'Hexane sạch từ E-765 qua van V47; Khí Nitơ LN điều áp qua PV-748 (PIC-748 = 0.5 kg/cm2g).',
    outlet: 'Qua bơm P-764A/B & LV-791: chuyển sang bồn chứa TK-703 (qua V32) nếu đạt chuẩn, hoặc hồi lưu về D-761 (qua V33) nếu Oligomer > 2.5 wt%.',
    principle: 'Bình chứa kiểm tra chất lượng sản phẩm Hexane trước khi xuất sang bồn chứa sạch TK-703.'
  },
  {
    id: 'E-764',
    name: 'Oligomer Bottom Cooler',
    type: 'Double-Pipe Cooler (D-PIPE)',
    specs: 'Area 0.52 m2 | Duty 23,000 kcal/h | BTL-EL+1050',
    inlet: 'Ống trong: Cặn Oligomer nóng từ đáy T-761 (155–210 °C) qua V27 & LV-790; Vỏ ngoài: Nước làm mát CWS qua V20.',
    outlet: 'Ống trong: Oligomer nguội xuống ≤ 40–43 °C (TI-794) qua V28 sang bình D-763; Vỏ ngoài: CWR qua V21.',
    principle: 'Làm nguội nhanh cặn sáp Oligomer từ đáy tháp xuống dưới 43 °C trước khi đưa vào bình chứa D-763, ngăn ngừa bốc hơi Hexane dư và đảm bảo an toàn tồn chứa.'
  },
  {
    id: 'D-763',
    name: 'Oligomer Drum',
    type: 'Horizontal Drum (2:1 Elliptical Heads)',
    specs: 'Dia 2500 x 3300 mm | Vol 20.2 m3 | Press 0.2/3.8 kg/cm2g | Temp 43/85 °C | CL-EL+2850',
    inlet: 'Oligomer nguội từ E-764 qua V36; Dòng xả từ D-718 khi dừng cụm qua V1; Khí Nitơ LN đệm áp qua V34/V35 & PV-749 (0.2 kg/cm2g).',
    outlet: 'Qua bơm P-763A/B & FT-743: xuất sang Package A (qua V42) hoặc nạp xe bồn Tank Truck (qua V41).',
    principle: 'Tồn chứa tập trung cặn Oligomer/Waste Hexane và tính toán chính xác tồn kho theo công thức hình trụ ngang kết hợp hai chỏm cầu elip 2:1.'
  },
  {
    id: 'D-752',
    name: 'Drainage Drum',
    type: 'Horizontal Slop Drainage Drum',
    specs: 'Dia 2600 x 3900 mm | Vol 25.3 m3 | Press 0.02~0.5/3.8 kg/cm2g | Temp 30/100 °C | CL-EL+3250',
    inlet: 'Tuyến xả đáy 1-1/2"-HX-7087-A2A-P (qua V8, V9, V10, V11) kết nối ống mềm từ V19 (P-718), V7 (D-762 Boot), V12 (LV-790), V18 (E-761), V13 (P-764), V14 (P-763).',
    outlet: 'Bơm thu hồi P-752 chuyển về hệ thống xử lý.',
    principle: 'Thu gom an toàn toàn bộ lượng lỏng Hydrocarbon dư trong đường ống và đáy thiết bị khi thực hiện quy trình dừng cụm (Shutdown SOP HD-W-7500-06-001).'
  }
];
