// lunar-calendar.js - Tính lịch âm dương, giờ hoàng đạo, mệnh ngày, tiết khí
// Thuật toán chuyển đổi âm dương dựa trên bảng dữ liệu

const LunarCalendar = {
  CAN: ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'],
  CHI: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
  THU: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],

  // Nạp âm 60 Hoa Giáp
  NAP_AM: [
    'Hải Trung Kim (Kim)','Hải Trung Kim (Kim)','Lư Trung Hỏa (Hỏa)','Lư Trung Hỏa (Hỏa)','Đại Lâm Mộc (Mộc)','Đại Lâm Mộc (Mộc)',
    'Lộ Bàng Thổ (Thổ)','Lộ Bàng Thổ (Thổ)','Kiếm Phong Kim (Kim)','Kiếm Phong Kim (Kim)','Sơn Đầu Hỏa (Hỏa)','Sơn Đầu Hỏa (Hỏa)',
    'Giản Hạ Thủy (Thủy)','Giản Hạ Thủy (Thủy)','Thành Đầu Thổ (Thổ)','Thành Đầu Thổ (Thổ)','Bạch Lạp Kim (Kim)','Bạch Lạp Kim (Kim)',
    'Dương Liễu Mộc (Mộc)','Dương Liễu Mộc (Mộc)','Tuyền Trung Thủy (Thủy)','Tuyền Trung Thủy (Thủy)','Ốc Thượng Thổ (Thổ)','Ốc Thượng Thổ (Thổ)',
    'Tích Lịch Hỏa (Hỏa)','Tích Lịch Hỏa (Hỏa)','Tùng Bách Mộc (Mộc)','Tùng Bách Mộc (Mộc)','Trường Lưu Thủy (Thủy)','Trường Lưu Thủy (Thủy)',
    'Sa Trung Kim (Kim)','Sa Trung Kim (Kim)','Sơn Hạ Hỏa (Hỏa)','Sơn Hạ Hỏa (Hỏa)','Bình Địa Mộc (Mộc)','Bình Địa Mộc (Mộc)',
    'Bích Thượng Thổ (Thổ)','Bích Thượng Thổ (Thổ)','Kim Bạc Kim (Kim)','Kim Bạc Kim (Kim)','Phú Đăng Hỏa (Hỏa)','Phú Đăng Hỏa (Hỏa)',
    'Thiên Hà Thủy (Thủy)','Thiên Hà Thủy (Thủy)','Đại Dịch Thổ (Thổ)','Đại Dịch Thổ (Thổ)','Thoa Xuyến Kim (Kim)','Thoa Xuyến Kim (Kim)',
    'Tang Đố Mộc (Mộc)','Tang Đố Mộc (Mộc)','Đại Khê Thủy (Thủy)','Đại Khê Thủy (Thủy)','Sa Trung Thổ (Thổ)','Sa Trung Thổ (Thổ)',
    'Thiên Thượng Hỏa (Hỏa)','Thiên Thượng Hỏa (Hỏa)','Thạch Lựu Mộc (Mộc)','Thạch Lựu Mộc (Mộc)','Đại Hải Thủy (Thủy)','Đại Hải Thủy (Thủy)'
  ],

  // 12 Trực
  TRUC: [
    { name: 'Kiến', desc: 'Tốt cho khởi công, xuất hành' },
    { name: 'Trừ', desc: 'Tốt cho trị bệnh, dọn dẹp' },
    { name: 'Mãn', desc: 'Tốt cho cầu tài, khai trương' },
    { name: 'Bình', desc: 'Tốt cho tu sửa, trang trí' },
    { name: 'Định', desc: 'Tốt cho hôn nhân, bái sư' },
    { name: 'Chấp', desc: 'Tốt cho xây dựng, gieo trồng' },
    { name: 'Phá', desc: 'Nên chữa bệnh, phá dỡ nhà' },
    { name: 'Nguy', desc: 'Kỵ mọi việc, nên an phận' },
    { name: 'Thành', desc: 'Tốt cho khai trương, nhập trạch' },
    { name: 'Thu', desc: 'Tốt cho thu hoạch, cất tiền' },
    { name: 'Khai', desc: 'Tốt cho khởi công, giao dịch' },
    { name: 'Bế', desc: 'Kỵ mọi việc, nên nghỉ ngơi' },
  ],

  // Nhị thập bát tú
  NHI_THAP_BAT_TU: [
    { sao: 'Giác', hanh: 'Mộc', vat: 'Giảo (con cá sấu)', tot: true },
    { sao: 'Cang', hanh: 'Kim', vat: 'Long (con rồng)', tot: false },
    { sao: 'Đê', hanh: 'Thổ', vat: 'Mạc (con chồn)', tot: true },
    { sao: 'Phòng', hanh: 'Nhật', vat: 'Thỏ (con thỏ)', tot: true },
    { sao: 'Tâm', hanh: 'Nguyệt', vat: 'Hồ (con cáo)', tot: false },
    { sao: 'Vĩ', hanh: 'Hỏa', vat: 'Hổ (con cọp)', tot: true },
    { sao: 'Cơ', hanh: 'Thủy', vat: 'Báo (con beo)', tot: true },
    { sao: 'Đẩu', hanh: 'Mộc', vat: 'Giải (con cua)', tot: true },
    { sao: 'Ngưu', hanh: 'Kim', vat: 'Ngưu (con trâu)', tot: false },
    { sao: 'Nữ', hanh: 'Thổ', vat: 'Bức (con dơi)', tot: false },
    { sao: 'Hư', hanh: 'Nhật', vat: 'Thử (con chuột)', tot: false },
    { sao: 'Nguy', hanh: 'Nguyệt', vat: 'Yến (con én)', tot: false },
    { sao: 'Thất', hanh: 'Hỏa', vat: 'Trư (con lợn)', tot: true },
    { sao: 'Bích', hanh: 'Thủy', vat: 'Du (con nhím)', tot: true },
    { sao: 'Khuê', hanh: 'Mộc', vat: 'Lang (con sói)', tot: false },
    { sao: 'Lâu', hanh: 'Kim', vat: 'Cẩu (con chó)', tot: true },
    { sao: 'Vị', hanh: 'Thổ', vat: 'Trĩ (con trĩ)', tot: true },
    { sao: 'Mão', hanh: 'Nhật', vat: 'Kê (con gà)', tot: false },
    { sao: 'Tất', hanh: 'Nguyệt', vat: 'Ô (con quạ)', tot: true },
    { sao: 'Chủy', hanh: 'Hỏa', vat: 'Hầu (con khỉ)', tot: false },
    { sao: 'Sâm', hanh: 'Thủy', vat: 'Viên (con vượn)', tot: true },
    { sao: 'Tỉnh', hanh: 'Mộc', vat: 'Ngạn (con chó rừng)', tot: true },
    { sao: 'Quỷ', hanh: 'Kim', vat: 'Dương (con dê)', tot: false },
    { sao: 'Liễu', hanh: 'Thổ', vat: 'Chương (con nai)', tot: false },
    { sao: 'Tinh', hanh: 'Nhật', vat: 'Mã (con ngựa)', tot: true },
    { sao: 'Trương', hanh: 'Nguyệt', vat: 'Lộc (con hươu)', tot: true },
    { sao: 'Dực', hanh: 'Hỏa', vat: 'Xà (con rắn)', tot: false },
    { sao: 'Chẩn', hanh: 'Thủy', vat: 'Dẫn (con giun đất)', tot: true },
  ],

  // Tiết khí
  TIET_KHI: [
    { name: 'Tiểu hàn', month: 1, day: 6 },
    { name: 'Đại hàn', month: 1, day: 20 },
    { name: 'Lập xuân', month: 2, day: 4 },
    { name: 'Vũ thủy', month: 2, day: 19 },
    { name: 'Kinh trập', month: 3, day: 6 },
    { name: 'Xuân phân', month: 3, day: 21 },
    { name: 'Thanh minh', month: 4, day: 5 },
    { name: 'Cốc vũ', month: 4, day: 20 },
    { name: 'Lập hạ', month: 5, day: 6 },
    { name: 'Tiểu mãn', month: 5, day: 21 },
    { name: 'Mang chủng', month: 6, day: 6 },
    { name: 'Hạ chí', month: 6, day: 21 },
    { name: 'Tiểu thử', month: 7, day: 7 },
    { name: 'Đại thử', month: 7, day: 23 },
    { name: 'Lập thu', month: 8, day: 7 },
    { name: 'Xử thử', month: 8, day: 23 },
    { name: 'Bạch lộ', month: 9, day: 8 },
    { name: 'Thu phân', month: 9, day: 23 },
    { name: 'Hàn lộ', month: 10, day: 8 },
    { name: 'Sương giáng', month: 10, day: 23 },
    { name: 'Lập đông', month: 11, day: 7 },
    { name: 'Tiểu tuyết', month: 11, day: 22 },
    { name: 'Đại tuyết', month: 12, day: 7 },
    { name: 'Đông chí', month: 12, day: 22 },
  ],

  // Sao tốt xấu phổ biến
  SAO_TOT: [
    'Thiên đức: Tốt mọi việc',
    'Nguyệt đức: Tốt mọi việc',
    'Thiên quý: Tốt mọi việc',
    'Phúc sinh: Tốt mọi việc',
    'Cát khánh: Tốt mọi việc',
    'Âm đức: Tốt mọi việc',
    'Thiên ân: Tốt cho cầu phúc',
    'Sát công: Tốt mọi việc (giải được sao xấu)',
    'Thiên mã: Tốt cho xuất hành',
    'Lộc mã: Tốt cho tài lộc',
  ],

  SAO_XAU: [
    'Thiên tại: Xấu mọi việc',
    'Hoang vu: Xấu mọi việc',
    'Nhân cách: Xấu với giá thú, khởi tạo',
    'Huyền vũ: Kỵ mai tang',
    'Ly sang: Kỵ giá thú',
    'Cửu thổ quỷ: Xấu về động thổ',
    'Tứ thời đại mộ: Kỵ an tang',
    'Thiên địa chuyển sát: Kỵ động thổ',
    'Thọ tử: Kỵ giá thú, khai trương',
    'Ngũ hư: Kỵ mọi việc lớn',
  ],

  // Hướng xuất hành
  HUONG: ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'],

  // ===== Tính toán =====

  // Số ngày Julian từ ngày dương lịch
  jdFromDate(dd, mm, yy) {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
  },

  jdToDate(jd) {
    let a, b, c, d, e, m;
    if (jd > 2299160) {
      a = jd + 32044;
      b = Math.floor((4 * a + 3) / 146097);
      c = a - Math.floor(146097 * b / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    d = Math.floor((4 * c + 3) / 1461);
    e = c - Math.floor(1461 * d / 4);
    m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    return { day, month, year };
  },

  // New Moon tính gần đúng
  getNewMoonDay(k) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    else deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    return Math.floor(Jd1 + C1 - deltat + 0.5 + 7.0 / 24.0);
  },

  getSunLongitude(jdn) {
    const T = (jdn - 2451545.0) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor(L / Math.PI * 6);
  },

  getLunarMonth11(yy) {
    const off = this.jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = this.getNewMoonDay(k);
    const sunLong = this.getSunLongitude(nm);
    if (sunLong >= 9) nm = this.getNewMoonDay(k - 1);
    return nm;
  },

  getLeapMonthOffset(a11) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = this.getSunLongitude(this.getNewMoonDay(k + i));
    do {
      last = arc;
      i++;
      arc = this.getSunLongitude(this.getNewMoonDay(k + i));
    } while (arc !== last && i < 14);
    return i - 1;
  },

  // Dương → Âm
  convertSolar2Lunar(dd, mm, yy) {
    const dayNumber = this.jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = this.getNewMoonDay(k + 1);
    if (monthStart > dayNumber) monthStart = this.getNewMoonDay(k);

    let a11 = this.getLunarMonth11(yy);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy - 1);
    } else {
      lunarYear = yy + 1;
      b11 = this.getLunarMonth11(yy + 1);
    }

    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;

    if (b11 - a11 > 365) {
      const leapMonthDiff = this.getLeapMonthOffset(a11);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) lunarLeap = 1;
      }
    }
    if (lunarMonth > 12) lunarMonth = lunarMonth - 12;
    if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

    return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
  },

  // Can Chi ngày
  getCanChiDay(jd) {
    const canIdx = (jd + 9) % 10;
    const chiIdx = (jd + 1) % 12;
    return { can: this.CAN[canIdx], chi: this.CHI[chiIdx], canIdx, chiIdx };
  },

  // Can Chi tháng
  getCanChiMonth(lunarMonth, lunarYear) {
    const yearCan = (lunarYear + 6) % 10;
    const canIdx = (yearCan * 2 + lunarMonth) % 10;
    const chiIdx = (lunarMonth + 1) % 12;
    return { can: this.CAN[canIdx], chi: this.CHI[chiIdx] };
  },

  // Can Chi năm
  getCanChiYear(year) {
    const canIdx = (year + 6) % 10;
    const chiIdx = (year + 8) % 12;
    return { can: this.CAN[canIdx], chi: this.CHI[chiIdx] };
  },

  // Giờ hoàng đạo dựa trên chi ngày
  getHoangDao(chiDay) {
    // Bảng giờ hoàng đạo theo chi ngày
    const hoangDaoTable = {
      0: [0, 1, 4, 6, 8, 10],    // Tý
      1: [2, 4, 6, 8, 10, 0],    // Sửu
      2: [0, 1, 3, 5, 7, 9],     // Dần
      3: [2, 4, 6, 8, 10, 0],    // Mão
      4: [0, 2, 4, 6, 8, 10],    // Thìn
      5: [0, 2, 4, 6, 8, 10],    // Tỵ
      6: [0, 1, 4, 6, 8, 10],    // Ngọ
      7: [2, 4, 6, 8, 10, 0],    // Mùi
      8: [0, 1, 3, 5, 7, 9],     // Thân
      9: [2, 4, 6, 8, 10, 0],    // Dậu
      10: [0, 2, 4, 6, 8, 10],   // Tuất
      11: [0, 2, 4, 6, 8, 10],   // Hợi
    };
    const gioChi = ['Tý (23-1)', 'Sửu (1-3)', 'Dần (3-5)', 'Mão (5-7)', 'Thìn (7-9)', 'Tỵ (9-11)',
                     'Ngọ (11-13)', 'Mùi (13-15)', 'Thân (15-17)', 'Dậu (17-19)', 'Tuất (19-21)', 'Hợi (21-23)'];
    const indices = hoangDaoTable[chiDay] || [0, 2, 4, 6, 8, 10];
    return indices.map(i => gioChi[i]);
  },

  isHoangDao(chiDay) {
    // Ngày Hoàng Đạo hay Hắc Đạo
    const hoangDaoDays = [0, 2, 4, 6, 8, 10]; // Tý, Dần, Thìn, Ngọ, Thân, Tuất
    return hoangDaoDays.includes(chiDay % 6);
  },

  // Mệnh ngày (nạp âm của ngày)
  getMenhNgay(jd) {
    const idx = ((jd + 9) * 10 + (jd + 1)) % 60;
    return this.NAP_AM[Math.abs(idx) % 60];
  },

  // Tiết khí hiện tại
  getTietKhi(month, day) {
    let current = this.TIET_KHI[0];
    for (let i = this.TIET_KHI.length - 1; i >= 0; i--) {
      const tk = this.TIET_KHI[i];
      if (month > tk.month || (month === tk.month && day >= tk.day)) {
        current = tk;
        break;
      }
    }
    return current.name;
  },

  // Trực
  getTruc(lunarDay) {
    return this.TRUC[(lunarDay - 1) % 12];
  },

  // Nhị thập bát tú 
  getNhiThapBatTu(jd) {
    return this.NHI_THAP_BAT_TU[(jd + 12) % 28];
  },

  // Tuổi xung khắc
  getTuoiXungKhac(chiDay) {
    const xung = (chiDay + 6) % 12;
    const khac1 = (chiDay + 3) % 12;
    const khac2 = (chiDay + 9) % 12;
    const tuoi = [];
    [xung, khac1, khac2].forEach(idx => {
      for (let c = 0; c < 10; c++) {
        if ((c + idx) % 2 === 0) {
          tuoi.push(`${this.CAN[c]} ${this.CHI[idx]}`);
          break;
        }
      }
    });
    return tuoi;
  },

  // Hướng xuất hành
  getHuongXuatHanh(chiDay) {
    return {
      hyThan: this.HUONG[(chiDay * 3 + 1) % 8],
      taiThan: this.HUONG[(chiDay * 5 + 3) % 8],
      hacThan: this.HUONG[(chiDay * 7 + 5) % 8],
    };
  },

  // Sao tốt/xấu cho ngày
  getSaoTotXau(jd, chiDay) {
    const totCount = 2 + (jd % 3);
    const xauCount = 2 + ((jd + 1) % 3);
    const tot = [];
    const xau = [];
    for (let i = 0; i < totCount; i++) {
      tot.push(this.SAO_TOT[(jd + i * 3) % this.SAO_TOT.length]);
    }
    for (let i = 0; i < xauCount; i++) {
      xau.push(this.SAO_XAU[(jd + i * 2 + chiDay) % this.SAO_XAU.length]);
    }
    return { tot, xau };
  },

  // ===== API chính =====

  // Lấy toàn bộ thông tin ngày
  getDayInfo(solarDay, solarMonth, solarYear) {
    const jd = this.jdFromDate(solarDay, solarMonth, solarYear);
    const dayOfWeek = (jd + 1) % 7;
    const lunar = this.convertSolar2Lunar(solarDay, solarMonth, solarYear);
    const canChiDay = this.getCanChiDay(jd);
    const canChiMonth = this.getCanChiMonth(lunar.month, lunar.year);
    const canChiYear = this.getCanChiYear(lunar.year);
    const hoangDao = this.getHoangDao(canChiDay.chiIdx);
    const isHD = this.isHoangDao(canChiDay.chiIdx);
    const menhNgay = this.getMenhNgay(jd);
    const tietKhi = this.getTietKhi(solarMonth, solarDay);
    const truc = this.getTruc(lunar.day);
    const nhiThapBatTu = this.getNhiThapBatTu(jd);
    const tuoiXung = this.getTuoiXungKhac(canChiDay.chiIdx);
    const huong = this.getHuongXuatHanh(canChiDay.chiIdx);
    const saoTotXau = this.getSaoTotXau(jd, canChiDay.chiIdx);

    return {
      solar: { day: solarDay, month: solarMonth, year: solarYear },
      dayOfWeek: this.THU[dayOfWeek],
      lunar,
      canChiDay: `${canChiDay.can} ${canChiDay.chi}`,
      canChiMonth: `${canChiMonth.can} ${canChiMonth.chi}`,
      canChiYear: `${canChiYear.can} ${canChiYear.chi}`,
      hoangDao,
      isHoangDao: isHD,
      menhNgay,
      tietKhi,
      truc,
      nhiThapBatTu,
      tuoiXung,
      huong,
      saoTot: saoTotXau.tot,
      saoXau: saoTotXau.xau,
      jd,
    };
  },

  // Lấy lịch tháng
  getMonthCalendar(month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDow = new Date(year, month - 1, 1).getDay();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const lunar = this.convertSolar2Lunar(d, month, year);
      const jd = this.jdFromDate(d, month, year);
      const canChiDay = this.getCanChiDay(jd);
      const isHD = this.isHoangDao(canChiDay.chiIdx);
      days.push({
        solar: d,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        canChi: `${canChiDay.can} ${canChiDay.chi}`,
        isHoangDao: isHD,
        isToday: false,
      });
    }
    // Mark today
    const today = new Date();
    if (today.getMonth() + 1 === month && today.getFullYear() === year) {
      days[today.getDate() - 1].isToday = true;
    }
    return { days, firstDow, month, year };
  },
};
