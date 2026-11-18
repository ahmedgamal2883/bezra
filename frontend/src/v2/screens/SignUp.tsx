'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V19-SignUp.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./SignUp.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import { useLanding } from '@/v2/data/landing';
import Logic from './SignUp.logic';

export default function SignUpScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
  const __L = useLanding(); // the sample field's real numbers for the preview panel
  return (
    <>
      <div className="v2 root">
        <div className="shell">
          <div className="su">
            <div className="sul">
              <Link href={__r("V20-Landing") + ""} className="brand" style={{"fontSize":"22px","fontWeight":"700","display":"flex","alignItems":"center","gap":"10px"} as any}>
                <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                  <rect width="34" height="34" rx="11" fill="#17251C" />
                  <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                  <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
                </svg>
                {"bezra"}
              </Link>
              {__v?.up ? (
                <>
                  <div className="form">
                    <div className="col" style={{"gap":"8px"} as any}>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {"Create your free account"}
                      </h1>
                      <p className="txt" style={{"fontSize":"16px"} as any}>
                        {"Your name, mobile number and a password. No code to wait for."}
                      </p>
                    </div>
                    <div className="fld">
                      <span>
                        {"I am a"}
                      </span>
                      <div className="roles" role="group" aria-label="I am a">
                        <button type="button" className={__s(__v?.farmer) as any} onClick={__v?.pickF}>
                          <b>
                            {"Farmer"}
                          </b>
                          <small>
                            {"I grow crops"}
                          </small>
                        </button>
                        <button type="button" className={__s(__v?.eng) as any} onClick={__v?.pickE}>
                          <b>
                            {"Agricultural engineer"}
                          </b>
                          <small>
                            {"I help farmers"}
                          </small>
                        </button>
                      </div>
                    </div>
                    <label className="fld">
                      <span>
                        {"Your name"}
                      </span>
                      <span className={__s(__v?.nameCls) as any}>
                        <input type="text" autoComplete="name" placeholder="Your full name" value={__s(__v?.name) as any} onChange={__v?.setName} />
                      </span>
                      {__v?.hasNameErr ? (
                        <>
                          <span className="ferr" role="alert">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                            </svg>
                            {__s(__v?.nameErr)}
                          </span>
                        </>
                      ) : null}
                    </label>
                    <label className="fld">
                      <span>
                        {"Mobile number"}
                      </span>
                      <span className={__s(__v?.phoneCls) as any}>
                        <span className="cc">
                          {"+20"}
                        </span>
                        <input type="tel" autoComplete="tel" inputMode="numeric" placeholder="010 1234 5678" value={__s(__v?.phone) as any} onChange={__v?.setPhone} />
                      </span>
                      {__v?.hasPhoneErr ? (
                        <>
                          <span className="ferr" role="alert">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                            </svg>
                            {__s(__v?.phoneErr)}
                          </span>
                        </>
                      ) : null}
                      <span className="meta">
                        {"Your account works right away. Alerts can also come on WhatsApp."}
                      </span>
                    </label>
                    <label className="fld">
                      <span>{"Password"}</span>
                      <span className={__s(__v?.pwCls) as any}>
                        <input type="password" autoComplete="new-password" placeholder="At least 6 characters" value={__s(__v?.pw) as any} onChange={__v?.setPw} />
                      </span>
                      {__v?.hasPwErr ? <span className="ferr" role="alert">{__s(__v?.pwErr)}</span> : null}
                    </label>
                    <button type="button" className="btn press" onClick={__v?.sendUp} disabled={!!__v?.busy} style={{"height":"56px","fontSize":"16px"} as any}>
                      {__s(__v?.upLabel)}
                    </button>
                    {__v?.hasFormErr ? <span className="ferr" role="alert">{__s(__v?.formErr)}</span> : null}
                    <div className="or">
                      {"or"}
                    </div>
                    <Link href="#" onClick={__v?.guest} className="sample press">
                      <span className="rki" style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#E4EFE7","color":"var(--green)"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontWeight":"600","fontSize":"16px"} as any}>
                          {"Look around first"}
                        </b>
                        <span className="meta">
                          {"Open a sample field as a guest. No phone needed."}
                        </span>
                      </span>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9.5 6 6 6-6 6" />
                      </svg>
                    </Link>
                    {false ? (<Link href={__r("V18-Add-Find") + ""} className="meta" style={{"textAlign":"center","textDecoration":"underline"} as any}>
                      {"Or add your own field as a guest"}
                    </Link>) : null}
                    <span className="meta" style={{"textAlign":"center","fontSize":"14px"} as any}>
                      {"Already have an account? "}
                      <button type="button" onClick={__v?.toIn} style={{"border":"0","background":"transparent","font":"inherit","fontWeight":"600","color":"var(--ink)","textDecoration":"underline","cursor":"pointer"} as any}>
                        {"Sign in"}
                      </button>
                    </span>
                  </div>
                </>
              ) : null}
              {__v?.inn ? (
                <>
                  <div className="form">
                    <div className="col" style={{"gap":"8px"} as any}>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {"Sign in"}
                      </h1>
                      <p className="txt" style={{"fontSize":"16px"} as any}>
                        {"Use the mobile number you signed up with."}
                      </p>
                    </div>
                    <label className="fld">
                      <span>
                        {"Mobile number"}
                      </span>
                      <span className={__s(__v?.phoneCls) as any}>
                        <span className="cc">
                          {"+20"}
                        </span>
                        <input type="tel" autoComplete="tel" inputMode="numeric" placeholder="010 1234 5678" value={__s(__v?.phone) as any} onChange={__v?.setPhone} />
                      </span>
                      {__v?.hasPhoneErr ? (
                        <>
                          <span className="ferr" role="alert">
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                            </svg>
                            {__s(__v?.phoneErr)}
                          </span>
                        </>
                      ) : null}
                      {__v?.noAcct ? (
                        <>
                          <div className="warnbox" role="alert">
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                            </svg>
                            <span>
                              {"There is no account with this number yet. "}
                              <button type="button" onClick={__v?.toUp} style={{"border":"0","background":"transparent","font":"inherit","fontWeight":"600","color":"inherit","textDecoration":"underline","cursor":"pointer","padding":"0"} as any}>
                                {"Create one"}
                              </button>
                              {", it takes a minute."}
                            </span>
                          </div>
                        </>
                      ) : null}
                    </label>
                    <label className="fld">
                      <span>{"Password"}</span>
                      <span className={__s(__v?.pwCls) as any}>
                        <input type="password" autoComplete="current-password" placeholder="At least 6 characters" value={__s(__v?.pw) as any} onChange={__v?.setPw} />
                      </span>
                      {__v?.hasPwErr ? <span className="ferr" role="alert">{__s(__v?.pwErr)}</span> : null}
                    </label>
                    <button type="button" className="btn press" onClick={__v?.sendIn} disabled={!!__v?.busy} style={{"height":"56px","fontSize":"16px"} as any}>
                      {__s(__v?.inLabel)}
                    </button>
                    {__v?.hasFormErr ? <span className="ferr" role="alert">{__s(__v?.formErr)}</span> : null}
                    <div className="or">
                      {"or"}
                    </div>
                    <Link href="#" onClick={__v?.guest} className="sample press">
                      <span className="rki" style={{"width":"52px","height":"52px","borderRadius":"16px","background":"#E4EFE7","color":"var(--green)"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontWeight":"600","fontSize":"16px"} as any}>
                          {"Look around first"}
                        </b>
                        <span className="meta">
                          {"Open a sample field as a guest. No phone needed."}
                        </span>
                      </span>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9.5 6 6 6-6 6" />
                      </svg>
                    </Link>
                    {false ? (<Link href={__r("V18-Add-Find") + ""} className="meta" style={{"textAlign":"center","textDecoration":"underline"} as any}>
                      {"Or add your own field as a guest"}
                    </Link>) : null}
                    <span className="meta" style={{"textAlign":"center","fontSize":"14px"} as any}>
                      {"New to Bezra? "}
                      <button type="button" onClick={__v?.toUp} style={{"border":"0","background":"transparent","font":"inherit","fontWeight":"600","color":"var(--ink)","textDecoration":"underline","cursor":"pointer"} as any}>
                        {"Create an account"}
                      </button>
                    </span>
                  </div>
                </>
              ) : null}
              {__v?.code ? (
                <>
                  <div className="form">
                    <button type="button" onClick={__v?.back} className="row meta" style={{"gap":"6px","border":"0","background":"transparent","font":"inherit","cursor":"pointer","padding":"0","alignSelf":"flex-start"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14.5 6-6 6 6 6" />
                      </svg>
                      {"Change number"}
                    </button>
                    <div className="col" style={{"gap":"8px"} as any}>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {__s(__v?.titleCode)}
                      </h1>
                      <p className="txt" style={{"fontSize":"16px"} as any}>
                        {"Write the 6-digit code we sent to "}
                        <b style={{"color":"var(--ink)"} as any}>
                          {"+20 "}
                          {__s(__v?.phoneShow)}
                        </b>
                        {"."}
                      </p>
                    </div>
                    {__v?.notOk ? (
                      <>
                        <button type="button" className={__s(__v?.codeCls) as any} onClick={__v?.type} aria-label="Code. Tap to type" style={{"border":"0","background":"transparent","padding":"0","cursor":"text"} as any}>
                          {((__v?.digits) || []).map((g: any, i0: number) => (
                            <Fragment key={i0}>
                              <span className={__s(g?.cls) as any}>
                                {__s(g?.d)}
                              </span>
                            </Fragment>
                          ))}
                        </button>
                        {__v?.codeErr ? (
                          <>
                            <span className="ferr" role="alert">
                              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                              </svg>
                              {"That code is not complete or not right. Check the SMS and try again."}
                            </span>
                          </>
                        ) : null}
                        <button type="button" className="btn press" onClick={__v?.verify} style={{"height":"56px","fontSize":"16px"} as any}>
                          {"Continue"}
                        </button>
                        {__v?.canResend ? (
                          <>
                            <button type="button" onClick={__v?.resend} style={{"border":"0","background":"transparent","font":"inherit","fontSize":"14px","fontWeight":"600","color":"var(--ink)","textDecoration":"underline","cursor":"pointer"} as any}>
                              {__s(__v?.resendTxt)}
                            </button>
                          </>
                        ) : null}
                        {__v?.waiting ? (
                          <>
                            <span className="meta" style={{"textAlign":"center"} as any}>
                              {__s(__v?.resendTxt)}
                            </span>
                          </>
                        ) : null}
                      </>
                    ) : null}
                    {__v?.ok ? (
                      <>
                        <div className="alldone">
                          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
                            <g className="">
                              <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" />
                              <path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
                              <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                              <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                              <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                              <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                                <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                                <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                              </g>
                              <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                              <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                              <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            </g>
                          </svg>
                          <span>
                            {"You are in."}
                          </span>
                        </div>
                        <a href={__s(__v?.nextHref) as any} className="btn cta press" style={{"height":"56px","fontSize":"16px","padding":"0 6px 0 22px","alignSelf":"flex-start"} as any}>
                          {"Continue"}
                          <span className="ar">
                            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7 17 17 7M9 7h8v8" />
                            </svg>
                          </span>
                        </a>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              <span className="meta">
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
            </div>
            <div className="sur" aria-hidden="true">
              <div className="mock" style={{"width":"620px","height":"640px"} as any}>
                <div className="mcard rise" style={{"--d":"1","left":"0","top":"40px","width":"400px","height":"330px"} as any}>
                  <svg viewBox="0 0 360 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="360" height="300" fill="#4C6B3A" />
                    <g transform="rotate(-9 180 150)">
                      <rect x="-40" y="-60" width="60" height="420" fill="#5E7D45" />
                      <rect x="20" y="-60" width="40" height="420" fill="#6E8A4E" />
                      <rect x="60" y="-60" width="52" height="420" fill="#557540" />
                      <rect x="230" y="-60" width="46" height="420" fill="#6E8A4E" />
                      <rect x="276" y="-60" width="60" height="420" fill="#5E7D45" />
                      <rect x="336" y="-60" width="60" height="420" fill="#557540" />
                      <rect x="112" y="-60" width="8" height="420" fill="#C9C0A4" />
                      <rect x="124.0" y="50.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                      <rect x="158.0" y="50.0" width="34" height="42" fill="#C9C77A" stroke="#fff" strokeOpacity=".6" />
                      <rect x="192.0" y="50.0" width="34" height="42" fill="#E8962C" stroke="#fff" strokeOpacity=".6" />
                      <rect x="124.0" y="92.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                      <rect x="158.0" y="92.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                      <rect x="192.0" y="92.0" width="34" height="42" fill="#C9C77A" stroke="#fff" strokeOpacity=".6" />
                      <rect x="124.0" y="134.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                      <rect x="158.0" y="134.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                      <rect x="192.0" y="134.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                      <rect x="124.0" y="176.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                      <rect x="158.0" y="176.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                      <rect x="192.0" y="176.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                      <rect x="124" y="50" width="102" height="168" fill="none" stroke="#fff" strokeWidth="2.5" />
                      <circle cx="209" cy="66" r="6" fill="#fff" />
                      <circle cx="209" cy="66" r="3" fill="#141A16" />
                    </g>
                  </svg>
                </div>
                <div className="mcard rise" style={{"--d":"3","right":"0","top":"170px","width":"330px"} as any}>
                  <div style={{"padding":"22px 24px","display":"flex","flexDirection":"column","gap":"12px"} as any}>
                    <span className="meta" style={{"fontSize":"12px"} as any}>
                      {__L.todayLong}
                    </span>
                    <b style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                      {"Your field is doing well."}
                    </b>
                    <span className="sec" style={{"fontSize":"11px","paddingTop":"6px"} as any}>
                      {"TO DO TODAY"}
                    </span>
                    <div className="row" style={{"gap":"12px","alignItems":"flex-start","padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                      <span className="tbox on" style={{"width":"24px","height":"24px","borderRadius":"8px","flex":"0 0 auto"} as any}>
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"14px","fontWeight":"600","textDecoration":"line-through","color":"var(--muted)"} as any}>
                          {"Water the whole field"}
                        </b>
                        <span style={{"fontSize":"12px","color":"var(--green)"} as any}>
                          {__L.protectTxt || "Every task says what it protects"}
                        </span>
                      </span>
                    </div>
                    <div className="row" style={{"gap":"12px","alignItems":"flex-start","padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                      <span className="tbox" style={{"width":"24px","height":"24px","borderRadius":"8px","flex":"0 0 auto"} as any}>
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"14px","fontWeight":"600"} as any}>
                          {__L.weakSq ? "Look at the leaves in square " + __L.weakSq : "Look at the weakest square"}
                        </b>
                        <span style={{"fontSize":"12px","color":"var(--muted)"} as any}>
                          {"From your journal"}
                        </span>
                      </span>
                    </div>
                                      </div>
                </div>
                <div className="mcard rise" style={{"--d":"5","left":"50px","bottom":"10px","width":"320px","padding":"20px 22px","background":"#fff"} as any}>
                  <span className="meta" style={{"fontSize":"12px","fontWeight":"600"} as any}>
                    {"BEZRA EFFECT, THIS SEASON"}
                  </span>
                  <div className="row" style={{"gap":"10px","alignItems":"baseline","marginTop":"6px"} as any}>
                    <b style={{"fontSize":"40px","fontWeight":"600","letterSpacing":"-1.4px","color":"var(--green)"} as any}>
                      {__L.deltaA || "—"}
                    </b>
                    <span className="meta">
                      {"ardab per feddan"}
                    </span>
                  </div>
                  <span className="meta">
                    {"Expected, vs the usual way. Sample field."}
                  </span>
                </div>
                <div className="rise" style={{"--d":"6","position":"absolute","right":"24px","top":"30px"} as any}>
                  <svg aria-hidden="true" width="80" height="80" viewBox="0 0 60 60">
                    <g className="sway">
                      <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" />
                      <path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
                      <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                      <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                      <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                        <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                        <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                      </g>
                      <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                      <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
