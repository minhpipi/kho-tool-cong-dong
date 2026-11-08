window.KhoTool.currentInit = function () {
  document.getElementById('m3-sendBtn').onclick = send;
};

function send() {
  const token = document.getElementById('m3-token').value;
  const chatId = document.getElementById('m3-chatid').value;
  const message = document.getElementById('m3-message').value;
  if (!token || !chatId || !message) {
    KhoTool.utils.showToast('Nhập đầy đủ thông tin', 'error');
    return;
  }
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  }).then(r => r.json()).then(data => {
    if (data.ok) {
      KhoTool.utils.showToast('Đã gửi');
      KhoTool.utils.incrementCounter();
    } else {
      KhoTool.utils.showToast('Lỗi: ' + (data.description || 'không xác định'), 'error');
    }
  }).catch(() => {
    KhoTool.utils.showToast('Không gửi được', 'error');
  });
}