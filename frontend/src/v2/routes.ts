'use client';
// Redesign page map (design-handoff/HANDOFF.md §8): design file name -> real route.
// Field pages carry the field id (a farmer can have several fields; an engineer opens other farmers' fields).
// Arabic design files (…-AR, V22-AR-…) open the same route: the language is a setting, not a page.
import { useCallback } from 'react';
import { useField } from '@/lib/field';

type To = (fieldId: string) => string;
const f = (tab: string): To => (id) => `/field/${id}/${tab}`;

const PAGES: Record<string, To> = {
  Today: f('today'), TodayD: f('today'), 'Today-Ticked': f('today'), 'Today-AllDone': f('today'), 'Today-Loading': f('today'),
  'Today-Joined': f('today'), 'Guest-Today': f('today'),
  'Log-What': (id) => `/field/${id}/today?log=1`, 'Log-Leaf': (id) => `/field/${id}/today?log=1`,
  Journal: f('journal'), JournalD: f('journal'),
  Crop: f('crop'), CropD: f('crop'), 'Crop-Rust': f('crop/rust'), 'Crop-RustD': f('crop/rust'),
  Check: f('crop/check'), 'Check-Result': f('crop/check'), 'Check-Unsure': f('crop/check'),
  Soil: f('soil'), SoilD: f('soil'), Season: f('season'), SeasonD: f('season'), 'Season-Joined': f('season'),
  Try: f('season/try'), TryD: f('season/try'), 'Try-Change': f('season/try'), 'Try-Replay': f('season/try'),
  Story: f('story'), StoryD: f('story'), Data: f('data'), DataD: f('data'),
  Reading: f('reading'), Catchup: f('catch-up'), 'Catchup-Late': f('catch-up'),
  'Tour-Welcome': (id) => `/field/${id}/today?tour=welcome`, 'Tour-Welcome-Guest': (id) => `/field/${id}/today?tour=welcome`,
  'Tour-Today': (id) => `/field/${id}/today?tour=today`, 'Tour-Finish': f('today'),
  Ask: () => '/ask', Profile: () => '/profile', Engineer: () => '/engineer', Notifications: () => '/notifications',
  Landing: () => '/', SignUp: () => '/signup', 'SignUp-Code': () => '/signup', SignIn: () => '/signin', 'SignIn-NoAcct': () => '/signin',
  'Add-Find': () => '/fields/new', 'Add-Draw': () => '/fields/new', 'Add-Stage': () => '/fields/new',
  Waking: () => '/waking', States: () => '/states',
};

/** "V22-AR-Crop" / "V18-Crop" / "V21-Tour-Today-AR" -> "Crop" / "Crop" / "Tour-Today" */
export function pageKey(design: string): string {
  return design.replace(/^V\d\d-/, '').replace(/^AR-/, '').replace(/-AR$/, '');
}

export function v2Href(design: string, fieldId: string): string {
  const to = PAGES[pageKey(design)];
  return to ? to(fieldId) : '#';
}

/** Inside a screen: __r('V18-Crop') -> /field/<current field>/crop */
export function useV2Href() {
  const { id } = useField();
  return useCallback((design: string) => v2Href(design, id), [id]);
}
