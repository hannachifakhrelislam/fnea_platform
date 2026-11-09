(() => {
"use strict";

/* ====== إعدادات تعدّلها الإدارة ====== */
const CA_CONFIG = {
  deadline: "2026-12-20T23:59:59+01:00", // نهاية التسجيل (غيّر التاريخ هنا فقط)
  scriptUrl: "PASTE_CA_SCRIPT_URL_HERE"  // رابط Apps Script الخاص بسجل المسابقة
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ca = $("#ca"), joinView = $("#view-join");
let ready = false;

/* ====== المحتوى ====== */
const TALENTS = [
  ["🎥", "Video Creator", "صناعة الفيديو والمحتوى القصير."],
  ["🎙️", "Presenter", "التقديم، الحوار والبودكاست."],
  ["📸", "Visual Creator", "التصوير، المونتاج والإخراج."],
  ["💡", "Creative Content", "المحتوى الثقافي، العلمي، التوعوي والطلابي."]
];
const STAGES = [
  ["التسجيل", "املأ استمارة المشاركة في خمس خطوات قصيرة، وأرفق رابط أفضل أعمالك."],
  ["مراجعة المشاركات", "يراجع المنظمون الطلبات والأعمال المرسلة للتأكد من اكتمالها."],
  ["اختيار المتأهلين", "يُعلَن عن الطلبة المتأهلين إلى مرحلة التحديات."],
  ["التحديات", "يخوض المتأهلون تحديات إبداعية تختبر الفكرة وجودة الإنتاج والحضور."],
  ["النهائي", "تُعرض الأعمال النهائية أمام لجنة التحكيم."],
  ["التتويج 🏆", "إعلان الفائزين وتسليم الجوائز والشهادات. تُعلَن المواعيد الدقيقة لاحقاً عبر المنتدى."]
];
const TIPS = [
  ["💡", "الفكرة أهم من المعدات", "لا تحتاج كاميرا احترافية. فكرة قوية بهاتفك أفضل من تصوير ممتاز بدون فكرة.", "ابدأ بسؤال واحد: ما الذي سيستفيده المشاهد أو يشعر به بعد مشاهدة عملك؟"],
  ["🎬", "أول ثوانٍ مهمة", "اجذب انتباه المشاهد منذ بداية المحتوى.", "ابدأ بالمشهد الأقوى أو بسؤال مباشر، واحذف أي مقدمة لا تضيف شيئاً."],
  ["🧠", "كن أصلياً", "لا تقلد الآخرين. أظهر أسلوبك أنت.", "اللجنة ترى أعمالاً كثيرة متشابهة. ما يميزك هو زاويتك ولغتك وطريقتك."],
  ["🎯", "احكِ قصة", "المحتوى القوي يجعل المشاهد يريد معرفة النهاية.", "لكل عمل بداية وصراع ونهاية، حتى لو كان الفيديو دقيقة واحدة."],
  ["🎙️", "اهتم بالصوت", "جودة الصوت جزء أساسي من جودة الفيديو.", "صوّر في مكان هادئ وقرّب الميكروفون من الفم. الصوت الواضح يُغني عن كثير من الإضاءة."],
  ["✨", "التفاصيل تصنع الفرق", "الإضاءة، الكادر، المونتاج، النص والإيقاع كلها مهمة.", "راجع عملك مرتين قبل الإرسال: مرة للصورة والصوت، ومرة للإيقاع والنص."]
];
const QUIZ = [
  "هل لديك فكرة محتوى تستطيع تنفيذها؟",
  "هل تستطيع إنتاج فيديو قصير؟",
  "هل لديك عمل سابق؟",
  "هل تستطيع الالتزام بموعد التحديات؟",
  "هل أنت مستعد لإظهار أسلوبك الخاص؟"
];
const CRIT = [["الإبداع والفكرة", 25], ["جودة الإنتاج", 20], ["القيمة والمضمون", 20], ["الحضور والتقديم", 15], ["السرد والسيناريو", 10], ["التفاعل الجماهيري", 10]];
const FAQ = [
  ["من يمكنه المشاركة؟", "المسابقة موجهة لطلبة جامعة 8 ماي 1945 قالمة."],
  ["هل المشاركة مجانية؟", "نعم، التسجيل في المسابقة مجاني."],
  ["هل أحتاج كاميرا احترافية؟", "لا. المهم هو الفكرة والتنفيذ، وليس سعر المعدات."],
  ["هل يمكنني المشاركة بالهاتف؟", "نعم، يمكنك تصوير عملك وتنفيذه بهاتفك."],
  ["هل أستطيع المشاركة بأكثر من نوع محتوى؟", "نعم، يمكنك اختيار أكثر من نوع في الخطوة الثانية من التسجيل."],
  ["كيف يتم اختيار الفائزين؟", "تقيّم لجنة التحكيم الأعمال وفق المعايير المعروضة في قسم «معايير التقييم»."],
  ["هل يوجد تصويت جماهيري؟", "التفاعل الجماهيري يمثل 10% من التقييم. تُعلَن تفاصيله مع مرحلة التحديات."],
  ["ماذا يحدث بعد التسجيل؟", "تصل مشاركتك إلى المنظمين للمراجعة، ثم يتواصلون معك عبر الهاتف أو البريد."]
];
const LEVELS = ["ليسانس 1", "ليسانس 2", "ليسانس 3", "ماستر 1", "ماستر 2", "دكتوراه", "أخرى"];
const CATS = ["Video Creator", "Photographer", "Presenter", "Podcaster", "Graphic Designer", "Other"];
const FACS = typeof FACULTIES !== "undefined" ? FACULTIES : [];

/* ====== بناء الصفحة ====== */
const acc = (head, body, extra = "") => `<div class="ca-acc ca-rv"><button type="button" data-acc aria-expanded="false">${head}<i aria-hidden="true">+</i></button><div class="ca-more"><div>${body}</div></div></div>${extra}`;

function build() {
  ca.innerHTML = `
<section class="ca-hero" aria-labelledby="ca-h1"><canvas class="ca-fx" aria-hidden="true"></canvas><div class="ca-orb" aria-hidden="true"></div>
 <div class="ca-hero-in">
  <p class="ca-eyebrow">جامعة 8 ماي 1945 قالمة × المنتدى الوطني للطلبة الجزائريين FNEA</p>
  <h2 class="ca-title" id="ca-h1"><span>UM1945</span><b>CREATOR AWARDS</b></h2>
  <p class="ca-sub">جوائز صُنّاع المحتوى الجامعي</p>
  <p class="ca-quote">«أبدع. أثّر. اترك بصمتك.»</p>
  <div class="ca-cta"><button type="button" class="ca-btn gold" data-go="ca-register">سجّل في المسابقة</button><button type="button" class="ca-btn ghost" data-go="ca-about">اكتشف المسابقة ↓</button></div>
  <p class="ca-count-lbl" id="ca-lbl">ينتهي التسجيل بعد</p>
  <div class="ca-count" id="ca-count" role="timer"></div>
 </div></section>

<div class="ca-wrap">
<section class="ca-sec" id="ca-about"><h3 class="ca-rv">ما هي UM1945 Creator Awards؟</h3>
 <p class="ca-lead ca-rv">مسابقة إبداعية موجهة لطلبة جامعة 8 ماي 1945 قالمة، تهدف إلى اكتشاف وتشجيع المواهب الطلابية في صناعة المحتوى الرقمي، من خلال تحديات تجمع بين الإبداع، جودة الإنتاج، القيمة والتأثير.</p>
 <div class="ca-grid ca-g2 ca-g4">${TALENTS.map(t => `<article class="ca-card ca-rv"><em aria-hidden="true">${t[0]}</em><h4>${t[1]}</h4><p>${t[2]}</p></article>`).join("")}</div></section>

<section class="ca-sec"><h3 class="ca-rv">كيف تسير المسابقة؟</h3><p class="ca-lead ca-rv">ست مراحل. اضغط على أي مرحلة لتعرف ما يحدث فيها.</p>
 <div class="ca-list">${STAGES.map((s, i) => acc(`<span class="ca-n">${i + 1}</span>${s[0]}`, s[1])).join("")}</div></section>

<section class="ca-sec"><h3 class="ca-rv">كيف تقدم مشاركة قوية؟</h3><p class="ca-lead ca-rv">ست نصائح قبل أن تصوّر. اضغط على أي بطاقة لتقرأ التفاصيل.</p>
 <div class="ca-list ca-g2 ca-grid">${TIPS.map(t => acc(`<span aria-hidden="true">${t[0]}</span>${t[1]}`, `<p>${t[2]}</p><p style="margin-top:8px;color:var(--au2)">${t[3]}</p>`)).join("")}</div></section>

<section class="ca-sec"><h3 class="ca-rv">هل أنت مستعد للمنافسة؟</h3><p class="ca-lead ca-rv">خمسة أسئلة سريعة. أجب بصدق.</p>
 <div class="ca-quiz ca-rv" id="ca-quiz">${QUIZ.map((q, i) => `<div class="ca-q" data-i="${i}"><p>${i + 1}. ${q}</p><div class="ca-yn"><button type="button" aria-pressed="false" data-v="1">نعم</button><button type="button" aria-pressed="false" data-v="0">لا</button></div></div>`).join("")}
  <div class="ca-res" id="ca-res" hidden aria-live="polite"><svg class="ca-ring" viewBox="0 0 80 80" aria-hidden="true"><circle class="bg" cx="40" cy="40" r="34"/><circle class="fg" cx="40" cy="40" r="34"/></svg><div><h4></h4><p></p></div></div></div></section>

<section class="ca-sec"><h3 class="ca-rv">معايير التقييم</h3><p class="ca-lead ca-rv">هكذا تُقيَّم الأعمال من 100%.</p>
 <div class="ca-crit ca-rv" id="ca-crit">${CRIT.map(c => `<div><span>${c[0]}<b>${c[1]}%</b></span><div class="ca-bar" role="img" aria-label="${c[0]} ${c[1]}%"><i style="--w:${c[1] * 4}%"></i></div></div>`).join("")}</div></section>

<section class="ca-sec"><h3 class="ca-rv">الجوائز</h3>
 <div class="ca-grid ca-g3 ca-podium">
  <article class="ca-card p1 ca-rv"><em>🥇</em><h4>المركز الأول</h4><p>أفضل صانع محتوى جامعي</p></article>
  <article class="ca-card ca-rv"><em>🥈</em><h4>المركز الثاني</h4></article>
  <article class="ca-card ca-rv"><em>🥉</em><h4>المركز الثالث</h4></article></div>
 <p class="ca-note ca-rv">جوائز قيمة + شهادات تقديرية + فرصة للتميز ضمن مجتمع صناع المحتوى الجامعي. وتُعلَن الجوائز الفرعية لاحقاً.</p></section>

<section class="ca-sec" id="ca-register"><h3 class="ca-rv">سجّل مشاركتك</h3><p class="ca-lead ca-rv">خمس خطوات قصيرة. بياناتك تُحفظ تلقائياً على هذا الجهاز إلى أن تُرسل.</p>
 <div class="ca-reg ca-rv" id="ca-reg"></div></section>

<section class="ca-sec"><h3 class="ca-rv">أسئلة شائعة</h3><div class="ca-list">${FAQ.map(f => acc(f[0], f[1])).join("")}</div></section>
</div>

<section class="ca-final"><h3 class="ca-rv">جاهز لتشارك؟</h3><p class="ca-rv">«موهبتك تستحق أن تُرى.»</p><button type="button" class="ca-btn gold ca-rv" data-go="ca-register" style="font-size:22px;min-height:60px">سجّل الآن 🚀</button></section>
<button type="button" class="ca-top" id="ca-top" aria-label="العودة إلى الأعلى">↑</button><div class="ca-toast" id="ca-toast" role="status"></div>`;
}

/* ====== أدوات ====== */
function toast(m) { const t = $("#ca-toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }
function go(id) { const el = document.getElementById(id); if (!el) return; el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }

function countdown() {
  const box = $("#ca-count"), end = new Date(CA_CONFIG.deadline).getTime();
  const u = [["يوم", 864e5], ["ساعة", 36e5], ["دقيقة", 6e4], ["ثانية", 1e3]];
  box.innerHTML = u.map(x => `<div><b>00</b><small>${x[0]}</small></div>`).join("");
  const nums = $$("b", box);
  function tick() {
    let d = end - Date.now();
    if (isNaN(end) || d <= 0) { box.innerHTML = '<span class="ca-count-end">انتهى التسجيل</span>'; $("#ca-lbl").hidden = true; closeReg(); clearInterval(tick.id); return; }
    u.forEach((x, i) => { const n = Math.floor(d / x[1]); d -= n * x[1]; nums[i].textContent = String(n).padStart(2, "0"); });
  }
  tick(); tick.id = setInterval(tick, 1000);
}

function hero() {
  const h = $(".ca-hero"), c = $(".ca-fx");
  if (reduce) return;
  if (matchMedia("(pointer:fine)").matches) h.addEventListener("pointermove", e => { const r = h.getBoundingClientRect(); h.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(2)); h.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(2)); });
  const x = c.getContext("2d"), N = innerWidth < 700 ? 20 : 46; let w, hh, ps = [], raf = 0;
  const size = () => { w = c.width = c.offsetWidth; hh = c.height = c.offsetHeight; ps = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * hh, r: Math.random() * 1.6 + .4, v: Math.random() * .25 + .06, a: Math.random() * .5 + .2 })); };
  const tick = () => { x.clearRect(0, 0, w, hh); for (const p of ps) { p.y -= p.v; if (p.y < -4) { p.y = hh + 4; p.x = Math.random() * w; } x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fillStyle = `rgba(212,175,55,${p.a})`; x.fill(); } raf = requestAnimationFrame(tick); };
  size(); addEventListener("resize", size);
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) tick(); }).observe(h);
}

