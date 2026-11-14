'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Ask.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Ask.logic.js (verbatim from the design).
import { Fragment, useState } from 'react';
import { useApi } from '@/lib/api';
import { LiveMessages, useAskChat, useMic } from '@/components/AskLive';
import { useField, FieldWho, UserName, UserInitials, EngineerTab, EngName, useDemo } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { LangSwitch } from '@/lib/i18n';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Ask.logic';

export default function AskScreen() {
  const tr = useT();
  const { fp, id } = useField();
  const __v = useDC(Logic);
  // Ask Bezra: POST /chat (step 3). Without a Claude API key the design's sample conversation stays as Demo.
  const status = useApi('/chat/status');
  const ready = !!status.data?.ready;
  const S = useApi(`/fields/${id}/summary`).data;
  const chat = useAskChat(id, ready);
  const [draft, setDraft] = useState('');
  const mic = useMic((t) => setDraft(t));
  const sendDraft = () => { if (draft.trim()) { chat.send(draft); setDraft(''); } };
  const demo = useDemo();
  const showDemo = demo && !ready && chat.msgs.length === 0;
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href={fp("")} className="brand" aria-label="Bezra, my field">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href={fp("")} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"My field"}
              </Link>
              <Link href="/sim" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v2M18 4v4M6 20v-2M3 7l3-3 3 3M15 7l3-3 3 3" />
                </svg>
                {"Simulator"}
              </Link>
              <Link href="/ask" aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5zM9 9h6M9 12h3" />
                </svg>
                {"Ask Bezra"}
              </Link>
              <Link href="/profile" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />
                </svg>
                {"Profile"}
              </Link>
              <EngineerTab />
            </nav>
            <div className="tools">
              <LangSwitch />
