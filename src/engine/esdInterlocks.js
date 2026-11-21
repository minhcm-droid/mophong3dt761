export function evaluateAlarmsAndESD(state) {
  const activeAlarms = [];
  const modeKey = state.sopMode === 'STARTUP' ? 'su' : 'sd';

  for (const tag of Object.values(state.tags)) {
    const limits = tag[modeKey];
    tag.alarmState = 'NORMAL';
    if (limits.ll !== null && tag.pv <= limits.ll) {
      tag.alarmState = 'CRIT';
      activeAlarms.push({ tag: tag.id, level: 'LL/ESD', pv: tag.pv, unit: tag.unit, desc: tag.desc });
    } else if (limits.hh !== null && tag.pv >= limits.hh) {
      tag.alarmState = 'CRIT';
      activeAlarms.push({ tag: tag.id, level: 'HH/ESD', pv: tag.pv, unit: tag.unit, desc: tag.desc });
    } else if (limits.l !== null && tag.pv <= limits.l) {
      tag.alarmState = 'WARN';
      activeAlarms.push({ tag: tag.id, level: 'L ALARM', pv: tag.pv, unit: tag.unit, desc: tag.desc });
    } else if (limits.h !== null && tag.pv >= limits.h) {
      tag.alarmState = 'WARN';
      activeAlarms.push({ tag: tag.id, level: 'H ALARM', pv: tag.pv, unit: tag.unit, desc: tag.desc });
    }
  }

  // Evaluate ESD Interlocks
  const esd1 = state.interlocks.find((i) => i.id === 'ESD-01');
  if (esd1 && esd1.enabled && !esd1.mos && state.tags['FZI-763'].alarmState === 'CRIT') {
    esd1.tripped = true;
    state.valves['FV-766'].open = false;
    state.valves['FV-766'].mv = 0;
  }

  const esd2 = state.interlocks.find((i) => i.id === 'ESD-02');
  if (esd2 && esd2.enabled && !esd2.mos && state.tags['PZI-753'].alarmState === 'CRIT') {
    esd2.tripped = true;
    state.valves['FV-766'].open = false;
    state.valves['FV-766'].mv = 0;
    state.valves['PV-763-2'].open = true;
    state.valves['PV-763-2'].mv = 100;
  }

  const esd3 = state.interlocks.find((i) => i.id === 'ESD-03');
  if (esd3 && esd3.enabled && !esd3.mos) {
    if (state.tags['LI-787'].pv <= 2.0) {
      esd3.tripped = true;
      state.pumps['P-761A'].running = false;
      state.pumps['P-761B'].running = false;
    }
    if (state.tags['LIC-788'].pv <= 5.9) {
      esd3.tripped = true;
      state.pumps['P-762A'].running = false;
      state.pumps['P-762B'].running = false;
    }
  }

  return activeAlarms;
}
