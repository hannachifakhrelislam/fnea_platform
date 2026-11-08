const WILAYAS=["أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار","أولاد جلال","بني عباس","إن صالح","إن قزام","تقرت","جانت","المغير","المنيعة"];
// بلديات الولايات: متوفرة حاليا لقالمة فقط، والبقية تُكتب يدويا
const COMMUNES={"قالمة":["قالمة","النشماية","بوشقوف","هليوبوليس","حمام دباغ","وادي الزناتي","عين مخلوف","الركنية","مجاز عمار","الخزارة","عين بن بيضاء","حمام النبايل","عين العربي","بلخير","بني مزلين","برج صباط","قلعة بوصبع","راس العقبة","وادي الشحم","جبالة الخميسي","هواري بومدين","عين رقادة","بوحمدان","تاملوكة","وادي فراغة","بوحشانة","الدهوارة","سلاوة عنونة","مجاز الصفا","عين صندل","بوعاطي محمود","فجوج","خميس مجاز","أخرى"]};
const FACULTIES=["كلية الرياضيات والإعلام الآلي وعلوم المادة","كلية العلوم والتكنولوجيا","كلية علوم الطبيعة والحياة وعلوم الأرض والكون","كلية الآداب واللغات","كلية العلوم الإنسانية والاجتماعية","كلية الحقوق والعلوم السياسية","كلية العلوم الاقتصادية والتجارية وعلوم التسيير","معهد الهندسة المدنية والري","معهد الهندسة الميكانيكية","معهد علوم وتقنيات النشاطات البدنية والرياضية"];
const RESIDENCES=["الإقامة الجامعية هباش أحمد الشريف","الإقامة الجامعية عڤون صالح","الإقامة الجامعية عبداوي مبروك","الإقامة الجامعية غولي إبراهيم","الإقامة الجامعية مدور عيسى","الإقامة الجامعية يحيى صالح","الإقامة الجامعية بلحساب عمر","الإقامة الجامعية بوحديد بلقاسم","الإقامة الجامعية قارة صالح"];
// ضع هنا رابط Apps Script المنشور (Web app)
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbz5XWJv9v-GHsjOhTFmuRWQL-rAggvSrW91Nj6Y6H1jHtosjQM-62uv1lwTBchcp_9H/exec";
const $=id=>document.getElementById(id), form=$("form");
function logoFallback(img){const b=document.createElement("b");b.className="logo-fb";b.textContent="FNEA";img.replaceWith(b)}
function fill(sel,items,first){sel.innerHTML=(first!==undefined?`<option value="${first[0]}">${first[1]}</option>`:"")+items.map(v=>`<option>${v}</option>`).join("")}

fill($("wilaya"),WILAYAS,["","اختر الولاية"]);
fill($("faculty"),FACULTIES,["","اختر الكلية أو المعهد"]);
fill($("residence"),RESIDENCES,["","غير مقيم في إقامة جامعية"]);
fill($("bacYear"),Array.from({length:46},(_,i)=>2025-i),["","اختر السنة"]);

$("wilaya").onchange=()=>{
  const c=$("commune"),t=$("communeText"),list=COMMUNES[$("wilaya").value];
  if(!$("wilaya").value){c.disabled=true;c.hidden=false;t.hidden=true;c.innerHTML='<option value="">اختر الولاية أولا</option>';return}
  if(list){c.hidden=false;t.hidden=true;t.value="";c.disabled=false;fill(c,list,["","اختر البلدية"])}
  else{c.hidden=true;c.value="";t.hidden=false}
  refresh();
};
$("bacNumber").oninput=e=>{e.target.value=e.target.value.replace(/\D/g,"")};
$("form").querySelector('[name=phone]').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,"")};

const v=n=>(form.elements[n].value||"").trim();
const commune=()=>v("birthCommune")||v("birthCommuneText");
function required(){return["firstName","lastName","birthDate","phone","birthWilaya","faculty","major","bacYear","bacNumber"].map(v).concat(commune())}
function refresh(){
  $("c-name").textContent=(v("firstName")+" "+v("lastName")).trim()||"الاسم واللقب";
  $("c-birth").textContent=v("birthDate")?new Date(v("birthDate")).toLocaleDateString("ar-DZ",{year:"numeric",month:"long",day:"numeric"}):"—";
  $("c-place").textContent=[commune(),v("birthWilaya")].filter(Boolean).join("، ")||"—";
  $("c-fac").textContent=v("faculty")||"—";
  $("c-bac").textContent=[v("bacYear"),v("bacNumber")].filter(Boolean).join(" · ")||"—";
  $("c-res").textContent=v("residence")||"غير مقيم";
  const r=required(),p=Math.round(r.filter(Boolean).length/r.length*100);
  $("bar").style.width=p+"%";$("pct").textContent="اكتمال الاستمارة "+p+"%";
}
form.addEventListener("input",refresh);form.addEventListener("change",refresh);

form.onsubmit=async e=>{
  e.preventDefault();
  const msg=$("msg");msg.textContent="";
  form.querySelectorAll(".bad").forEach(x=>x.classList.remove("bad"));
  const bad=[];
  ["firstName","lastName","birthDate","birthWilaya","faculty","major","bacYear","bacNumber"].forEach(n=>{if(!v(n))bad.push(form.elements[n])});
  if(!commune())bad.push($("wilaya").value&&!COMMUNES[$("wilaya").value]?$("communeText"):$("commune"));
  if(!/^0[567]\d{8}$/.test(v("phone")))bad.push(form.elements.phone);
  if(v("email")&&!form.elements.email.checkValidity())bad.push(form.elements.email);
  if(bad.length){bad.forEach(x=>x.classList.add("bad"));bad[0].focus();msg.textContent="تأكد من الخانات المحددة بالأحمر (الهاتف يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام).";return}
  const data={firstName:v("firstName"),lastName:v("lastName"),birthDate:v("birthDate"),birthWilaya:v("birthWilaya"),birthCommune:commune(),phone:v("phone"),email:v("email"),university:v("university"),faculty:v("faculty"),major:v("major"),bacYear:v("bacYear"),bacNumber:v("bacNumber"),residence:v("residence")||"غير مقيم"};
  const btn=$("send");btn.disabled=true;btn.textContent="جار الإرسال…";
  try{
    await fetch(SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});
    $("done").hidden=false;
  }catch(err){msg.textContent="تعذر الإرسال. تحقق من اتصالك وأعد المحاولة.";btn.disabled=false;btn.textContent="أرسل طلب الانخراط"}
};
refresh();
