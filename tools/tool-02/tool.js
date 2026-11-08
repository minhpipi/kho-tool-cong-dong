const STORAGE_KEY = 'ktcd_saved_accounts';

window.KhoTool.currentInit = function () {
  document.getElementById('m2-genBtn').onclick = generate;
};

function generate() {
  const bank = document.getElementById('m2-bank').value;
  const account = document.getElementById('m2-account').value;
  const amount = document.getElementById('m2-amount').value;
  const content = document.getElementById('m2-content').value;
  if (!bank || !account) {
    KhoTool.utils.showToast('Nhập ngân hàng và số tài khoản', 'error');
    return;
  }
  const url = `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
  document.getElementById('m2-qr').src = url;
  document.getElementById('m2-result').classList.remove('hidden');
  KhoTool.utils.showToast('Đã tạo QR');
  KhoTool.utils.incrementCounter();
}