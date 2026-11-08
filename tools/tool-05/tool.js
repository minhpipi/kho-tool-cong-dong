const FORMULAS = [
  { name: "Tính tổng", formula: "=SUM(A1:A10)", desc: "Cộng tất cả số trong vùng", tag: "sum", explain: "SUM cộng các ô từ A1 đến A10." },
  { name: "Tính tổng có điều kiện", formula: "=SUMIF(B:B,\"Hoàn thành\",A:A)", desc: "Cộng nếu cột B chứa điều kiện", tag: "sum", explain: "Chỉ cộng giá trị cột A khi cột B là Hoàn thành." },
  { name: "Trung bình", formula: "=AVERAGE(A1:A10)", desc: "Tính giá trị trung bình", tag: "sum", explain: "AVERAGE tính trung bình các số trong vùng." },
  { name: "Đếm số ô", formula: "=COUNTA(A1:A10)", desc: "Đếm ô không trống", tag: "count", explain: "COUNTA đếm các ô có nội dung." },
  { name: "Đếm có điều kiện", formula: "=COUNTIF(B:B,\"Hoàn thành\")", desc: "Đếm số lần xuất hiện", tag: "count", explain: "Đếm số ô trong cột B có giá trị Hoàn thành." },
  { name: "Điều kiện IF", formula: "=IF(A1>100,\"Đạt\",\"Chưa đạt\")", desc: "Trả kết quả theo điều kiện", tag: "if", explain: "Nếu A1 lớn hơn 100 thì hiện Đạt, ngược lại Chưa đạt." },
  { name: "VLOOKUP", formula: "=VLOOKUP(A1,D:E,2,FALSE)", desc: "Tra cứu giá trị theo cột", tag: "lookup", explain: "Tìm A1 trong cột D, trả về giá trị cột E tương ứng." },
  { name: "XLOOKUP", formula: "=XLOOKUP(A1,D:D,E:E)", desc: "Tra cứu linh hoạt hơn", tag: "lookup", explain: "XLOOKUP tìm A1 trong cột D, trả về giá trị cột E." },
  { name: "Nối chuỗi", formula: "=A1&\" \"&B1", desc: "Ghép nội dung các ô", tag: "text", explain: "Nối nội dung ô A1 và B1, cách nhau bởi dấu cách." },
  { name: "Ngày hôm nay", formula: "=TODAY()", desc: "Lấy ngày hiện tại", tag: "date", explain: "TODAY trả về ngày hôm nay, tự cập nhật." },
  { name: "Thuế GTGT", formula: "=A1*10%", desc: "Tính thuế GTGT 10%", tag: "accounting", explain: "Nhân giá trị với 10% để ra số thuế GTGT." },
  { name: "Chiết khấu", formula: "=A1*(1-B1)", desc: "Giá sau chiết khấu", tag: "accounting", explain: "A1 là giá gốc, B1 là tỷ lệ chiết khấu." },
  { name: "Tính lương gross", formula: "=A1*B1", desc: "Lương = đơn giá × số ngày/giờ", tag: "accounting", explain: "Nhân đơn giá lương với số ngày hoặc số giờ làm việc." }
];

let currentTag = 'all';

window.KhoTool.currentInit = function () {
  document.getElementById('m5-search').oninput = render;
  document.querySelectorAll('.m5-tag').forEach(btn => {
    btn.onclick = function () {
      document.querySelectorAll('.m5-tag').forEach(b => {
        b.classList.remove('bg-orange-600', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      this.classList.remove('bg-slate-800', 'text-slate-300');
      this.classList.add('bg-orange-600', 'text-white');
      currentTag = this.dataset.tag;
      render();
    };
  });
  render();
};

function render() {
  const q = document.getElementById('m5-search').value.toLowerCase().trim();
  let list = FORMULAS;
  if (currentTag !== 'all') list = list.filter(f => f.tag === currentTag);
  if (q) list = list.filter(f => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
  const box = document.getElementById('m5-results');
  if (!list.length) {
    box.innerHTML = '<div class="text-xs text-slate-500 text-center py-6">Không tìm thấy.</div>';
    return;
  }
  box.innerHTML = list.map((f, i) => `
    <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
      <div class="flex justify-between items-start">
        <div>
          <div class="text-sm font-semibold text-white">${f.name}</div>
          <div class="text-xs text-slate-400">${f.desc}</div>
        </div>
        <button onclick="copyFormula(${i})" class="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">Sao chép</button>
      </div>
      <div class="font-mono text-xs text-emerald-400 bg-slate-900 rounded-lg p-2">${f.formula}</div>
      <div class="text-[11px] text-slate-500">${f.explain}</div>
    </div>
  `).join('');
  window._m5_list = list;
}

function copyFormula(index) {
  const formula = window._m5_list[index].formula;
  navigator.clipboard.writeText(formula).then(() => {
    KhoTool.utils.showToast('Đã sao chép');
    KhoTool.utils.incrementCounter();
  });
}