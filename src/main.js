import { EQUIPMENT_CATALOG } from './data/equipmentCatalog.js';
import { INITIAL_DCS_TAGS, INITIAL_ESD_INTERLOCKS } from './data/dcsTagsConfig.js';
import { VALVES_REGISTRY } from './data/valvesAndLocator.js';
import { SOP_PROCEDURES } from './data/sopProcedures.js';
import { DEVIATIONS_CATALOG } from './data/deviationsCatalog.js';
import { stepThermodynamics, calculateD763VolumeM3 } from './engine/thermodynamics.js';
import { evaluateAlarmsAndESD } from './engine/esdInterlocks.js';
import { dcsAudio } from './engine/audioSynth.js';
import { PIDRenderer2D } from './ui/pidRenderer2D.js';
import { DigitalTwin3D } from './ui/digitalTwin3D.js';
import { renderDCSTuningModal } from './ui/dcsTuningModal.js';

function createInitialState() {
  const tags = {};
  INITIAL_DCS_TAGS.forEach((t) => {
    tags[t.id] = JSON.parse(JSON.stringify(t));
  });
  const valves = {};
  VALVES_REGISTRY.forEach((v) => {
    valves[v.id] = { ...v };
  });
  return {
    sopMode: 'STARTUP',
    viewMode: '2D',
    simSpeed: 1,
    simTime: new Date(),
    isRunning: true,
    oligomerWt: 1.85,
    d763VolumeM3: calculateD763VolumeM3(40.0),
    d752Level: 15.0,
    tags,
    valves,
    pumps: {
      'P-761A': { running: true }, 'P-761B': { running: false },
      'P-762A': { running: true }, 'P-762B': { running: false },
      'P-763A': { running: true }, 'P-763B': { running: false },
      'P-764A': { running: true }, 'P-764B': { running: false }
    },
    interlocks: JSON.parse(JSON.stringify(INITIAL_ESD_INTERLOCKS)),
    completedSteps: new Set(),
    activeDeviation: null
  };
}

let state = createInitialState();

const pid2D = new PIDRenderer2D(document.getElementById('pid-container'), (vid) => {
  const v = state.valves[vid];
  if (!v) return;
  if (v.type === 'MANUAL') {
    v.open = !v.open;
  } else {
    v.mv = v.mv > 0 ? 0 : 50;
    v.open = v.mv > 0;
  }
  dcsAudio.playTone(520, 0.08, 'sine');
  refreshUI();
});

const twin3D = new DigitalTwin3D(document.getElementById('three-container'));

function renderLeftPanel() {
  const tagGrid = document.getElementById('dcs-tags-grid');
  tagGrid.innerHTML = Object.values(state.tags).map((t) => {
    const cls = t.alarmState === 'CRIT' ? 'alarm-crit' : (t.alarmState === 'WARN' ? 'alarm-warn' : '');
    return `
      <div class="tag-cell ${cls}">
        <div class="tag-name">${t.id}</div>
        <div class="tag-val">${Number(t.pv).toFixed(t.unit === 'mmH2O' ? 0 : 1)} <span style="font-size:10px;font-weight:400;">${t.unit}</span></div>
        <div class="tag-desc">${t.desc}</div>
      </div>
    `;
  }).join('');
}

function renderRightPanel() {
  const steps = SOP_PROCEDURES[state.sopMode];
  const sopBox = document.getElementById('sop-checklist');
  sopBox.innerHTML = steps.map((s) => {
    const done = state.completedSteps.has(s.id);
    const roleCls = s.role.includes('BM') ? 'role-bm' : 'role-fo';
    return `
      <div class="sop-step ${done ? 'done' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-weight:700;color:#38BDF8;">${s.id} • ${s.phase}</span>
          <span class="role-pill ${roleCls}">${s.role}</span>
        </div>
        <div style="color:#E2E8F0;line-height:1.4;margin-bottom:6px;">${s.text}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <button data-locate="${s.valveRef}" style="padding:2px 8px;font-size:11px;border-color:#FACC15;color:#FACC15;">🎯 Định vị ${s.valveRef.replace('SU-','').replace('SD-','')}</button>
          <label style="font-size:11px;cursor:pointer;"><input type="checkbox" data-step="${s.id}" ${done ? 'checked' : ''}/> Xác nhận</label>
        </div>
      </div>
    `;
  }).join('');

  sopBox.querySelectorAll('[data-locate]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const v = state.valves[btn.getAttribute('data-locate')];
      if (v) {
        pid2D.focusValve(v);
        twin3D.flyToValve(v);
        refreshUI();
      }
    });
  });

  sopBox.querySelectorAll('[data-step]').forEach((chk) => {
    chk.addEventListener('change', () => {
      const sid = chk.getAttribute('data-step');
      if (chk.checked) state.completedSteps.add(sid);
      else state.completedSteps.delete(sid);
      renderRightPanel();
    });
  });
}

function refreshUI() {
  const alarms = evaluateAlarmsAndESD(state);
  if (alarms.some((a) => a.level.includes('ESD'))) dcsAudio.triggerAlarm('CRIT');
  else if (alarms.length > 0) dcsAudio.triggerAlarm('WARN');

  const banner = document.getElementById('alarm-banner');
  if (alarms.length > 0) {
    banner.style.display = 'block';
    banner.textContent = `CẢNH BÁO DCS (${alarms.length}): ` + alarms.map((a) => `[${a.level}] ${a.tag}: ${a.pv} ${a.unit}`).join(' | ');
  } else {
    banner.style.display = 'none';
  }

  renderLeftPanel();
  renderRightPanel();
  pid2D.render(state);
  twin3D.update(state);
}

