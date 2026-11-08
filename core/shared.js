window.KhoTool = window.KhoTool || {};

window.KhoTool.utils = {
  formatVND(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + ' đ';
  },
  showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm font-medium z-50 ${
      type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
    } text-white shadow-lg`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  },
  incrementCounter() {
    const key = 'ktcd_global_counter';
    const count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count);
  }
};