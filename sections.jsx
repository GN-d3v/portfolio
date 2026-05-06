// sections.jsx — section components

const { useState, useEffect, useRef } = React;

// ─── HERO ─────────────────────────────────────────────────────────
function Hero({ t }) {
  const h = t.hero;
  const [step, setStep] = useState(0);
  const [glyphIn, setGlyphIn] = useState(false);

  useEffect(() => {
    setGlyphIn(false);
    const a = setTimeout(() => setGlyphIn(true), 300);
    return () => clearTimeout(a);
  }, [t]);

  useEffect(() => {
    setStep(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setStep(i);
      if (i >= h.bootLines.length) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [t]);

  return (
    <section id="hero" className="scene hero" data-screen-label="01 Hero">
      <div>
        <div className="reveal in" style={{ fontSize: 11, color: "var(--fg-mute)", letterSpacing: "0.12em", marginBottom: 22 }}>
          {h.preTag}
        </div>
        <h1 className={"hero-glyph" + (glyphIn ? " in" : "")} style={{ margin: 0 }}>
          GN&nbsp;d<span className="three">3</span>v
          <span className="underline" />
        </h1>
        <p className="hero-tagline">
          {h.tagPre}<em>{h.tagEm}</em>{h.tagPost}
        </p>
        <div className="hero-meta">
          {h.meta.map((m, i) => (
            <div key={i}>
              {m.k}
              <b>{m.v}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="reveal in">
        <div className="term-window">
          <div className="term-chrome">
            <div className="lights"><span className="r"></span><span className="y"></span><span className="g"></span></div>
            <div className="title">~/gn-d3v · zsh</div>
          </div>
          <div className="term-body">
            {h.bootLines.slice(0, step).map((line, i) => {
              if (line.p) return <div key={i}><span className="prompt">$</span> <span className="com">{line.t}</span></div>;
              if (line.ok) return <div key={i} className="out"><span className="ok">[ok]</span> {line.ok.replace("OK · ", "")}</div>;
              return <div key={i} className="out" style={{ whiteSpace: "pre-wrap" }}>{line.o}</div>;
            })}
            {step >= h.bootLines.length && <div><span className="prompt">$</span> <span className="cursor"></span></div>}
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: "var(--fg-mute)", textAlign: "right", letterSpacing: "0.08em" }}>
          {h.scrollHint}
        </div>
      </div>
    </section>
  );
}

// ─── MANIFESTO ────────────────────────────────────────────────────
function Manifesto({ t }) {
  const m = t.manifesto;
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const wh = window.innerHeight;
      // start when section enters viewport, finish when it's near top
      const total = r.height + wh * 0.4;
      const passed = wh - r.top;
      const p = Math.max(0, Math.min(1, passed / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // total words across parts to drive progressive lighting
  const allWords = m.titleParts.flatMap((p) => p.t.split(" ").map((w) => ({ w, part: p })));
  const litCount = Math.floor(progress * allWords.length);

  return (
    <section id="manifesto" className="scene" data-screen-label="02 Manifesto" ref={ref}>
      <div className="sec-label">{m.label}</div>
      <div className="manifesto-grid">
        <aside className="manifesto-aside reveal">
          <div style={{ marginBottom: 14, color: "var(--fg)", fontWeight: 500 }}>// principles</div>
          {m.principles.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span className="k">{p.k}</span>&nbsp;&nbsp;{p.t}
            </div>
          ))}
        </aside>
        <div className="manifesto-text">
          {allWords.map((aw, i) => {
            const isGreen = aw.part.green && aw.part.green.includes(aw.w);
            const isAmber = aw.part.amber && aw.part.amber.includes(aw.w);
            const lit = i < litCount;
            return (
              <span key={i} className={"word" + (lit ? " lit" : "") + (lit && isGreen ? " green" : "") + (lit && isAmber ? " amber" : "")}>
                {aw.w}{i < allWords.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────
function Services({ t }) {
  const s = t.services;
  return (
    <section id="services" className="scene" data-screen-label="03 Services">
      <div className="sec-label">{s.label}</div>
      <h2 className="reveal" style={{ fontFamily: "var(--display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px 0" }}>
        {s.heading}
      </h2>
      <p className="reveal" style={{ color: "var(--fg-dim)", maxWidth: 600, fontSize: 14 }}>{s.headingSub}</p>
      <div className="services-grid">
        {s.items.map((it, i) => (
          <div className="service reveal" key={i}>
            <div className="num">{it.num}</div>
            <div className="glyph">{it.glyph}</div>
            <h3><span className="pre">{it.pre}</span>{it.name}</h3>
            <p>{it.desc}</p>
            <div className="tags">
              {it.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────
function Projects({ t }) {
  const p = t.projects;
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="scene" data-screen-label="04 Projects" style={{ background: "var(--bg-2)" }}>
      <div className="sec-label">{p.label}</div>
      <h2 className="reveal" style={{ fontFamily: "var(--display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px 0" }}>
        {p.heading}
      </h2>
      <p className="reveal" style={{ color: "var(--fg-dim)", maxWidth: 620, fontSize: 14 }}>{p.headingSub}</p>
      <div className="projects-list">
        {p.items.map((it, i) => (
          <a
            key={i}
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project reveal"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              ...(active !== null && active !== i ? { opacity: 0.4 } : {}),
              textDecoration: "none",
              color: "inherit",
              display: "grid",
              cursor: "pointer",
            }}
          >
            <div className="pnum">[{it.num}]</div>
            <div className="pmain">
              <span className="ptag">{it.tag}</span>
              <h4>{it.name}</h4>
              <div className="desc">{it.desc}</div>
            </div>
            <div className="pstack">
              {it.stack.map((s, j) => (
                <span key={j}>{s}{j < it.stack.length - 1 ? " ·" : ""}</span>
              ))}
            </div>
            <div className="pyear" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {it.year}
              <span style={{ fontSize: 12, opacity: 0.5 }}>↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────
function Team({ t }) {
  const tm = t.team;
  return (
    <section id="team" className="scene" data-screen-label="05 Team">
      <div className="sec-label">{tm.label}</div>
      <h2 className="reveal" style={{ fontFamily: "var(--display)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 10px 0" }}>
        {tm.heading}
      </h2>
      <p className="reveal" style={{ color: "var(--fg-dim)", maxWidth: 620, fontSize: 14 }}>{tm.headingSub}</p>
      <div className="team-grid">
        {tm.members.map((mb, i) => (
          <div className="member reveal" key={i}>
            <div className="avatar">
              <div className="matrix">{makeMatrix(i + 1)}</div>
              <div className="glyph">{mb.glyph}</div>
            </div>
            <div className="body">
              <h5>{mb.name}</h5>
              <div className="role">{mb.role}</div>
              <div className="bio">{mb.bio}</div>
              <div className="stats">
                {mb.stats.map((st, j) => (
                  <div key={j}>{st.k}<b>{st.v}</b></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────
function Contact({ t }) {
  const c = t.contact;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://formsubmit.co/ajax/gnd3vs@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Nuovo contatto da ${form.name}`,
          nome: form.name,
          email: form.email,
          azienda: form.company || "Non specificata",
          budget: form.budget || "Non specificato",
          messaggio: form.msg,
        }),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("C'è stato un errore. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="scene" data-screen-label="06 Contact" style={{ background: "var(--bg-2)" }}>
      <div className="sec-label">{c.label}</div>
      <div className="contact-grid">
        <div className="contact-left reveal">
          <h2>{c.h2Pre}<br /><em>{c.h2Em}</em></h2>
          <p>{c.desc}</p>
          <div className="contact-info">
            {c.info.map((it, i) => (
              <div className="ci-row" key={i}>
                <div className="k">{it.k}</div>
                <div className="v"><a href={it.link}>{it.v}</a></div>
              </div>
            ))}
          </div>
        </div>
        <form className="form reveal" onSubmit={onSubmit}>
          {sent ? (
            <div className="submitted">
              <div className="ok">✓</div>
              <div style={{ marginTop: 10 }}>{c.form.ok}</div>
              <div style={{ color: "var(--fg-mute)", fontSize: 12, marginTop: 6 }}>{c.form.ok2}</div>
            </div>
          ) : (
            <>
              <div className="field">
                <label>{c.form.name} <span className="req">*</span></label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={c.form.nameP} />
              </div>
              <div className="field">
                <label>{c.form.email} <span className="req">*</span></label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={c.form.emailP} />
              </div>
              <div className="field">
                <label>{c.form.company}</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder={c.form.companyP} />
              </div>
              <div className="field">
                <label>{c.form.budget}</label>
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                  <option value="">—</option>
                  {c.form.budgetOptions.map((o, i) => <option key={i} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{c.form.msg} <span className="req">*</span></label>
                <textarea required value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder={c.form.msgP} />
              </div>
              <div className="submit-row">
                <span className="hint">{c.form.hint}</span>
                <button type="submit" className="submit" disabled={loading}>
                  {loading ? "invio..." : c.form.cta}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Manifesto, Services, Projects, Team, Contact });