// Toolbar Event Bindings
document.getElementById('btn-mode-startup').addEventListener('click', () => {
  state.sopMode = 'STARTUP';
  document.getElementById('btn-mode-startup').classList.add('active');
  document.getElementById('btn-mode-shutdown').classList.remove('active');
  refreshUI();
});

document.getElementById('btn-mode-shutdown').addEventListener('click', () => {
  state.sopMode = 'SHUTDOWN';
  document.getElementById('btn-mode-shutdown').classList.add('active');
  document.getElementById('btn-mode-startup').classList.remove('active');
  refreshUI();
});

document.getElementById('btn-view-2d').addEventListener('click', () => {
  state.viewMode = '2D';
  document.getElementById('pid-container').style.display = 'block';
  document.getElementById('three-container').style.display = 'none';
  document.getElementById('btn-view-2d').classList.add('active');
  document.getElementById('btn-view-3d').classList.remove('active');
});

document.getElementById('btn-view-3d').addEventListener('click', () => {
  state.viewMode = '3D';
  document.getElementById('pid-container').style.display = 'none';
  document.getElementById('three-container').style.display = 'block';
  document.getElementById('btn-view-3d').classList.add('active');
  document.getElementById('btn-view-2d').classList.remove('active');
  twin3D.init();
  twin3D.update(state);
});

document.getElementById('sim-speed').addEventListener('change', (e) => {
  state.simSpeed = Number(e.target.value);
});

document.getElementById('btn-reset-all').addEventListener('click', () => {
  state = createInitialState();
  pid2D.resetView();
  refreshUI();
});

document.getElementById('btn-reset-view').addEventListener('click', () => {
  pid2D.resetView();
  refreshUI();
});

// Valve Locator Quick Search
const valveSearch = document.getElementById('valve-locator-select');
Object.values(state.valves).forEach((v) => {
  const opt = document.createElement('option');
  opt.value = v.id;
  opt.textContent = `${v.id.replace('SU-','[SU] ').replace('SD-','[SD] ')} — ${v.desc.slice(0, 42)}`;
  valveSearch.appendChild(opt);
});
valveSearch.addEventListener('change', () => {
  const v = state.valves[valveSearch.value];
  if (v) {
    pid2D.focusValve(v);
    twin3D.flyToValve(v);
    refreshUI();
  }
});

// Deviations Selector
const devSelect = document.getElementById('deviation-select');
DEVIATIONS_CATALOG.forEach((d) => {
  const opt = document.createElement('option');
  opt.value = d.id;
  opt.textContent = `${d.id}: ${d.title}`;
  devSelect.appendChild(opt);
});
document.getElementById('btn-inject-dev').addEventListener('click', () => {
  const dev = DEVIATIONS_CATALOG.find((d) => d.id === devSelect.value);
  if (!dev) return;
  dev.inject(state);
  document.getElementById('deviation-guide').innerHTML = `
    <div style="color:#FCA5A5;font-weight:700;margin-bottom:4px;">Sự cố: ${dev.title} (${dev.equip} / ${dev.tag})</div>
    <div style="margin-bottom:3px;"><strong>Nguyên nhân:</strong> ${dev.cause}</div>
    <div style="margin-bottom:3px;"><strong>Hậu quả:</strong> ${dev.consequence}</div>
    <div style="color:#86EFAC;"><strong>Khắc phục (SOP):</strong> ${dev.action}</div>
  `;
  refreshUI();
});

// Modals: DCS Tuning & Equipment Principles
const modal = document.getElementById('main-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

document.getElementById('btn-open-tuning').addEventListener('click', () => {
  modalTitle.textContent = 'CỬA SỔ CẤU HÌNH TRỰC TIẾP — DCS ALARM & ESD TUNING PANEL';
  renderDCSTuningModal(modalBody, state, refreshUI);
  modal.classList.add('open');
});

document.getElementById('btn-open-equip').addEventListener('click', () => {
  modalTitle.textContent = 'NGUYÊN LÝ HOẠT ĐỘNG & THÔNG SỐ THIẾT BỊ CHÍNH CỤM T-761 (SECTION 700)';
  modalBody.innerHTML = EQUIPMENT_CATALOG.map((eq) => `
    <div style="background:#0F172A;border:1px solid #334155;border-radius:8px;padding:12px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span style="color:#38BDF8;font-family:JetBrains Mono;font-weight:700;font-size:15px;">${eq.id} — ${eq.name}</span>
        <span style="color:#94A3B8;font-size:12px;">${eq.type}</span>
      </div>
      <div style="font-family:JetBrains Mono;font-size:11px;color:#FBBF24;margin-bottom:6px;">${eq.specs}</div>
      <div style="margin-bottom:4px;"><strong>Đầu vào (Inlet):</strong> ${eq.inlet}</div>
      <div style="margin-bottom:4px;"><strong>Đầu ra (Outlet):</strong> ${eq.outlet}</div>
      <div style="color:#A7F3D0;"><strong>Mục đích & Nguyên lý:</strong> ${eq.principle}</div>
    </div>
  `).join('');
  modal.classList.add('open');
});

document.getElementById('btn-close-modal').addEventListener('click', () => {
  modal.classList.remove('open');
});

document.getElementById('btn-print-pdf').addEventListener('click', () => {
  window.print();
});

// Real-Time Simulation Loop (1s tick)
setInterval(() => {
  if (state.simSpeed > 0) {
    state.simTime = new Date(state.simTime.getTime() + 1000 * state.simSpeed);
    stepThermodynamics(state, state.simSpeed);
    refreshUI();
  }
  const pad = (n) => String(n).padStart(2, '0');
  const d = state.simTime;
  document.getElementById('realtime-clock').textContent =
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}, 1000);

refreshUI();
