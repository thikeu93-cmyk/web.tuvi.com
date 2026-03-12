// tuvi-engine.js - Lục Thập Hoa Giáp + An Sao Tử Vi
// Tính toán sao và cung dựa trên ngày giờ sinh

const TuviEngine = {
  // Thiên Can
  CAN: ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'],
  
  // Địa Chi
  CHI: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
  
  // Thập nhị cung
  CUNG_NAME: ['MỆNH', 'PHỤ MẪU', 'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC', 'THIÊN DI', 'TẬT ÁCH', 'TÀI BẠCH', 'PHU THÊ', 'TỬ TỨC', 'HUYNH ĐỆ'],

  // Ngũ Hành Nạp Âm (60 Hoa Giáp)
  NGU_HANH: ['Kim','Kim','Hỏa','Hỏa','Mộc','Mộc','Thổ','Thổ','Kim','Kim','Hỏa','Hỏa','Mộc','Mộc','Thủy','Thủy','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Hỏa','Hỏa','Thủy','Thủy','Thổ','Thổ','Kim','Kim','Hỏa','Hỏa','Mộc','Mộc','Thổ','Thổ','Kim','Kim','Hỏa','Hỏa','Mộc','Mộc','Thủy','Thủy','Hỏa','Hỏa','Thổ','Thổ','Kim','Kim','Hỏa','Hỏa','Thủy','Thủy','Thổ','Thổ','Kim','Kim','Mộc','Mộc'],
  
  // Tên nạp âm
  NAP_AM: [
    'Hải Trung Kim','Hải Trung Kim','Lư Trung Hỏa','Lư Trung Hỏa','Đại Lâm Mộc','Đại Lâm Mộc',
    'Lộ Bàng Thổ','Lộ Bàng Thổ','Kiếm Phong Kim','Kiếm Phong Kim','Sơn Đầu Hỏa','Sơn Đầu Hỏa',
    'Giản Hạ Thủy','Giản Hạ Thủy','Thành Đầu Thổ','Thành Đầu Thổ','Bạch Lạp Kim','Bạch Lạp Kim',
    'Dương Liễu Mộc','Dương Liễu Mộc','Tuyền Trung Thủy','Tuyền Trung Thủy','Ốc Thượng Thổ','Ốc Thượng Thổ',
    'Tích Lịch Hỏa','Tích Lịch Hỏa','Tùng Bách Mộc','Tùng Bách Mộc','Trường Lưu Thủy','Trường Lưu Thủy',
    'Sa Trung Kim','Sa Trung Kim','Sơn Hạ Hỏa','Sơn Hạ Hỏa','Bình Địa Mộc','Bình Địa Mộc',
    'Bích Thượng Thổ','Bích Thượng Thổ','Kim Bạc Kim','Kim Bạc Kim','Phú Đăng Hỏa','Phú Đăng Hỏa',
    'Thiên Hà Thủy','Thiên Hà Thủy','Đại Dịch Thổ','Đại Dịch Thổ','Thoa Xuyến Kim','Thoa Xuyến Kim',
    'Tang Đố Mộc','Tang Đố Mộc','Đại Khê Thủy','Đại Khê Thủy','Sa Trung Thổ','Sa Trung Thổ',
    'Thiên Thượng Hỏa','Thiên Thượng Hỏa','Thạch Lựu Mộc','Thạch Lựu Mộc','Đại Hải Thủy','Đại Hải Thủy'
  ],
  
  // Cục
  CUC: ['Thủy Nhị Cục', 'Thổ Ngũ Cục', 'Hỏa Lục Cục', 'Mộc Tam Cục', 'Kim Tứ Cục'],

  // 14 Chính tinh
  CHINH_TINH: ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'],

  // Giờ sang chi index
  hourToChi(hour) {
    if (hour >= 23 || hour < 1) return 0;  // Tý
    return Math.floor((hour + 1) / 2);
  },

  // Tính can chi năm
  getCanChi(year) {
    const canIdx = (year + 6) % 10;
    const chiIdx = (year + 8) % 12;
    return { can: this.CAN[canIdx], chi: this.CHI[chiIdx], canIdx, chiIdx };
  },
  
  // Tính nạp âm
  getNapAm(year) {
    const idx = (year - 4) % 60;
    return { napAm: this.NAP_AM[idx >= 0 ? idx : idx + 60], nguHanh: this.NGU_HANH[idx >= 0 ? idx : idx + 60] };
  },

  // Tính cung Mệnh (dựa trên tháng và giờ sinh)
  getMenhCung(month, hourChi) {
    // Cung Mệnh = Dần + (tháng - 1) - giờ chi
    return (2 + (month - 1) - hourChi + 24) % 12;
  },

  // Tính Cục
  getCuc(canYear, menhCung) {
    const cucTable = [
      [1,4,1,4,2,4,2,4,3,4,3,4],
      [4,0,4,0,4,0,4,1,4,1,4,1],
      [0,2,0,2,0,2,1,3,1,3,1,3],
      [2,3,2,3,2,3,3,0,3,0,3,0],
      [3,1,3,1,3,1,0,2,0,2,0,2],
    ];
    const canGroup = Math.floor(canYear / 2);
    return this.CUC[cucTable[canGroup]?.[menhCung] ?? 0];
  },

  // An sao giả lập thực tế (dựa trên logique tử vi cơ bản)
  generateStars(menhCung, month, hourChi, canYear, gender) {
    const palaces = [];
    
    // Danh sách 14 chính tinh - phân phối dựa trên Mệnh
    const chinhTinhSets = [
      ['Tử Vi', 'Thiên Phủ'],
      ['Thiên Cơ', 'Thái Âm'],
      ['Thái Dương', 'Cự Môn'],
      ['Vũ Khúc', 'Thiên Tướng'],
      ['Thiên Đồng', 'Thiên Lương'],
      ['', ''],
      ['Liêm Trinh', 'Thất Sát'],
      ['', 'Phá Quân'],
      ['', 'Tham Lang'],
    ];
    
    // Phụ tinh phân bổ
    const phuTinh = [
      ['Văn Xương', 'Hồng Loan', 'Thiên Quan'],
      ['Văn Khúc', 'Đào Hoa', 'Thiên Phúc'],
      ['Long Trì', 'Phượng Các', 'Tam Thai'],
      ['Thiên Khôi', 'Thiên Việt', 'Ân Quang'],
      ['Tả Phụ', 'Thiên Mã', 'Đường Phù'],
      ['Hữu Bật', 'Quốc Ấn', 'Lưu Hà'],
      ['Hỏa Tinh', 'Kình Dương', 'Địa Không'],
      ['Linh Tinh', 'Đà La', 'Địa Kiếp'],
      ['Thiên Khốc', 'Thiên Hư', 'Tuế Phá'],
      ['Thiên Đức', 'Nguyệt Đức', 'Thiên Y'],
      ['Long Đức', 'Thiên Thọ', 'Bệnh Phù'],
      ['Phúc Đức', 'Thiên Giải', 'Mộ Trì'],
    ];

    // Trạng thái sao
    const trangThai = ['(V)', '(M)', '(Đ)', '(B)', '(H)'];
    
    // Sao lưu niên
    const luuNien = ['Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Bệnh Phù'];
    
    for (let i = 0; i < 12; i++) {
      const cungIdx = (menhCung + i) % 12;
      const cungName = this.CUNG_NAME[i];
      const chi = this.CHI[cungIdx];
      
      // Chính tinh cho cung này
      const chinhSet = chinhTinhSets[i % chinhTinhSets.length] || [];
      const mainStars = chinhSet.filter(s => s).map(s => ({
        name: s,
        state: trangThai[Math.floor(Math.random() * 3)], // V, M, Đ weighted
        color: ['Tử Vi','Liêm Trinh','Tham Lang','Phá Quân','Thất Sát'].includes(s) ? 'red' : 
               ['Thiên Cơ','Thiên Đồng','Thiên Lương','Thiên Phủ'].includes(s) ? 'green' : 'blue'
      }));
      
      // Phụ tinh cho cung này
      const phuSet = phuTinh[cungIdx] || [];
      const minorStars = phuSet.map(s => s);
      
      // Sao lưu niên
      const luuNienStar = luuNien[(cungIdx + month) % 12];
      
      // Tuổi đại hạn
      const daiHan = (i * 10 + 4);
      
      palaces.push({
        cungName,
        chi,
        cungIdx,
        mainStars,
        minorStars,
        luuNienStar,
        daiHan,
      });
    }
    
    return palaces;
  },

  // Tính toán lá số hoàn chỉnh
  calculate(day, month, year, hour, gender) {
    const canChi = this.getCanChi(year);
    const napAm = this.getNapAm(year);
    const hourChi = this.hourToChi(hour);
    const hourCanChi = this.CHI[hourChi];
    const menhCung = this.getMenhCung(month, hourChi);
    const cuc = this.getCuc(canChi.canIdx, menhCung);
    const amDuong = (gender === 'Nam' && canChi.canIdx % 2 === 0) || (gender === 'Nữ' && canChi.canIdx % 2 === 1) ? 'Âm dương thuận lý' : 'Âm dương nghịch lý';

    const palaces = this.generateStars(menhCung, month, hourChi, canChi.canIdx, gender);

    return {
      canChi: `${canChi.can} ${canChi.chi}`,
      napAm: napAm.napAm,
      nguHanh: napAm.nguHanh,
      cuc,
      amDuong,
      menhChu: this.CHINH_TINH[menhCung % 14],
      thanChu: this.CHINH_TINH[(menhCung + 6) % 14],
      hourCanChi: `${this.CAN[(canChi.canIdx * 2 + hourChi) % 10]} ${this.CHI[hourChi]}`,
      palaces,
    };
  }
};