function reveal() {
  const els = $$(".ca-rv,.ca-crit", ca);
  if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  els.forEach(e => io.observe(e));
}

function quiz() {
  const box = $("#ca-quiz"), ans = Array(QUIZ.length).fill(null), res = $("#ca-res");
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-v]"); if (!b) return;
    const i = +b.closest(".ca-q").dataset.i; ans[i] = +b.dataset.v;
    $$("button", b.parentNode).forEach(x => x.setAttribute("aria-pressed", x === b));
    if (ans.includes(null)) return;
    const s = ans.reduce((a, v) => a + v, 0), ok = s >= 4;
    $("h4", res).textContent = ok ? "🔥 أنت مستعد!" : "💡 لديك أساس جيد.";
    $("p", res).textContent = ok ? "يبدو أنك جاهز لخوض المنافسة." : "راجع نصائحنا وطوّر فكرتك قبل التسجيل.";
    res.hidden = false; const fg = $(".fg", res); fg.style.strokeDashoffset = 214;
    requestAnimationFrame(() => requestAnimationFrame(() => { res.classList.add("show"); fg.style.strokeDashoffset = 214 - 214 * s / ANS_MAX(); }));
    res.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  });
  const ANS_MAX = () => QUIZ.length;
}

/* ====== التسجيل متعدد الخطوات ====== */
const STEPS = [
  { t: "معلومات الطالب", f: ["fullName", "email", "phone", "faculty", "department", "level"] },
  { t: "أنت كصانع محتوى", cats: true },
  { t: "حضورك الرقمي", f: ["instagram", "tiktok", "youtube", "facebook", "portfolio"] },
  { t: "أعمالك", f: ["workUrl", "workDesc", "motivation"] },
  { t: "تأكيد الإرسال", sum: true }
];
const FIELDS = {
  fullName: ["الاسم واللقب", "text"], email: ["البريد الإلكتروني", "email"], phone: ["رقم الهاتف", "tel"],
  faculty: ["الكلية", "select", FACS], department: ["التخصص", "text"], level: ["المستوى الجامعي", "select", LEVELS],
  instagram: ["Instagram", "text", "@username أو رابط"], tiktok: ["TikTok", "text", "@username أو رابط"], youtube: ["YouTube", "text", "رابط القناة"],
  facebook: ["Facebook", "text", "رابط الصفحة أو الحساب"], portfolio: ["Portfolio / رابط", "text", "https://"],
  workUrl: ["رابط أفضل عمل سابق", "url", "https://"], workDesc: ["وصف مختصر للعمل", "area"], motivation: ["لماذا تريد المشاركة؟", "area"]
};
const min = (n, m) => v => v.length >= n ? "" : m;
const RULES = {
  fullName: v => /\S+\s+\S+/.test(v) ? "" : "اكتب الاسم واللقب كاملين.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "اكتب بريداً إلكترونياً صحيحاً.",
  phone: v => /^0[567]\d{8}$/.test(v) ? "" : "الهاتف يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام.",
  faculty: min(1, "اختر كليتك أو معهدك."), department: min(2, "اكتب تخصصك."), level: min(1, "اختر مستواك الجامعي."),
  workUrl: v => /^https?:\/\/\S+\.\S+/i.test(v) ? "" : "ضع رابطاً صحيحاً يبدأ بـ https://",
  workDesc: min(20, "اكتب 20 حرفاً على الأقل لوصف العمل."), motivation: min(20, "اكتب 20 حرفاً على الأقل.")
};
const SOCIAL = ["instagram", "tiktok", "youtube", "facebook", "portfolio"];
let D = { cats: [] }, step = 0, sending = false;
const K = "ca_draft", DONE = "ca_done";
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } }, del: k => { try { localStorage.removeItem(k); } catch (e) { } } };

