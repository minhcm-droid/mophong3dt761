export const DEVIATIONS_CATALOG = [
  {
    id: 'DEV-01',
    equip: 'D-761',
    tag: 'LI-787',
    title: 'Mức D-761 thấp (Low Level) / Xâm thực bơm P-761A/B',
    cause: 'Vô tình mở lớn van điều khiển FV-764 trên đường đẩy bơm P-761A/B.',
    consequence: 'Mất cột áp hút gây xâm thực (cavitation) làm hư hỏng cánh và phớt cơ khí bơm P-761A/B.',
    action: 'Kiểm tra kính thủy LG-7601/7602 và vị trí FV-764. Đóng van cô lập trước/sau FV-764, điều tiết bằng van bypass tay; xem xét dừng bơm P-761A/B nếu kim PG-7604A/B dao động.',
    inject: (state) => { state.tags['LI-787'].pv = 8.5; state.valves['FV-764'].mv = 100; }
  },
  {
    id: 'DEV-02',
    equip: 'D-762',
    tag: 'LIC-788',
    title: 'Mức D-762 cao (High Level) do Trip bơm P-762A/B',
    cause: 'Bơm hồi lưu Slop Hexane P-762A/B bị dừng đột ngột (trip).',
    consequence: 'Ngập bình D-762 làm mất diện tích trao đổi nhiệt ngưng tụ tại E-762, dẫn tới quá áp đỉnh tháp và nguy cơ rò rỉ cháy nổ (LOC).',
    action: 'Kiểm tra trạng thái bơm P-762A/B và độ mở LV-788. Khởi động lại bơm hoặc chuyển sang bơm dự phòng (A <-> B) ngay lập tức.',
    inject: (state) => { state.tags['LIC-788'].pv = 92.5; state.pumps['P-762A'].running = false; }
  },
  {
    id: 'DEV-03',
    equip: 'D-762 Boot',
    tag: 'LI-789-1/2',
    title: 'Mức nước Boot Leg D-762 thấp (Mở nhầm LV-789)',
    cause: 'Van xả nước LV-789 trên bầu Boot Leg D-762 bị mở ngoài ý muốn.',
    consequence: 'Mất lớp đệm nước (water seal) khiến Hexane lỏng lọt thẳng xuống hố thu PIT-762 gây nguy cơ hỏa hoạn.',
    action: 'Chuyển đổi bộ đo dự phòng LI-789-1 / LI-789-2, kiểm tra tín hiệu AZIG-74, đóng van cô lập LV-789 và điều chỉnh bằng van bypass.',
    inject: (state) => { state.tags['LI-789-1'].pv = 12.0; state.tags['LI-789-2'].pv = 12.0; state.valves['LV-789'].mv = 100; }
  },
  {
    id: 'DEV-04',
    equip: 'D-762',
    tag: 'PIC-763',
    title: 'Áp suất bình D-762 tăng cao (Mở nhầm PV-763-1)',
    cause: 'Van cấp Nitơ bù áp PV-763-1 (MN2 -> D-762) bị mở nhầm hoặc kẹt mở.',
    consequence: 'Quá áp hệ thống D-762 và đỉnh tháp T-761, tiềm ẩn nguy cơ bung van an toàn PSV hoặc mất kiểm soát môi chất.',
    action: 'Kiểm tra vị trí PV-763-1 và PV-763-2. Đóng van cô lập nguồn cấp MN2 bằng tay và mở nhẹ van bypass xả khí sang hệ thống Flare.',
    inject: (state) => { state.tags['PIC-763'].pv = 1.76; state.tags['PZI-753'].pv = 1.78; state.valves['PV-763-1'].mv = 90; }
  },
  {
    id: 'DEV-05',
    equip: 'E-762',
    tag: 'FZI-763',
    title: 'Mất nước làm mát CWR tại bộ ngưng tụ E-762 (Low Flow)',
    cause: 'Đóng nhầm van cô lập CW hoặc sụt áp tuyến nước làm mát.',
    consequence: 'Mất ngưng tụ hơi đỉnh T-761 gây tăng áp đột ngột; nếu FZI-763 ≤ 37.8 t/h sẽ kích hoạt khóa liên động I-705.',
    action: 'Kiểm tra TG-7601, PG-7602, PIC-763; mở hoàn toàn van cô lập nước làm mát cho E-762 và xả khí air trên tuyến CW.',
    inject: (state) => { state.tags['FZI-763'].pv = 35.0; }
  },
  {
    id: 'DEV-06',
    equip: 'E-763',
    tag: 'TIC-787',
    title: 'Đóng băng cục bộ tại Vent Condenser E-763',
    cause: 'Nhiệt độ Brine giảm quá sâu khi vận hành TIC-787 ở 5 °C làm đóng băng hơi ẩm trong khí thoát.',
    consequence: 'Tắc nghẽn đường thoát khí từ D-762 sang Flare làm áp suất PIC-763 tăng nhanh.',
    action: 'Chuyển bộ điều khiển TIC-787 sang chế độ MANUAL và giảm độ mở MV của TV-787 để làm tan băng; khi áp suất ổn định chuyển lại AUTO.',
    inject: (state) => { state.tags['TIC-787'].pv = -2.0; state.tags['PIC-763'].pv = 1.72; }
  },
  {
    id: 'DEV-07',
    equip: 'T-761',
    tag: 'TI-792',
    title: 'Nhiệt độ đáy T-761 cao & Oligomer D-764 > 2.5 wt%',
    cause: 'Cấp dư hơi cao áp HS qua FV-766 vào Reboiler E-761.',
    consequence: 'Sáp Oligomer nặng bị cuốn theo hơi lên khay 10 làm hỏng chất lượng Hexane (Oligomer > 2.5 wt%), giảm hoạt tính xúc tác PE.',
    action: 'Giảm độ mở FV-766 đưa TI-792 về 155–160 °C; đóng V32 và mở V33 hồi lưu Hexane từ D-764 về D-761 để chưng cất lại, lấy mẫu qua V30 mỗi 4 giờ.',
    inject: (state) => { state.tags['TI-792'].pv = 194.0; state.tags['TI-789'].pv = 110.0; state.oligomerWt = 3.8; }
  },
  {
    id: 'DEV-08',
    equip: 'T-761',
    tag: 'PDI-760',
    title: 'Ngập lụt tháp (Flooding) & Chênh áp khay 1-20 cao',
    cause: 'Nạp liệu quá mức vào T-761 do sự cố thượng lưu (van LV-782 mở hoàn toàn) hoặc đóng nhầm LV-790.',
    consequence: 'Chênh áp PDI-760 vượt 2400 mmH2O, gây ngập lụt và hư hỏng cơ khí 20 mâm van bên trong tháp T-761.',
    action: 'Kiểm tra kính thủy LG-7605 và độ mở LV-790, giảm lưu lượng nạp liệu vào T-761 và mở van bypass đáy tháp nếu cần.',
    inject: (state) => { state.tags['PDI-760'].pv = 2580; state.tags['LIC-790'].pv = 84.0; }
  },
  {
    id: 'DEV-09',
    equip: 'D-765',
    tag: 'LIC-797',
    title: 'Mức nước ngưng D-765 cao gây ngập Reboiler E-761',
    cause: 'Đóng nhầm van điều khiển nước ngưng LV-797.',
    consequence: 'Nước ngưng dâng ngập ống trao đổi nhiệt E-761 làm mất nhiệt gia nhiệt đáy tháp, khiến Hexane lọt sang bình Oligomer D-763.',
    action: 'Kiểm tra kính thủy LG-7907, điều khiển bằng tay van bypass của LV-797 để hạ mức D-765 về 50% và lấy mẫu kiểm tra D-763, D-764.',
    inject: (state) => { state.tags['LIC-797'].pv = 93.0; state.tags['TI-792'].pv = 148.0; }
  },
  {
    id: 'DEV-10',
    equip: 'D-764 / D-763',
    tag: 'PIC-748 / PIC-749',
    title: 'Quá áp đỉnh bình D-764 hoặc D-763 (Đóng nhầm PV-748/749)',
    cause: 'Van điều áp thoát khí PV-748 (D-764) hoặc PV-749 (D-763) bị đóng nhầm.',
    consequence: 'Cản trở dòng rút Hexane tại khay 10 hoặc dòng xả Oligomer đáy tháp T-761 gây dâng mức và ngập tháp.',
    action: 'Kiểm tra áp kế hiện trường PG-7614 (D-764) và PG-7617 (D-763), mở van bypass tay để xả áp về 0.5 kg/cm2g (D-764) và 0.2 kg/cm2g (D-763).',
    inject: (state) => { state.tags['PIC-748'].pv = 0.68; state.tags['PIC-749'].pv = 0.65; }
  }
];
