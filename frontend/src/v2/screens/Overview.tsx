'use client';
/* eslint-disable */
// Overview: the whole field on one page (map, today's action and why, soil and season numbers, tasks, warnings,
// weather, rotation). Header shared with the other screens; data: v2/data/overview.ts (existing endpoints only).
import Link from 'next/link';
import { s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import { useOverviewData } from '@/v2/data/overview';
import SeedLoader from '@/components/SeedLoader';
import PriorityPicker from '@/v2/PriorityPicker';
import CropPlanCard from '@/v2/CropPlanCard';
import Tour from '@/v2/tour/Tour';

export default function OverviewScreen() {
  const __r = useV2Href();
  const __w = useWho();
  const v = useOverviewData();
  const __v: any = {};
  return (
    <>
      <style>{OV_CSS}</style>
      <div className="v2 root">
        <div className="shell">
          <header className="top">
            <Link href={__r("V18-Today") + ""} className="brand" aria-label="Bezra, Today">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href={__r("V18-Overview") + ""} aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                {"Overview"}
              </Link>
              <Link href={__r("V18-Today") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"Today"}
              </Link>
              <Link href={__r("V18-Crop") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                </svg>
                {"Crop"}
              </Link>
              <Link href={__r("V19-Soil") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                </svg>
                {"Soil"}
              </Link>
              <Link href={__r("V19-Season") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                </svg>
                {"Season"}
              </Link>
              <Link href={__r("V18-Journal") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4zM5 16a4 4 0 0 1 4-4h10" />
                </svg>
                {"Journal"}
              </Link>
            </nav>
            <div className="tools">
              <Link href="/notifications" className="ibtn press" aria-label="Notifications">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <Link href={__r("V18-Profile") + ""} className="who" aria-label="Your profile, fields and settings">
                <span className="av" aria-hidden="true">
                  {__s(__w.initials)}
                </span>
                <span>
                  <b>
                    {__s(__w.userName)}
                  </b>
                  <small>
                    {__s(__w.fieldLabel)}
                  </small>
                </span>
              </Link>
            </div>
          </header>
          <main className="main ov" style={{"gap":"20px","paddingTop":"16px"} as any}>
            {!v.ready ? <div className="sk" style={{"height":"320px","borderRadius":"24px"} as any} aria-busy="true" /> : (
            <>
            <section className="ovcard" aria-labelledby="ov-h">
              <div className="row sp" style={{"alignItems":"flex-start","gap":"12px","flexWrap":"wrap"} as any}>
                <div className="col" style={{"gap":"4px"} as any}>
                  <span className="meta">{v.date + " · " + v.fieldLine}</span>
                  <h1 id="ov-h" className="ovh1">{v.hello}</h1>
                </div>
                <Link href={__r("V18-Today") + ""} className="btn soft press" style={{"height":"40px"} as any}>{"Open today's list"}</Link>
              </div>
              <p className="ovlead">{v.brief}</p>
              {v.briefItems?.length ? <ul className="ovlist">{v.briefItems.map((x: string, i: number) => <li key={i}>{x}</li>)}</ul> : null}
              <div className="row" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                <Link href={__r("V18-Story") + ""} className="ovchip press">{"What should I do?"}</Link>
                <Link href="/ask" className="ovchip press">{"Ask Bezra"}</Link>
                <Link href={__r("V19-Try") + ""} className="ovchip press">{"Try a change first"}</Link>
                <Link href={__r("Log-What") + ""} className="ovchip press">{"Add to journal"}</Link>
              </div>
            </section>

            <CropPlanCard id={v.id} />

            <section className="card ovyou">
              <div className="ovyoutx">
                <div className="lab">{"YOU ARE IN CHARGE"}</div>
                <p style={{"margin":"4px 0 0","fontSize":"16px","lineHeight":"1.45"} as any}>{"Watered, fed or sprayed already? Write it in the journal and the plan moves with you: a watering you did cancels the turn it covers."}</p>
                <Link href={__r("Log-What") + ""} className="btn press" style={{"height":"44px","marginTop":"10px","display":"inline-flex"} as any}>{"Add to journal"}</Link>
                <p className="muted" style={{"margin":"14px 0 0","fontSize":"14px"} as any}>{"Growing a crop Bezra does not know? Ask Bezra and it builds a season plan with you; the steps show up in your tasks."} <Link href="/ask" style={{"textDecoration":"underline"} as any}>{"Make a plan with Bezra"}</Link></p>
              </div>
              <div className="ovyoupr">
                <PriorityPicker id={v.id} onSaved={() => v.reload?.()} />
              </div>
              <Link href={__r("V18-Journal") + ""} className="ovgo press">{"Open your journal"} <span aria-hidden="true">→</span></Link>
            </section>

            <div className="ovgrid2">
              <section className="ovcard" aria-labelledby="ov-map">
                <div className="row sp"><h2 id="ov-map" className="ovh2">{"Your field from space"}</h2>{v.map ? <span className="meta">{v.map.date}</span> : null}</div>
                {v.map ? (
                  <>
                    <div className="ovmap" style={{"--cols": v.map.cols} as any} role="img" aria-label={"Field squares, coloured by how green they are, " + v.map.date}>
                      {v.map.cells.map((c: any, i: number) => (
                        <span key={i} className={"ovsq " + c.cls} title={c.pct != null ? c.name + ": " + (c.pct >= 0 ? "+" : "") + c.pct + "% vs the rest" : c.name}>
                          {c.cls !== 'outside' ? <><b>{c.name}</b>{c.pct != null && c.cls === 'less' ? <small>{c.pct + "%"}</small> : null}</> : null}
                        </span>
                      ))}
                    </div>
                    <div className="row" style={{"gap":"14px","flexWrap":"wrap"} as any}>
                      <span className="ovleg"><i className="ovsq good" />{"Good"}</span>
                      <span className="ovleg"><i className="ovsq normal" />{"Normal"}</span>
                      <span className="ovleg"><i className="ovsq less" />{"Needs a look"}</span>
                    </div>
                    <span className="meta" style={{"fontSize":"12px"} as any}>{v.map.source + " · 30 m squares"}</span>
                  </>
                ) : <SeedLoader inline />}
                <Link href={__r("V18-Crop") + ""} className="ovgo press">{"See your map on Crop"} <span aria-hidden="true">→</span></Link>
              </section>

              <section className="ovcard" aria-labelledby="ov-act">
                <span className="ovpill now">{v.action.done ? "Done today" : "Today's action"}</span>
                <h2 id="ov-act" className="ovh2" style={{"fontSize":"24px"} as any}>{v.action.title}</h2>
                {v.action.amount ? <div className="ovamount"><span className="meta">{"Water to give"}</span><b>{v.action.amount}</b></div> : null}
                <div className="ovwhy">
                  <div className="row sp"><b>{"Why Bezra says so"}</b>{v.action.conf ? <span className="meta">{"Confidence: " + v.action.conf}</span> : null}</div>
                  <ul>{v.action.why.map((w: string, i: number) => <li key={i}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D45" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg><span>{w}</span></li>)}</ul>
                  {v.action.confWhy ? <span className="meta" style={{"fontSize":"12px"} as any}>{"Why not higher: " + v.action.confWhy}</span> : null}
                </div>
                <div className="row" style={{"gap":"8px","marginTop":"auto","flexWrap":"wrap"} as any}>
                  {v.action.taskId ? <button type="button" className="btn press" onClick={() => v.act.done(v.action.taskId)}>{"Mark as done"}</button> : null}
                  <Link href={__r("V18-Today") + ""} className="btn soft press">{"See it on Today"}</Link>
                </div>
                <Link href={__r("V18-Today") + ""} className="ovgo press">{"Open Today"} <span aria-hidden="true">→</span></Link>
              </section>
            </div>

            <div className="ovtiles">
              {v.tiles.map((t: any) => (
                <Link key={t.k} href={__r("V18-" + (t.href === 'soil' ? 'Soil' : t.href === 'journal' ? 'Journal' : 'Season')) + ""} className={"ovtile press " + t.tone}>
                  <span className="ovtl">{t.label}</span>
                  <b className="ovbig">{t.big}</b>
                  <span className="ovts">{t.small}</span>
                </Link>
              ))}
            </div>

            <div className="ovgrid2">
              <section className="ovcard" aria-labelledby="ov-tasks">
                <div className="row sp"><h2 id="ov-tasks" className="ovh2">{"Today's tasks"}</h2></div>
                {v.tasks.length ? v.tasks.map((t: any) => (
                  <div key={t.id} className="ovrow">
                    <div className="col" style={{"gap":"2px","minWidth":"0"} as any}><b className="ovrt">{t.title}</b><span className="meta ovrs">{t.sub}</span></div>
                    <span className={"ovpill " + t.cls}>{t.label}</span>
                  </div>
                )) : <p className="meta">{"Nothing to do today."}</p>}
                {v.coming.length ? <span className="meta" style={{"fontWeight":"600","marginTop":"8px"} as any}>{"COMING UP"}</span> : null}
                {v.coming.map((t: any) => (
                  <div key={t.id} className="ovrow">
                    <div className="col" style={{"gap":"2px","minWidth":"0"} as any}><b className="ovrt">{t.title}</b><span className="meta ovrs">{t.sub}</span></div>
                    <span className={"ovpill " + t.cls}>{t.label}</span>
                  </div>
                ))}
                <Link href={__r("V18-Today") + ""} className="ovgo press">{"All tasks on Today"} <span aria-hidden="true">→</span></Link>
              </section>
              <section className="ovcard" aria-labelledby="ov-warn">
                <div className="row sp"><h2 id="ov-warn" className="ovh2">{"Warnings"}</h2></div>
                {v.alerts.length ? v.alerts.map((x: any, i: number) => (
                  <div key={i} className="ovrow">
                    <div className="col" style={{"gap":"2px","minWidth":"0"} as any}><b className="ovrt">{x.title}</b><span className="meta ovrs">{x.why}</span></div>
                    <span className={"ovpill " + x.cls}>{x.label}</span>
                  </div>
                )) : <SeedLoader inline />}
                <Link href={__r("V18-Crop") + ""} className="ovgo press">{"All warnings on Crop"} <span aria-hidden="true">→</span></Link>
              </section>
            </div>

            <div className="ovgrid2 top">
              <section className="ovcard" aria-labelledby="ov-wx">
                <h2 id="ov-wx" className="ovh2">{"Next 7 days"}</h2>
                {v.week.length ? (
                  <div className="ovweek">
                    {v.week.map((d: any, i: number) => (
                      <div key={i} className={"ovday" + (d.water ? " water" : "")}>
                        <span className="meta">{d.day}</span><b>{d.hi + "°"}</b><span className="meta">{d.lo + "°"}</span>
                        <span className="meta">{d.rain ? d.rain + " mm" : "dry"}</span>
                        {d.water ? <span className="ovpill now" style={{"fontSize":"11px"} as any}>{"Water"}</span> : null}
                      </div>
                    ))}
                  </div>
                ) : v.weekErr ? <p className="meta">{"The forecast is not available right now."}</p> : <SeedLoader inline />}
                <span className="meta" style={{"fontSize":"12px"} as any}>{v.weekSrc || ""}</span>
                <Link href={__r("V18-Season") + ""} className="ovgo press">{"Weather and season on Season"} <span aria-hidden="true">→</span></Link>
              </section>
              <section className="ovcard" aria-labelledby="ov-rot">
                <div className="row sp"><h2 id="ov-rot" className="ovh2">{"Rotation"}</h2></div>
                <div className="ovrow"><span className="meta">{"Next winter in your plan"}</span><b>{v.nextWinter || "Not chosen yet"}</b></div>
                {v.best ? (
                  <div className="ovrot">
                    <span className="meta">{"Best for your soil"}</span>
                    <b>{v.best.name}</b>
                    <span className="meta">{v.best.seq}</span>
                    <div className="ovrotnums">
                      {v.best.soil ? <span><b>{v.best.soil}</b> {"soil in 10 years"}</span> : null}
                      {v.best.water ? <span><b>{v.best.water}</b> {"water a year"}</span> : null}
                    </div>
                  </div>
                ) : <SeedLoader inline />}
                {v.own ? (
                  <div className="ovrot own">
                    <span className="meta">{"Your own rotation, made with Bezra"}</span>
                    <b>{v.own.name}</b>
                    <span className="meta">{v.own.seq}</span>
                    <div className="ovrotnums">
                      {v.own.soil ? <span><b>{v.own.soil}</b> {"soil in 10 years"}</span> : null}
                      {v.own.water ? <span><b>{v.own.water}</b> {"water a year"}</span> : null}
                    </div>
                    {v.own.stand ? <span className="meta" style={{"fontSize":"12px"} as any}>{v.own.stand}</span> : null}
                  </div>
                ) : null}
                <span className="meta" style={{"fontSize":"12px"} as any}>{"Compared with what you grow now. Estimates from Bezra's soil model on your field's NASA weather."}</span>
                <Link href="/ask" className="ovchip press" style={{"alignSelf":"flex-start"} as any}>{v.own ? "Change your rotation with Bezra" : "Make your own rotation with Bezra"}</Link>
                <Link href={__r("V18-Soil") + ""} className="ovgo press">{"Rotation on Soil"} <span aria-hidden="true">→</span></Link>
              </section>
            </div>
            <p className="meta" style={{"fontSize":"13px"} as any}>{"Bezra helps you think. It doesn't decide for you."}</p>
            </>
            )}
          </main>

        </div>
      </div>
      <Tour page="Overview" />
    </>
  );
}

const OV_CSS = `.v2 .ov .ovcard{background:#fff;border-radius:24px;padding:22px;display:flex;flex-direction:column;gap:12px;min-width:0}
.v2 .ov .ovh1{font-size:34px;font-weight:600;letter-spacing:-.8px;margin:0}
.v2 .ov .ovgo{align-self:flex-start;margin-top:auto;padding-top:6px;font-size:14px;font-weight:600;color:var(--green);display:inline-flex;gap:6px;align-items:center}
.v2 .ov .ovgo:hover{text-decoration:underline}
[dir=rtl] .v2 .ov .ovgo span{transform:scaleX(-1)}
.v2 .ov .ovrot{display:flex;flex-direction:column;gap:4px;padding:12px 14px;border-radius:14px;background:var(--inset)}
.v2 .ov .ovrot.own{background:var(--sun-tint)}
.v2 .ov .ovrotnums{display:flex;gap:16px;flex-wrap:wrap;margin-top:4px;font-size:13px}
.v2 .ov .ovrotnums b{font-size:16px}
.v2 .ov .ovh2{font-size:18px;font-weight:600;margin:0}
.v2 .ov .ovlead{font-size:19px;line-height:1.45;margin:0;max-width:820px}
.v2 .ov .ovlist{margin:0;padding-inline-start:22px;display:flex;flex-direction:column;gap:4px;font-size:16px}
.v2 .ov .ovyou{display:grid;grid-template-columns:1fr 1fr;gap:24px;border-inline-start:4px solid #2F6B3A}
@media (max-width:820px){.v2 .ov .ovyou{grid-template-columns:1fr}}
.v2 .ov .lab{font-size:12px;letter-spacing:.08em;font-weight:700;color:#6B6A63}
.v2 .ov .ovchip{height:36px;padding:0 14px;border-radius:999px;background:#F1F0EC;display:inline-flex;align-items:center;font-size:14px;font-weight:600}
.v2 .ov .ovgrid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.v2 .ov .ovgrid2.top{align-items:start}
.v2 .ov .ovmap{display:grid;grid-template-columns:repeat(var(--cols,4),1fr);gap:4px;max-width:420px;width:100%}
.v2 .ov .ovsq{aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;color:#17251C}
.v2 .ov .ovsq.good{background:#4E8A3A;color:#fff}
.v2 .ov .ovsq.normal{background:#DDE3B0}
.v2 .ov .ovsq.less{background:#F29B1E}
.v2 .ov .ovsq.outside{background:transparent}
.v2 .ov .ovleg{display:inline-flex;align-items:center;gap:6px;font-size:13px}
.v2 .ov .ovleg i{width:14px;height:14px;border-radius:4px;display:inline-block;aspect-ratio:auto}
.v2 .ov .ovpill{align-self:flex-start;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.v2 .ov .ovrow .ovpill{align-self:center}
.v2 .ov .ovpill.now{background:#FDECD3;color:#8A4B06}
.v2 .ov .ovpill.late{background:#FBE0DA;color:#9A2F1C}
.v2 .ov .ovpill.ok{background:#DCEFD9;color:#1F5E2E}
.v2 .ov .ovpill.plan{background:#ECEBE6;color:#4A514C}
.v2 .ov .ovamount{display:flex;justify-content:space-between;align-items:baseline;gap:12px;background:#F6F5F1;border-radius:14px;padding:12px 14px}
.v2 .ov .ovamount b{font-size:20px}
.v2 .ov .ovwhy{border:1px solid #ECEBE6;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px}
.v2 .ov .ovwhy ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.v2 .ov .ovwhy li{display:flex;gap:8px;align-items:flex-start;font-size:14px}
.v2 .ov .ovwhy li svg{flex:0 0 auto;margin-top:2px}
.v2 .ov .ovtiles{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.v2 .ov .ovtile{border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:6px;min-height:150px;background:#fff}
.v2 .ov .ovtile.green{background:linear-gradient(160deg,#5FA845,#2E7D45);color:#fff}
.v2 .ov .ovtile.orange{background:linear-gradient(160deg,#F7A33A,#D96A16);color:#fff}
.v2 .ov .ovtl{font-size:13px;font-weight:600}
.v2 .ov .ovts{font-size:13px}
.v2 .ov .ovbig{font-size:48px;font-weight:700;line-height:1;letter-spacing:-1px;margin-top:auto;font-variant-numeric:tabular-nums}
.v2 .ov .ovrow{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-top:1px solid #F0EFEA}
.v2 .ov .ovrt{font-size:15px;font-weight:600}
.v2 .ov .ovrs{font-size:13px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v2 .ov .ovweek{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.v2 .ov .ovday{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 2px;border-radius:14px;background:#F6F5F1;min-width:0}
.v2 .ov .ovday.water{background:#E3F0F7}
@media (max-width:820px){.v2 .ov .ovgrid2{grid-template-columns:1fr}.v2 .ov .ovtiles{grid-template-columns:1fr 1fr;gap:12px}.v2 .ov .ovh1{font-size:28px}.v2 .ov .ovbig{font-size:36px}.v2 .ov .ovcard{padding:18px}.v2 .ov .ovweek{gap:4px}.v2 .ov .ovday{padding:8px 0;font-size:13px}}
`;
