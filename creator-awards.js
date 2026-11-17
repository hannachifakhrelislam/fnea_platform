(() => {
"use strict";

/* =====================================================================
   CA_CONFIG — المصدر الوحيد لبيانات المسابقة. عدّل هنا فقط.
   - في النصوص: {regOpen} {regClose} {training} {deadline} {top8} {opening}
     {challenges} {finale} تتحول تلقائيا إلى تاريخ منسق، و {ig} إلى حساب Instagram.
   ===================================================================== */
const CA_CONFIG = {
  /* رابط Apps Script الخاص بسجل المسابقة (كما كان) */
  scriptUrl: "https://script.google.com/macros/s/AKfycbwTyXCdO2WP4UsVxPcWYAvS2DVAuzgeD6g3uO8zvutwRhz8WnGIU4i_BpvgHF85BmcQ/exec",

  /* توقيت الجزائر (ثابت +01:00 طوال السنة) */
  timezone: "+01:00",

  /* true: التسجيل لا يعمل إلا بين regOpen و regClose. false: يعمل دائما (للتجربة) */
  enforceRegistrationWindow: true,

  /* للاختبار فقط: افتح الصفحة بـ ?ca_now=2026-11-16T12:00#creator-awards لمحاكاة تاريخ.
     اجعلها null قبل النشر النهائي لتعطيل الميزة. */
  debugNowParam: "ca_now",

  /* Instagram: إذا تركت url فارغا يُبنى الرابط تلقائيا من الحساب. ضع الرابط الرسمي هنا لتثبيته. */
  instagram: { handle: "@fnea_guelma", url: "" },

  /* التواريخ الرسمية (YYYY-MM-DD) */
  dates: {
    regOpen: "2026-11-15", regClose: "2026-11-22", training: "2026-11-24", deadline: "2026-12-01",
    top8: "2026-12-06", opening: "2026-12-07", challenges: "2026-12-08", finale: "2026-12-09"
  },

  timeline: [
    { date: "regOpen", icon: "📝", title: "إطلاق التسجيلات" },
    { date: "regClose", icon: "🔒", title: "غلق التسجيلات" },
    { date: "training", icon: "🎓", title: "الدورة التكوينية + انطلاق المنافسة", text: "حضور الدورة إلزامي." },
    { date: "deadline", icon: "⏰", title: "آخر أجل لإرسال الأعمال", text: "عبر Instagram {ig}." },
    { date: "top8", icon: "⭐", title: "إعلان أفضل 08 أعمال" },
    { date: "opening", icon: "🎤", title: "الافتتاح + الورشات التكوينية" },
    { date: "challenges", icon: "⚡", title: "التحديات العامة" },
    { date: "finale", icon: "🏆", title: "حفل الاختتام + إعلان الفائزين" }
  ],

  formats: [["🎬", "فيلم قصير"], ["🎥", "وثائقي"], ["😂", "محتوى كوميدي"], ["🎙️", "مقابلة"], ["📱", "Reel إبداعي"], ["🎨", "Storytelling"], ["💡", "فكرة مبتكرة"]],

  requirements: [
    ["👤", "المشاركة", "فردية فقط."],
    ["🏫", "الجامعة", "المشارك طالب بجامعة 8 ماي 1945 – قالمة."],
    ["🎯", "الموضوع", "يجب أن يكون العمل مرتبطًا بالجامعة."],
    ["🎬", "المدة", "لا تتجاوز 3 دقائق."],
    ["🎨", "الأسلوب", "حر، مع احترام ضوابط المسابقة."],
    ["📲", "التسليم", "الفيديو لا يتم رفعه أثناء التسجيل."]
  ],

  workshops: [["📷", "التصوير"], ["🎬", "المونتاج"], ["✍️", "كتابة السيناريو"]],

  /* شركاء التكوين: ضع مسار الشعار في logo (مثال: "Assets/clubs/creativa.png"). null = مكان محجوز */
  clubs: [
    { name: "نادي كرياتيفا للفنون البصرية", logo: null },
    { name: "نادي بيكوم للإعلام والاتصال", logo: null },
    { name: "نادي Tech Geeks للإعلام الآلي", logo: null }
  ],

  journey: [
    { title: "اختر فكرتك", text: "اختر فكرة مرتبطة بالجامعة وبالشكل الذي تريده: فيلم، وثائقي، Reel أو غيره. لا توجد فئة إلزامية." },
    { title: "اصنع المحتوى", text: "نفّذ عملك في 3 دقائق كحد أقصى، بعد حضور الدورة التكوينية يوم {training}." },
    { title: "راجع عملك", text: "تأكد من احترام الضوابط الأخلاقية والملكية الفكرية، ومن أن العمل أصلي ولا يتجاوز 3 دقائق." },
    { title: "أرسل العمل عبر Instagram", text: "أرسل الفيديو عبر صفحة {ig} قبل آخر أجل: {deadline}." }
  ],

  ethics: [
    ["احترام الأشخاص وكرامتهم", "يُمنع الإساءة أو التشهير أو التنمر أو السخرية المهينة."],
    ["احترام الخصوصية", "لا يجوز تصوير أو نشر محتوى يتضمن أشخاصًا بطريقة تنتهك خصوصيتهم، مع مراعاة الحصول على الموافقات اللازمة."],
    ["احترام البيئة الجامعية", "يجب احترام الجامعة ومرافقها وطلبتها وموظفيها وعدم الإساءة المتعمدة أو التشويه."],
    ["منع خطاب الكراهية والتمييز", "يُمنع المحتوى الذي يتضمن تحريضًا أو تمييزًا أو إساءة على أساس شخصي أو اجتماعي."],
    ["منع المحتوى غير اللائق", "يُمنع المحتوى الذي يتضمن ألفاظًا أو مشاهد أو إيحاءات غير مناسبة للبيئة الجامعية."],
    ["احترام القوانين والأنظمة", "يجب الالتزام بالقوانين والأنظمة المعمول بها والقواعد الداخلية للجامعة."],
    ["احترام الملكية الفكرية", "يجب احترام حقوق المؤلف والمواد المحمية."],
    ["منع انتحال الأعمال", "يُمنع تقديم أعمال الغير على أنها أعمال المشارك."],
    ["أصالة العمل", "يجب أن يعكس العمل فكرة وجهد المشارك."],
    ["حق الجهة المنظمة في الاستبعاد", "يمكن استبعاد أي عمل يخالف شروط المسابقة أو ضوابطها."]
  ],

  /* معايير التقييم: بدون نسب إلى أن تُعتمد الأوزان الرسمية */
  criteria: [
    ["🎨", "الإبداع والأصالة"], ["💡", "قوة الفكرة"], ["🎬", "جودة التنفيذ والإخراج"], ["🏫", "الارتباط بالجامعة"],
    ["📝", "جودة المحتوى والسرد"], ["❤️", "التفاعل والتصويت الجماهيري"], ["⚖️", "احترام الضوابط"]
  ],

  stats: [[3, "دقائق كحد أقصى"], [3, "ورشات تكوينية"], [8, "أعمال في المرحلة النهائية"], [3, "فائزون"]],

  faq: [
    ["هل المشاركة فردية؟", "نعم، المشاركة فردية فقط."],
    ["من يمكنه المشاركة؟", "طلبة جامعة 8 ماي 1945 – قالمة."],
    ["هل يجب اختيار فئة محتوى؟", "لا، لا توجد فئة إلزامية. المشارك يحدد فكرة ومشروعه بنفسه."],
    ["هل موضوع الفيديو محدد؟", "لا، الموضوع حر بشرط أن يكون مرتبطًا بالجامعة."],
    ["ما مدة الفيديو؟", "3 دقائق كحد أقصى."],
    ["هل أرفع الفيديو أثناء التسجيل؟", "لا."],
    ["أين أرسل الفيديو؟", "عبر Instagram {ig}."],
    ["هل الدورة التكوينية إجبارية؟", "نعم."],
    ["متى آخر أجل لإرسال العمل؟", "{deadline}."],
    ["متى يتم إعلان أفضل 08؟", "{top8}."],
    ["متى يتم إعلان الفائزين؟", "{finale} خلال حفل الاختتام."]
  ],

  /* أفضل 08: أضف حتى 8 عناصر بعد الإعلان. الترتيب = الرتبة.
     { name, title, desc, thumb:"Assets/finalists/1.jpg", url:"https://...", voteUrl:"https://..." } */
  finalists: [],

  /* لجنة التحكيم: { name, role, photo:"Assets/jury/x.jpg", bio } */
  jury: [],

  /* الفائزون الثلاثة (بعد الحفل): [الأول, الثاني, الثالث] — { name, title, url } أو null */
  winners: [null, null, null],

  /* الجوائز (لم تُحدد بعد): نص لكل مركز، أو null = "سيتم الإعلان عن الجوائز لاحقًا" */
  prizes: [null, null, null]
};

/* ====== أدوات ====== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = u => { u = String(u || "").trim(); return /^(javascript|data|vbscript):/i.test(u) ? "" : u; };
const ca = $("#ca"), joinView = $("#view-join"), root = document.documentElement;
const CFG = CA_CONFIG, DT = CFG.dates, TZ = CFG.timezone;
let ready = false, active = false, timer = 0, rvIO = null;

const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const fmt = d => { const p = d.split("-"); return `${p[2]} ${MONTHS[+p[1] - 1]}`; };
const startOf = d => new Date(`${d}T00:00:00${TZ}`).getTime();
const afterDay = d => new Date(`${d}T23:59:59.999${TZ}`).getTime() + 1;
const ig = () => `<bdi dir="ltr">${esc(CFG.instagram.handle)}</bdi>`;
const tpl = s => String(s).replace(/\{(\w+)\}/g, (m, k) => k === "ig" ? ig() : DT[k] ? fmt(DT[k]) : m);
const plain = s => tpl(s).replace(/<[^>]+>/g, "");
const igUrl = () => safeUrl(CFG.instagram.url) || `https://www.instagram.com/${CFG.instagram.handle.replace(/^@/, "")}/`;

/* الوقت الحالي (مع إمكانية المحاكاة للاختبار) */
let skew = 0;
(() => {
  const p = CFG.debugNowParam; if (!p) return;
  let v = new URLSearchParams(location.search).get(p); if (!v) return;
  if (!v.includes("T")) v += "T00:00";
  const t = new Date(/(Z|[+-]\d\d:\d\d)$/i.test(v) ? v : v + TZ).getTime();
  if (!isNaN(t)) skew = t - Date.now();
})();
const now = () => Date.now() + skew;

/* ====== مراحل المسابقة (مشتقة من CA_CONFIG.dates) ====== */
const PHASES = [
  { id: "pre", from: -Infinity, icon: "⏳", label: "التسجيل يبدأ قريبًا", sub: "افتتاح التسجيلات يوم {regOpen}", target: startOf(DT.regOpen), cd: "يفتح التسجيل بعد" },
  { id: "reg", from: startOf(DT.regOpen), icon: "🔴", label: "التسجيلات مفتوحة", sub: "يغلق التسجيل يوم {regClose}", target: afterDay(DT.regClose), cd: "يغلق التسجيل بعد", live: true },
  { id: "gap", from: afterDay(DT.regClose), icon: "🎓", label: "المرحلة القادمة: الدورة التكوينية — {training}", sub: "أُغلقت التسجيلات", target: startOf(DT.training), cd: "تنطلق الدورة بعد" },
  { id: "prod", from: startOf(DT.training), icon: "🎬", label: "المنافسة جارية", sub: "آخر أجل لإرسال الأعمال يوم {deadline}", target: afterDay(DT.deadline), cd: "آخر أجل لإرسال الأعمال بعد", live: true,
    urgent: { within: 72, icon: "⏰", label: "آخر أجل لإرسال الأعمال: {deadline}" } },
  { id: "review", from: afterDay(DT.deadline), icon: "⭐", label: "مرحلة التقييم", sub: "إعلان أفضل 08 أعمال يوم {top8}", target: startOf(DT.top8), cd: "إعلان أفضل 08 بعد",
    urgent: { within: 48, icon: "🏆", label: "إعلان أفضل 08 أعمال — {top8}" } },
  { id: "top8", from: startOf(DT.top8), icon: "🏆", label: "تم إعلان أفضل 08 أعمال", sub: "افتتاح الفعاليات يوم {opening}", target: startOf(DT.opening), cd: "الافتتاح بعد" },
  { id: "event", from: startOf(DT.opening), icon: "🎉", label: "فعاليات Creator Awards جارية", sub: "حفل الاختتام يوم {finale}", target: startOf(DT.finale), cd: "حفل الاختتام بعد", live: true },
  { id: "finale", from: startOf(DT.finale), icon: "🎉", label: "فعاليات Creator Awards جارية", sub: "حفل الاختتام اليوم", target: afterDay(DT.finale), cd: "تنتهي فعاليات اليوم بعد", live: true },
  { id: "end", from: afterDay(DT.finale), icon: "🏆", label: "تم اختتام UM1945 Creator Awards", sub: "شكرًا لكل المشاركين.", target: null }
];
const phaseAt = t => PHASES.filter(p => t >= p.from).pop();

/* ====== بناء الصفحة ====== */
let accN = 0;
const stg = i => `style="--d:${Math.min(i * .06, .5).toFixed(2)}s"`;
const acc = (head, body, i = 0) => { const n = ++accN; return `<div class="ca-acc ca-rv" ${stg(i)}><h4 class="ca-acch"><button type="button" id="ca-ah${n}" data-acc aria-expanded="false" aria-controls="ca-ap${n}">${head}<i aria-hidden="true">+</i></button></h4><div class="ca-more" id="ca-ap${n}" role="region" aria-labelledby="ca-ah${n}" inert><div>${body}</div></div></div>`; };
const sec = (id, inner, cls = "") => `<section class="ca-sec ${cls}" id="${id}" aria-labelledby="${id}-h">${inner}</section>`;
const head = (id, title, lead) => `<h3 class="ca-rv" id="${id}-h">${title}</h3>${lead ? `<p class="ca-lead ca-rv">${lead}</p>` : ""}`;
const NAV = [["ca-timeline", "البرنامج"], ["ca-req", "الشروط"], ["ca-training", "الدورة"], ["ca-submit", "إرسال العمل"], ["ca-top8", "أفضل 08"], ["ca-jury", "اللجنة"], ["ca-faq", "الأسئلة"]];

function build() {
  const C = CFG;
  ca.innerHTML = `
<section class="ca-hero" aria-labelledby="ca-h1"><canvas class="ca-fx" aria-hidden="true"></canvas><div class="ca-orb" aria-hidden="true"></div><span class="ca-vf" aria-hidden="true"></span>
 <div class="ca-hero-in">
  <p class="ca-eyebrow">جامعة 8 ماي 1945 – قالمة × المنتدى الوطني للطلبة الجزائريين FNEA</p>
  <h2 class="ca-title" id="ca-h1"><span>UM1945</span><b>CREATOR AWARDS</b></h2>
  <p class="ca-sub">الجامعة بعيون طلبتها</p>
  <p class="ca-desc">مسابقة إبداعية لطلبة جامعة 8 ماي 1945 – قالمة، لاكتشاف المواهب في صناعة المحتوى وتحويل الحياة الجامعية إلى قصص وأفكار إبداعية.</p>
  <ul class="ca-badges"><li>👤 مشاركة فردية</li><li>🏫 طلبة جامعة 8 ماي 1945</li><li>🎬 3 دقائق كحد أقصى</li></ul>
  <div class="ca-cta"><button type="button" class="ca-btn gold" data-go="ca-register">التسجيل في المسابقة</button><button type="button" class="ca-btn ghost" data-go="ca-timeline">اكتشف البرنامج</button></div>
 </div>
 <button type="button" class="ca-scroll" data-go="ca-status" aria-label="انتقل إلى الأسفل"></button>
</section>

<nav class="ca-nav2" id="ca-nav2" aria-label="أقسام المسابقة">${NAV.map(n => `<a href="#creator-awards" data-go="${n[0]}" data-spy="${n[0]}">${n[1]}</a>`).join("")}<a href="#creator-awards" class="reg" data-go="ca-register">سجّل</a></nav>

<div class="ca-wrap">
${sec("ca-status", `<h3 class="ca-sr" id="ca-status-h">حالة المسابقة</h3>
 <div class="ca-st ca-rv"><div class="ca-st-top"><span class="ca-pulse" id="ca-pulse" aria-hidden="true"></span><div><p class="ca-st-label" id="ca-st-label" aria-live="polite"></p><p class="ca-st-sub" id="ca-st-sub"></p></div></div>
  <p class="ca-count-lbl" id="ca-lbl"></p><div class="ca-count" id="ca-count" role="timer" aria-label="العد التنازلي" dir="ltr"></div>
  <div class="ca-pg" id="ca-pg" role="progressbar" aria-label="تقدم المسابقة" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i id="ca-pg-fill"></i></div>
  <div class="ca-pg-ends"><span>${fmt(DT.regOpen)}</span><span>${fmt(DT.finale)}</span></div></div>
 <ul class="ca-stats">${C.stats.map((s, i) => `<li class="ca-rv" ${stg(i)}><b data-count="${s[0]}">${s[0]}</b><span>${s[1]}</span></li>`).join("")}</ul>`, "ca-status")}

${sec("ca-why", `<h3 class="ca-rv" id="ca-why-h">لو كان بإمكانك أن تحكي قصة جامعتك... ماذا ستقول؟</h3>
 <p class="ca-why-t ca-rv" style="--d:.1s">الجامعة ليست فقط مباني ومدرجات.<br>هي أشخاص، مواقف، أفكار، طموحات وذكريات.</p>
 <p class="ca-why-t gold ca-rv" style="--d:.25s">في UM1945 Creator Awards، أنت من يختار القصة، والأسلوب، والطريقة.</p>`, "ca-why")}

${sec("ca-create", `${head("ca-create", "ماذا يمكنك أن تصنع؟")}
 <div class="ca-grid ca-auto">${C.formats.map((f, i) => `<article class="ca-card ca-rv" ${stg(i)}><em aria-hidden="true">${f[0]}</em><h4>${f[1]}</h4></article>`).join("")}</div>
 <div class="ca-box ca-rv"><p><b>هذه أمثلة للإلهام وليست فئات إلزامية.</b></p><p>لك الحرية في اختيار شكل العمل وطريقة تقديمه.</p></div>`)}

${sec("ca-req", `${head("ca-req", "شروط المشاركة")}
 <div class="ca-grid ca-auto">${C.requirements.map((r, i) => `<article class="ca-card ca-rv" ${stg(i)}><em aria-hidden="true">${r[0]}</em><h4>${r[1]}</h4><p>${r[2]}</p></article>`).join("")}</div>
 <p class="ca-warn ca-rv" role="note">⚠️ التسجيل في المنصة لا يعني إرسال الفيديو.</p>`)}

${sec("ca-timeline", `${head("ca-timeline", "البرنامج الرسمي")}
 <ol class="ca-tl" id="ca-tl" data-watch>${C.timeline.map((e, i) => `<li data-state="" class="ca-rv" ${stg(i)}><span class="ca-td" aria-hidden="true">${e.icon}</span><div class="ca-tc"><time datetime="${DT[e.date]}">${fmt(DT[e.date])}</time><b class="ca-tb"></b><h4>${e.title}</h4>${e.text ? `<p>${tpl(e.text)}</p>` : ""}</div></li>`).join("")}</ol>`)}

${sec("ca-training", `<div class="ca-train ca-rv"><div class="ca-tdate" aria-hidden="true"><b>${+DT.training.slice(8)}</b><span>${MONTHS[+DT.training.slice(5, 7) - 1]}</span></div>
 <div class="ca-tbody"><h3 id="ca-training-h">الدورة التكوينية للمشاركين</h3><span class="ca-tag">حضور إلزامي</span>
 <p class="ca-lead">حضور الدورة التكوينية إلزامي، وهي مخصصة لشرح المسابقة وآلياتها وتحضير المشاركين لإنجاز أعمالهم.</p>
 <ul class="ca-ws">${C.workshops.map(w => `<li><em aria-hidden="true">${w[0]}</em>${w[1]}</li>`).join("")}</ul></div></div>
 <h4 class="ca-sub2 ca-rv">🤝 شركاء التكوين</h4>
 <div class="ca-grid ca-auto">${C.clubs.map((c, i) => `<article class="ca-card ca-club ca-rv" ${stg(i)}><div class="ca-logo${c.logo ? "" : " ph"}">${c.logo ? `<img src="${esc(safeUrl(c.logo))}" alt="شعار ${esc(c.name)}" loading="lazy">` : "<span>مكان شعار النادي</span>"}</div><h4>${c.name}</h4></article>`).join("")}</div>`, "ca-trainsec")}

${sec("ca-journey-s", `${head("ca-journey-s", "كيف تصنع مشاركتك؟", "أربع خطوات من الفكرة إلى الإرسال. اضغط على أي خطوة.")}
 <div class="ca-jny ca-rv" id="ca-journey" style="--jp:0"><div class="ca-jtrack" aria-hidden="true"><i></i></div>
  <div class="ca-jtabs" role="tablist" aria-label="خطوات إنجاز العمل">${C.journey.map((s, i) => `<button type="button" role="tab" id="ca-jt${i}" data-step="${i}" aria-controls="ca-jp" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><span class="ca-jn">0${i + 1}</span><span class="ca-jl">${s.title}</span></button>`).join("")}</div>
  <div class="ca-jpanel" id="ca-jp" role="tabpanel" aria-labelledby="ca-jt0" tabindex="0"><h4></h4><p></p></div></div>`)}

${sec("ca-ethics", `${head("ca-ethics", "الضوابط الأخلاقية للمحتوى")}
 <div class="ca-list" data-accgroup>${C.ethics.map((e, i) => acc(`<span class="ca-n">${i + 1}</span>${e[0]}`, `<p>${e[1]}</p>`, i)).join("")}</div>
 <p class="ca-warn ca-rv" role="note">المحتوى يجب أن يبقى ضمن الإطار الجامعي وألا يتحول إلى محتوى شارع أو محتوى يسيء للأشخاص أو المؤسسة.</p>`)}

${sec("ca-eval", `${head("ca-eval", "المعايير المعتمدة للتقييم")}
 <p class="ca-box ca-rv"><b>التصويت الجماهيري معيار واحد ضمن عدة معايير، وليس العامل الوحيد في التقييم.</b></p>
 <div class="ca-grid ca-auto">${C.criteria.map((c, i) => `<article class="ca-card ca-rv" ${stg(i)}><em aria-hidden="true">${c[0]}</em><h4>${c[1]}</h4></article>`).join("")}</div>`)}

${sec("ca-submit", `<div class="ca-ig ca-rv"><h3 id="ca-submit-h">📲 أين أرسل عملي؟</h3>
 <p>التسجيل في المنصة لا يتطلب رفع الفيديو.</p><p>بعد إنجاز العمل، يتم إرسال الفيديو عبر صفحة Instagram الرسمية:</p>
 <p class="ca-ig-h" dir="ltr">${esc(C.instagram.handle)}</p>
 <p class="ca-ig-d">آخر أجل لإرسال الأعمال: <b>${fmt(DT.deadline)}</b></p>
 <div class="ca-cta"><a class="ca-btn gold" id="ca-ig-link" href="${esc(igUrl())}" target="_blank" rel="noopener noreferrer">إرسال العمل عبر Instagram</a><button type="button" class="ca-btn ghost" data-copy>نسخ اسم الحساب</button></div>
 <p class="ca-warn strong" role="note">⚠️ التسجيل في المنصة ≠ إرسال العمل</p></div>`, "ca-submitsec")}

${sec("ca-top8", `${head("ca-top8", "⭐ أفضل 08 أعمال")}<div id="ca-top8-body"></div>`)}

${sec("ca-jury", `${head("ca-jury", "👥 لجنة التحكيم")}<div id="ca-jury-body"></div>`)}
</div>

<section class="ca-finale" id="ca-finale" aria-labelledby="ca-finale-h"><div class="ca-wrap">
 <p class="ca-fin-en ca-rv" id="ca-finale-h">THE GRAND FINALE</p>
 <h3 class="ca-fin-ar ca-rv">حفل اختتام UM1945 Creator Awards</h3>
 <p class="ca-fin-date ca-rv"><time datetime="${DT.finale}">${fmt(DT.finale)}</time></p>
 <p class="ca-lead ca-rv" style="margin-inline:auto">ليلة تتويج الإبداع الطلابي والإعلان عن الفائزين في UM1945 Creator Awards.</p>
 <div id="ca-podium" class="ca-podium" data-watch></div></div></section>

<div class="ca-wrap">${sec("ca-faq", `${head("ca-faq", "الأسئلة الشائعة")}<div class="ca-list" data-accgroup>${C.faq.map((f, i) => acc(f[0], `<p>${tpl(f[1])}</p>`, i)).join("")}</div>`)}</div>

<section class="ca-final" id="ca-cta" aria-labelledby="ca-cta-h"><h3 class="ca-rv" id="ca-cta-h">جاهز تحكي قصة جامعتك؟</h3><p class="ca-rv">سجّل الآن وكن جزءًا من UM1945 Creator Awards.</p>
 <div class="ca-cta ca-rv"><button type="button" class="ca-btn gold" data-go="ca-register">📝 التسجيل في المسابقة</button><button type="button" class="ca-btn ghost" data-go="ca-timeline">📅 مشاهدة البرنامج</button></div></section>

<div class="ca-wrap"><section class="ca-sec" id="ca-register" aria-labelledby="ca-register-h"><h3 class="ca-rv" id="ca-register-h">التسجيل في المسابقة</h3>
 <p class="ca-lead ca-rv">مشاركة فردية. لا يُطلب رفع أي فيديو أثناء التسجيل، ولا تُفرض فئة محتوى.</p><div class="ca-reg ca-rv" id="ca-reg"></div></section></div>

<footer class="ca-foot"><div class="ca-wrap"><img class="logo" src="logo.png" alt="شعار FNEA" onerror="logoFallback(this)">
 <p class="ca-foot-t">UM1945 CREATOR AWARDS</p><p>جامعة 8 ماي 1945 – قالمة</p><p>المنتدى الوطني للطلبة الجزائريين</p>
 <p>Instagram: <a href="${esc(igUrl())}" target="_blank" rel="noopener noreferrer" dir="ltr">${esc(C.instagram.handle)}</a></p>
 <small>© 2026 UM1945 Creator Awards</small></div></footer>
<button type="button" class="ca-top" id="ca-top" aria-label="العودة إلى الأعلى">↑</button><div class="ca-toast" id="ca-toast" role="status"></div>`;
}

/* ====== أدوات واجهة ====== */
function toast(m) { const t = $("#ca-toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3200); }
function go(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
function watch(els) { if (!rvIO) return els.forEach(e => e.classList.add("in")); els.forEach(e => rvIO.observe(e)); }
function measure() {
  const tabs = $(".tabs"), nav = $("#ca-nav2");
  root.style.setProperty("--tabs-h", (tabs ? tabs.offsetHeight : 0) + "px");
  root.style.setProperty("--nav-h", (nav ? nav.offsetHeight : 0) + "px");
}

/* ====== الحالة المباشرة والعد التنازلي ====== */
const CD = [["يوم", 864e5], ["ساعة", 36e5], ["دقيقة", 6e4], ["ثانية", 1e3]];
let stKey = "", pgVal = -1, nums = [];
function paintStatus(t) {
  const p = phaseAt(t), urg = !!(p.urgent && p.target && p.target - t <= p.urgent.within * 36e5), v = urg ? { ...p, ...p.urgent } : p, key = p.id + (urg ? "!" : "");
  if (key !== stKey) {
    stKey = key;
    $("#ca-st-label").textContent = `${v.icon} ${plain(v.label)}`;
    $("#ca-st-sub").textContent = plain(p.sub);
    $("#ca-pulse").classList.toggle("live", !!p.live);
    const box = $("#ca-count"), lbl = $("#ca-lbl"), has = !!p.target;
    box.hidden = lbl.hidden = !has;
    if (has) { lbl.textContent = p.cd; box.innerHTML = CD.map(x => `<div><b>00</b><small>${x[0]}</small></div>`).join(""); nums = $$("b", box); }
  }
  if (p.target) { let d = Math.max(0, p.target - t); CD.forEach((x, i) => { const n = Math.floor(d / x[1]); d -= n * x[1]; const s = String(n).padStart(2, "0"); if (nums[i].textContent !== s) nums[i].textContent = s; }); }
  const a = startOf(DT.regOpen), b = afterDay(DT.finale), pc = Math.round(Math.min(1, Math.max(0, (t - a) / (b - a))) * 100);
  if (pc !== pgVal) { pgVal = pc; $("#ca-pg-fill").style.width = pc + "%"; $("#ca-pg").setAttribute("aria-valuenow", pc); }
}

/* ====== الخط الزمني ====== */
let tlKey = "";
function lineFill() {
  const tl = $("#ca-tl"), items = $$("#ca-tl>li"); if (!tl || !items.length) return;
  const st = items.map(i => i.dataset.state); let idx = -1;
  st.forEach((s, i) => { if (s === "done" || s === "active") idx = i; });
  tl.style.setProperty("--fill", (idx >= 0 ? items[idx].offsetTop : 0) + "px");
}
function paintTimeline(t) {
  const items = $$("#ca-tl>li"), ev = CFG.timeline;
  const k = ev.findIndex(e => t < afterDay(DT[e.date]));
  const st = ev.map((e, i) => k === -1 || i < k ? "done" : i === k ? (t >= startOf(DT[e.date]) ? "active" : "next") : "pending");
  const key = st.join(); if (key === tlKey) return; tlKey = key;
  const lab = { done: "✓ منجز", active: "جارٍ الآن", next: "القادم", pending: "" };
  items.forEach((li, i) => { li.dataset.state = st[i]; $(".ca-tb", li).textContent = lab[st[i]]; st[i] === "active" ? li.setAttribute("aria-current", "step") : li.removeAttribute("aria-current"); });
  lineFill();
}

/* ====== أفضل 08 / اللجنة / الفائزون ====== */
const safeImg = (u, alt) => safeUrl(u) ? `<img src="${esc(safeUrl(u))}" alt="${esc(alt)}" loading="lazy">` : "";
let t8Key = "";
function paintTop8(t) {
  const open = t >= startOf(DT.top8), list = CFG.finalists || [], key = open + ":" + JSON.stringify(list); if (key === t8Key) return; t8Key = key;
  const cards = Array.from({ length: 8 }, (_, i) => {
    const f = open && list[i];
    if (!f) return `<article class="ca-fc soon ca-rv" ${stg(i)} aria-label="المركز ${i + 1}: سيتم الإعلان لاحقًا"><span class="ca-rank">${i + 1}</span><div class="ca-thumb" aria-hidden="true"></div><h4>سيتم الإعلان لاحقًا</h4><p>Coming Soon</p></article>`;
    return `<article class="ca-fc ca-rv" ${stg(i)}><span class="ca-rank">${i + 1}</span><div class="ca-thumb">${safeImg(f.thumb, f.title || f.name)}</div><h4>${esc(f.title || "")}</h4><p class="ca-by">${esc(f.name || "")}</p>${f.desc ? `<p>${esc(f.desc)}</p>` : ""}<div class="ca-fa">${safeUrl(f.url) ? `<a class="ca-btn gold sm" href="${esc(safeUrl(f.url))}" target="_blank" rel="noopener noreferrer">مشاهدة العمل</a>` : ""}${safeUrl(f.voteUrl) ? `<a class="ca-btn ghost sm" href="${esc(safeUrl(f.voteUrl))}" target="_blank" rel="noopener noreferrer">تفاعل وصوّت</a>` : ""}</div></article>`;
  }).join("");
  const body = $("#ca-top8-body");
  body.innerHTML = `<p class="ca-lead ca-rv">${open ? "تم اختيار أفضل ثمانية أعمال للانتقال إلى المرحلة النهائية من المنافسة." : `سيتم الإعلان عن أفضل 08 أعمال يوم ${fmt(DT.top8)}.`}</p><div class="ca-grid ca-fin">${cards}</div>`;
  watch($$(".ca-rv", body));
}
let juKey = "";
function paintJury() {
  const list = CFG.jury || [], key = JSON.stringify(list); if (key === juKey) return; juKey = key;
  const body = $("#ca-jury-body");
  body.innerHTML = list.length ? `<div class="ca-grid ca-auto">${list.map((j, i) => `<article class="ca-card ca-jm ca-rv" ${stg(i)}><div class="ca-av">${safeImg(j.photo, j.name) || "<span aria-hidden='true'>👤</span>"}</div><h4>${esc(j.name)}</h4><p class="ca-role">${esc(j.role || "")}</p>${j.bio ? `<p>${esc(j.bio)}</p>` : ""}</article>`).join("")}</div>`
    : `<div class="ca-jph ca-rv"><div class="ca-avs" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p>سيتم الإعلان عن أعضاء لجنة التحكيم قريبًا</p></div>`;
  watch($$(".ca-rv", body));
}
let wKey = "";
function paintWinners(t) {
  const out = t >= startOf(DT.finale), W = CFG.winners || [], P = CFG.prizes || [], key = out + JSON.stringify([W, P]); if (key === wKey) return; wKey = key;
  const pending = !P.some(Boolean), meta = [["🥇", "المركز الأول", "p1"], ["🥈", "المركز الثاني", "p2"], ["🥉", "المركز الثالث", "p3"]];
  const box = $("#ca-podium"); box.classList.remove("in");
  box.innerHTML = `<div class="ca-pods">${meta.map((m, i) => { const w = out && W[i]; return `<article class="ca-pod ${m[2]}"><em aria-hidden="true">${m[0]}</em><h4>${m[1]}</h4>${w ? `<p class="ca-wn">${esc(w.name)}</p><p>${esc(w.title || "")}</p>${safeUrl(w.url) ? `<a class="ca-btn ghost sm" href="${esc(safeUrl(w.url))}" target="_blank" rel="noopener noreferrer">مشاهدة العمل</a>` : ""}` : `<p class="ca-wn dim">${out ? "—" : `يُعلن يوم ${fmt(DT.finale)}`}</p>`}${pending ? "" : `<p class="ca-pz">${esc(P[i] || "")}</p>`}</article>`; }).join("")}</div>${pending ? '<p class="ca-note">سيتم الإعلان عن الجوائز لاحقًا</p>' : ""}`;
  watch([box]);
}

/* ====== تفاعلات: رحلة المشاركة، العدادات، الهيرو ====== */
function journey() {
  const box = $("#ca-journey"), tabs = $$("[data-step]", box), panel = $("#ca-jp"), J = CFG.journey; let timers = [];
  const set = i => {
    tabs.forEach((b, k) => { b.setAttribute("aria-selected", k === i); b.tabIndex = k === i ? 0 : -1; b.classList.toggle("done", k < i); });
    box.style.setProperty("--jp", (i / (tabs.length - 1)).toFixed(3));
    panel.setAttribute("aria-labelledby", "ca-jt" + i); $("h4", panel).textContent = J[i].title; $("p", panel).innerHTML = tpl(J[i].text);
  };
  const stop = () => { timers.forEach(clearTimeout); timers = []; };
  box.addEventListener("click", e => { const b = e.target.closest("[data-step]"); if (b) { stop(); set(+b.dataset.step); } });
  box.addEventListener("keydown", e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const n = { ArrowLeft: i + 1, ArrowRight: i - 1, Home: 0, End: tabs.length - 1 }[e.key]; if (n === undefined) return;
    e.preventDefault(); stop(); const j = Math.max(0, Math.min(tabs.length - 1, n)); set(j); tabs[j].focus();
  });
  set(0);
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); tabs.forEach((_, k) => { if (k) timers.push(setTimeout(() => set(k), 900 * k)); }); }, { threshold: .6 });
    io.observe(box);
  }
}

