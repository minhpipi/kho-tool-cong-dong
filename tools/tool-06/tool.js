let rawData = [];
let workbook = null;
let barChart = null;
let doughnutChart = null;
let logoDataUrl = '';
let lastTotals = {};
let lastGrand = 0;

window.KhoTool.currentInit = function () {
  document.getElementById('m6-excelInput').onchange = handleFile;
  document.getElementById('m6-buildBtn').onclick = buildDashboard;
  document.getElementById('m6-printBtn').onclick = printReport;
  const logoInput = document.getElementById('m6-logoInput');
  if (logoInput) logoInput.onchange = handleLogo;
};

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (typeof XLSX === 'undefined') {
    KhoTool.utils.showToast('Thư viện Excel chưa tải. Tải lại trang.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const data = new Uint8Array(ev.target.result);
      workbook = XLSX.read(data, { type: 'array' });
      if (!workbook.SheetNames.length) {
        KhoTool.utils.showToast('File không có dữ liệu', 'error');
        return;
      }
      loadSheet(workbook.SheetNames[0]);
      KhoTool.utils.showToast('Đã đọc file');
    } catch (err) {
      KhoTool.utils.showToast('Lỗi đọc file', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function loadSheet(sheetName) {
  rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  if (!rawData.length) {
    KhoTool.utils.showToast('Sheet trống', 'error');
    return;
  }
  const headers = Object.keys(rawData[0]);
  fillSelect('m6-catColSelect', headers);
  fillSelect('m6-valColSelect', headers);
}

function fillSelect(id, headers) {
  const sel = document.getElementById(id);
  sel.innerHTML = '';
  headers.forEach(h => sel.add(new Option(h, h)));
}

function handleLogo(e) {
  const file = e.target.files[0];
  if (!file) { logoDataUrl = ''; return; }
  const reader = new FileReader();
  reader.onload = function (ev) { logoDataUrl = ev.target.result; };
  reader.readAsDataURL(file);
}

function buildDashboard() {
  if (!rawData.length) {
    KhoTool.utils.showToast('Chưa có dữ liệu', 'error');
    return;
  }
  const catCol = document.getElementById('m6-catColSelect').value;
  const valCol = document.getElementById('m6-valColSelect').value;
  const totals = {};
  let grand = 0;
  rawData.forEach(row => {
    const cat = String(row[catCol] || 'Khác').trim();
    const val = parseFloat(String(row[valCol] || '0').replace(/[^\d.-]/g, '')) || 0;
    totals[cat] = (totals[cat] || 0) + val;
    grand += val;
  });
  lastTotals = totals;
  lastGrand = grand;
  renderResult(totals, grand);
  document.getElementById('m6-uploadSection').classList.add('hidden');
  document.getElementById('m6-dashboardSection').classList.remove('hidden');
  KhoTool.utils.showToast('Đã tạo báo cáo');
  KhoTool.utils.incrementCounter();
}

function renderResult(totals, grand) {
  const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
  document.getElementById('m6-kpiTotal').textContent = KhoTool.utils.formatVND(grand);
  document.getElementById('m6-kpiAvg').textContent = KhoTool.utils.formatVND(grand / sorted.length);
  document.getElementById('m6-kpiCount').textContent = rawData.length;
  document.getElementById('m6-kpiTop').textContent = sorted[0] || '-';
  const top = sorted[0];
  const topPct = ((totals[top] / grand) * 100).toFixed(1);
  document.getElementById('m6-insightText').innerHTML = `<strong>${top}</strong> dẫn đầu với ${KhoTool.utils.formatVND(totals[top])} (${topPct}%).`;
  document.getElementById('m6-detailTable').innerHTML = sorted.map(k => {
    const pct = ((totals[k] / grand) * 100).toFixed(1);
    return `<tr class="border-t border-slate-800"><td class="px-4 py-2">${k}</td><td class="px-4 py-2 text-right">${KhoTool.utils.formatVND(totals[k])}</td><td class="px-4 py-2 text-right">${pct}%</td></tr>`;
  }).join('');
  const colors = ['#f43f5e','#818cf8','#34d399','#fbbf24','#38bdf8'];
  if (barChart) barChart.destroy();
  if (doughnutChart) doughnutChart.destroy();
  barChart = new Chart(document.getElementById('m6-barChart'), {
    type: 'bar',
    data: { labels: sorted.slice(0, 8), datasets: [{ data: sorted.slice(0, 8).map(k => totals[k]), backgroundColor: colors }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
  doughnutChart = new Chart(document.getElementById('m6-doughnutChart'), {
    type: 'doughnut',
    data: { labels: sorted.slice(0, 6), datasets: [{ data: sorted.slice(0, 6).map(k => totals[k]), backgroundColor: colors }] },
    options: { responsive: true }
  });
}

function printReport() {
  const company = document.getElementById('m6-companyName').value.trim();
  const barImg = document.getElementById('m6-barChart').toDataURL('image/png');
  const doughImg = document.getElementById('m6-doughnutChart').toDataURL('image/png');
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>Báo cáo</title><style>body{font-family:system-ui;padding:32px;}h1{font-size:20px;}</style></head><body>
    ${company ? '<div style="font-weight:bold;margin-bottom:8px;">' + company + '</div>' : ''}
    <h1>Báo cáo</h1>
    <div>Tổng: ${document.getElementById('m6-kpiTotal').textContent}</div>
    <img src="${barImg}" style="width:48%;">
    <img src="${doughImg}" style="width:48%;">
    ${document.querySelector('#m6-detailTable').closest('table').outerHTML}
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 400);
}