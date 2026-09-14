/* CareFlow v1
   Vanilla HTML/CSS/JS prototype.
   Data is stored only in browser localStorage.
   All patient data in this demo is synthetic.
*/

const STORAGE_KEY = "careflow_v1_db";
const SETTINGS_KEY = "careflow_v1_settings";

const prakritiQuestions = [
  "Your natural body build is generally…",
  "Your skin tends to be…",
  "Your appetite is usually…",
  "Your sleep pattern is generally…",
  "Your energy during the day is…",
  "Your response to cold weather is…",
  "Your usual speech style is…",
  "Your memory and learning style tends to be…",
  "Your natural pace of movement is…",
  "Your hair tends to be…",
  "Your reaction under pressure is usually…",
  "Your preferred climate is…",
  "Your digestion tends to be…",
  "Your emotional pattern is generally…",
  "Your stamina for prolonged activity is…",
  "Your body temperature generally feels…",
  "Your routine preference is…",
  "Your concentration is generally…",
  "Your appetite timing is…",
  "Your overall temperament is best described as…"
];

const options = [
  {label:"Option A", type:"vata"},
  {label:"Option B", type:"pitta"},
  {label:"Option C", type:"kapha"}
];

const demoPatients = [
  {
    id:"p1", fullName:"Aarav Mehta", age:28, gender:"Male", phone:"9000000001", abhaId:"",
    createdAt:"2026-09-02T09:30:00", updatedAt:"2026-09-08T11:10:00",
    prakriti:{vata:35,pitta:45,kapha:20,result:"Pitta dominant",answers:[]},
    cases:[{id:"c1",date:"2026-09-08",chiefComplaint:"Recurring acidity and post-meal discomfort",symptoms:["Acidity","Bloating","Irregular appetite"],history:"Symptoms noticed intermittently over the past month. Patient reports discomfort after heavy meals.",observations:"Demo AYUSH observations entered for prototype.",diagnosis:"Practitioner assessment — demo only",treatment:"Practitioner-entered management plan — demo only",followUp:"2026-09-22",summary:""}],
    followUps:[{id:"f1",caseId:"c1",date:"2026-09-22",status:"Upcoming",notes:"Review symptoms and response to management plan."}]
  },
  {
    id:"p2", fullName:"Diya Sharma", age:34, gender:"Female", phone:"9000000002", abhaId:"",
    createdAt:"2026-09-01T10:00:00", updatedAt:"2026-09-09T15:00:00",
    prakriti:{vata:25,pitta:25,kapha:50,result:"Kapha dominant",answers:[]},
    cases:[{id:"c2",date:"2026-09-09",chiefComplaint:"Seasonal nasal congestion",symptoms:["Nasal congestion","Sneezing","Heaviness"],history:"Intermittent seasonal symptoms. No real medical data is represented.",observations:"Demo AYUSH observations.",diagnosis:"Practitioner assessment — demo only",treatment:"Practitioner-entered management plan — demo only",followUp:"2026-09-24",summary:""}],
    followUps:[{id:"f2",caseId:"c2",date:"2026-09-24",status:"Upcoming",notes:"Demo follow-up."}]
  },
  {
    id:"p3", fullName:"Rohan Verma", age:22, gender:"Male", phone:"9000000003", abhaId:"",
    createdAt:"2026-08-27T12:00:00", updatedAt:"2026-09-04T13:20:00",
    prakriti:{vata:50,pitta:30,kapha:20,result:"Vata dominant",answers:[]},
    cases:[{id:"c3",date:"2026-09-04",chiefComplaint:"Difficulty maintaining regular routine",symptoms:["Fatigue","Irregular routine","Restlessness"],history:"Synthetic demonstration case created for CareFlow.",observations:"Demo AYUSH observations.",diagnosis:"Practitioner assessment — demo only",treatment:"Practitioner-entered management plan — demo only",followUp:"2026-09-18",summary:""}],
    followUps:[{id:"f3",caseId:"c3",date:"2026-09-18",status:"Upcoming",notes:"Demo follow-up."}]
  },
  {
    id:"p4", fullName:"Meera Joshi", age:41, gender:"Female", phone:"9000000004", abhaId:"",
    createdAt:"2026-08-20T08:30:00", updatedAt:"2026-08-29T10:00:00",
    prakriti:{vata:30,pitta:40,kapha:30,result:"Pitta dominant",answers:[]},
    cases:[{id:"c4",date:"2026-08-29",chiefComplaint:"General wellness consultation",symptoms:["Fatigue"],history:"Synthetic demo record.",observations:"Demo observations.",diagnosis:"Practitioner assessment — demo only",treatment:"Practitioner-entered management plan — demo only",followUp:"2026-09-16",summary:""}],
    followUps:[{id:"f4",caseId:"c4",date:"2026-09-16",status:"Upcoming",notes:"Demo follow-up."}]
  }
];

