import { useState, useEffect, useRef } from "react";

const ADMIN = { username: "libreria", password: "1234" };
const LIBRARIANS = ["Marco", "Sara", "Giulia", "Luca", "Anna"];
const OCCASIONS = [
  { id: "normale", label: "🛒 Normale" },
  { id: "bookclub", label: "📖 Bookclub" },
  { id: "presentazione", label: "🎤 Presentazione" },
  { id: "regalo", label: "🎁 Regalo" },
];
const BOOK_COLORS = ["#8B2635","#5C4033","#2E5D4B","#1A3A5C","#6B3D8B"];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
*{box-sizing:border-box;}
.app{font-family:'Helvetica Neue',Arial,sans-serif;background:#F5F0E8;min-height:100vh;color:#1A1A1A;}
.hdr{background:#1A1A1A;padding:16px 24px 12px;display:flex;align-items:center;justify-content:space-between;}
.hdr-title{font-family:'Playfair Display',Georgia,serif;color:#FDFAF5;font-size:22px;font-weight:600;letter-spacing:.02em;}
.hdr-sub{font-size:11px;color:#A09890;margin-top:2px;letter-spacing:.08em;text-transform:uppercase;}
.hdr-btn{font-size:12px;color:#A09890;background:none;border:none;cursor:pointer;}
.hdr-btn:hover{color:#FDFAF5;}
.tabbar{background:#1A1A1A;padding:0 24px;display:flex;gap:2px;border-top:1px solid #2E2E2E;}
.tab{padding:10px 16px 0;font-size:13px;cursor:pointer;border-radius:6px 6px 0 0;color:#A09890;border:none;background:none;transition:color .15s;letter-spacing:.02em;}
.tab:hover{color:#FDFAF5;}
.tab.active{background:#F5F0E8;color:#1A1A1A;font-weight:500;padding-bottom:10px;}
.tab-x{margin-left:6px;opacity:.5;font-size:15px;}
.tab-x:hover{opacity:1;}
.content{padding:24px;max-width:760px;margin:0 auto;}
.card{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.card-dark{background:#1A1A1A;border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.card-title{font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:500;margin:0 0 14px;color:#1A1A1A;}
.card-title-light{font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:500;margin:0 0 12px;color:#FDFAF5;}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
.stat{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:14px 16px;}
.stat-label{font-size:11px;color:#6B6560;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;}
.stat-value{font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:500;color:#1A1A1A;margin:0;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
.row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #EDE8E0;}
.row:last-child{border-bottom:none;}
.row-name{font-size:13px;color:#1A1A1A;}
.row-val{font-size:13px;font-weight:500;color:#8B2635;}
.row-sub{font-size:11px;color:#6B6560;margin-top:1px;}
.stamp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0;}
.stamp{height:54px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all .2s;}
.stamp.filled{background:#1A1A1A;border:1.5px solid #1A1A1A;}
.stamp.empty{background:#F0EBE1;border:1.5px solid #E0D8CC;}
.btn-primary{width:100%;background:#1A1A1A;color:#FDFAF5;border:none;border-radius:8px;padding:12px;font-size:15px;font-weight:500;cursor:pointer;letter-spacing:.02em;transition:background .15s;}
.btn-primary:hover{background:#333;}
.btn-sec{background:none;border:1px solid #C8C0B4;border-radius:8px;padding:10px;font-size:14px;cursor:pointer;color:#1A1A1A;transition:background .15s;}
.btn-sec:hover{background:#F0EBE1;}
.btn-danger{background:none;border:none;font-size:13px;color:#8B2635;cursor:pointer;padding:0;}
.badge-bord{display:inline-block;background:#8B2635;color:#FDFAF5;font-size:11px;padding:3px 10px;border-radius:20px;letter-spacing:.04em;}
input,select{width:100%;padding:9px 12px;border:1px solid #D8D0C4;border-radius:8px;font-size:14px;background:#FDFAF5;color:#1A1A1A;outline:none;margin-bottom:10px;font-family:inherit;}
input:focus,select:focus{border-color:#1A1A1A;}
label{font-size:12px;color:#6B6560;letter-spacing:.04em;text-transform:uppercase;display:block;margin-bottom:4px;}
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:500;flex-shrink:0;font-family:'Playfair Display',Georgia,serif;}
.client-row{display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #EDE8E0;cursor:pointer;transition:background .1s;}
.client-row:hover{background:#F0EBE1;margin:0 -4px;padding:13px 4px;border-radius:6px;}
.dots{display:flex;gap:4px;}
.dot{width:8px;height:8px;border-radius:50%;}
.overlay{position:absolute;inset:0;background:rgba(20,15,10,.45);display:flex;align-items:center;justify-content:center;z-index:100;border-radius:12px;}
.modal{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:12px;padding:22px 24px;width:310px;}
.modal-title{font-family:'Playfair Display',Georgia,serif;font-size:17px;margin:0 0 16px;color:#1A1A1A;}
.prize-screen{min-height:320px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;}
.lib-tag{font-size:11px;color:#A09890;background:#F0EBE1;border-radius:4px;padding:2px 7px;margin-left:5px;}
.occ-tag{font-size:11px;padding:2px 7px;border-radius:4px;margin-left:5px;background:#EDE8DF;color:#5C3A2A;}
.occ-btn{display:inline-block;font-size:12px;padding:6px 12px;border-radius:6px;margin:0 6px 6px 0;cursor:pointer;border:1px solid #D8D0C4;background:#F0EBE1;color:#5C3A2A;transition:all .15s;}
.occ-btn.sel{background:#1A1A1A;color:#FDFAF5;border-color:#1A1A1A;}
.bar-wrap{display:flex;align-items:flex-end;gap:3px;height:64px;margin-top:8px;}
.bar-col{display:flex;flex-direction:column;align-items:center;flex:1;}
.bar-inner{border-radius:3px 3px 0 0;width:100%;background:#1A1A1A;transition:height .3s;}
.bar-lbl{font-size:9px;color:#6B6560;margin-top:3px;}
.export-bar{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.export-btn{display:flex;align-items:center;gap:6px;font-size:13px;color:#1A1A1A;background:none;border:1px solid #D8D0C4;border-radius:7px;padding:7px 14px;cursor:pointer;transition:background .15s;}
.export-btn:hover{background:#F0EBE1;}
`;

function getInitials(n){return n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);}
function nowTime(){return new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});}
function nowDate(){return new Date().toLocaleDateString("it-IT");}
function hourFromTime(t){if(!t)return null;const p=t.split(":");return p.length>=1?parseInt(p[0]):null;}

function LoginPage({onLogin}){
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");
  function handle(){if(u===ADMIN.username&&p===ADMIN.password)onLogin();else setErr("Credenziali errate. Riprova.");}
  return(
    <div style={{minHeight:"100vh",background:"#F5F0E8",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:32,fontWeight:600,color:"#1A1A1A"}}>📚 La Pagina</div>
        <div style={{fontSize:11,color:"#6B6560",letterSpacing:".1em",textTransform:"uppercase",marginTop:4}}>Gestione Fedeltà</div>
        <div style={{width:40,height:2,background:"#8B2635",margin:"10px auto 0"}}/>
      </div>
      <div style={{background:"#FDFAF5",border:"1px solid #E0D8CC",borderRadius:14,padding:"2rem 2.5rem",width:320}}>
        <label>Username</label><input value={u} onChange={e=>setU(e.target.value)} placeholder="username"/>
        <label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="••••••••"/>
        {err&&<p style={{color:"#8B2635",fontSize:13,margin:"0 0 10px"}}>{err}</p>}
        <button className="btn-primary" onClick={handle} style={{marginTop:4}}>Accedi</button>
        <p style={{fontSize:11,color:"#A09890",textAlign:"center",marginTop:14}}>libreria / 1234</p>
      </div>
    </div>
  );
}

function TabBar({tabs,activeTab,onSelect,onClose}){
  return(
    <div className="tabbar">
      {tabs.map(tab=>{
        const active=tab.id===activeTab;
        return(
          <button key={tab.id} className={`tab${active?" active":""}`} onClick={()=>onSelect(tab.id)}>
            {tab.icon} {tab.label}
            {tab.closable&&<span className="tab-x" onClick={e=>{e.stopPropagation();onClose(tab.id);}}>×</span>}
          </button>
        );
      })}
    </div>
  );
}

function HourChart({purchases}){
  const counts=Array(24).fill(0);
  purchases.forEach(p=>{const h=hourFromTime(p.time);if(h!==null)counts[h]++;});
  const hours=[];
  for(let i=8;i<=21;i++)hours.push(i);
  const max=Math.max(...hours.map(h=>counts[h]),1);
  const peak=hours.reduce((a,h)=>counts[h]>counts[a]?h:a,hours[0]);
  const morning=hours.filter(h=>h<13).reduce((s,h)=>s+counts[h],0);
  const evening=hours.filter(h=>h>=13).reduce((s,h)=>s+counts[h],0);
  const total=morning+evening||1;
  return(
    <div>
      <div className="bar-wrap">
        {hours.map(h=>(
          <div key={h} className="bar-col">
            <div className="bar-inner" style={{height:`${Math.round((counts[h]/max)*64)}px`,background:h===peak?"#8B2635":"#1A1A1A",opacity:counts[h]===0?.15:1}}/>
            <div className="bar-lbl">{h}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
        <span style={{fontSize:10,background:"#8B2635",color:"#FDFAF5",padding:"2px 8px",borderRadius:4}}>Picco: {peak}:00</span>
        <span style={{fontSize:10,background:"#F0EBE1",color:"#5C3A2A",border:"1px solid #E0D8CC",padding:"2px 8px",borderRadius:4}}>Mattina {Math.round(morning/total*100)}%</span>
        <span style={{fontSize:10,background:"#F0EBE1",color:"#5C3A2A",border:"1px solid #E0D8CC",padding:"2px 8px",borderRadius:4}}>Pomeriggio/sera {Math.round(evening/total*100)}%</span>
      </div>
    </div>
  );
}

function OccasionChart({purchases}){
  const counts={};
  OCCASIONS.forEach(o=>counts[o.id]=0);
  purchases.forEach(p=>{if(p.occasion&&counts[p.occasion]!==undefined)counts[p.occasion]++;});
  const total=purchases.length||1;
  return(
    <div>
      {OCCASIONS.map(o=>{
        const pct=Math.round(counts[o.id]/total*100);
        return(
          <div key={o.id} className="row">
            <span className="row-name">{o.label}</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:60,height:6,background:"#EDE8E0",borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:o.id==="normale"?"#1A1A1A":"#8B2635",borderRadius:3}}/>
              </div>
              <span className="row-val" style={{minWidth:28,textAlign:"right"}}>{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard({clients,onExport,onImport,fileRef}){
  const allPurchases=clients.flatMap(c=>c.history);
  const totalSpent=allPurchases.reduce((s,h)=>s+parseFloat(h.amount),0);
  const totalCards=clients.reduce((s,c)=>s+c.totalCards,0);
  const nearPrize=clients.filter(c=>c.stamps>=6).sort((a,b)=>b.stamps-a.stamps);
  const topClients=[...clients].sort((a,b)=>b.history.length-a.history.length).slice(0,5);
  const recent=clients.flatMap(c=>c.history.map(h=>({...h,clientName:c.name}))).slice(0,6);
  return(
    <div>
      <div className="stat-grid">
        {[{l:"Clienti",v:clients.length},{l:"Acquisti",v:allPurchases.length},{l:"Tessere",v:totalCards},{l:"Spesa totale",v:`€${Math.round(totalSpent)}`}].map(m=>(
          <div key={m.l} className="stat"><p className="stat-label">{m.l}</p><p className="stat-value">{m.v}</p></div>
        ))}
      </div>

      <div className="export-bar">
        <span style={{fontSize:13,fontWeight:500,color:"#1A1A1A"}}>💾 Backup dati</span>
        <div style={{display:"flex",gap:8}}>
          <button className="export-btn" onClick={onExport}>↓ Esporta JSON</button>
          <button className="export-btn" onClick={()=>fileRef.current?.click()}>↑ Importa JSON</button>
          <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={onImport}/>
        </div>
      </div>

      <div className="two-col">
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🕐 Ore di punta</p>
          <HourChart purchases={allPurchases}/>
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🎭 Per occasione</p>
          <OccasionChart purchases={allPurchases}/>
        </div>
      </div>

      <div style={{height:14}}/>
      <div className="two-col">
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">⏳ Vicini al premio</p>
          {nearPrize.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessuno ancora vicino.</p>:nearPrize.slice(0,5).map(c=>(
            <div key={c.id} className="row"><span className="row-name">{c.name}</span><span className="row-val">{c.stamps}/8</span></div>
          ))}
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🏆 Clienti top</p>
          {topClients.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessun acquisto.</p>:topClients.map(c=>(
            <div key={c.id} className="row"><span className="row-name">{c.name}</span><span style={{fontSize:13,color:"#6B6560"}}>{c.history.length} acq.</span></div>
          ))}
        </div>
      </div>

      <div style={{height:14}}/>
      <div className="card">
        <p className="card-title">🕐 Ultimi acquisti</p>
        {recent.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessun acquisto ancora.</p>:recent.map((h,i)=>(
          <div key={i} className="row">
            <div style={{flex:1}}>
              <span className="row-name">{h.clientName}</span>
              {h.librarian&&<span className="lib-tag">{h.librarian}</span>}
              {h.occasion&&h.occasion!=="normale"&&<span className="occ-tag">{OCCASIONS.find(o=>o.id===h.occasion)?.label}</span>}
              <div className="row-sub">{h.note||"Acquisto"}{h.occasionDetail?` · ${h.occasionDetail}`:""} · {h.date}{h.time?` ${h.time}`:""}</div>
            </div>
            <span className="row-val">€{h.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientList({clients,setClients,onOpenClient}){
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [n,setN]=useState({name:"",phone:"",email:""});
  const filtered=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search)||c.email.toLowerCase().includes(search.toLowerCase()));
  function addClient(){
    if(!n.name.trim())return;
    const c={id:Date.now(),name:n.name.trim(),phone:n.phone.trim(),email:n.email.trim(),stamps:0,history:[],totalCards:0};
    setClients(prev=>[...prev,c]);setN({name:"",phone:"",email:""});setShowAdd(false);onOpenClient(c);
  }
  return(
    <div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca per nome, telefono o email…"/>
      {showAdd?(
        <div className="card">
          <p className="card-title">Nuovo cliente</p>
          <label>Nome *</label><input value={n.name} onChange={e=>setN(p=>({...p,name:e.target.value}))} placeholder="Nome e cognome"/>
          <label>Telefono</label><input value={n.phone} onChange={e=>setN(p=>({...p,phone:e.target.value}))} placeholder="es. 333 1234567"/>
          <label>Email</label><input value={n.email} onChange={e=>setN(p=>({...p,email:e.target.value}))} placeholder="es. mario@email.com"/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn-primary" onClick={addClient} style={{flex:1}}>Aggiungi</button>
            <button className="btn-sec" onClick={()=>setShowAdd(false)} style={{flex:1}}>Annulla</button>
          </div>
        </div>
      ):(
        <button className="btn-primary" onClick={()=>setShowAdd(true)} style={{marginBottom:16}}>+ Aggiungi cliente</button>
      )}
      {filtered.length===0&&<p style={{fontSize:14,color:"#6B6560"}}>Nessun cliente trovato.</p>}
      {filtered.map((c,i)=>(
        <div key={c.id} className="client-row" onClick={()=>onOpenClient(c)}>
          <div className="avatar" style={{width:42,height:42,background:BOOK_COLORS[i%BOOK_COLORS.length]+"18",color:BOOK_COLORS[i%BOOK_COLORS.length],fontSize:15}}>{getInitials(c.name)}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:500}}>{c.name}</div>
            <div style={{fontSize:12,color:"#6B6560",marginTop:2}}>{c.email||c.phone||"–"}</div>
          </div>
          <div className="dots">{Array.from({length:8},(_,j)=><div key={j} className="dot" style={{background:j<c.stamps?"#1A1A1A":"#D8D0C4"}}/>)}</div>
        </div>
      ))}
    </div>
  );
}

function EditModal({purchase,onSave,onDelete,onClose}){
  const [amount,setAmount]=useState(purchase.amount);
  const [note,setNote]=useState(purchase.note||"");
  const [librarian,setLibrarian]=useState(purchase.librarian||"");
  const [occasion,setOccasion]=useState(purchase.occasion||"normale");
  const [occasionDetail,setOccasionDetail]=useState(purchase.occasionDetail||"");
  return(
    <div className="overlay">
      <div className="modal">
        <p className="modal-title">Modifica acquisto</p>
        <label>Importo (€)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)}/>
        <label>Titolo / nota</label><input value={note} onChange={e=>setNote(e.target.value)}/>
        <label>Librario</label>
        <select value={librarian} onChange={e=>setLibrarian(e.target.value)}>
          <option value="">— nessuno —</option>
          {LIBRARIANS.map(l=><option key={l} value={l}>{l}</option>)}
        </select>
        <label>Occasione</label>
        <div style={{marginBottom:10}}>
          {OCCASIONS.map(o=><span key={o.id} className={`occ-btn${occasion===o.id?" sel":""}`} onClick={()=>setOccasion(o.id)}>{o.label}</span>)}
        </div>
        {occasion!=="normale"&&<><label>Dettaglio (opzionale)</label><input value={occasionDetail} onChange={e=>setOccasionDetail(e.target.value)} placeholder="es. McCarthy – maggio"/></>}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button className="btn-primary" style={{flex:1}} onClick={()=>onSave({...purchase,amount:Number(amount).toFixed(2),note,librarian,occasion,occasionDetail})}>Salva</button>
          <button className="btn-sec" style={{flex:1}} onClick={onClose}>Annulla</button>
        </div>
        <button className="btn-danger" style={{width:"100%",border:"1px solid #D4A0A0",borderRadius:8,padding:"8px"}} onClick={()=>onDelete(purchase.idx)}>Elimina acquisto</button>
      </div>
    </div>
  );
}

function ClientDetail({clientId,clients,setClients,onDelete}){
  const client=clients.find(c=>c.id===clientId);
  const [showPurchase,setShowPurchase]=useState(false);
  const [purchase,setPurchase]=useState({amount:"",note:"",librarian:LIBRARIANS[0],occasion:"normale",occasionDetail:""});
  const [prize,setPrize]=useState(false);
  const [editing,setEditing]=useState(null);
  const ci=clients.indexOf(client);

  if(!client)return<p style={{color:"#6B6560"}}>Cliente non trovato.</p>;

  function addPurchase(){
    if(!purchase.amount||isNaN(Number(purchase.amount)))return;
    setClients(prev=>prev.map(c=>{
      if(c.id!==clientId)return c;
      const newStamps=c.stamps+1;const completed=newStamps>=8;
      const entry={date:nowDate(),time:nowTime(),amount:Number(purchase.amount).toFixed(2),note:purchase.note,librarian:purchase.librarian,occasion:purchase.occasion,occasionDetail:purchase.occasionDetail};
      if(completed)setPrize(true);
      return{...c,stamps:completed?0:newStamps,history:[entry,...c.history],totalCards:c.totalCards+(completed?1:0)};
    }));
    setPurchase({amount:"",note:"",librarian:LIBRARIANS[0],occasion:"normale",occasionDetail:""});setShowPurchase(false);
  }

  function saveEdit(updated){
    setClients(prev=>prev.map(c=>{
      if(c.id!==clientId)return c;
      return{...c,history:c.history.map((h,i)=>i===updated.idx?{...h,amount:updated.amount,note:updated.note,librarian:updated.librarian,occasion:updated.occasion,occasionDetail:updated.occasionDetail}:h)};
    }));setEditing(null);
  }

  function deletePurchase(idx){
    setClients(prev=>prev.map(c=>{
      if(c.id!==clientId)return c;
      const h=c.history.filter((_,i)=>i!==idx);
      const cards=Math.floor(h.length/8);
      return{...c,history:h,stamps:h.length-cards*8,totalCards:cards};
    }));setEditing(null);
  }

  if(prize)return(
    <div className="prize-screen">
      <div style={{fontSize:60,marginBottom:16}}>🎉</div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,margin:"0 0 10px"}}>Premio raggiunto!</h2>
      <p style={{fontSize:15,color:"#6B6560",margin:"0 0 20px",lineHeight:1.5}}><strong>{client.name}</strong> ha completato la tessera.<br/>Ha diritto a uno sconto o un libro gratuito.</p>
      <button className="btn-primary" style={{width:"auto",padding:"10px 32px"}} onClick={()=>setPrize(false)}>Continua</button>
    </div>
  );

  return(
    <div style={{position:"relative"}}>
      {editing&&<EditModal purchase={editing} onSave={saveEdit} onDelete={deletePurchase} onClose={()=>setEditing(null)}/>}
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
        <div className="avatar" style={{width:54,height:54,background:BOOK_COLORS[ci%BOOK_COLORS.length]+"18",color:BOOK_COLORS[ci%BOOK_COLORS.length],fontSize:18}}>{getInitials(client.name)}</div>
        <div>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:500}}>{client.name}</div>
          <div style={{fontSize:13,color:"#6B6560",marginTop:2}}>{client.email||"–"}{client.phone?" · "+client.phone:""}</div>
        </div>
      </div>

      <div className="card-dark">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="card-title-light">Tessera fedeltà</span>
          <span style={{fontSize:12,color:"#A09890",letterSpacing:".05em"}}>{client.stamps} di 8</span>
        </div>
        <div className="stamp-grid">
          {Array.from({length:8},(_,i)=>(
            <div key={i} className={`stamp ${i<client.stamps?"filled":"empty"}`}>
              {i<client.stamps?<span style={{fontSize:20}}>📖</span>:<span style={{fontSize:16,color:"#C8C0B4"}}>·</span>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          {[{l:"Tessere completate",v:client.totalCards},{l:"Acquisti totali",v:client.history.length}].map(m=>(
            <div key={m.l} style={{flex:1,background:"#2A2A2A",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
              <p style={{margin:0,fontSize:11,color:"#A09890",letterSpacing:".05em",textTransform:"uppercase"}}>{m.l}</p>
              <p style={{margin:"4px 0 0",fontSize:20,fontWeight:500,color:"#FDFAF5",fontFamily:"'Playfair Display',Georgia,serif"}}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>

      {showPurchase?(
        <div className="card">
          <p className="card-title">Registra acquisto</p>
          <label>Importo (€)</label><input type="number" value={purchase.amount} onChange={e=>setPurchase(p=>({...p,amount:e.target.value}))} placeholder="es. 18.50"/>
          <label>Titolo / nota (opzionale)</label><input value={purchase.note} onChange={e=>setPurchase(p=>({...p,note:e.target.value}))} placeholder="es. Il nome della rosa"/>
          <label>Librario</label>
          <select value={purchase.librarian} onChange={e=>setPurchase(p=>({...p,librarian:e.target.value}))}>
            {LIBRARIANS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <label>Occasione</label>
          <div style={{marginBottom:10}}>
            {OCCASIONS.map(o=><span key={o.id} className={`occ-btn${purchase.occasion===o.id?" sel":""}`} onClick={()=>setPurchase(p=>({...p,occasion:o.id,occasionDetail:""}))}>{o.label}</span>)}
          </div>
          {purchase.occasion!=="normale"&&(
            <><label>Dettaglio occasione (opzionale)</label><input value={purchase.occasionDetail} onChange={e=>setPurchase(p=>({...p,occasionDetail:e.target.value}))} placeholder="es. McCarthy – maggio"/></>
          )}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn-primary" style={{flex:1}} onClick={addPurchase}>Conferma</button>
            <button className="btn-sec" style={{flex:1}} onClick={()=>setShowPurchase(false)}>Annulla</button>
          </div>
        </div>
      ):(
        <button className="btn-primary" onClick={()=>setShowPurchase(true)} style={{marginBottom:16}}>+ Registra acquisto</button>
      )}

      <div className="card">
        <p className="card-title">Storico acquisti</p>
        {client.history.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessun acquisto ancora registrato.</p>:client.history.map((h,idx)=>(
          <div key={idx} className="row">
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:2}}>
                <span style={{fontSize:14,color:"#1A1A1A"}}>{h.note||"Acquisto"}</span>
                {h.librarian&&<span className="lib-tag">{h.librarian}</span>}
                {h.occasion&&h.occasion!=="normale"&&<span className="occ-tag">{OCCASIONS.find(o=>o.id===h.occasion)?.label}{h.occasionDetail?` · ${h.occasionDetail}`:""}</span>}
              </div>
              <div className="row-sub">{h.date}{h.time?` · ${h.time}`:""}</div>
            </div>
            <span className="row-val" style={{marginRight:12}}>€{h.amount}</span>
            <button onClick={()=>setEditing({...h,idx})} style={{fontSize:12,color:"#6B6560",background:"#F0EBE1",border:"1px solid #E0D8CC",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Modifica</button>
          </div>
        ))}
      </div>

      <button className="btn-danger" onClick={()=>{if(window.confirm("Eliminare questo cliente?"))onDelete(clientId);}}>Elimina cliente</button>
    </div>
  );
}

export default function App(){
  const [logged,setLogged]=useState(false);
  const [clients,setClients]=useState(()=>{try{return JSON.parse(localStorage.getItem("lib_clients")||"[]");}catch{return[];}});
  const [tabs,setTabs]=useState([{id:"dashboard",label:"Dashboard",icon:"◈",closable:false},{id:"clienti",label:"Clienti",icon:"◉",closable:false}]);
  const [activeTab,setActiveTab]=useState("dashboard");
  const fileRef=useRef();

  useEffect(()=>{try{localStorage.setItem("lib_clients",JSON.stringify(clients));}catch{}},[clients]);

  function openClientTab(c){
    const tabId=`client-${c.id}`;
    setTabs(prev=>{if(prev.find(t=>t.id===tabId))return prev;return[...prev,{id:tabId,label:c.name.split(" ")[0],icon:"○",closable:true,clientId:c.id}];});
    setActiveTab(tabId);
  }
  function closeTab(tabId){setTabs(prev=>prev.filter(t=>t.id!==tabId));setActiveTab(prev=>prev===tabId?"clienti":prev);}
  function deleteClient(clientId){setClients(prev=>prev.filter(c=>c.id!==clientId));closeTab(`client-${clientId}`);}

  function handleExport(){
    const blob=new Blob([JSON.stringify(clients,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`libreria_backup_${nowDate().replace(/\//g,"-")}.json`;a.click();URL.revokeObjectURL(url);
  }

  function handleImport(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(Array.isArray(data)){setClients(data);alert(`✅ Importati ${data.length} clienti.`);}
        else alert("File non valido.");
      }catch{alert("Errore nella lettura del file.");}
    };
    reader.readAsText(file);
    e.target.value="";
  }

  if(!logged)return(<><style>{css}</style><div className="app"><LoginPage onLogin={()=>setLogged(true)}/></div></>);

  const activeTabData=tabs.find(t=>t.id===activeTab);
  return(
    <><style>{css}</style>
    <div className="app">
      <div className="hdr">
        <div><div className="hdr-title">📚 La Pagina</div><div className="hdr-sub">Gestione Fedeltà · {clients.length} clienti</div></div>
        <button className="hdr-btn" onClick={()=>setLogged(false)}>Esci →</button>
      </div>
      <TabBar tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} onClose={closeTab}/>
      <div className="content">
        {activeTab==="dashboard"&&<Dashboard clients={clients} onExport={handleExport} onImport={handleImport} fileRef={fileRef}/>}
        {activeTab==="clienti"&&<ClientList clients={clients} setClients={setClients} onOpenClient={openClientTab}/>}
        {activeTabData?.clientId&&<ClientDetail clientId={activeTabData.clientId} clients={clients} setClients={setClients} onDelete={deleteClient}/>}
      </div>
    </div></>
  );
}