<DataLive />
              <div role="group" aria-label="Detail level" className="seg">
                <button type="button" className={__s(__v?.segS) as any} onClick={__v?.pickS} aria-pressed={__s(__v?.isS) as any}>
                  {"Simple"}
                </button>
                <button type="button" className={__s(__v?.segD) as any} onClick={__v?.pickD} aria-pressed={__s(__v?.isD) as any}>
                  {"Details"}
                </button>
              </div>
              <Link href={fp("/alerts")} className="ibtn press" aria-label="Alerts, 2 new">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <span className="who">
                <span className="av" aria-hidden="true">
                  <UserInitials />
                </span>
                <span>
                  <b>
                    <UserName />
                  </b>
                  <small>
                    <FieldWho />
                  </small>
                </span>
              </span>
            </div>
          </header>
          <main className="main">
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 340px","alignItems":"start"} as any}>
              <section aria-label="Chat with Bezra" className="col" style={{"gap":"14px","padding":"22px","borderRadius":"var(--r-hero)","background":"#ECECE7","minHeight":"760px"} as any}>
                <div className="row sp rise" style={{"--d":"1"} as any}>
                  <span className="row" style={{"gap":"12px"} as any}>
                    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 60 60">
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
                    <span className="col">
                      <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                        <T en="Ask Bezra" ar="اسأل بذرة" />
                      </b>
                      <span className="tl">
                        {"Answers from your field's data. Says so when it doesn't know."}
                      </span>
                    </span>
                  </span>
                  <span className="pill">
                    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                    </svg>
                    {" Egyptian Arabic"}
                  </span>
                </div>
                {showDemo ? (
                <>
                <div className="col" style={{"gap":"14px","flex":"1"} as any}>
                  <div className="row rise" style={{"--d":"2","gap":"10px","alignItems":"flex-end","maxWidth":"640px"} as any}>
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
                        <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <div className="col" style={{"gap":"8px","padding":"14px 16px","borderRadius":"18px 18px 18px 6px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                      <p style={{"fontSize":"16px","lineHeight":"1.7"} as any}>
                        <T en="Hi Hassan! I&apos;m Bezra 🌱 I watch your field with NASA satellites. Ask me anything." ar="أهلاً يا حاج حسن! أنا بذرة 🌱 بشوف أرضك بأقمار ناسا. اسألني أي حاجة." />
                      </p>
                    </div>
                  </div>
                  <div className="rise" style={{"--d":"3","alignSelf":"flex-end","maxWidth":"460px","padding":"12px 16px","borderRadius":"18px 18px 6px 18px","background":"var(--dark)","color":"#fff","fontSize":"16px","lineHeight":"1.6"} as any}>
                    <T en="Should I water today?" ar="أروي ولا لأ النهارده؟" />
                  </div>
                  <div className="row rise" style={{"--d":"4","gap":"10px","alignItems":"flex-end","maxWidth":"640px"} as any}>
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
                        <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <div className="col" style={{"gap":"8px","padding":"14px 16px","borderRadius":"18px 18px 18px 6px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                      <p style={{"fontSize":"16px","lineHeight":"1.7"} as any}>
                        <T en="No, wait for your turn on Thursday. The soil has 38% water and the wheat is tillering, so don&apos;t miss that turn." ar="لأ، استنى نوبتك يوم الخميس. الأرض عندها 38% مية، والقمح في مرحلة التفريع، فمتفوتش النوبة دي." />
                      </p>
                      <div className="inset" style={{"background":"var(--water-tint)"} as any}>
                        <span style={{"color":"var(--water)"} as any}>
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                          </svg>
                        </span>
                        <b>
                          {"Soil water 38%, refill at 50%"}
                        </b>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                      </div>
                      <span className="row" style={{"gap":"4px"} as any}>
                        <span className="pill">
                          {"FAO-56"}
                        </span>
                        <span className="pill">
                          {"NASA POWER"}
                        </span>
                        <span className="pill">
                          {"GPM IMERG"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="rise" style={{"--d":"5","alignSelf":"flex-end","maxWidth":"460px","padding":"12px 16px","borderRadius":"18px 18px 6px 18px","background":"var(--dark)","color":"#fff","fontSize":"16px","lineHeight":"1.6"} as any}>
                    <T en="What if I sow two weeks later next year?" ar="طب لو زرعت السنة الجاية متأخر أسبوعين؟" />
                  </div>
                  <div className="row rise" style={{"--d":"6","gap":"10px","alignItems":"flex-end","maxWidth":"640px"} as any}>
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
                        <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <div className="col" style={{"gap":"8px","padding":"14px 16px","borderRadius":"18px 18px 18px 6px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                      <p style={{"fontSize":"16px","lineHeight":"1.7"} as any}>
                        <T en="I tried it in the simulator. Two weeks later, the harvest is expected to drop about 8%, because grain filling lands in the April heat." ar="جربتلك ده في المحاكي. لو اتأخرت أسبوعين، المحصول متوقع يقل حوالي 8%، عشان طرد الحبوب هييجي في حر أبريل." />
                      </p>
                      <Link href="/sim" className="lift" style={{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"6px","padding":"8px","borderRadius":"12px","background":"var(--inset)"} as any}>
                        <span className="col" style={{"padding":"8px 10px","borderRadius":"8px","background":"#fff"} as any}>
                          <span className="tl">
                            {"Sow 25 Oct"}
                          </span>
                          <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                            {"94%"}
                          </b>
                        </span>
                        <span className="col" style={{"padding":"8px 10px","borderRadius":"8px","background":"#fff"} as any}>
                          <span className="tl">
                            {"Sow 8 Nov"}
                          </span>
                          <b style={{"fontSize":"22px","fontWeight":"600","color":"var(--risk)"} as any}>
                            {"86%"}
                          </b>
                        </span>
                      </Link>
                      <span className="row" style={{"gap":"4px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        <span className="pill">
                          {"Simulator, 30 past years"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="rise" style={{"--d":"7","alignSelf":"flex-end","maxWidth":"460px","padding":"12px 16px","borderRadius":"18px 18px 6px 18px","background":"var(--dark)","color":"#fff","fontSize":"16px","lineHeight":"1.6"} as any}>
                    <T en="How many litres of pesticide should I spray for the worms?" ar="أرش كام لتر مبيد للدودة؟" />
                  </div>
                  <div className="row rise" style={{"--d":"8","gap":"10px","alignItems":"flex-end","maxWidth":"640px"} as any}>
                    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
                      <g className="">
                        <path d="M30 14C24 9 15 11 12 15c5 4 12 3 18-1z" fill="#5E9A45" />
                        <path d="M30 14c5-6 14-6 18-2-4 5-12 6-18 2z" fill="#3E7F35" />
                        <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                        <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                        <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                          <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                          <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                        </g>
                        <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <div className="col" style={{"gap":"8px","padding":"14px 16px","borderRadius":"18px 18px 18px 6px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                      <p style={{"fontSize":"16px","lineHeight":"1.7"} as any}>
                        <T en="Your engineer has to set that dose. I don&apos;t give doses. I can send your question to your engineer now." ar="دي جرعة لازم مهندسك يحددها، أنا مش بدي جرعات. ممكن أبعت سؤالك لم. منى دلوقتي." />
                      </p>
                      <Link href="/messages" className="btn sun sm press" style={{"alignSelf":"flex-start"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />
                        </svg>
                        <>{"Ask "}<EngName /></>
                      </Link>
                    </div>
                  </div>
                  <div className="row rise" style={{"--d":"9","gap":"10px","alignItems":"center"} as any}>
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
                        <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <span className="typing" aria-label="Bezra is typing" style={{"padding":"12px 16px","borderRadius":"18px","background":"#fff"} as any}>
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                </div>
                </>
                ) : <LiveMessages msgs={chat.msgs} busy={chat.busy} greeting />}
                <div className="row wrap rise" style={{"--d":"10","gap":"6px","justifyContent":"flex-end"} as any}>
                  <button type="button" className="btn line sm press" onClick={() => chat.send(tr('Why should I sow early?', 'ليه لازم أزرع بدري؟'))} disabled={chat.busy}>
                    <T en="Why should I sow early?" ar="ليه لازم أزرع بدري؟" />
                  </button>
                  <button type="button" className="btn line sm press" onClick={() => chat.send(tr('What does greenness mean?', 'يعني إيه NDVI؟'))} disabled={chat.busy}>
                    <T en="What does greenness mean?" ar="يعني إيه NDVI؟" />
                  </button>
                  <Link href="/sim" className="btn line sm press">
                    <T en="Try it in the simulator" ar="جرّب في المحاكي" />
                  </Link>
                  <Link href="/messages" className="btn line sm press">
                    <T en="Talk to your engineer" ar="كلّم المهندس" />
                  </Link>
                </div>
                <div className="row rise" style={{"--d":"11","gap":"8px","padding":"6px","borderRadius":"999px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.06)"} as any}>
                  <button type="button" className="ibtn press" aria-label={mic.on ? "Stop listening" : "Speak"} aria-pressed={mic.on} onClick={mic.toggle} title={mic.supported ? "Speak in Arabic" : "Voice needs Chrome or Edge"} style={{"background": mic.on ? "var(--risk)" : "var(--sun)", "color": mic.on ? "#fff" : undefined} as any}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v4" />
                    </svg>
                  </button>
                  <label className="vh" htmlFor="askq">
                    {"Your question"}
                  </label>
                  <input id="askq" dir="auto" placeholder={tr('Type your question or tap the mic', 'اكتب سؤالك أو دوس على المايك')} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendDraft(); }} style={{"flex":"1","height":"44px","border":"0","outline":"0","fontSize":"16px","background":"transparent","fontFamily":"inherit"} as any} />
                  <button type="button" className="ibtn press" aria-label="Send" onClick={sendDraft} disabled={chat.busy} style={{"background":"var(--dark)","color":"#fff"} as any}>
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12 20 5l-4 15-4-6zM12 14l8-9" />
                    </svg>
                  </button>
                </div>
              </section>
              <aside className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"2"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                  <h2 className="h2">
                    {"What Bezra sees now"}
                  </h2>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="inset">
                      <span>
                        {"Field"}
                      </span>
                      <b>
                        {S ? `${S.field.name}, ${S.field.crop.toLowerCase()}` : "…"}
                      </b>
                    </div>
                    <div className="inset">
                      <span>
                        {"Stage"}
                      </span>
                      <b>
                        {S ? `${S.stage}, day ${S.day_n}` : "Tillering, day 30"}
                      </b>
                    </div>
                    <div className="inset">
                      <span>
                        {"Open alerts"}
                      </span>
                      <b>
                        {S ? String(Object.values(S.risks).filter((r: any) => r.level !== "Low").length) : "2"}
                      </b>
                    </div>
                    <div className="inset">
                      <span>
                        {"Came from"}
                      </span>
                      <b>
                        {"Today"}
                      </b>
                    </div>
                  </div>
                </section>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <h2 className="h2">
                    {"Bezra's moods"}
                  </h2>
                  <div className="grid" style={{"gridTemplateColumns":"repeat(4, 1fr)","gap":"4px"} as any}>
                    <div className="col" style={{"alignItems":"center","gap":"4px"} as any}>
                      <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
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
                          <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                          <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        </g>
                      </svg>
                      <span className="tl">
                        {"Happy"}
                      </span>
                    </div>
                    <div className="col" style={{"alignItems":"center","gap":"4px"} as any}>
                      <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
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
                          <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                          <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        </g>
                      </svg>
                      <span className="tl">
                        {"Thinking"}
                      </span>
                    </div>
                    <div className="col" style={{"alignItems":"center","gap":"4px"} as any}>
                      <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
                        <g className="">
                          <path d="M30 14C24 9 15 11 12 15c5 4 12 3 18-1z" fill="#5E9A45" />
                          <path d="M30 14c5-6 14-6 18-2-4 5-12 6-18 2z" fill="#3E7F35" />
                          <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                          <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                          <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                          <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                            <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                            <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                          </g>
                          <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                          <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        </g>
                      </svg>
                      <span className="tl">
                        {"Concerned"}
                      </span>
                    </div>
                    <div className="col" style={{"alignItems":"center","gap":"4px"} as any}>
                      <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
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
                      <span className="tl">
                        {"Proud"}
                      </span>
                    </div>
                  </div>
                  <p className="sub">
                    {"The seed grows with your wheat: seed, sprout, plant, ear. Its mood follows your alerts."}
                  </p>
                </section>
                <section className="card rise tint-s" style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <h2 className="h2">
                    {"Rules Bezra keeps"}
                  </h2>
                  <ul style={{"margin":"0","paddingLeft":"18px","display":"flex","flexDirection":"column","gap":"6px"} as any} className="body">
                    <li>
                      {"Only uses your field's data and checked sources."}
                    </li>
                    <li>
                      {"Never gives pesticide or fertilizer doses."}
                    </li>
                    <li>
                      {"Shows its sources and confidence."}
                    </li>
                  </ul>
                </section>
              </aside>
            </div>
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {ready ? "Answers by Claude from your field's NASA data. Check them with your engineer." : "All numbers on this screen are demo data."}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
