'use client';
// Small runtime that runs the V11 design logic scripts unchanged inside React.
// Each design screen ships a `Component extends DCLogic` class with renderVals();
// we keep those classes verbatim and re-render React when they call setState.
import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DCLogic {
  props: any;
  state: any;
  __render?: () => void;
  constructor(p?: any) {
    this.props = p || {};
  }
  setState(o: any) {
    Object.assign(this.state, o);
    if (this.__render) this.__render();
  }
}

// Simple / Details is one app-wide switch (it lives in the shared header).
const ModeCtx = createContext<{ details: boolean; setDetails: (d: boolean) => void }>({
  details: false,
  setDetails: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState(false);
  return <ModeCtx.Provider value={{ details, setDetails }}>{children}</ModeCtx.Provider>;
}

// For hand-built screens (outside the design's logic classes).
export function useMode() {
  return useContext(ModeCtx);
}

type LogicClass =new (p: any) => DCLogic & { renderVals(): any };

export function useDC(Logic: LogicClass, extraProps: Record<string, unknown> = {}): any {
  const { details, setDetails } = useContext(ModeCtx);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const ref = useRef<(DCLogic & { renderVals(): any }) | null>(null);
  if (!ref.current) ref.current = new Logic({ details, ...extraProps });
  const inst = ref.current;
  inst.props = { ...inst.props, details, ...extraProps };
  inst.__render = () => {
    // Same as the design runtime: after the first interaction, entrance animations stop replaying.
    document.documentElement.classList.add('static');
    const s = inst.state;
    if (s && 'mode' in s && s.mode != null) {
      setDetails(s.mode === 'details');
      s.mode = null;
    }
    force();
  };
  useEffect(() => {
    // A fresh page plays its entrance animations again.
    document.documentElement.classList.remove('static');
  }, []);
  return inst.renderVals();
}

// Converts a CSS text like "--i:3; height: 20px" to a React style object.
export function css(str: unknown): Record<string, string> | undefined {
  if (str == null || typeof str !== 'string' || !str.trim()) return undefined;
  const out: Record<string, string> = {};
  let depth = 0, buf = '';
  const parts: string[] = [];
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { parts.push(buf); buf = ''; } else buf += ch;
  }
  parts.push(buf);
  for (const p of parts) {
    const i = p.indexOf(':');
    if (i < 0) continue;
    const k = p.slice(0, i).trim();
    const v = p.slice(i + 1).trim();
    if (!k) continue;
    out[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
}

// Same rule as the design template: null/undefined/functions print as empty text.
export function s(v: unknown): string {
  return v == null || typeof v === 'function' ? '' : String(v);
}