function counters() {
  const els = $$("[data-count]", ca); if (!("IntersectionObserver" in window) || reduce) return;
  const run = el => { const to = +el.dataset.count, t0 = performance.now(); const f = n => { const p = Math.min(1, (n - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
  els.forEach(e => { e.textContent = "0"; io.observe(e); });
}

function hero() {
  const h = $(".ca-hero"), c = $(".ca-fx"); if (reduce) return;
  if (matchMedia("(pointer:fine)").matches) h.addEventListener("pointermove", e => { const r = h.getBoundingClientRect(); h.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(2)); h.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(2)); });
  const x = c.getContext("2d"), N = innerWidth < 700 ? 20 : 46; let w, hh, ps = [], raf = 0;
  const size = () => { w = c.width = c.offsetWidth; hh = c.height = c.offsetHeight; ps = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * hh, r: Math.random() * 1.6 + .4, v: Math.random() * .25 + .06, a: Math.random() * .5 + .2, g: Math.random() > .7 })); };
  const tick = () => { x.clearRect(0, 0, w, hh); for (const p of ps) { p.y -= p.v; if (p.y < -4) { p.y = hh + 4; p.x = Math.random() * w; } x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fillStyle = p.g ? `rgba(46,160,110,${p.a})` : `rgba(212,175,55,${p.a})`; x.fill(); } raf = requestAnimationFrame(tick); };
  size(); addEventListener("resize", () => { if (active) size(); });
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting && active) tick(); }).observe(h);
}

