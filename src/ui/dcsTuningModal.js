export function renderDCSTuningModal(container, state, onUpdate) {
  const modeKey = state.sopMode === 'STARTUP' ? 'su' : 'sd';
  const modeLabel = state.sopMode === 'STARTUP' ? 'START-UP (HD-W-7500-02-001)' : 'SHUTDOWN (HD-W-7500-06-001)';

  container.innerHTML = `
    <div style="margin-bottom:14px;">
      <h4 style="color:#38BDF8;margin-bottom:8px;">1. Khóa Liên động An toàn ESD & Công tắc Bảo trì (MOS)</h4>
      <div style="display:grid;gap:8px;">
        ${state.interlocks.map((item) => `
          <div style="display:flex;align-items:center;justify-content:space-between;background:#0F172A;padding:8px 12px;border-radius:6px;border:1px solid ${item.tripped ? '#DC2626' : '#334155'};">
            <div>
              <div style="font-weight:700;color:${item.tripped ? '#FCA5A5' : '#F8FAFC'};">${item.id} — ${item.name}</div>
              <div style="font-size:11px;color:#94A3B8;">Hành động liên động: ${item.action}</div>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
              <label style="font-size:12px;"><input type="checkbox" data-esd-en="${item.id}" ${item.enabled ? 'checked' : ''}/> Kích hoạt ESD</label>
              <label style="font-size:12px;color:#FBBF24;"><input type="checkbox" data-esd-mos="${item.id}" ${item.mos ? 'checked' : ''}/> MOS Bypass</label>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div>
      <h4 style="color:#38BDF8;margin-bottom:8px;">2. Bảng Cấu hình Ngưỡng Cảnh báo DCS Trực tiếp — Chế độ ${modeLabel}</h4>
      <table class="dcs-table">
        <thead>
          <tr>
            <th>Tag DCS</th>
            <th>Thông số</th>
            <th>PV Hiện tại</th>
            <th>LL / ESD</th>
            <th>L Alarm</th>
            <th>H Alarm</th>
            <th>HH / ESD</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(state.tags).map((t) => {
            const lim = t[modeKey];
            return `
              <tr>
                <td style="color:#38BDF8;font-weight:700;">${t.id}</td>
                <td>${t.desc} (${t.unit})</td>
                <td><input type="number" step="0.1" data-tag-pv="${t.id}" value="${t.pv}"/></td>
                <td><input type="number" step="0.1" data-tag-lim="${t.id}:ll" value="${lim.ll ?? ''}" placeholder="-/-"/></td>
                <td><input type="number" step="0.1" data-tag-lim="${t.id}:l" value="${lim.l ?? ''}" placeholder="-/-"/></td>
                <td><input type="number" step="0.1" data-tag-lim="${t.id}:h" value="${lim.h ?? ''}" placeholder="-/-"/></td>
                <td><input type="number" step="0.1" data-tag-lim="${t.id}:hh" value="${lim.hh ?? ''}" placeholder="-/-"/></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('[data-esd-en]').forEach((el) => {
    el.addEventListener('change', () => {
      const item = state.interlocks.find((i) => i.id === el.getAttribute('data-esd-en'));
      if (item) {
        item.enabled = el.checked;
        if (!el.checked) item.tripped = false;
        onUpdate();
      }
    });
  });

  container.querySelectorAll('[data-esd-mos]').forEach((el) => {
    el.addEventListener('change', () => {
      const item = state.interlocks.find((i) => i.id === el.getAttribute('data-esd-mos'));
      if (item) {
        item.mos = el.checked;
        if (el.checked) item.tripped = false;
        onUpdate();
      }
    });
  });

  container.querySelectorAll('[data-tag-pv]').forEach((el) => {
    el.addEventListener('change', () => {
      const tag = state.tags[el.getAttribute('data-tag-pv')];
      if (tag && el.value !== '') {
        tag.pv = parseFloat(el.value);
        onUpdate();
      }
    });
  });

  container.querySelectorAll('[data-tag-lim]').forEach((el) => {
    el.addEventListener('change', () => {
      const [id, field] = el.getAttribute('data-tag-lim').split(':');
      const tag = state.tags[id];
      if (tag) {
        tag[modeKey][field] = el.value === '' ? null : parseFloat(el.value);
        onUpdate();
      }
    });
  });
}
