window.KhoTool.currentInit = function () {
  document.getElementById('m7-titleBtn').onclick = () => format('title');
  document.getElementById('m7-upperBtn').onclick = () => format('upper');
  document.getElementById('m7-lowerBtn').onclick = () => format('lower');
};

function format(type) {
  let text = document.getElementById('m7-input').value;
  if (!text.trim()) {
    KhoTool.utils.showToast('Nhập văn bản', 'error');
    return;
  }
  if (type === 'title') {
    text = text.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  } else if (type === 'upper') {
    text = text.toUpperCase();
  } else {
    text = text.toLowerCase();
  }
  document.getElementById('m7-output').value = text;
  KhoTool.utils.showToast('Đã chuẩn hóa');
  KhoTool.utils.incrementCounter();
}