const state = {
  view:"dashboard",
  selectedPatient:null,
  search:"",
  settings:loadSettings(),
  newPatientId:null
};

function clone(obj){ return JSON.parse(JSON.stringify(obj)); }

function initialDB(){
  return {patients:clone(demoPatients), meta:{createdAt:new Date().toISOString(), version:"1.0"}};
}
function getDB(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){const db=initialDB(); saveDB(db); return db;}
    const db=JSON.parse(raw);
    db.patients ||= [];
    return db;
  }catch(e){return initialDB();}
}
function saveDB(db){localStorage.setItem(STORAGE_KEY,JSON.stringify(db));}
function loadSettings(){
  try{return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{compact:false,confirmDelete:true};}
  catch(e){return {compact:false,confirmDelete:true};}
}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(state.settings));}

function uid(prefix="id"){return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7);}
function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();}
function esc(value=""){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function formatDate(value){
  if(!value) return "—";
  const d=new Date(value+"T00:00:00");
  if(Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function todayISO(){return new Date().toISOString().slice(0,10);}
function getPatient(id){return getDB().patients.find(p=>p.id===id);}
function latestCase(p){return (p?.cases||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0];}
function latestPrakriti(p){return p?.prakriti||null;}
function totalCases(db){return db.patients.reduce((n,p)=>n+(p.cases?.length||0),0);}
function allFollowups(db){
  return db.patients.flatMap(p=>(p.followUps||[]).map(f=>({...f,patient:p}))).sort((a,b)=>a.date.localeCompare(b.date));
}
function upcomingFollowups(db){
  return allFollowups(db).filter(f=>f.status!=="Completed" && f.date>=todayISO());
}
function showToast(message,type=""){
  const el=document.createElement("div");el.className="toast "+type;el.textContent=message;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(()=>el.remove(),2800);
}
function navigate(view,patientId=null){
  state.view=view;
  state.selectedPatient=patientId;
  const map={
    dashboard:["Dashboard","Overview of your practice records"],
    patients:["Patients","Search and manage patient records"],
    "new-patient":["New Patient","Register a patient and begin a structured case"],
    prakriti:["Prakriti Assessment","Prototype questionnaire — not clinically validated"],
    "case-entry":["Case Entry","Capture structured consultation information"],
    summary:["Case Summary","Review the structured case record"],
    profile:["Patient Profile","Patient information, cases and follow-up timeline"],
    followups:["Follow-ups","Track upcoming and completed follow-up visits"],
    settings:["Settings","Prototype configuration and local data controls"]
  };
  document.getElementById("pageTitle").textContent=map[view]?.[0]||"CareFlow";
  document.getElementById("pageSubtitle").textContent=map[view]?.[1]||"";
  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  document.getElementById("sidebar").classList.remove("open");
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}

function render(){
  const app=document.getElementById("app");
  const views={dashboard:renderDashboard,patients:renderPatients,"new-patient":renderNewPatient,prakriti:renderPrakriti,"case-entry":renderCaseEntry,summary:renderSummary,profile:renderProfile,followups:renderFollowups,settings:renderSettings};
  app.innerHTML=views[state.view] ? views[state.view]() : renderDashboard();
  bindViewEvents();
}

function renderDashboard(){
  const db=getDB(), patients=db.patients, followups=upcomingFollowups(db);
  const recent=patients.slice().sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,5);
  return `
    <div class="page-head"><div><h2>Welcome</h2><p>Here’s what’s happening in your demo practice.</p></div><button class="btn btn-primary" data-action="new-patient">＋ Add New Patient</button></div>
    <div class="stats">
      <div class="stat-card"><div class="stat-label">Total Patients</div><div class="stat-value">${patients.length}</div><div class="stat-foot">Stored locally in this browser</div></div>
      <div class="stat-card"><div class="stat-label">Total Cases</div><div class="stat-value">${totalCases(db)}</div><div class="stat-foot">Structured case records</div></div>
      <div class="stat-card"><div class="stat-label">Follow-ups Due</div><div class="stat-value">${followups.length}</div><div class="stat-foot">Upcoming demo follow-ups</div></div>
      <div class="stat-card"><div class="stat-label">Data Mode</div><div class="stat-value" style="font-size:19px;margin-top:12px">Local</div><div class="stat-foot">No server or cloud database</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><h3>Recent Patients</h3><button class="btn btn-sm" data-action="patients">View all</button></div>
        <div class="table-wrap">${recent.length?patientTable(recent):emptyState("No patients yet","Register your first demo patient.")}</div>
      </div>
      <div class="card"><div class="card-header"><h3>Upcoming Follow-ups</h3><button class="btn btn-sm" data-action="followups">View all</button></div>
        <div class="card-body">${followups.slice(0,5).map(followupItem).join("")||emptyState("No upcoming follow-ups","They will appear here after a case is saved.")}</div>
      </div>
    </div>`;
}

function emptyState(title,text){return `<div class="empty"><strong>${esc(title)}</strong>${esc(text)}</div>`;}

function patientTable(list){
  return `<table class="table"><thead><tr><th>Patient</th><th>Last Visit</th><th>Prakriti</th><th>Follow-up</th><th></th></tr></thead><tbody>
  ${list.map(p=>{const c=latestCase(p), f=(p.followUps||[]).filter(x=>x.status!=="Completed").sort((a,b)=>a.date.localeCompare(b.date))[0];
    return `<tr class="clickable" data-patient="${p.id}"><td><div class="patient-cell"><div class="patient-avatar">${initials(p.fullName)}</div><div><div class="patient-name">${esc(p.fullName)}</div><div class="patient-meta">${p.age} yrs · ${esc(p.gender)}</div></div></div></td><td>${formatDate(c?.date)}</td><td><span class="badge badge-green">${esc(p.prakriti?.result||"Not assessed")}</span></td><td>${formatDate(f?.date)}</td><td>›</td></tr>`;
  }).join("")}</tbody></table>`;
}

function followupItem(f){
  return `<div class="followup-item"><div><div class="followup-name">${esc(f.patient.fullName)}</div><div class="followup-date">${formatDate(f.date)} · ${esc(f.notes||"Follow-up review")}</div></div><span class="badge ${f.date===todayISO()?"badge-orange":"badge-gray"}">${f.date===todayISO()?"Today":"Upcoming"}</span></div>`;
}

function renderPatients(){
  const db=getDB();
  const filtered=db.patients.filter(p=>(p.fullName+" "+p.phone+" "+p.gender).toLowerCase().includes(state.search.toLowerCase())).sort((a,b)=>a.fullName.localeCompare(b.fullName));
  return `<div class="page-head"><div><h2>Patients</h2><p>${db.patients.length} patient records in the demo database.</p></div><button class="btn btn-primary" data-action="new-patient">＋ Add New Patient</button></div>
    <div class="card"><div class="card-body"><div class="search-row"><div class="search"><span class="search-icon">⌕</span><input id="patientSearch" value="${esc(state.search)}" placeholder="Search by name, phone or gender…" /></div></div>
    <div class="table-wrap">${filtered.length?patientTable(filtered):emptyState("No matching patients","Try a different search term.")}</div></div></div>`;
}

function renderNewPatient(){
  return `<div class="page-head"><div><h2>Register New Patient</h2><p>Start a structured CareFlow case record.</p></div></div>
  <div class="card form-card"><form id="newPatientForm">
    <div class="form-section"><div class="section-title">Basic Information</div><div class="section-subtitle">Use synthetic information for this prototype.</div>
      <div class="form-grid">
        <div class="field full"><label>Full Name <span>*</span></label><input name="fullName" required placeholder="e.g. Ananya Kapoor" /></div>
        <div class="field"><label>Age <span>*</span></label><input type="number" name="age" min="1" max="120" required placeholder="28" /></div>
        <div class="field"><label>Gender</label><select name="gender"><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></select></div>
        <div class="field"><label>Phone <span>optional</span></label><input name="phone" inputmode="numeric" placeholder="9000000000" /></div>
        <div class="field"><label>ABHA ID <span>optional — demo only</span></label><input name="abhaId" placeholder="Not required for prototype" /></div>
      </div>
    </div>
    
    <div class="form-actions"><button type="button" class="btn" data-action="dashboard">Cancel</button><button class="btn btn-primary">Create Patient & Continue →</button></div>
  </form></div>`;
}

function renderPrakriti(){
  const p=getPatient(state.selectedPatient);
  if(!p)return missingPatient();
  return `<div class="page-head"><div><h2>Prakriti Assessment</h2><p>${esc(p.fullName)} · Prototype scoring for demonstration only</p></div><span class="badge badge-orange">Not clinically validated</span></div>
    <div class="stepper"><div class="step active"><span class="step-circle">1</span> Registration</div><span class="step-line"></span><div class="step active"><span class="step-circle">2</span> Prakriti</div><span class="step-line"></span><div class="step"><span class="step-circle">3</span> Case</div><span class="step-line"></span><div class="step"><span class="step-circle">4</span> Summary</div></div>
    <div class="card"><div class="card-body"><div class="prototype-banner" style="margin:0 0 18px">The questions below are placeholders for the software prototype. Replace them and verify scoring against authoritative AYUSH/academic sources before any real-world use.</div>
    <form id="prakritiForm"><div class="question-list">${prakritiQuestions.map((q,i)=>`
      <div class="question"><div class="question-title">${i+1}. ${q}</div><div class="options">${options.map(o=>`<div class="option"><input required type="radio" name="q${i}" id="q${i}_${o.type}" value="${o.type}"><label for="q${i}_${o.type}">${o.label}</label></div>`).join("")}</div></div>`).join("")}</div>
    <div class="form-actions" style="margin:20px -17px -17px"><button type="button" class="btn" data-action="profile" data-id="${p.id}">Cancel</button><button class="btn btn-primary">Calculate Prototype Result →</button></div></form></div></div>`;
}

function renderCaseEntry(){
  const p=getPatient(state.selectedPatient);
  if(!p)return missingPatient();
  const c=state.editingCaseId ? p.cases.find(x=>x.id===state.editingCaseId) : null;
  return `<div class="page-head"><div><h2>${c?"Edit":"New"} Case Entry</h2><p>${esc(p.fullName)} · ${p.age} yrs · ${esc(p.gender)}</p></div><span class="badge badge-gray">Practitioner-led documentation</span></div>
  <div class="stepper"><div class="step active"><span class="step-circle">1</span> Registration</div><span class="step-line"></span><div class="step active"><span class="step-circle">2</span> Prakriti</div><span class="step-line"></span><div class="step active"><span class="step-circle">3</span> Case</div><span class="step-line"></span><div class="step"><span class="step-circle">4</span> Summary</div></div>
  <div class="card form-card"><form id="caseForm">
    <div class="form-section"><div class="section-title">Consultation</div><div class="form-grid"><div class="field full"><label>Chief Complaint <span>*</span></label><textarea name="chiefComplaint" required placeholder="Primary reason for consultation…">${esc(c?.chiefComplaint||"")}</textarea></div>
      <div class="field full"><label>Symptoms / Concerns <span>*</span></label><div class="tag-list">${["Fatigue","Pain","Acidity","Bloating","Headache","Nasal congestion","Cough","Sleep difficulty","Stress","Irregular appetite","Skin concern","Other"].map(s=>`<div class="check-tag"><input type="checkbox" name="symptoms" value="${esc(s)}" id="sym_${s.replace(/\W/g,"")}"><label for="sym_${s.replace(/\W/g,"")}">${esc(s)}</label></div>`).join("")}</div></div>
      <div class="field full"><label>Case History</label><textarea name="history" placeholder="Relevant history documented by practitioner…">${esc(c?.history||"")}</textarea></div>
    </div></div>
    <div class="form-section"><div class="section-title">AYUSH Case Information</div><div class="section-subtitle">Fields are intentionally generic until the team verifies the exact clinical data dictionary.</div>
      <div class="form-grid"><div class="field full"><label>AYUSH Observations</label><textarea name="observations" placeholder="Enter verified case-taking observations…">${esc(c?.observations||"")}</textarea></div>
      <div class="field"><label>Practitioner Assessment / Diagnosis</label><textarea name="diagnosis" placeholder="Entered by practitioner — not generated by CareFlow">${esc(c?.diagnosis||"")}</textarea></div>
      <div class="field"><label>Treatment / Management Plan</label><textarea name="treatment" placeholder="Entered by practitioner — no autonomous recommendations">${esc(c?.treatment||"")}</textarea></div>
      <div class="field"><label>Follow-up Date</label><input type="date" name="followUp" value="${esc(c?.followUp||"")}" /></div>
    </div></div>
    <div class="form-section"><div class="prototype-banner" style="margin:0">CareFlow does not diagnose conditions or recommend medicines/dosages. Clinical assessment and management decisions remain with the practitioner.</div></div>
    <div class="form-actions"><button type="button" class="btn" data-action="profile" data-id="${p.id}">Cancel</button><button class="btn btn-primary">Save Case & Generate Summary →</button></div>
  </form></div>`;
}

function renderSummary(){
  const p=getPatient(state.selectedPatient), c=p?.cases?.find(x=>x.id===state.selectedCaseId)||latestCase(p);
  if(!p||!c)return missingPatient();
  const pr=p.prakriti;
  return `<div class="page-head no-print"><div><h2>Case Summary</h2><p>Structured documentation for ${esc(p.fullName)}</p></div><div style="display:flex;gap:8px"><button class="btn" data-action="edit-case" data-id="${p.id}" data-case="${c.id}">Edit Case</button><button class="btn btn-primary" id="printSummary">Print / Save PDF</button></div></div>
  <div class="card" id="printArea"><div class="card-body">
    <div class="profile-head"><div class="profile-main"><div class="profile-avatar">${initials(p.fullName)}</div><div><div class="profile-name">${esc(p.fullName)}</div><div class="profile-meta">${p.age} yrs · ${esc(p.gender)} · Last visit ${formatDate(c.date)}</div></div></div><span class="badge badge-orange">Demo Record</span></div>
    <div class="summary-grid">
      <div class="summary-box"><h4>Patient</h4><p>Name: ${esc(p.fullName)}
Age: ${p.age}
Gender: ${esc(p.gender)}
Phone: ${esc(p.phone||"Not provided")}</p></div>
      <div class="summary-box"><h4>Prakriti</h4><p>${esc(pr?.result||"Not assessed")}
Vata: ${pr?.vata??"—"}%
Pitta: ${pr?.pitta??"—"}%
Kapha: ${pr?.kapha??"—"}%</p></div>
      <div class="summary-box full"><h4>Chief Complaint</h4><p>${esc(c.chiefComplaint||"Not recorded")}</p></div>
      <div class="summary-box"><h4>Symptoms / Concerns</h4><p>${esc((c.symptoms||[]).join(", ")||"None recorded")}</p></div>
      <div class="summary-box"><h4>Case History</h4><p>${esc(c.history||"Not recorded")}</p></div>
      <div class="summary-box full"><h4>AYUSH Observations</h4><p>${esc(c.observations||"Not recorded")}</p></div>
      <div class="summary-box"><h4>Practitioner Assessment</h4><p>${esc(c.diagnosis||"Not recorded")}</p></div>
      <div class="summary-box"><h4>Treatment / Management</h4><p>${esc(c.treatment||"Not recorded")}</p></div>
      <div class="summary-box full"><h4>Follow-up</h4><p>${c.followUp?formatDate(c.followUp):"No follow-up scheduled"}</p></div>
    </div>
    <div class="prototype-banner" style="margin:18px 0 0">Prototype only. Prakriti scoring is not clinically validated in this application. This summary is a documentation aid, not medical advice or an autonomous clinical decision.</div>
  </div></div>`;
}

function renderProfile(){
  const p=getPatient(state.selectedPatient);
  if(!p)return missingPatient();
  const cases=(p.cases||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
  return `<div class="page-head"><div><h2>Patient Profile</h2><p>Longitudinal record and case history</p></div><div style="display:flex;gap:8px"><button class="btn" data-action="prakriti" data-id="${p.id}">Prakriti Assessment</button><button class="btn btn-primary" data-action="case-entry" data-id="${p.id}">＋ New Case</button></div></div>
    <div class="card"><div class="card-body"><div class="profile-head"><div class="profile-main"><div class="profile-avatar">${initials(p.fullName)}</div><div><div class="profile-name">${esc(p.fullName)}</div><div class="profile-meta">${p.age} years · ${esc(p.gender)} · ${esc(p.phone||"No phone")}</div></div></div><span class="badge badge-green">${esc(p.prakriti?.result||"Prakriti not assessed")}</span></div>
    <div class="tabs"><button class="tab active">Overview</button></div>
    <div class="summary-grid">
      <div class="summary-box"><h4>Patient Details</h4><p>Registered: ${formatDate(p.createdAt.slice(0,10))}
ABHA: ${esc(p.abhaId||"Not provided")}
Cases: ${cases.length}</p></div>
      <div class="summary-box"><h4>Prakriti Result</h4><p>${esc(p.prakriti?.result||"Not assessed")}
Vata ${p.prakriti?.vata??"—"}% · Pitta ${p.prakriti?.pitta??"—"}% · Kapha ${p.prakriti?.kapha??"—"}%</p></div>
    </div></div></div>
    <div class="card" style="margin-top:16px"><div class="card-header"><h3>Case Timeline</h3><span>${cases.length} record(s)</span></div><div class="card-body">
      ${cases.length?`<div class="timeline">${cases.map(c=>`<div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-date">${formatDate(c.date)}</div><div class="timeline-title">${esc(c.chiefComplaint||"Consultation")}</div><div class="timeline-text">${esc((c.symptoms||[]).join(" · "))}<br>${esc(c.history||"No history recorded")}</div><div style="margin-top:8px"><button class="btn btn-sm" data-action="summary" data-id="${p.id}" data-case="${c.id}">View Summary</button> <button class="btn btn-sm" data-action="edit-case" data-id="${p.id}" data-case="${c.id}">Edit</button></div></div>`).join("")}</div>`:emptyState("No cases yet","Start a new case for this patient.")}
    </div></div>`;
}

function renderFollowups(){
  const db=getDB(), items=allFollowups(db);
  return `<div class="page-head"><div><h2>Follow-ups</h2><p>Track upcoming patient follow-up visits.</p></div></div>
    <div class="card"><div class="card-body"><div class="table-wrap">${items.length?`<table class="table"><thead><tr><th>Patient</th><th>Date</th><th>Related Case</th><th>Status</th><th>Action</th></tr></thead><tbody>${items.map(f=>`<tr><td><div class="patient-cell"><div class="patient-avatar">${initials(f.patient.fullName)}</div><div><div class="patient-name">${esc(f.patient.fullName)}</div><div class="patient-meta">${f.patient.age} yrs · ${esc(f.patient.gender)}</div></div></div></td><td>${formatDate(f.date)}</td><td>${esc(latestCase(f.patient)?.chiefComplaint||"Case")}</td><td><span class="badge ${f.status==="Completed"?"badge-green":f.date<todayISO()?"badge-red":"badge-orange"}">${esc(f.date<todayISO()&&f.status!=="Completed"?"Overdue":f.status)}</span></td><td><button class="btn btn-sm" data-action="profile" data-id="${f.patient.id}">Open patient</button> ${f.status!=="Completed"?`<button class="btn btn-sm" data-complete-followup="${f.patient.id}" data-followup="${f.id}">Mark done</button>`:""}</td></tr>`).join("")}</tbody></table>`:emptyState("No follow-ups","Create a case with a follow-up date to populate this list.")}</div></div></div>`;
}

function renderSettings(){
  const db=getDB();
  return `<div class="page-head"><div><h2>Settings</h2><p>Prototype controls and local storage information.</p></div></div>
  <div class="card form-card"><div class="card-body"><div class="settings-list">
    <div class="setting-row"><div><div class="setting-title">Demo Mode</div><div class="setting-desc">CareFlow uses synthetic data only. No information leaves this browser.</div></div><span class="badge badge-green">Active</span></div>
    <div class="setting-row"><div><div class="setting-title">Compact Interface</div><div class="setting-desc">Use a slightly denser layout for tables and records.</div></div><button class="toggle ${state.settings.compact?"on":""}" id="compactToggle" aria-label="Toggle compact interface"></button></div>
    <div class="setting-row"><div><div class="setting-title">Confirm before reset</div><div class="setting-desc">Ask before replacing the current browser data with the original demo dataset.</div></div><button class="toggle ${state.settings.confirmDelete?"on":""}" id="confirmToggle" aria-label="Toggle reset confirmation"></button></div>
    <div class="setting-row"><div><div class="setting-title">Local database</div><div class="setting-desc">${db.patients.length} patients · ${totalCases(db)} cases · ${allFollowups(db).length} follow-ups. Stored under localStorage key <code>${STORAGE_KEY}</code>.</div></div><span class="badge badge-gray">Browser only</span></div>
    <div class="setting-row"><div><div class="setting-title">Data controls</div><div class="setting-desc">For a real deployment, replace localStorage with an authenticated backend and apply appropriate privacy/security controls.</div></div><button class="btn btn-danger btn-sm" id="resetFromSettings">Reset demo data</button></div>
  </div></div></div>`;
}

function missingPatient(){return `<div class="card"><div class="card-body">${emptyState("Patient not found","Return to Patients and select a patient.")}<div style="text-align:center"><button class="btn btn-primary" data-action="patients">Go to Patients</button></div></div></div>`;}

function bindViewEvents(){
  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
  document.querySelectorAll("[data-action]").forEach(el=>el.addEventListener("click",handleAction));
  document.querySelectorAll("[data-patient]").forEach(el=>el.addEventListener("click",()=>navigate("profile",el.dataset.patient)));

  const search=document.getElementById("patientSearch");
  if(search) search.addEventListener("input",e=>{state.search=e.target.value;render();const s=document.getElementById("patientSearch");s?.focus();s?.setSelectionRange(s.value.length,s.value.length)});

  const newForm=document.getElementById("newPatientForm");
  if(newForm)newForm.addEventListener("submit",handleNewPatient);

  const prakForm=document.getElementById("prakritiForm");
  if(prakForm)prakForm.addEventListener("submit",handlePrakriti);

  const caseForm=document.getElementById("caseForm");
  if(caseForm)caseForm.addEventListener("submit",handleCase);

  document.getElementById("printSummary")?.addEventListener("click",()=>window.print());

  document.querySelectorAll("[data-complete-followup]").forEach(btn=>btn.addEventListener("click",()=>{
    const db=getDB(),p=getPatient(btn.dataset.completeFollowup),f=p?.followUps?.find(x=>x.id===btn.dataset.followup);
    if(f){f.status="Completed";f.completedAt=todayISO();saveDB(db);showToast("Follow-up marked as completed");render();}
  }));

  document.getElementById("compactToggle")?.addEventListener("click",()=>{
    state.settings.compact=!state.settings.compact;saveSettings();document.body.classList.toggle("compact",state.settings.compact);render();
  });
  document.getElementById("confirmToggle")?.addEventListener("click",()=>{
    state.settings.confirmDelete=!state.settings.confirmDelete;saveSettings();render();
  });
  document.getElementById("resetFromSettings")?.addEventListener("click",resetDemo);
}

function handleAction(e){
  const action=e.currentTarget.dataset.action, id=e.currentTarget.dataset.id;
  if(action==="new-patient")navigate("new-patient");
  else if(action==="patients")navigate("patients");
  else if(action==="dashboard")navigate("dashboard");
  else if(action==="followups")navigate("followups");
  else if(action==="profile")navigate("profile",id);
  else if(action==="prakriti"){state.selectedPatient=id;navigate("prakriti",id);}
  else if(action==="case-entry"){state.selectedPatient=id;state.editingCaseId=null;navigate("case-entry",id);}
  else if(action==="summary"){state.selectedPatient=id;state.selectedCaseId=e.currentTarget.dataset.case;navigate("summary",id);}
  else if(action==="edit-case"){state.selectedPatient=id;state.editingCaseId=e.currentTarget.dataset.case;navigate("case-entry",id);}
}

function handleNewPatient(e){
  e.preventDefault();
  const fd=new FormData(e.target);
  const db=getDB();
  const p={id:uid("p"),fullName:fd.get("fullName").trim(),age:Number(fd.get("age")),gender:fd.get("gender"),phone:fd.get("phone").trim(),abhaId:fd.get("abhaId").trim(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),prakriti:null,cases:[],followUps:[]};
  db.patients.push(p);saveDB(db);state.selectedPatient=p.id;state.newPatientId=p.id;showToast("Patient created successfully");navigate("prakriti",p.id);
}

function handlePrakriti(e){
  e.preventDefault();
  const fd=new FormData(e.target), counts={vata:0,pitta:0,kapha:0}, answers=[];
  prakritiQuestions.forEach((_,i)=>{const value=fd.get("q"+i);counts[value]++;answers.push(value)});
  const total=prakritiQuestions.length;
  const scores={vata:Math.round(counts.vata/total*100),pitta:Math.round(counts.pitta/total*100),kapha:Math.round(counts.kapha/total*100)};
  let result="Balanced prototype result";
  const max=Math.max(scores.vata,scores.pitta,scores.kapha);
  const winners=Object.entries(scores).filter(([,v])=>v===max).map(([k])=>k);
  if(winners.length===1) result=winners[0][0].toUpperCase()+winners[0].slice(1)+" dominant";
  else result="Mixed prototype result";
  const db=getDB(),p=getPatient(state.selectedPatient);
  p.prakriti={...scores,result,answers,assessedAt:new Date().toISOString()};
  p.updatedAt=new Date().toISOString();saveDB(db);
  showToast("Prototype Prakriti result saved");navigate("case-entry",p.id);
}

function handleCase(e){
  e.preventDefault();
  const fd=new FormData(e.target),db=getDB(),p=getPatient(state.selectedPatient);
  const symptoms=fd.getAll("symptoms");
  let c=state.editingCaseId?p.cases.find(x=>x.id===state.editingCaseId):null;
  if(!c){c={id:uid("c"),date:todayISO()};p.cases.push(c);}
  c.chiefComplaint=fd.get("chiefComplaint").trim();c.symptoms=symptoms;c.history=fd.get("history").trim();c.observations=fd.get("observations").trim();c.diagnosis=fd.get("diagnosis").trim();c.treatment=fd.get("treatment").trim();c.followUp=fd.get("followUp")||"";
  c.updatedAt=new Date().toISOString();
  p.updatedAt=new Date().toISOString();
  if(c.followUp){
    let f=p.followUps.find(x=>x.caseId===c.id);
    if(!f){f={id:uid("f"),caseId:c.id};p.followUps.push(f);}
    f.date=c.followUp;f.status="Upcoming";f.notes="Review symptoms and practitioner-entered management plan.";
  }
  c.summary=buildSummary(p,c);
  saveDB(db);state.selectedCaseId=c.id;state.editingCaseId=null;showToast("Case saved and summary generated");navigate("summary",p.id);
}

function buildSummary(p,c){
  return `Patient: ${p.fullName}\nChief complaint: ${c.chiefComplaint}\nSymptoms: ${(c.symptoms||[]).join(", ")}\nCase history: ${c.history||"Not recorded"}\nPrakriti: ${p.prakriti?.result||"Not assessed"}\nPractitioner assessment: ${c.diagnosis||"Not recorded"}\nManagement plan: ${c.treatment||"Not recorded"}\nFollow-up: ${c.followUp?formatDate(c.followUp):"Not scheduled"}`;
}

function resetDemo(){
  if(state.settings.confirmDelete && !confirm("Reset CareFlow to the original synthetic demo data? Your current local changes will be removed."))return;
  saveDB(initialDB());state.search="";state.selectedPatient=null;showToast("Demo data reset");navigate("dashboard");
}

document.getElementById("resetDemoBtn").addEventListener("click",resetDemo);
document.getElementById("mobileMenuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
function closeModal(){document.getElementById("modalBackdrop").classList.add("hidden");document.getElementById("modal").innerHTML="";}

document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

if(!localStorage.getItem(STORAGE_KEY))saveDB(initialDB());
document.body.classList.toggle("compact",state.settings.compact);
render();