function closeReg() { const r = $("#ca-reg"); if (r) r.innerHTML = '<div class="ca-ok"><h4 style="font:700 24px Reem Kufi">انتهى التسجيل</h4><p>شكراً لاهتمامك بالمسابقة.</p></div>'; }

function fieldHTML(n) {
  const [l, t, o] = FIELDS[n], v = D[n] || "";
  let c;
  if (t === "select") c = `<select id="f-${n}" name="${n}"><option value="">اختر</option>${o.map(x => `<option${x === v ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
  else if (t === "area") c = `<textarea id="f-${n}" name="${n}" rows="4">${esc(v)}</textarea>`;
  else c = `<input id="f-${n}" name="${n}" type="${t}" value="${esc(v)}" ${o && t !== "select" ? `placeholder="${esc(o)}"` : ""} ${t === "tel" ? 'inputmode="numeric" maxlength="10" autocomplete="tel"' : ""} ${["email", "url", "tel"].includes(t) || SOCIAL.includes(n) ? 'dir="ltr"' : ""}>`;
  const wide = ["workDesc", "motivation", "workUrl", "email"].includes(n) ? " wide" : "";
  return `<label class="f${wide}">${l}${c}<small class="ca-err" id="e-${n}" role="alert"></small></label>`;
}

function renderReg() {
  const reg = $("#ca-reg"), s = STEPS[step];
  let body = "";
  if (s.f) body = `<div class="ca-fields ${step === 0 ? "two" : ""}">${s.f.map(fieldHTML).join("")}</div>`;
  if (s.cats) body = `<div class="ca-fields"><p class="ca-lead" style="margin:0">اختر نوعاً واحداً على الأقل، ويمكنك اختيار أكثر.</p><div class="ca-chips" role="group" aria-label="نوع المحتوى">${CATS.map(c => `<label class="ca-chip"><input type="checkbox" value="${c}"${D.cats.includes(c) ? " checked" : ""}><span>${c}</span></label>`).join("")}</div><small class="ca-err" id="e-cats" role="alert"></small></div>`;
  if (step === 2) body = body.replace('<div class="ca-fields ">', '<div class="ca-fields"><p class="ca-lead" style="margin:0">أضف حساباً واحداً على الأقل.</p>') + '<small class="ca-err" id="e-social" role="alert"></small>';
  if (s.sum) {
    const rows = [["الاسم", D.fullName], ["البريد", D.email], ["الهاتف", D.phone], ["الكلية", D.faculty], ["التخصص", D.department], ["المستوى", D.level], ["نوع المحتوى", D.cats.join("، ")], ...SOCIAL.filter(k => D[k]).map(k => [FIELDS[k][0], D[k]]), ["أفضل عمل", D.workUrl], ["وصف العمل", D.workDesc], ["سبب المشاركة", D.motivation]];
    body = `<dl class="ca-sum ca-fields">${rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1] || "—")}</dd>`).join("")}</dl>`;
  }
  reg.innerHTML = `<div class="ca-prog" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${step + 1}"><i style="width:${(step + 1) * 20}%"></i></div>
   <div class="ca-steps">${STEPS.map((_, i) => `<span class="${i < step ? "ok" : i === step ? "on" : ""}" ${i === step ? 'aria-current="step"' : ""}>${i < step ? "✓" : i + 1}</span>`).join("")}<h4>${s.t}</h4></div>
   <form id="ca-form" novalidate>${body}<div class="ca-nav">${step ? '<button type="button" class="ca-btn ghost" data-prev>رجوع</button>' : ""}<button type="${s.sum ? "submit" : "button"}" class="ca-btn gold" ${s.sum ? 'id="ca-send"' : "data-next"}>${s.sum ? "تأكيد وإرسال المشاركة" : "التالي"}</button></div></form>`;
  store.set(K, JSON.stringify({ D, step }));
}

function check(n) {
  const v = (D[n] || "").trim(), m = RULES[n] ? RULES[n](v) : "", i = document.getElementById("f-" + n), e = document.getElementById("e-" + n);
  if (e) e.textContent = m; if (i) i.classList.toggle("bad", !!m);
  return !m;
}
function validStep() {
  const s = STEPS[step]; let ok = true, first = null;
  (s.f || []).forEach(n => { if (RULES[n] && !check(n)) { ok = false; first = first || document.getElementById("f-" + n); } });
  if (s.cats && !D.cats.length) { ok = false; $("#e-cats").textContent = "اختر نوع محتوى واحداً على الأقل."; }
  if (step === 2) { const has = SOCIAL.some(k => (D[k] || "").trim().length >= 3); $("#e-social").textContent = has ? "" : "أضف حساباً واحداً على الأقل."; if (!has) { ok = false; first = first || $("#f-instagram"); } }
  if (first) first.focus();
  return ok;
}

function regEvents() {
  const reg = $("#ca-reg");
  reg.addEventListener("input", e => {
    const t = e.target, n = t.name; if (!n) return;
    if (t.type === "checkbox") { D.cats = $$("input:checked", reg).map(x => x.value); $("#e-cats").textContent = ""; }
    else { if (n === "phone") t.value = t.value.replace(/\D/g, ""); D[n] = t.value; if (t.classList.contains("bad")) check(n); }
    store.set(K, JSON.stringify({ D, step }));
  });
  reg.addEventListener("change", e => { if (e.target.tagName === "SELECT") { D[e.target.name] = e.target.value; check(e.target.name); store.set(K, JSON.stringify({ D, step })); } });
  reg.addEventListener("focusout", e => { const n = e.target.name; if (n && RULES[n] && (D[n] || "").length) check(n); });
  reg.addEventListener("click", e => {
    if (e.target.closest("[data-next]")) { if (validStep()) { step++; renderReg(); go("ca-register"); } }
    if (e.target.closest("[data-prev]")) { step--; renderReg(); go("ca-register"); }
  });
  reg.addEventListener("submit", async e => {
    e.preventDefault(); if (sending) return;
    if (store.get(DONE)) return toast("سبق أن أرسلت مشاركتك من هذا الجهاز.");
    if (CA_CONFIG.scriptUrl.startsWith("PASTE")) return toast("رابط استقبال المشاركات لم يُضبط بعد.");
    sending = true; const b = $("#ca-send"); b.disabled = true; b.textContent = "جارٍ الإرسال…";
    const p = { type: "creator_awards", ...D, categories: D.cats.join(", "), status: "pending", submittedAt: new Date().toISOString() }; delete p.cats;
    try {
      await fetch(CA_CONFIG.scriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) });
      store.set(DONE, "1"); store.del(K);
      reg.innerHTML = '<div class="ca-ok" role="status"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42"/><path d="M30 52l14 14 27-30"/></svg><h4 style="font:700 26px Reem Kufi">تم استلام مشاركتك</h4><p style="color:var(--mu)">سيتواصل معك المنظمون عبر الهاتف أو البريد الإلكتروني.</p></div>';
    } catch (err) { sending = false; b.disabled = false; b.textContent = "تأكيد وإرسال المشاركة"; toast("تعذر الإرسال. تحقق من اتصالك وأعد المحاولة."); }
  });
}

/* ====== التهيئة والتنقل ====== */
function init() {
  ready = true; build();
  try { const d = JSON.parse(store.get(K) || "null"); if (d && d.D) { D = { cats: [], ...d.D }; step = Math.min(d.step || 0, 3); } } catch (e) { }
  if (store.get(DONE)) $("#ca-reg").innerHTML = '<div class="ca-ok"><h4 style="font:700 24px Reem Kufi">سبق أن أرسلت مشاركتك ✓</h4><p style="color:var(--mu)">سيتواصل معك المنظمون قريباً.</p></div>';
  else { renderReg(); regEvents(); }
  countdown(); hero(); quiz();
  ca.addEventListener("click", e => {
    const a = e.target.closest("[data-acc]"); if (a) { const p = a.parentNode, o = p.classList.toggle("open"); a.setAttribute("aria-expanded", o); }
    const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go);
    if (e.target.closest("#ca-top")) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  const top = $("#ca-top"); addEventListener("scroll", () => top.classList.toggle("show", scrollY > 700), { passive: true });
  reveal();
}

function route() {
  const on = location.hash === "#creator-awards";
  if (on && !ready) init();
  ca.hidden = !on; joinView.hidden = on; document.body.classList.toggle("ca-on", on);
  $$(".tabs a").forEach(a => (a.getAttribute("href") === (on ? "#creator-awards" : "#join")) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  scrollTo(0, 0);
}
addEventListener("hashchange", route); route();
})();
