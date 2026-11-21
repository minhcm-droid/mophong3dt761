export class PIDRenderer2D {
  constructor(container, onSelectValve) {
    this.container = container;
    this.onSelectValve = onSelectValve;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.locatedValve = null;
    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <svg id="live-pid-svg" viewBox="0 0 1600 920" style="width:100%;height:100%;cursor:grab;">
        <g id="pid-viewport-group">
          <rect width="1600" height="920" fill="#0B1120"/>
          <g id="pid-pipes"></g>
          <g id="pid-vessels"></g>
          <g id="pid-valves"></g>
          <g id="pid-callouts"></g>
          <g id="pid-locator-layer"></g>
        </g>
      </svg>
    `;
    this.svg = this.container.querySelector('#live-pid-svg');
    this.viewport = this.container.querySelector('#pid-viewport-group');

    let dragging = false;
    let startX = 0;
    let startY = 0;
    this.svg.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX - this.panX;
      startY = e.clientY - this.panY;
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      this.panX = e.clientX - startX;
      this.panY = e.clientY - startY;
      this.applyTransform();
    });
    window.addEventListener('mouseup', () => { dragging = false; });
    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      this.scale = Math.max(0.55, Math.min(3.2, this.scale * factor));
      this.applyTransform();
    });
  }

  applyTransform() {
    this.viewport.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.scale})`);
  }

  focusValve(valve) {
    this.locatedValve = valve;
    this.scale = 1.65;
    const rect = this.container.getBoundingClientRect();
    const cx = (rect.width || 900) / 2;
    const cy = (rect.height || 600) / 2;
    this.panX = cx - (valve.x2d / 1600) * (rect.width || 900) * this.scale;
    this.panY = cy - (valve.y2d / 920) * (rect.height || 600) * this.scale;
    this.applyTransform();
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.locatedValve = null;
    this.applyTransform();
  }

  render(state) {
    const pipesG = this.svg.querySelector('#pid-pipes');
    const vesselsG = this.svg.querySelector('#pid-vessels');
    const valvesG = this.svg.querySelector('#pid-valves');
    const calloutsG = this.svg.querySelector('#pid-callouts');
    const locatorG = this.svg.querySelector('#pid-locator-layer');

    const flowCls = state.isRunning ? 'pipe-flowing' : '';
    pipesG.innerHTML = `
      <path d="M 50 360 L 160 360" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 50 310 L 160 310" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 195 450 L 195 540 L 340 540 L 340 280 L 420 280" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 480 350 L 480 540 L 660 540 L 660 220 L 760 220" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 50 680 L 760 680" stroke="#F59E0B" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 795 150 L 795 95 L 480 95 L 480 250" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 560 250 L 560 165 L 725 165" stroke="#FB7185" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 545 375 L 545 455" stroke="#2DD4BF" stroke-width="3" fill="none"/>
      <path d="M 830 560 L 925 560 L 925 490 L 830 490" stroke="#F59E0B" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 1045 525 L 955 525" stroke="#EF4444" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 925 560 L 925 620" stroke="#EF4444" stroke-width="3" fill="none"/>
      <path d="M 830 310 L 1210 310" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 1245 390 L 1245 450 L 1520 450" stroke="#38BDF8" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 1410 450 L 1410 85 L 195 85 L 195 290" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="6 4" fill="none"/>
      <path d="M 795 620 L 795 720 L 1160 720 L 1160 630 L 1190 630" stroke="#F59E0B" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 1270 670 L 1270 740 L 1520 740" stroke="#F59E0B" stroke-width="3" fill="none" class="${flowCls}"/>
      <path d="M 620 840 L 920 840" stroke="#E879F9" stroke-width="3" stroke-dasharray="6 4" fill="none"/>
    `;

    const drawDrum = (x, y, w, h, rx, label, pct, color) => {
      const fillH = Math.max(4, (h - 8) * (Math.min(100, Math.max(0, pct)) / 100));
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#1E293B" stroke="${color}" stroke-width="2.5"/>
        <rect x="${x + 4}" y="${y + h - 4 - fillH}" width="${w - 8}" height="${fillH}" rx="${Math.min(rx, 10)}" fill="${color}" fill-opacity="0.32"/>
        <text x="${x + w / 2}" y="${y + h / 2}" fill="#F8FAFC" font-family="JetBrains Mono" font-size="14" font-weight="700" text-anchor="middle">${label}</text>
        <text x="${x + w / 2}" y="${y + h / 2 + 16}" fill="${color}" font-family="JetBrains Mono" font-size="11" text-anchor="middle">${pct.toFixed(1)}%</text>
      `;
    };

    vesselsG.innerHTML = `
      ${drawDrum(160, 290, 70, 160, 26, 'D-761', state.tags['LI-787'].pv, '#38BDF8')}
      ${drawDrum(420, 250, 160, 100, 32, 'D-762', state.tags['LIC-788'].pv, '#38BDF8')}
      ${drawDrum(760, 150, 70, 470, 30, 'T-761', state.tags['LIC-790'].pv, '#38BDF8')}
      ${drawDrum(1210, 250, 70, 140, 24, 'D-764', state.tags['LI-791'].pv, '#38BDF8')}
      ${drawDrum(1190, 570, 160, 100, 32, 'D-763', state.tags['LI-792'].pv, '#F59E0B')}
      ${drawDrum(898, 620, 44, 75, 14, 'D-765', state.tags['LIC-797'].pv, '#EF4444')}
      ${drawDrum(920, 800, 140, 75, 24, 'D-752', state.d752Level, '#E879F9')}
      <circle cx="480" cy="165" r="26" fill="#1E293B" stroke="#10B981" stroke-width="2.5"/>
      <text x="480" y="170" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">E-762</text>
      <circle cx="630" cy="165" r="24" fill="#1E293B" stroke="#818CF8" stroke-width="2.5"/>
      <text x="630" y="170" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">E-763</text>
      <circle cx="925" cy="525" r="30" fill="#1E293B" stroke="#EF4444" stroke-width="2.5"/>
      <text x="925" y="530" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">E-761</text>
      <circle cx="1085" cy="310" r="24" fill="#1E293B" stroke="#10B981" stroke-width="2.5"/>
      <text x="1085" y="315" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">E-765</text>
      <circle cx="1085" cy="720" r="24" fill="#1E293B" stroke="#10B981" stroke-width="2.5"/>
      <text x="1085" y="725" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">E-764</text>
      <rect x="515" y="455" width="60" height="34" rx="4" fill="#0F172A" stroke="#2DD4BF" stroke-width="2"/>
      <text x="545" y="476" fill="#2DD4BF" font-family="JetBrains Mono" font-size="11" font-weight="700" text-anchor="middle">PIT-762</text>
    `;

    // Render Pumps
    const pumpList = [
      { id: 'P-761A', x: 265, y: 540 },
      { id: 'P-762A', x: 550, y: 540 },
      { id: 'P-764A', x: 1320, y: 450 },
      { id: 'P-763A', x: 1340, y: 740 }
    ];
    for (const p of pumpList) {
      const run = state.pumps[p.id]?.running;
      const col = run ? '#22C55E' : '#EF4444';
      vesselsG.innerHTML += `
        <circle cx="${p.x}" cy="${p.y}" r="18" fill="#0F172A" stroke="${col}" stroke-width="3"/>
        <text x="${p.x}" y="${p.y + 32}" fill="#F8FAFC" font-family="JetBrains Mono" font-size="12" font-weight="700" text-anchor="middle">${p.id}/B</text>
      `;
    }

    // Filter valves for current SOP mode + Control valves
    const visibleValves = Object.values(state.valves).filter(
      (v) => v.sop === 'BOTH' || v.sop === state.sopMode
    );
    valvesG.innerHTML = visibleValves.map((v) => {
      const shortLabel = v.id.replace('SU-', '').replace('SD-', '');
      const bg = v.type === 'CONTROL' ? '#0F172A' : (v.open ? '#14532D' : '#450A0A');
      const stroke = v.type === 'CONTROL' ? '#38BDF8' : (v.open ? '#22C55E' : '#EF4444');
      return `
        <g class="pid-valve-node" data-vid="${v.id}" transform="translate(${v.x2d}, ${v.y2d})" style="cursor:pointer;">
          <rect x="-28" y="-14" width="56" height="28" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="2.2"/>
          <text y="5" fill="#F8FAFC" font-family="JetBrains Mono" font-size="14" font-weight="700" text-anchor="middle">${shortLabel}</text>
        </g>
      `;
    }).join('');

    valvesG.querySelectorAll('.pid-valve-node').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const vid = el.getAttribute('data-vid');
        if (this.onSelectValve) this.onSelectValve(vid);
      });
    });

    // Live Process Callout Boxes on P&ID
    calloutsG.innerHTML = `
      <g transform="translate(845, 165)">
        <rect width="145" height="68" rx="6" fill="#0F172A" stroke="#38BDF8"/>
        <text x="8" y="18" fill="#38BDF8" font-family="JetBrains Mono" font-size="11" font-weight="700">T-761 PROFILE</text>
        <text x="8" y="34" fill="#F8FAFC" font-family="JetBrains Mono" font-size="11">TOP: ${state.tags['TI-789'].pv.toFixed(1)} °C</text>
        <text x="8" y="49" fill="#F8FAFC" font-family="JetBrains Mono" font-size="11">BTM: ${state.tags['TI-792'].pv.toFixed(1)} °C</text>
        <text x="8" y="63" fill="#F59E0B" font-family="JetBrains Mono" font-size="11">PZI: ${state.tags['PZI-753'].pv.toFixed(2)} k/g</text>
      </g>
      <g transform="translate(1365, 575)">
        <rect width="175" height="62" rx="6" fill="#0F172A" stroke="#F59E0B"/>
        <text x="8" y="18" fill="#F59E0B" font-family="JetBrains Mono" font-size="11" font-weight="700">D-763 ELLIPTICAL VOL</text>
        <text x="8" y="36" fill="#F8FAFC" font-family="JetBrains Mono" font-size="13" font-weight="700">${state.d763VolumeM3.toFixed(2)} m³ / 20.2</text>
        <text x="8" y="52" fill="#94A3B8" font-family="JetBrains Mono" font-size="10">HX Spec: ${state.oligomerWt.toFixed(2)} wt%</text>
      </g>
    `;

    // High-Visibility Golden Locator Crosshair
    if (this.locatedValve) {
      const lv = this.locatedValve;
      locatorG.innerHTML = `
        <g transform="translate(${lv.x2d}, ${lv.y2d})">
          <circle r="44" fill="none" stroke="#FACC15" stroke-width="3" stroke-dasharray="8 5" class="locator-ring"/>
          <circle r="28" fill="rgba(250, 204, 21, 0.16)" stroke="#FACC15" stroke-width="2"/>
          <line x1="-58" y1="0" x2="58" y2="0" stroke="#FACC15" stroke-width="1.5"/>
          <line x1="0" y1="-58" x2="0" y2="58" stroke="#FACC15" stroke-width="1.5"/>
          <rect x="-54" y="-44" width="108" height="20" rx="4" fill="#FACC15"/>
          <text y="-30" fill="#0B1120" font-family="JetBrains Mono" font-size="12" font-weight="800" text-anchor="middle">TARGET: ${lv.id.replace('SU-','').replace('SD-','')}</text>
        </g>
      `;
    } else {
      locatorG.innerHTML = '';
    }
  }
}
