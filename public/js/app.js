// app.js - Xử lý logic Frontend UI (Cookie-based free view)

const app = {
    elements: {
      formSinhCon: document.getElementById('formSinhCon'),
      formTuvi: document.getElementById('formLaSo'),
      inputs: {
        dadYear: document.getElementById('dadYear'),
        momYear: document.getElementById('momYear'),
        childYear: document.getElementById('childYear'),
      },
      tuviInputs: {
        day: document.getElementById('dobDay'),
        month: document.getElementById('dobMonth'),
        year: document.getElementById('dobYear'),
        hour: document.getElementById('dobHour'),
        minute: document.getElementById('dobMinute'),
        viewYear: document.getElementById('viewYear')
      },
      aiResultBox: document.getElementById('aiResultBox'),
      resultTitle: document.getElementById('result-title'),
      loading: document.getElementById('loadingOverlay'),
      markdownContainer: document.getElementById('ai-output'),
      mockChart: document.getElementById('horoscope-chart'),
      cName: document.getElementById('c-name'),
      cDob: document.getElementById('c-dob'),
      cGender: document.getElementById('c-gender'),
    },
  
    init() {
      if (this.elements.formSinhCon) this.renderChildYearOptions();
      if (this.elements.formTuvi) this.loadTuViSelects();
      this.bindEvents();
    },
  
    renderChildYearOptions() {
      const selectEl = this.elements.inputs.childYear;
      if(!selectEl) return;
      const currentYear = new Date().getFullYear();
      const can = ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"];
      const chi = ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"];
      for (let i = 0; i <= 10; i++) {
          const year = currentYear + i;
          const canChi = `${can[year % 10]} ${chi[year % 12]}`;
          const option = document.createElement('option');
          option.value = year;
          option.textContent = `${year} (${canChi})`;
          selectEl.appendChild(option);
      }
    },
  
    loadTuViSelects() {
      const tv = this.elements.tuviInputs;
      if(!tv.day) return;
      for(let i=1; i<=31; i++) tv.day.add(new Option(`Ngày ${i}`, i));
      for(let i=1; i<=12; i++) tv.month.add(new Option(`Tháng ${i}`, i));
      for(let i=0; i<=23; i++) tv.hour.add(new Option(`${i} Giờ`, i));
      for(let i=0; i<=59; i++) tv.minute.add(new Option(`${i} Phút`, i));
      const curYear = new Date().getFullYear();
      tv.viewYear.add(new Option(curYear, curYear));
      tv.viewYear.add(new Option(curYear+1, curYear+1));
    },

    bindEvents() {
      if (this.elements.formSinhCon) {
        this.elements.formSinhCon.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleConsultSubmit();
        });
      }
      if (this.elements.formTuvi) {
        this.elements.formTuvi.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleTuviSubmit();
        });
      }
    },
  
    showLoading() {
      if (this.elements.aiResultBox) this.elements.aiResultBox.classList.add('active');
      if (this.elements.loading) this.elements.loading.style.display = 'block';
      if (this.elements.markdownContainer) this.elements.markdownContainer.innerHTML = '';
      if (this.elements.mockChart) this.elements.mockChart.style.display = 'none';
    },
  
    hideLoading() {
      if (this.elements.loading) this.elements.loading.style.display = 'none';
    },

    // Hiện popup liên hệ khi hết lượt
    showLimitPopup() {
      const modal = document.getElementById('limitModal');
      if (modal) modal.classList.add('active');
    },

    closeLimitPopup() {
      const modal = document.getElementById('limitModal');
      if (modal) modal.classList.remove('active');
    },

    handleErrorResponse(result) {
      if (result.limitReached) {
        this.showLimitPopup();
        this.elements.markdownContainer.innerHTML = `
          <div style="text-align:center; padding: 20px;">
            <i class="las la-exclamation-circle" style="font-size: 48px; color: #e67e22;"></i>
            <h3 style="color: #c0392b; margin-top: 10px;">Đã hết lượt miễn phí hôm nay</h3>
            <p style="color: #666;">Mỗi ngày bạn được xem 1 lần miễn phí. Muốn xem thêm, vui lòng liên hệ:</p>
            <p style="font-size: 16px; margin-top: 10px;">
              <strong>Zalo:</strong> <span style="color: #0068ff;">0812.79.9999</span><br>
              <strong>TikTok:</strong> <span style="color: #010101;">@xemtuvicohoc</span>
            </p>
          </div>`;
      } else {
        this.elements.markdownContainer.innerHTML = `<p style="color:red;">Lỗi: ${result.message}</p>`;
      }
    },

    // --- API HANDLERS (no auth needed, cookie handles limit) ---

    async handleConsultSubmit() {
      const dadYear = document.getElementById('dadYear').value;
      const momYear = document.getElementById('momYear').value;
      const childYear = document.getElementById('childYear').value;

      this.showLoading();
      if (this.elements.aiResultBox) this.elements.aiResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

      try {
        const response = await fetch('/api/predict-child', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dadYear, momYear, childYear })
        });

        const result = await response.json();
        if (result.success) {
          this.elements.markdownContainer.innerHTML = marked.parse(result.data);
        } else {
          this.handleErrorResponse(result);
        }
      } catch (err) {
        this.elements.markdownContainer.innerHTML = `<p style="color:red;">Lỗi kết nối Backend. Hãy chạy 'node server.js'.</p>`;
      } finally {
        this.hideLoading();
      }
    },
  
    async handleTuviSubmit() {
      const name = document.getElementById('tvName').value;
      const day = document.getElementById('dobDay').value;
      const month = document.getElementById('dobMonth').value;
      const year = document.getElementById('dobYear').value;
      const calType = document.querySelector('input[name="calType"]:checked').value;
      const hour = document.getElementById('dobHour').value;
      const minute = document.getElementById('dobMinute').value;
      const gender = document.querySelector('input[name="gender"]:checked').value;

      this.showLoading();
      if (this.elements.aiResultBox) this.elements.aiResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

      try {
        const response = await fetch('/api/horoscope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, day, month, year, calType, hour, minute, gender })
        });

        const result = await response.json();
        if (result.success) {
          this.elements.markdownContainer.innerHTML = marked.parse(result.data);
          if (this.elements.mockChart) {
            this.elements.mockChart.style.display = 'block';
            if (typeof TuviEngine !== 'undefined') {
              const chartData = TuviEngine.calculate(
                parseInt(day), parseInt(month), parseInt(year), parseInt(hour), gender
              );
              populateChart(chartData, name, `${day}/${month}/${year}`, gender);
            } else {
              if (this.elements.cName) this.elements.cName.textContent = `Họ tên: ${name}`;
              if (this.elements.cDob) this.elements.cDob.textContent = `Ngày sinh: ${day}/${month}/${year}`;
              if (this.elements.cGender) this.elements.cGender.textContent = `Giới tính: ${gender}`;
            }
          }
        } else {
          this.handleErrorResponse(result);
        }
      } catch (err) {
        this.elements.markdownContainer.innerHTML = `<p style="color:red;">Lỗi kết nối Backend. Hãy chạy 'node server.js'.</p>`;
      } finally {
        this.hideLoading();
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
