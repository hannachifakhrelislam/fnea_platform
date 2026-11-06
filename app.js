// ضع هنا رابط Apps Script المنشور (Web app)
const SCRIPT_URL="PUT_YOUR_APPS_SCRIPT_URL_HERE";
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
