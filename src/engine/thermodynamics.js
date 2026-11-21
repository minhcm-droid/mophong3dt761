export function calculateD763VolumeM3(levelPercent) {
  // D-763 specs from SOP HD-W-7500-06-001: 2:1 elliptical head, L = 3300 mm (3.3 m), D = 2500 mm (2.5 m)
  const D = 2.5;
  const L = 3.3;
  const clamped = Math.max(0, Math.min(100, levelPercent));
  const h = (clamped / 100) * D;
  if (h <= 0) return 0;
  const R = D / 2;
  const cylVol = (Math.pow(R, 2) * Math.acos((R - h) / R) - (R - h) * Math.sqrt(Math.max(0, D * h - h * h))) * L;
  // Two 2:1 elliptical heads combined = pi/6 * h^2 * (1.5*D - h)
  const headsVol = (Math.PI / 6) * Math.pow(h, 2) * (1.5 * D - h);
  return cylVol + headsVol;
}

export function stepThermodynamics(state, dtSeconds) {
  const t = state.tags;
  const fv766Open = state.valves['FV-766'].open ? state.valves['FV-766'].mv / 100 : 0;
  const cwFlow = state.valves['SU-V1'].open && state.valves['SD-V15'].open ? 80.0 : 12.0;

  // Smooth convergence toward physical equilibrium
  const alpha = Math.min(1, dtSeconds * 0.08);
  t['FZI-763'].pv += (cwFlow - t['FZI-763'].pv) * alpha;

  // Target bottom temp driven by HP steam FV-766
  const targetBottomTemp = 35 + fv766Open * 275; // ~158.7 °C at 45% MV
  t['TI-792'].pv += (targetBottomTemp - t['TI-792'].pv) * alpha;

  // Tray temperature cascade from bottom to top
  const targetLowerTemp = 32 + (t['TI-792'].pv - 32) * 0.66;
  const targetMidTemp = 30 + (t['TI-792'].pv - 30) * 0.54;
  const targetTopTemp = 28 + (t['TI-792'].pv - 28) * 0.47;
  t['TI-791'].pv += (targetLowerTemp - t['TI-791'].pv) * alpha;
  t['TI-790'].pv += (targetMidTemp - t['TI-790'].pv) * alpha;
  t['TI-789'].pv += (targetTopTemp - t['TI-789'].pv) * alpha;

  // Tower top pressure PZI-753 & D-762 pressure PIC-763
  const heatCoolingDiff = Math.max(0, (t['TI-789'].pv - 89) * 0.015) + (t['FZI-763'].pv < 45 ? 0.35 : 0);
  const targetPress = 1.50 + heatCoolingDiff;
  t['PZI-753'].pv += (targetPress - t['PZI-753'].pv) * alpha;
  t['PIC-763'].pv += (targetPress - t['PIC-763'].pv) * alpha;

  // Tray 1-20 differential pressure PDI-760
  const p762Active = state.pumps['P-762A'].running || state.pumps['P-762B'].running;
  const targetPdi = p762Active ? (450 + fv766Open * 450) : 120;
  t['PDI-760'].pv += (targetPdi - t['PDI-760'].pv) * alpha;

  // Product quality Oligomer wt% in D-764
  const targetOligomer = t['TI-792'].pv > 165 ? (1.8 + (t['TI-792'].pv - 165) * 0.12) : 1.45;
  state.oligomerWt += (targetOligomer - state.oligomerWt) * alpha;

  // D-763 level & exact volume
  state.d763VolumeM3 = calculateD763VolumeM3(t['LI-792'].pv);
}
