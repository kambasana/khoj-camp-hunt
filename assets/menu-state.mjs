const SECTION_IDS = Object.freeze(['play', 'profile', 'settings', 'help']);

const sectionFlags = (active) => Object.fromEntries(
  SECTION_IDS.map((section) => [section, section === active]),
);

export function createMenuState() {
  return {
    open: false,
    sections: sectionFlags('play'),
    focusIntent: null,
  };
}

export function openMenuSection(state, section) {
  const active = SECTION_IDS.includes(section) ? section : 'play';
  return {
    ...state,
    open: true,
    sections: sectionFlags(active),
    focusIntent: 'section',
  };
}

export function closeMenu(state) {
  return {
    ...state,
    open: false,
    focusIntent: 'opener',
  };
}

/** Preserve DOM nodes only while navigating an already-live menu. */
export function shouldPreserveMenuBody(state, hasLiveMenu) {
  return state?.open === true && hasLiveMenu === true;
}

export function menuHostTransition(state, requestedSection, hasLiveMenu = false) {
  const nextState = openMenuSection(state, requestedSection);
  const preserveBody = shouldPreserveMenuBody(state, hasLiveMenu);
  return {
    state: nextState,
    section: Object.entries(nextState.sections).find(([, active]) => active)?.[0] || 'play',
    menuClass: true,
    preserveBody,
    replaceBody: !preserveBody,
  };
}