function spy() {
  if (!("IntersectionObserver" in window)) return;
  const links = $$("[data-spy]"), map = new Map(links.map(l => [l.dataset.spy, l]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.removeAttribute("aria-current")); const l = map.get(e.target.id); l.setAttribute("aria-current", "true");
    l.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
  }), { rootMargin: "-35% 0px -60% 0px" });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ====== التسجيل متعدد الخطوات (فردي، بدون رفع فيديو، بدون فئة إلزامية) ====== */
const LEVELS = ["ليسانس 1", "ليسانس 2", "ليسانس 3", "ماستر 1", "ماستر 2", "دكتوراه", "أخرى"];
const FACS = typeof FACULTIES !== "undefined" ? FACULTIES : [];
const STEPS = [
  { t: "معلوماتك", f: ["fullName", "email", "phone", "university", "faculty", "department", "level"] },
  { t: "مشروعك", f: ["projectTitle", "projectDesc", "format"], intro: "لا توجد فئة إلزامية. اختر فكرتك وشكل عملك بحرية، بشرط أن يرتبط بالجامعة ولا يتجاوز 3 دقائق." },
  { t: "حضورك الرقمي", f: ["instagram", "tiktok", "youtube", "facebook"], intro: "أضف حساباتك إن وجدت. هذه الخانات اختيارية." },
  { t: "تأكيد وإرسال", sum: true }
];
const FIELDS = {
  fullName: ["الاسم واللقب", "text"], email: ["البريد الإلكتروني", "email"], phone: ["رقم الهاتف", "tel"], university: ["الجامعة", "text"],
  faculty: ["الكلية / المعهد", "select", FACS], department: ["التخصص", "text"], level: ["المستوى الجامعي", "select", LEVELS],
  projectTitle: ["عنوان المشروع", "text"], projectDesc: ["فكرة المشروع / وصف مختصر", "area"], format: ["شكل المحتوى المخطط له (اختياري)", "text", "مثال: فيلم قصير، Reel، وثائقي…"],
  instagram: ["Instagram", "text", "@username أو رابط"], tiktok: ["TikTok", "text", "@username أو رابط"], youtube: ["YouTube", "text", "رابط القناة"], facebook: ["Facebook", "text", "رابط الصفحة أو الحساب"]
};
const SOCIAL = ["instagram", "tiktok", "youtube", "facebook"], WIDE = ["email", "university", "projectTitle", "projectDesc", "format"];
const min = (n, m) => v => v.length >= n ? "" : m, opt = v => !v || v.length >= 3 ? "" : "اكتب اسم الحساب أو رابطه.";
const RULES = {
  fullName: v => /\S+\s+\S+/.test(v) ? "" : "اكتب الاسم واللقب كاملين.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "اكتب بريدًا إلكترونيًا صحيحًا.",
  phone: v => /^0[567]\d{8}$/.test(v) ? "" : "الهاتف يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام.",
  faculty: min(1, "اختر كليتك أو معهدك."), department: min(2, "اكتب تخصصك."), level: min(1, "اختر مستواك الجامعي."),
  projectTitle: min(3, "اكتب عنوان المشروع."), projectDesc: min(20, "اكتب 20 حرفًا على الأقل لوصف فكرتك."),
  instagram: opt, tiktok: opt, youtube: opt, facebook: opt
};
const UNI = "جامعة 8 ماي 1945 – قالمة";
let F = { university: UNI }, step = 0, sending = false;
const K = "ca2_draft", DONE = "ca2_done";
const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } }, del: k => { try { localStorage.removeItem(k); } catch (e) { } } };
const save = () => store.set(K, JSON.stringify({ F, step }));
const notice = (ic, h, p) => `<div class="ca-ok" role="status"><span class="ca-ico" aria-hidden="true">${ic}</span><h4>${h}</h4><p>${p}</p></div>`;

