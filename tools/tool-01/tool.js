window.KhoTool.currentInit = function () {
  document.getElementById('m1-cleanBtn').onclick = clean;
  document.getElementById('m1-copyBtn').onclick = copy;
};

function clean() {
  const text = document.getElementById('m1-input').value;
  if (!text.trim()) {
    KhoTool.utils.showToast('Nhập danh sách', 'error');
    return;
  }
  const phones = text.match(/0\d{9}/g) || [];
  const unique = [...new Set(phones)];
  document.getElementById('m1-output').value = unique.join('\n');
  document.getElementById('m1-result').classList.remove('hidden');
  KhoTool.utils.showToast(`Tìm thấy ${unique.length} số`);
  KhoTool.utils.incrementCounter();
}

function copy() {
  const text = document.getElementById('m1-output').value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    KhoTool.utils.showToast('Đã sao chép');
  });
}