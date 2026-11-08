window.KhoTool.currentInit = function () {
  document.getElementById('m9-toJsonBtn').onclick = toJson;
  document.getElementById('m9-toCsvBtn').onclick = toCsv;
};

function toJson() {
  const text = document.getElementById('m9-input').value.trim();
  if (!text) {
    KhoTool.utils.showToast('Nhập dữ liệu', 'error');
    return;
  }
  const lines = text.split('\n').filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim());
  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || '');
    return obj;
  });
  document.getElementById('m9-output').value = JSON.stringify(data, null, 2);
  KhoTool.utils.showToast('Đã chuyển JSON');
  KhoTool.utils.incrementCounter();
}

function toCsv() {
  const text = document.getElementById('m9-input').value.trim();
  if (!text) {
    KhoTool.utils.showToast('Nhập dữ liệu', 'error');
    return;
  }
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data) || !data.length) throw new Error();
    const headers = Object.keys(data[0]);
    const csv = [headers.join(',')].concat(data.map(row => headers.map(h => row[h] || '').join(','))).join('\n');
    document.getElementById('m9-output').value = csv;
    KhoTool.utils.showToast('Đã chuyển CSV');
    KhoTool.utils.incrementCounter();
  } catch {
    KhoTool.utils.showToast('JSON không hợp lệ', 'error');
  }
}