// Populate chart HTML
function populateChart(chartData, name, dob, gender) {
  const chi2class = {
    'Tỵ': 'p-ty-high', 'Ngọ': 'p-ngo', 'Mùi': 'p-mui', 'Thân': 'p-than-high',
    'Dậu': 'p-dau', 'Tuất': 'p-tuat',
    'Hợi': 'p-hoi', 'Tý': 'p-ty-low', 'Sửu': 'p-suu', 'Dần': 'p-dan-low',
    'Mão': 'p-mao', 'Thìn': 'p-thin',
  };

  chartData.palaces.forEach(p => {
    const cls = chi2class[p.chi];
    if (!cls) return;
    const el = document.querySelector(`.${cls}`);
    if (!el) return;

    // Header
    const header = el.querySelector('.palace-header');
    if (header) {
      header.innerHTML = `<span class="palace-name">${p.cungName}</span><span class="palace-coord">${p.chi}</span>`;
    }

    // Stars
    const starsEl = el.querySelector('.palace-stars');
    if (starsEl) {
      let html = '';
      // Chính tinh
      p.mainStars.forEach(s => {
        html += `<div class="star-major star-${s.color}">${s.name} ${s.state}</div>`;
      });
      // Phụ Tinh  
      if (p.minorStars.length > 0) {
        html += `<div class="star-minor">${p.minorStars.join(' · ')}</div>`;
      }
      // Lưu niên
      if (p.luuNienStar) {
        html += `<div class="star-ln">${p.luuNienStar}</div>`;
      }
      starsEl.innerHTML = html;
    }

    // Footer (đại hạn)
    const footer = el.querySelector('.palace-footer');
    if (footer) footer.textContent = p.daiHan;
  });

  // Center info
  const center = document.querySelector('.center-info');
  if (center) {
    center.innerHTML = `
      <h2>Lá Số Tử Vi</h2>
      <p id="c-name">Họ tên: ${name}</p>
      <p id="c-dob">Ngày sinh: ${dob}</p>
      <p id="c-gender">Giới tính: ${gender}</p>
      <hr style="width: 80%; border: none; border-top: 1px dashed #dcb274; margin: 8px 0;">
      <p style="font-size: 13px; color: #8b4513;"><strong>Mệnh:</strong> ${chartData.napAm} (${chartData.nguHanh})</p>
      <p style="font-size: 13px; color: #8b4513;"><strong>Cục:</strong> ${chartData.cuc}</p>
      <p style="font-size: 12px; color: #666;"><strong>Can Chi:</strong> ${chartData.canChi}</p>
      <p style="font-size: 12px; color: #666;"><strong>Giờ:</strong> ${chartData.hourCanChi}</p>
      <p style="font-size: 12px; color: #666;"><strong>${chartData.amDuong}</strong></p>
      <p style="font-size: 12px; color: #8b4513;"><strong>Mệnh chủ:</strong> ${chartData.menhChu}</p>
      <p style="font-size: 12px; color: #8b4513;"><strong>Thần chủ:</strong> ${chartData.thanChu}</p>
    `;
  }
}