function fieldHTML(n) {
  const [l, t, o] = FIELDS[n], v = F[n] || "", d = `id="f-${n}" name="${n}" aria-describedby="e-${n}"`;
  let c;
  if (t === "select") c = `<select ${d}><option value="">اختر</option>${o.map(x => `<option${x === v ? " selected" : ""}>${esc(x)}</option>`).join("")}</select>`;
  else if (t === "area") c = `<textarea ${d} rows="4">${esc(v)}</textarea>`;
  else c = `<input ${d} type="${t}" value="${esc(v)}" ${o ? `placeholder="${esc(o)}"` : ""} ${n === "format" ? 'list="ca-formats"' : ""} ${n === "university" ? "readonly" : ""} ${t === "tel" ? 'inputmode="numeric" maxlength="10" autocomplete="tel"' : ""} ${n === "fullName" ? 'autocomplete="name"' : ""} ${["email", "tel"].includes(t) || SOCIAL.includes(n) ? 'dir="ltr"' : ""}>${n === "format" ? `<datalist id="ca-formats">${CFG.formats.map(f => `<option value="${esc(f[1])}">`).join("")}</datalist>` : ""}`;
  return `<label class="f${WIDE.includes(n) ? " wide" : ""}">${l}${c}<small class="ca-err" id="e-${n}" role="alert"></small></label>`;
}

