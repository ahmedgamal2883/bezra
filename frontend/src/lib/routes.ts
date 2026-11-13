// Maps each V11 design artboard to its app route (brief §1).
// The demo field id is fixed for now; it becomes dynamic when fields come from the backend.
export const DEMO_FIELD_ID = 'north-plot';

const f = (tab = '') => `/field/${DEMO_FIELD_ID}${tab}`;

export const routes: Record<string, string> = {
  'V11-Landing.html': '/',
  'V11-Onboarding.html': '/onboarding',
  'V11-Field.html': f(),
  'V11-Plan.html': f('/plan'),
  'V11-Health.html': f('/health'),
  'V11-Calendar.html': f('/calendar'),
  'V11-Next.html': f('/next'),
  'V11-Alerts.html': f('/alerts'),
  'V11-Diagnose.html': f('/diagnose'),
  'V11-Sim.html': '/sim',
  'V11-Ask.html': '/ask',
  'V11-Profile.html': '/profile',
  'V11-Engineer.html': '/engineer',
  'V11-About.html': '/about',
  'V11-States.html': '/states',
};