function renderReg(focus) {
  const reg = $("#ca-reg"), s = STEPS[step], last = STEPS.length - 1; let body = "";
  if (s.f) body = `<div class="ca-fields ${step === 0 ? "two" : ""}">${s.intro ? `<p class="ca-lead wide" style="margin:0">${s.intro}</p>` : ""}${s.f.map(fieldHTML).join("")}</div>`;
  if (s.sum) {
    const rows = [["الاسم", F.fullName], ["البريد", F.email], ["الهاتف", F.phone], ["الجامعة", F.university], ["الكلية", F.faculty], ["التخصص", F.department], ["المستوى", F.level], ["عنوان المشروع", F.projectTitle], ["الفكرة", F.projectDesc], ["شكل المحتوى", F.format], ...SOCIAL.filter(k => F[k]).map(k => [FIELDS[k][0], F[k]])];
    body = `<dl class="ca-sum">${rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1] || "—")}</dd>`).join("")}</dl>
     <p class="ca-box">📲 لا يُطلب رفع الفيديو أثناء التسجيل. يُرسل العمل لاحقًا عبر Instagram ${ig()} قبل ${fmt(DT.deadline)}.</p>
     <label class="ca-consent"><input type="checkbox" name="consentRules" aria-describedby="e-consentRules" ${F.consentRules ? "checked" : ""}><span>أقر بأنني اطلعت على شروط وضوابط المسابقة وأوافق عليها.</span></label><small class="ca-err" id="e-consentRules" role="alert"></small>
     <label class="ca-consent"><input type="checkbox" name="consentPrivacy" aria-describedby="e-consentPrivacy" ${F.consentPrivacy ? "checked" : ""}><span>أوافق على معالجة بياناتي الشخصية لغرض تنظيم المسابقة والتواصل معي.</span></label><small class="ca-err" id="e-consentPrivacy" role="alert"></small>`;
  }
  reg.innerHTML = `<div class="ca-prog" role="progressbar" aria-label="تقدم التسجيل" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="${step + 1}"><i style="width:${(step + 1) / STEPS.length * 100}%"></i></div>
   <div class="ca-steps">${STEPS.map((_, i) => `<span class="${i < step ? "ok" : i === step ? "on" : ""}" ${i === step ? 'aria-current="step"' : ""}>${i < step ? "✓" : i + 1}</span>`).join("")}<h4 id="ca-step-h" tabindex="-1">${s.t}</h4></div>
   <form id="ca-form" novalidate>${body}<div class="ca-nav">${step ? '<button type="button" class="ca-btn ghost" data-prev>رجوع</button>' : ""}<button type="${step === last ? "submit" : "button"}" class="ca-btn gold" ${step === last ? 'id="ca-send"' : "data-next"}>${step === last ? "تأكيد وإرسال المشاركة" : "التالي"}</button></div></form>`;
  save();
  if (focus) { $("#ca-step-h").focus({ preventScroll: true }); go("ca-reg"); }
}

function check(n) {
  const v = (F[n] || "").trim(), m = RULES[n] ? RULES[n](v) : "", i = document.getElementById("f-" + n), e = document.getElementById("e-" + n);
  if (e) e.textContent = m; if (i) { i.classList.toggle("bad", !!m); i.setAttribute("aria-invalid", !!m); }
  return !m;
}
function validStep() {
  let ok = true, first = null;
  (STEPS[step].f || []).forEach(n => { if (RULES[n] && !check(n)) { ok = false; first = first || document.getElementById("f-" + n); } });
  if (first) first.focus();
  return ok;
}

function regEvents() {
  const reg = $("#ca-reg");
  reg.addEventListener("input", e => {
    const t = e.target, n = t.name; if (!n) return;
    if (t.type === "checkbox") { F[n] = t.checked; const er = document.getElementById("e-" + n); if (er) er.textContent = ""; }
    else { if (n === "phone") t.value = t.value.replace(/\D/g, ""); F[n] = t.value; if (t.classList.contains("bad")) check(n); }
    save();
  });
  reg.addEventListener("change", e => { if (e.target.tagName === "SELECT") { F[e.target.name] = e.target.value; check(e.target.name); save(); } });
  reg.addEventListener("focusout", e => { const n = e.target.name; if (n && RULES[n] && (F[n] || "").length) check(n); });
  reg.addEventListener("click", e => {
    if (e.target.closest("[data-next]") && validStep()) { step++; renderReg(true); }
    if (e.target.closest("[data-prev]")) { step--; renderReg(true); }
  });
  reg.addEventListener("submit", async e => {
    e.preventDefault(); if (sending) return;
    if (store.get(DONE)) return toast("سبق أن أرسلت مشاركتك من هذا الجهاز.");
    let bad = null; [["consentRules", "يجب الموافقة على شروط وضوابط المسابقة."], ["consentPrivacy", "يجب الموافقة على معالجة البيانات."]].forEach(([n, m]) => { const er = $("#e-" + n); er.textContent = F[n] ? "" : m; if (!F[n] && !bad) bad = $(`[name=${n}]`); });
    if (bad) return bad.focus();
    if (CFG.scriptUrl.startsWith("PASTE")) return toast("رابط استقبال المشاركات لم يُضبط بعد.");
    sending = true; const b = $("#ca-send"); b.disabled = true; b.textContent = "جارٍ الإرسال…";
    const p = { type: "creator_awards", ...F, consentRules: true, consentPrivacy: true, status: "pending", submittedAt: new Date().toISOString() };
    try {
      await fetch(CFG.scriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(p) });
      store.set(DONE, "1"); store.del(K);
      reg.innerHTML = notice("✓", "تم استلام مشاركتك", `تذكير: لا يتم إرسال الفيديو هنا. أرسل عملك عبر Instagram ${ig()} قبل ${fmt(DT.deadline)}.`);
    } catch (err) { sending = false; b.disabled = false; b.textContent = "تأكيد وإرسال المشاركة"; toast("تعذر الإرسال. تحقق من اتصالك وأعد المحاولة."); }
  });
}

let gateKey = "";
function paintGate(t) {
  const s = !CFG.enforceRegistrationWindow ? "open" : t < startOf(DT.regOpen) ? "soon" : t < afterDay(DT.regClose) ? "open" : "closed";
  if (s === gateKey) return; gateKey = s; const reg = $("#ca-reg");
  if (s === "soon") reg.innerHTML = notice("⏳", `يفتح التسجيل يوم ${fmt(DT.regOpen)}`, `ويغلق يوم ${fmt(DT.regClose)}. التسجيل لا يتطلب رفع الفيديو.`);
  else if (s === "closed") reg.innerHTML = notice("🔒", "انتهى التسجيل", "شكرًا لاهتمامك بالمسابقة.");
  else if (store.get(DONE)) reg.innerHTML = notice("✓", "سبق أن أرسلت مشاركتك", "سيتواصل معك المنظمون قريبًا.");
  else renderReg(false);
}

/* ====== الدورة الزمنية ====== */
function paint() { const t = now(); paintStatus(t); paintTimeline(t); paintGate(t); paintTop8(t); paintWinners(t); }
function start() { if (active) return; active = true; paint(); timer = setInterval(paint, 1000); }
function stop() { active = false; clearInterval(timer); }

function init() {
  ready = true; build(); measure();
  try { const d = JSON.parse(store.get(K) || "null"); if (d && d.F) { F = { university: UNI, ...d.F }; step = Math.min(d.step || 0, STEPS.length - 2); } } catch (e) { }
  rvIO = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); if (e.target.id === "ca-tl") lineFill(); rvIO.unobserve(e.target); } }), { threshold: .12 }) : null;
  watch($$(".ca-rv,[data-watch]", ca));
  regEvents(); paintJury(); journey(); counters(); hero(); spy();
  ca.addEventListener("click", e => {
    const a = e.target.closest("[data-acc]");
    if (a) { const o = a.getAttribute("aria-expanded") !== "true"; a.setAttribute("aria-expanded", o); const c = a.closest(".ca-acc"); c.classList.toggle("open", o); $(".ca-more", c).toggleAttribute("inert", !o); }
    const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); go(g.dataset.go); }
    if (e.target.closest("#ca-top")) scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (e.target.closest("[data-copy]")) { const h = CFG.instagram.handle; (navigator.clipboard ? navigator.clipboard.writeText(h) : Promise.reject()).then(() => toast("تم نسخ " + h), () => toast(h)); }
  });
  ca.addEventListener("keydown", e => {
    const b = e.target.closest && e.target.closest("[data-acc]"); if (!b || !["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const all = $$("[data-acc]", b.closest("[data-accgroup]")), i = all.indexOf(b), n = e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + all.length) % all.length;
    e.preventDefault(); all[n].focus();
  });
  const top = $("#ca-top"); addEventListener("scroll", () => { if (active) top.classList.toggle("show", scrollY > 700); }, { passive: true });
  let rz = 0; addEventListener("resize", () => { if (!active) return; cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { measure(); lineFill(); }); });
}

/* ====== التوجيه (#creator-awards) — كما كان ====== */
function route() {
  const on = location.hash === "#creator-awards";
  if (on && !ready) init();
  ca.hidden = !on; joinView.hidden = on; document.body.classList.toggle("ca-on", on); root.classList.toggle("ca-on", on);
  $$(".tabs a").forEach(a => (a.getAttribute("href") === (on ? "#creator-awards" : "#join")) ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  scrollTo(0, 0);
  if (on) { measure(); start(); lineFill(); } else stop();
}
addEventListener("hashchange", route); route();
})();
