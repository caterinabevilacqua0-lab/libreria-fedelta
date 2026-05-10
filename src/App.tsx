import { useState, useEffect, useRef } from "react";

const ADMIN = { username: "libreria", password: "1234" };
const LIBRARIANS = ["Teresa", "Giacomo", "Francesca", "Antonella"];
const OCCASIONS = [
  { id: "normale", label: "🛒 Normale" },
  { id: "bookclub", label: "📖 Bookclub" },
  { id: "presentazione", label: "🎤 Presentazione" },
  { id: "regalo", label: "🎁 Regalo" },
];
const BOOKCLUBS = ["Convegno Femminista", "Bookclub del Mese", "Animalia"];
const BOOK_COLORS = ["#8B2635","#5C4033","#2E5D4B","#1A3A5C","#6B3D8B","#854F0B","#0F6E56","#A32D2D"];

const WELCOME_MSGS = [
  "Buongiorno! Oggi è una bella giornata per leggere ☀️",
  "Bentornata! Quanti libri meravigliosi oggi? 📚",
  "Ciao! La libreria ti aspettava 🌿",
  "Buonasera! Come è andata oggi tra gli scaffali? 🕯️",
  "Eccoci! Pronti a far felici i lettori? 📖",
  "Bentornati! Un nuovo giorno, nuove storie da raccontare ✨",
];

const TITLES = [
  { min:0, max:0, label:"🌱 Nuovo lettore" },
  { min:1, max:2, label:"📖 Lettore curioso" },
  { min:3, max:5, label:"🔖 Habitué" },
  { min:6, max:9, label:"📚 Divoratore di pagine" },
  { min:10, max:14, label:"🦉 Lettore notturno" },
  { min:15, max:19, label:"✒️ Critico letterario" },
  { min:20, max:Infinity, label:"👑 Anima della libreria" },
];

function getTitle(purchases, totalCards) {
  const base = TITLES.find(t => purchases >= t.min && purchases <= t.max)?.label || "🌱 Nuovo lettore";
  return totalCards > 0 ? base + " · ⭐ Cliente fedele" : base;
}

const DEMO_CLIENTS = [
  { id:1, name:"Emma Bovary", phone:"333 1122334", email:"emma@bovary.fr", notes:"Ama i romanzi francesi dell'Ottocento. Devota al Bookclub del Mese.", stamps:7, totalCards:1, history:[
    { date:"08/05/2026", time:"10:30", amount:"14.00", note:"Madame Bovary", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"02/05/2026", time:"17:15", amount:"16.50", note:"Anna Karenina", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
    { date:"10/04/2026", time:"10:00", amount:"18.50", note:"Cime tempestose", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"15/03/2026", time:"11:00", amount:"22.00", note:"Guerra e Pace", librarian:"Francesca", occasion:"presentazione", occasionDetail:"Tolstoj" },
    { date:"10/03/2026", time:"11:15", amount:"15.00", note:"Jane Eyre", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"01/02/2026", time:"12:30", amount:"11.00", note:"Orgoglio e pregiudizio", librarian:"Teresa", occasion:"regalo", occasionDetail:"" },
    { date:"15/01/2026", time:"17:00", amount:"9.00", note:"Persuasione", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"10/12/2025", time:"11:15", amount:"15.00", note:"Middlemarch", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
  ]},
  { id:2, name:"Atticus Finch", phone:"333 4455667", email:"atticus@maycomb.us", notes:"Preferisce narrativa americana. Grande appassionato di letteratura sociale.", stamps:4, totalCards:0, history:[
    { date:"05/05/2026", time:"09:45", amount:"19.00", note:"Il buio oltre la siepe", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"18/04/2026", time:"15:00", amount:"13.50", note:"1984", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
    { date:"03/04/2026", time:"11:30", amount:"21.00", note:"Il grande Gatsby", librarian:"Giacomo", occasion:"presentazione", occasionDetail:"Fitzgerald" },
    { date:"15/03/2026", time:"16:00", amount:"16.00", note:"Walden", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Animalia" },
  ]},
  { id:3, name:"Holden Caulfield", phone:"", email:"holden@rye.com", notes:"Ama Salinger. Brontola ma compra sempre. Cliente affezionato.", stamps:2, totalCards:1, history:[
    { date:"07/05/2026", time:"14:00", amount:"17.00", note:"Il giovane Holden", librarian:"Antonella", occasion:"normale", occasionDetail:"" },
    { date:"20/04/2026", time:"18:00", amount:"11.50", note:"Franny e Zooey", librarian:"Giacomo", occasion:"regalo", occasionDetail:"" },
    { date:"10/03/2026", time:"10:00", amount:"14.00", note:"L'appello della foresta", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"10/02/2026", time:"16:30", amount:"9.50", note:"Zanna bianca", librarian:"Antonella", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"20/01/2026", time:"11:00", amount:"14.00", note:"Il vecchio e il mare", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"05/01/2026", time:"12:00", amount:"12.00", note:"Uomini e topi", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
    { date:"20/12/2025", time:"17:00", amount:"16.00", note:"Regalo di Natale", librarian:"Antonella", occasion:"regalo", occasionDetail:"" },
    { date:"01/12/2025", time:"10:30", amount:"11.00", note:"Storie brevi", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
  ]},
  { id:4, name:"Clarissa Dalloway", phone:"333 9988776", email:"clarissa@dalloway.uk", notes:"Devota a Virginia Woolf. Ama le copertine belle. Partecipa al Convegno Femminista.", stamps:8, totalCards:0, history:[
    { date:"09/05/2026", time:"10:15", amount:"18.00", note:"La signora Dalloway", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"25/04/2026", time:"14:30", amount:"14.00", note:"Gita al faro", librarian:"Francesca", occasion:"normale", occasionDetail:"" },
    { date:"12/04/2026", time:"11:00", amount:"22.00", note:"Orlando", librarian:"Teresa", occasion:"presentazione", occasionDetail:"Woolf" },
    { date:"20/03/2026", time:"10:30", amount:"15.00", note:"Gli anni", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"08/03/2026", time:"17:45", amount:"12.00", note:"Una stanza tutta per sé", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"10/02/2026", time:"15:00", amount:"16.50", note:"Le onde", librarian:"Francesca", occasion:"normale", occasionDetail:"" },
    { date:"22/01/2026", time:"11:15", amount:"19.00", note:"Flush", librarian:"Giacomo", occasion:"regalo", occasionDetail:"" },
    { date:"05/01/2026", time:"15:00", amount:"13.00", note:"Diario", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
  ]},
  { id:5, name:"Leopold Bloom", phone:"333 5566778", email:"leopold@dublin.ie", notes:"Curioso e onnivoro. Legge di tutto, ama gli animali e la natura.", stamps:5, totalCards:0, history:[
    { date:"06/05/2026", time:"11:00", amount:"20.00", note:"Ulisse", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"01/04/2026", time:"15:30", amount:"14.00", note:"Il lupo e il leone", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"10/03/2026", time:"10:45", amount:"17.50", note:"L'isola dei delfini blu", librarian:"Antonella", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"14/02/2026", time:"16:00", amount:"13.00", note:"Regalo San Valentino", librarian:"Francesca", occasion:"regalo", occasionDetail:"" },
    { date:"20/01/2026", time:"12:00", amount:"15.00", note:"Moby Dick", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Animalia" },
  ]},
  { id:6, name:"Anna Karenina", phone:"333 6677889", email:"anna@karenina.ru", notes:"Appassionata di letteratura russa e romanticismo. Partecipa al Convegno Femminista.", stamps:6, totalCards:1, history:[
    { date:"07/05/2026", time:"09:30", amount:"19.00", note:"Anna Karenina", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"20/04/2026", time:"14:00", amount:"16.00", note:"Resurrezione", librarian:"Francesca", occasion:"presentazione", occasionDetail:"Tolstoj" },
    { date:"15/03/2026", time:"11:30", amount:"22.00", note:"Guerra e Pace", librarian:"Teresa", occasion:"presentazione", occasionDetail:"Tolstoj" },
    { date:"08/03/2026", time:"10:00", amount:"14.00", note:"Sorelle Brontë", librarian:"Antonella", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"10/02/2026", time:"15:00", amount:"11.00", note:"Delitto e Castigo", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
    { date:"15/01/2026", time:"17:00", amount:"18.00", note:"I fratelli Karamazov", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"20/12/2025", time:"11:00", amount:"13.00", note:"Il maestro e Margherita", librarian:"Francesca", occasion:"normale", occasionDetail:"" },
    { date:"01/12/2025", time:"16:00", amount:"15.00", note:"Natasha e Pierre", librarian:"Giacomo", occasion:"regalo", occasionDetail:"" },
    { date:"10/11/2025", time:"10:30", amount:"12.00", note:"La morte di Ivan Il'ič", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
  ]},
  { id:7, name:"Jay Gatsby", phone:"333 7788990", email:"jay@westgg.com", notes:"Ama i classici americani. Cliente occasionale ma generoso negli acquisti.", stamps:3, totalCards:0, history:[
    { date:"04/05/2026", time:"16:00", amount:"24.00", note:"Il grande Gatsby", librarian:"Giacomo", occasion:"presentazione", occasionDetail:"Fitzgerald" },
    { date:"20/03/2026", time:"14:00", amount:"19.00", note:"Tenera è la notte", librarian:"Teresa", occasion:"presentazione", occasionDetail:"Fitzgerald" },
    { date:"14/02/2026", time:"18:00", amount:"22.00", note:"Di qua dal paradiso", librarian:"Francesca", occasion:"regalo", occasionDetail:"" },
  ]},
  { id:8, name:"Isabel Archer", phone:"333 8899001", email:"isabel@portrait.uk", notes:"Lettrice raffinata. Ama James e il Convegno Femminista.", stamps:5, totalCards:0, history:[
    { date:"08/05/2026", time:"14:30", amount:"21.00", note:"Ritratto di signora", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"22/04/2026", time:"10:00", amount:"16.00", note:"Le ali della colomba", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Convegno Femminista" },
    { date:"18/03/2026", time:"15:30", amount:"18.00", note:"Giro di vite", librarian:"Antonella", occasion:"presentazione", occasionDetail:"Woolf" },
    { date:"05/02/2026", time:"11:00", amount:"14.00", note:"Washington Square", librarian:"Francesca", occasion:"normale", occasionDetail:"" },
    { date:"10/01/2026", time:"16:00", amount:"17.00", note:"Daisy Miller", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
  ]},
  { id:9, name:"Raskolnikov", phone:"", email:"rask@pietroburgo.ru", notes:"Cliente misterioso. Compra in fretta, paga in contanti, non si ferma mai a chiacchierare.", stamps:2, totalCards:0, history:[
    { date:"03/05/2026", time:"18:45", amount:"15.00", note:"Delitto e Castigo", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
    { date:"01/04/2026", time:"19:00", amount:"13.00", note:"L'idiota", librarian:"Antonella", occasion:"normale", occasionDetail:"" },
  ]},
  { id:10, name:"Don Chisciotte", phone:"333 0011223", email:"don@lamancha.es", notes:"Il più fedele dei lettori. Ama tutto, specialmente Animalia e i cavalieri.", stamps:8, totalCards:2, history:[
    { date:"09/05/2026", time:"09:00", amount:"18.00", note:"Il Signore degli Anelli", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"25/04/2026", time:"11:00", amount:"16.00", note:"La fattoria degli animali", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"10/04/2026", time:"14:00", amount:"22.00", note:"Don Chisciotte", librarian:"Francesca", occasion:"presentazione", occasionDetail:"Cervantes" },
    { date:"20/03/2026", time:"10:00", amount:"14.00", note:"Il lupo di mare", librarian:"Teresa", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"05/03/2026", time:"16:30", amount:"19.00", note:"Watership Down", librarian:"Antonella", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"14/02/2026", time:"12:00", amount:"13.00", note:"Regalo cavalleresco", librarian:"Teresa", occasion:"regalo", occasionDetail:"" },
    { date:"20/01/2026", time:"11:00", amount:"15.00", note:"Sancho Panza", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
    { date:"05/01/2026", time:"10:00", amount:"17.00", note:"I cavalieri della tavola", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"10/12/2025", time:"15:00", amount:"12.00", note:"Ivanhoe", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
    { date:"01/11/2025", time:"11:00", amount:"20.00", note:"Robin Hood", librarian:"Giacomo", occasion:"bookclub", occasionDetail:"Animalia" },
    { date:"15/10/2025", time:"14:00", amount:"16.00", note:"I miserabili", librarian:"Francesca", occasion:"bookclub", occasionDetail:"Bookclub del Mese" },
    { date:"01/10/2025", time:"10:00", amount:"18.00", note:"Il conte di Montecristo", librarian:"Teresa", occasion:"normale", occasionDetail:"" },
    { date:"10/09/2025", time:"16:00", amount:"14.00", note:"Tre moschettieri", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
    { date:"01/09/2025", time:"11:00", amount:"15.00", note:"Cyrano de Bergerac", librarian:"Francesca", occasion:"regalo", occasionDetail:"" },
    { date:"15/08/2025", time:"10:00", amount:"13.00", note:"Il piccolo principe", librarian:"Teresa", occasion:"regalo", occasionDetail:"" },
    { date:"01/08/2025", time:"15:00", amount:"11.00", note:"Storie di cavalieri", librarian:"Giacomo", occasion:"normale", occasionDetail:"" },
  ]},
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
*{box-sizing:border-box;}
.app{font-family:'Helvetica Neue',Arial,sans-serif;background:#F5F0E8;min-height:100vh;color:#1A1A1A;}
.hdr{background:#1A1A1A;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.hdr-icon{width:36px;height:36px;background:#FDFAF5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.hdr-title{font-family:'Playfair Display',Georgia,serif;color:#FDFAF5;font-size:20px;font-weight:600;}
.hdr-sub{font-size:11px;color:#A09890;margin-top:1px;letter-spacing:.06em;text-transform:uppercase;}
.hdr-btn{font-size:12px;color:#A09890;background:none;border:none;cursor:pointer;}
.hdr-btn:hover{color:#FDFAF5;}
.tabbar{background:#1A1A1A;padding:0 24px;display:flex;gap:2px;border-top:1px solid #2E2E2E;overflow-x:auto;scrollbar-width:none;}
.tab{padding:10px 14px 0;font-size:12px;cursor:pointer;border-radius:6px 6px 0 0;color:#A09890;border:none;background:none;transition:color .15s;white-space:nowrap;display:flex;align-items:center;gap:6px;}
.tab:hover{color:#FDFAF5;}
.tab.active{background:#F5F0E8;color:#1A1A1A;font-weight:500;padding-bottom:10px;}
.tab-x{margin-left:4px;opacity:.5;font-size:14px;}
.tab-x:hover{opacity:1;}
.tab-av{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;flex-shrink:0;}
.content{padding:24px;max-width:780px;margin:0 auto;}
.card{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.card-dark{background:#1A1A1A;border-radius:12px;padding:20px 22px;margin-bottom:16px;}
.card-inner-dark{background:#111;border:1px solid #2A2A2A;border-radius:10px;padding:14px;}
.card-title{font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:500;margin:0 0 14px;color:#1A1A1A;}
.card-title-light{font-family:'Playfair Display',Georgia,serif;font-size:15px;font-weight:500;margin:0 0 12px;color:#FDFAF5;}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;}
@media(max-width:520px){.stat-grid{grid-template-columns:repeat(2,1fr);}}
.stat{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:14px 16px;}
.stat-label{font-size:11px;color:#6B6560;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;}
.stat-value{font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:500;color:#1A1A1A;margin:0;font-variant-numeric:tabular-nums;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
@media(max-width:520px){.two-col{grid-template-columns:1fr;}}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:16px;}
@media(max-width:600px){.three-col{grid-template-columns:1fr;}}
.row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #EDE8E0;}
.row:last-child{border-bottom:none;}
.row-name{font-size:13px;color:#1A1A1A;}
.row-val{font-size:13px;font-weight:500;color:#8B2635;}
.stamp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0;}
.stamp{height:54px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all .3s;}
.stamp.filled{background:#2A2A2A;border:1.5px solid #3A3A3A;}
.stamp.empty{background:#151515;border:1.5px dashed #2A2A2A;}
.stamp.prize{background:#6B1020;border:1.5px solid #8B2635;}
.stamp.pop{animation:stampPop .4s cubic-bezier(.36,.07,.19,.97);}
@keyframes stampPop{0%{transform:scale(1)}40%{transform:scale(1.3)}70%{transform:scale(.9)}100%{transform:scale(1)}}
.btn-primary{width:100%;background:#1A1A1A;color:#FDFAF5;border:none;border-radius:8px;padding:12px;font-size:15px;font-weight:500;cursor:pointer;transition:background .15s;}
.btn-primary:hover{background:#333;}
.btn-sec{background:none;border:1px solid #C8C0B4;border-radius:8px;padding:10px;font-size:14px;cursor:pointer;color:#1A1A1A;transition:background .15s;}
.btn-sec:hover{background:#F0EBE1;}
.btn-danger{background:none;border:none;font-size:13px;color:#8B2635;cursor:pointer;padding:0;}
.badge-prize{display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 8px;border-radius:20px;background:#8B2635;color:#FDFAF5;}
.badge-near{display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 8px;border-radius:20px;background:#F5E6C8;color:#633806;}
.lib-tag{font-size:11px;color:#A09890;background:#F0EBE1;border-radius:4px;padding:2px 7px;}
.occ-tag{font-size:11px;padding:2px 7px;border-radius:4px;background:#EDE8DF;color:#5C3A2A;}
.occ-btn{display:inline-block;font-size:12px;padding:6px 12px;border-radius:6px;margin:0 6px 6px 0;cursor:pointer;border:1px solid #D8D0C4;background:#F0EBE1;color:#5C3A2A;transition:all .15s;}
.occ-btn.sel{background:#1A1A1A;color:#FDFAF5;border-color:#1A1A1A;}
.filter-btn{display:inline-block;font-size:11px;padding:4px 10px;border-radius:6px;margin:0 4px 4px 0;cursor:pointer;border:1px solid #D8D0C4;background:#F0EBE1;color:#5C3A2A;transition:all .15s;}
.filter-btn.sel{background:#1A1A1A;color:#FDFAF5;border-color:#1A1A1A;}
.bar-wrap{display:flex;align-items:flex-end;gap:3px;height:64px;}
.bar-col{display:flex;flex-direction:column;align-items:center;flex:1;}
.bar-inner{border-radius:3px 3px 0 0;width:100%;transition:height .3s;}
.bar-lbl{font-size:9px;color:#6B6560;margin-top:6px;text-align:center;}
.export-bar{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.export-btn{display:flex;align-items:center;gap:6px;font-size:13px;color:#1A1A1A;background:none;border:1px solid #D8D0C4;border-radius:7px;padding:7px 14px;cursor:pointer;transition:background .15s;}
.export-btn:hover{background:#F0EBE1;}
.client-card{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 3px rgba(0,0,0,.06);cursor:pointer;transition:background .1s;}
.client-card:hover{background:#FAF7F2;}
.dots{display:flex;gap:3px;}
.dot{width:7px;height:7px;border-radius:50%;}
.hist-row{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:8px;margin-bottom:6px;border:1px solid #E0D8CC;box-shadow:0 1px 3px rgba(0,0,0,.04);}
.hist-row:nth-child(odd){background:#FDFAF5;}
.hist-row:nth-child(even){background:#FAF7F2;}
.overlay{position:absolute;inset:0;background:rgba(20,15,10,.45);display:flex;align-items:center;justify-content:center;z-index:100;border-radius:12px;}
.modal{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:12px;padding:22px 24px;width:320px;max-width:90vw;}
.modal-title{font-family:'Playfair Display',Georgia,serif;font-size:17px;margin:0 0 16px;color:#1A1A1A;}
.prize-screen{min-height:320px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;position:relative;overflow:hidden;}
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;flex-shrink:0;font-family:'Playfair Display',Georgia,serif;}
.title-badge{display:inline-block;font-size:11px;color:#5C3A2A;background:#F0EBE1;border:1px solid #DDD0C0;border-radius:4px;padding:2px 8px;margin-top:4px;}
.search-results{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.1);}
.search-result-item{padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid #EDE8E0;display:flex;align-items:center;gap:10px;}
.search-result-item:last-child{border-bottom:none;}
.search-result-item:hover{background:#F0EBE1;}
.edit-btn{font-size:11px;color:#6B6560;border:1px solid #D8D0C4;border-radius:5px;padding:3px 8px;cursor:pointer;background:none;white-space:nowrap;}
.edit-btn:hover{background:#F0EBE1;}
.event-card{background:#FDFAF5;border:1px solid #E0D8CC;border-radius:10px;padding:16px 18px;margin-bottom:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.event-card.top{border-left:3px solid #8B2635;border-radius:0 10px 10px 0;}
.confetti{position:absolute;pointer-events:none;z-index:200;}
input,select,textarea{width:100%;padding:9px 12px;border:1px solid #D8D0C4;border-radius:8px;font-size:14px;background:#FDFAF5;color:#1A1A1A;outline:none;margin-bottom:10px;font-family:inherit;}
textarea{resize:vertical;min-height:70px;}
input:focus,select:focus,textarea:focus{border-color:#1A1A1A;}
label{font-size:12px;color:#6B6560;letter-spacing:.04em;text-transform:uppercase;display:block;margin-bottom:4px;}
.stat-dark{flex:1;background:#2A2A2A;border-radius:7px;padding:8px 10px;text-align:center;}
.cassa-mode{background:#1A1A1A;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;}
.cassa-search{background:#2A2A2A;border:1px solid #3A3A3A;border-radius:12px;padding:12px 16px;display:flex;gap:10px;align-items:center;width:100%;max-width:480px;margin-bottom:16px;}
.cassa-search input{background:none;border:none;outline:none;color:#FDFAF5;font-size:16px;width:100%;margin:0;padding:0;}
.cassa-result{background:#2A2A2A;border:1px solid #3A3A3A;border-radius:10px;padding:14px 18px;width:100%;max-width:480px;cursor:pointer;margin-bottom:8px;display:flex;align-items:center;gap:14px;transition:background .15s;}
.cassa-result:hover{background:#333;}
`;

function getInitials(n){return n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);}
function nowTime(){return new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});}
function nowDate(){return new Date().toLocaleDateString("it-IT");}
function hourFromTime(t){if(!t)return null;const p=t.split(":");return p.length>=1?parseInt(p[0]):null;}
function daysSince(s){if(!s)return null;const d=new Date(s);if(isNaN(d))return null;return Math.floor((Date.now()-d.getTime())/(1000*60*60*24));}
function parseDate(s){if(!s)return null;const p=s.split("/");return p.length===3?new Date(`${p[2]}-${p[1]}-${p[0]}`):null;}
function monthKey(s){if(!s)return null;const p=s.split("/");return p.length===3?`${p[1]}/${p[2]}`:null;}
const MONTH_NAMES=["","Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
function monthLabel(k){if(!k)return"–";const[m,y]=k.split("/");return`${MONTH_NAMES[parseInt(m)]} ${y}`;}

function Confetti({onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const colors=["#8B2635","#F5E6C8","#FDFAF5","#2E5D4B","#1A3A5C","#EF9F27"];
    const pieces=[];
    for(let i=0;i<80;i++){
      const d=document.createElement("div");
      d.style.cssText=`position:absolute;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?"50%":"2px"};left:${Math.random()*100}%;top:-20px;`;
      el.appendChild(d);pieces.push({el:d,x:Math.random()*300-150,vy:3+Math.random()*5,vx:(Math.random()-.5)*4,rot:Math.random()*360,rotV:(Math.random()-.5)*15,y:0});
    }
    let frame,t=0;
    function animate(){t++;pieces.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.rot+=p.rotV;p.vy+=.15;p.el.style.transform=`translate(${p.x}px,${p.y}px) rotate(${p.rot}deg)`;p.el.style.opacity=Math.max(0,1-t/80);});if(t<100)frame=requestAnimationFrame(animate);else{onDone();el.innerHTML="";}}
    frame=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(frame);
  },[]);
  return <div ref={ref} className="confetti" style={{inset:0,overflow:"hidden"}}/>;
}

function LoginPage({onLogin}){
  const [u,setU]=useState("");const [p,setP]=useState("");const [err,setErr]=useState("");
  const msg=WELCOME_MSGS[new Date().getDay()%WELCOME_MSGS.length];
  function handle(){if(u===ADMIN.username&&p===ADMIN.password)onLogin();else setErr("Ops! Credenziali errate, riprova 🙈");}
  return(
    <div style={{minHeight:"100vh",background:"#F5F0E8",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:40,marginBottom:8}}>🪶</div>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:32,fontWeight:600,color:"#1A1A1A"}}>La Pagina</div>
        <div style={{fontSize:11,color:"#6B6560",letterSpacing:".1em",textTransform:"uppercase",marginTop:4}}>Gestione Programma Fedeltà</div>
        <div style={{width:40,height:2,background:"#8B2635",margin:"10px auto 0"}}/>
        <div style={{marginTop:16,fontSize:14,color:"#5C4033",fontStyle:"italic"}}>{msg}</div>
      </div>
      <div style={{background:"#FDFAF5",border:"1px solid #E0D8CC",borderRadius:14,padding:"2rem 2.5rem",width:320}}>
        <label>Username</label><input value={u} onChange={e=>setU(e.target.value)} placeholder="username"/>
        <label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="••••••••"/>
        {err&&<p style={{color:"#8B2635",fontSize:13,margin:"0 0 10px"}}>{err}</p>}
        <button className="btn-primary" onClick={handle} style={{marginTop:4}}>Entra in libreria →</button>
        <p style={{fontSize:11,color:"#A09890",textAlign:"center",marginTop:14}}>libreria / 1234</p>
      </div>
    </div>
  );
}

function MiniBarChart({data,color="#1A1A1A"}){
  const max=Math.max(...data.map(d=>d.v),1);
  return(
    <div>
      <div className="bar-wrap">
        {data.map((d,i)=>(
          <div key={i} className="bar-col">
            <div className="bar-inner" style={{height:`${Math.round((d.v/max)*64)}px`,background:d.v===Math.max(...data.map(x=>x.v))?color:"#C8C0B4",opacity:d.v===0?.2:1}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:3}}>
        {data.map((d,i)=><div key={i} className="bar-col"><div className="bar-lbl">{d.k}</div></div>)}
      </div>
    </div>
  );
}

function TabBar({tabs,activeTab,onSelect,onClose}){
  return(
    <div className="tabbar">
      {tabs.map((tab,i)=>{
        const active=tab.id===activeTab;
        return(
          <button key={tab.id} className={`tab${active?" active":""}`} onClick={()=>onSelect(tab.id)}>
            {tab.clientId?(
              <div className="tab-av" style={{background:BOOK_COLORS[i%BOOK_COLORS.length]+"30",color:BOOK_COLORS[i%BOOK_COLORS.length]}}>{tab.initials}</div>
            ):(
              <span style={{fontSize:13}}>{tab.icon}</span>
            )}
            {tab.label}
            {tab.closable&&<span className="tab-x" onClick={e=>{e.stopPropagation();onClose(tab.id);}}>×</span>}
          </button>
        );
      })}
    </div>
  );
}

function BookclubTab({clients}){
  const allPurchases=clients.flatMap(c=>c.history.map(h=>({...h,clientName:c.name,clientId:c.id})));
  const bcPurchases=allPurchases.filter(p=>p.occasion==="bookclub"&&p.occasionDetail);

  const stats={};
  BOOKCLUBS.forEach(bc=>{
    const purchases=bcPurchases.filter(p=>p.occasionDetail===bc);
    const participants=[...new Set(purchases.map(p=>p.clientId))];
    const total=purchases.reduce((s,p)=>s+parseFloat(p.amount),0);
    const byMonth={};
    purchases.forEach(p=>{const k=monthKey(p.date);if(k)byMonth[k]=(byMonth[k]||0)+1;});
    const bestMonth=Object.entries(byMonth).sort((a,b)=>b[1]-a[1])[0];
    const editions=[...new Set(purchases.map(p=>monthKey(p.date)).filter(Boolean))].sort();
    stats[bc]={purchases,participants,total,bestMonth,editions,byMonth};
  });

  const sorted=BOOKCLUBS.map(bc=>({bc,s:stats[bc]})).sort((a,b)=>b.s.total-a.s.total);
  const topBc=sorted[0]?.bc;

  return(
    <div>
      <div className="card" style={{background:"#1A1A1A",border:"none"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{l:"Acquisti totali",v:bcPurchases.length},{l:"Incasso totale",v:`€${Math.round(bcPurchases.reduce((s,p)=>s+parseFloat(p.amount),0))}`},{l:"Bookclub più redditizio",v:topBc?.split(" ").slice(0,2).join(" ")||"–"}].map(m=>(
            <div key={m.l} style={{background:"#2A2A2A",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:11,color:"#A09890",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{m.l}</div>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:500,color:"#FDFAF5"}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {sorted.map(({bc,s},idx)=>{
        const monthData=Object.entries(s.byMonth).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>({k:monthLabel(k).split(" ")[0],v}));
        const clientNames=[...new Set(s.purchases.map(p=>p.clientName))];
        return(
          <div key={bc} className={`event-card${idx===0?" top":""}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,fontWeight:500,color:"#1A1A1A"}}>{bc}</div>
                {idx===0&&<span style={{fontSize:10,background:"#8B2635",color:"#FDFAF5",padding:"2px 8px",borderRadius:4,marginTop:4,display:"inline-block"}}>⭐ Il più redditizio</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:500,color:"#8B2635"}}>€{Math.round(s.total)}</div>
                <div style={{fontSize:11,color:"#6B6560"}}>{s.purchases.length} acquisti · {s.participants.length} partecipanti</div>
              </div>
            </div>

            {s.bestMonth&&(
              <div style={{fontSize:12,color:"#5C3A2A",background:"#F5EBE0",borderRadius:6,padding:"6px 10px",marginBottom:12,display:"inline-block"}}>
                📅 Mese più redditizio: <strong>{monthLabel(s.bestMonth[0])}</strong> ({s.bestMonth[1]} acquisti)
              </div>
            )}

            <div className="two-col" style={{marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Acquisti per mese</div>
                {monthData.length>0?<MiniBarChart data={monthData} color="#8B2635"/>:<p style={{fontSize:12,color:"#A09890"}}>Nessun dato ancora</p>}
              </div>
              <div>
                <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Scheda partecipazione</div>
                {s.editions.length===0?<p style={{fontSize:12,color:"#A09890"}}>Nessuna edizione ancora</p>:s.editions.map(ed=>{
                  const edClients=[...new Set(s.purchases.filter(p=>monthKey(p.date)===ed).map(p=>p.clientName))];
                  return(
                    <div key={ed} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid #EDE8E0"}}>
                      <div style={{fontSize:12,fontWeight:500,color:"#1A1A1A"}}>{monthLabel(ed)}</div>
                      <div style={{fontSize:11,color:"#6B6560",marginTop:2}}>{edClients.join(", ")} <span style={{color:"#A09890"}}>({edClients.length} pers.)</span></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Partecipanti abituali</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {clientNames.map(n=>(
                <span key={n} style={{fontSize:11,background:"#F0EBE1",border:"1px solid #E0D8CC",borderRadius:20,padding:"3px 10px",color:"#5C3A2A"}}>{n}</span>
              ))}
              {clientNames.length===0&&<span style={{fontSize:12,color:"#A09890"}}>Nessuno ancora 🌱</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PresentazioniTab({clients}){
  const allPurchases=clients.flatMap(c=>c.history.map(h=>({...h,clientName:c.name,clientId:c.id})));
  const presPurchases=allPurchases.filter(p=>p.occasion==="presentazione"&&p.occasionDetail);

  const events={};
  presPurchases.forEach(p=>{
    if(!events[p.occasionDetail])events[p.occasionDetail]={purchases:[],total:0,byMonth:{}};
    events[p.occasionDetail].purchases.push(p);
    events[p.occasionDetail].total+=parseFloat(p.amount);
    const k=monthKey(p.date);if(k)events[p.occasionDetail].byMonth[k]=(events[p.occasionDetail].byMonth[k]||0)+1;
  });

  const sorted=Object.entries(events).sort((a,b)=>b[1].total-a[1].total);
  const topEvent=sorted[0]?.[0];

  return(
    <div>
      <div className="card" style={{background:"#1A1A1A",border:"none"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{l:"Acquisti totali",v:presPurchases.length},{l:"Incasso totale",v:`€${Math.round(presPurchases.reduce((s,p)=>s+parseFloat(p.amount),0))}`},{l:"Presentazione top",v:topEvent||"–"}].map(m=>(
            <div key={m.l} style={{background:"#2A2A2A",borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:11,color:"#A09890",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{m.l}</div>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:500,color:"#FDFAF5"}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {sorted.map(([name,data],idx)=>{
        const participants=[...new Set(data.purchases.map(p=>p.clientName))];
        const monthData=Object.entries(data.byMonth).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>({k:monthLabel(k).split(" ")[0],v}));
        const bestMonth=Object.entries(data.byMonth).sort((a,b)=>b[1]-a[1])[0];
        const booksSold=[...new Set(data.purchases.map(p=>p.note).filter(Boolean))];
        return(
          <div key={name} className={`event-card${idx===0?" top":""}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,fontWeight:500}}>🎤 {name}</div>
                {idx===0&&<span style={{fontSize:10,background:"#8B2635",color:"#FDFAF5",padding:"2px 8px",borderRadius:4,marginTop:4,display:"inline-block"}}>⭐ La più redditizia</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:500,color:"#8B2635"}}>€{Math.round(data.total)}</div>
                <div style={{fontSize:11,color:"#6B6560"}}>{data.purchases.length} acquisti · {participants.length} partecipanti</div>
              </div>
            </div>

            {bestMonth&&(
              <div style={{fontSize:12,color:"#5C3A2A",background:"#F5EBE0",borderRadius:6,padding:"6px 10px",marginBottom:12,display:"inline-block"}}>
                📅 Mese più redditizio: <strong>{monthLabel(bestMonth[0])}</strong> ({bestMonth[1]} acquisti)
              </div>
            )}

            <div className="two-col" style={{marginBottom:12}}>
              <div>
                <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Acquisti per mese</div>
                {monthData.length>0?<MiniBarChart data={monthData} color="#8B2635"/>:<p style={{fontSize:12,color:"#A09890"}}>Nessun dato</p>}
              </div>
              <div>
                <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>Libri acquistati</div>
                {booksSold.slice(0,5).map(b=>(
                  <div key={b} style={{fontSize:12,color:"#1A1A1A",padding:"3px 0",borderBottom:"1px solid #EDE8E0"}}>📚 {b}</div>
                ))}
              </div>
            </div>

            <div style={{fontSize:11,color:"#6B6560",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Partecipanti</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {participants.map(n=>(
                <span key={n} style={{fontSize:11,background:"#F0EBE1",border:"1px solid #E0D8CC",borderRadius:20,padding:"3px 10px",color:"#5C3A2A"}}>{n}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getBestMonth(purchases){
  const counts={};
  purchases.forEach(p=>{const k=monthKey(p.date);if(k)counts[k]=(counts[k]||0)+1;});
  if(!Object.keys(counts).length)return null;
  const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  return`${monthLabel(best[0])} (${best[1]} acq.)`;
}

function getTopBook(purchases){
  const counts={};
  purchases.forEach(p=>{if(p.note?.trim())counts[p.note.trim()]=(counts[p.note.trim()]||0)+1;});
  if(!Object.keys(counts).length)return null;
  const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  return best[1]>1?`${best[0]} (${best[1]}×)`:null;
}

function getClientOfMonth(clients){
  const now=new Date();
  const m=String(now.getMonth()+1).padStart(2,"0");
  const y=String(now.getFullYear());
  let top=null,topCount=0;
  clients.forEach(c=>{
    const count=c.history.filter(h=>{const k=monthKey(h.date);return k===`${m}/${y}`;}).length;
    if(count>topCount){topCount=count;top=c;}
  });
  return top&&topCount>0?{client:top,count:topCount}:null;
}

function Dashboard({clients,onExport,onImport,fileRef,lastBackup,onOpenClient,onOpenTab}){
  const [search,setSearch]=useState("");
  const [showResults,setShowResults]=useState(false);
  const allPurchases=clients.flatMap(c=>c.history);
  const totalSpent=allPurchases.reduce((s,h)=>s+parseFloat(h.amount),0);
  const totalCards=clients.reduce((s,c)=>s+c.totalCards,0);
  const nearPrize=clients.filter(c=>c.stamps>=6&&c.stamps<8).sort((a,b)=>b.stamps-a.stamps);
  const prizeDue=clients.filter(c=>c.stamps>=8);
  const topClients=[...clients].sort((a,b)=>b.history.length-a.history.length).slice(0,5);
  const recent=clients.flatMap(c=>c.history.map(h=>({...h,clientName:c.name}))).slice(0,5);
  const backupDays=daysSince(lastBackup);
  const bestMonth=getBestMonth(allPurchases);
  const topBook=getTopBook(allPurchases);
  const clientOfMonth=getClientOfMonth(clients);
  const filtered=search.trim().length>1?clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search)||c.email.toLowerCase().includes(search.toLowerCase())):[];

  return(
    <div>
      <div style={{position:"relative",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"#FDFAF5",border:"1px solid #D8D0C4",borderRadius:8,padding:"8px 12px"}}>
          <span style={{fontSize:15,color:"#A09890"}}>🔍</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setShowResults(true);}} onFocus={()=>setShowResults(true)} placeholder="Cerca un lettore… inizia a digitare" style={{border:"none",background:"none",outline:"none",fontSize:14,color:"#1A1A1A",width:"100%",margin:0,padding:0}}/>
          {search&&<span onClick={()=>{setSearch("");setShowResults(false);}} style={{cursor:"pointer",color:"#A09890",fontSize:16}}>×</span>}
        </div>
        {showResults&&filtered.length>0&&(
          <div className="search-results" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,marginTop:4}}>
            {filtered.map((c,i)=>(
              <div key={c.id} className="search-result-item" onClick={()=>{onOpenClient(c);setSearch("");setShowResults(false);}}>
                <div className="avatar" style={{width:32,height:32,background:BOOK_COLORS[i%BOOK_COLORS.length]+"18",color:BOOK_COLORS[i%BOOK_COLORS.length],fontSize:11}}>{getInitials(c.name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500}}>{c.name}</div>
                  <div style={{fontSize:11,color:"#6B6560"}}>{getTitle(c.history.length,c.totalCards)}</div>
                </div>
                {c.stamps>=8&&<span className="badge-prize">🎉 Premio!</span>}
                {c.stamps>=6&&c.stamps<8&&<span className="badge-near">⏳ {c.stamps}/8</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stat-grid">
        {[{l:"Lettori",v:clients.length},{l:"Acquisti",v:allPurchases.length},{l:"Tessere",v:totalCards},{l:"Incasso",v:`€${Math.round(totalSpent)}`}].map(m=>(
          <div key={m.l} className="stat"><p className="stat-label">{m.l}</p><p className="stat-value">{m.v}</p></div>
        ))}
      </div>

      <div className="export-bar">
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:500}}>💾 Backup dati</span>
          {backupDays===null&&<span style={{fontSize:11,color:"#8B2635",background:"#F5E6E6",padding:"2px 8px",borderRadius:4}}>⚠ Nessun backup — salvalo oggi!</span>}
          {backupDays!==null&&backupDays>3&&<span style={{fontSize:11,color:"#8B2635",background:"#F5E6E6",padding:"2px 8px",borderRadius:4}}>⚠ Ultimo: {backupDays} giorni fa</span>}
          {backupDays!==null&&backupDays<=3&&<span style={{fontSize:11,color:"#2E5D4B",background:"#E1F5EE",padding:"2px 8px",borderRadius:4}}>✓ Tutto in ordine!</span>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="export-btn" onClick={onExport}>↓ Esporta</button>
          <button className="export-btn" onClick={()=>fileRef.current?.click()}>↑ Importa</button>
          <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={onImport}/>
        </div>
      </div>

      <div className="two-col">
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🕐 Ore di punta</p>
          {(()=>{
            const counts=Array(24).fill(0);
            allPurchases.forEach(p=>{const h=hourFromTime(p.time);if(h!==null)counts[h]++;});
            const hours=[];for(let i=8;i<=21;i++)hours.push(i);
            const max=Math.max(...hours.map(h=>counts[h]),1);
            const peak=hours.reduce((a,h)=>counts[h]>counts[a]?h:a,hours[0]);
            const morning=hours.filter(h=>h<13).reduce((s,h)=>s+counts[h],0);
            const evening=hours.filter(h=>h>=13).reduce((s,h)=>s+counts[h],0);
            const total=morning+evening||1;
            return(<>
              <div className="bar-wrap">
                {hours.map(h=><div key={h} className="bar-col"><div className="bar-inner" style={{height:`${Math.round((counts[h]/max)*64)}px`,background:h===peak?"#8B2635":"#1A1A1A",opacity:counts[h]===0?.15:1}}/></div>)}
              </div>
              <div style={{display:"flex",gap:3}}>
                {hours.map(h=><div key={h} className="bar-col"><div className="bar-lbl" style={{color:h===peak?"#8B2635":"#6B6560"}}>{h}</div></div>)}
              </div>
              <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                <span style={{fontSize:10,background:"#8B2635",color:"#FDFAF5",padding:"2px 8px",borderRadius:4}}>Picco: {peak}:00</span>
                <span style={{fontSize:10,background:"#F0EBE1",color:"#5C3A2A",border:"1px solid #E0D8CC",padding:"2px 8px",borderRadius:4}}>Mattina {Math.round(morning/total*100)}%</span>
                <span style={{fontSize:10,background:"#F0EBE1",color:"#5C3A2A",border:"1px solid #E0D8CC",padding:"2px 8px",borderRadius:4}}>Sera {Math.round(evening/total*100)}%</span>
              </div>
            </>);
          })()}
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🎭 Acquisti per occasione</p>
          {(()=>{
            const counts={};OCCASIONS.forEach(o=>counts[o.id]=0);
            allPurchases.forEach(p=>{if(p.occasion&&counts[p.occasion]!==undefined)counts[p.occasion]++;});
            const total=allPurchases.length||1;
            return OCCASIONS.map(o=>{
              const pct=Math.round(counts[o.id]/total*100);
              const clickable=o.id==="bookclub"||o.id==="presentazione";
              return(<div key={o.id} className="row" onClick={clickable?()=>onOpenTab(o.id==="bookclub"?"bookclub":"presentazioni",o.id==="bookclub"?"Bookclub":"Presentazioni",o.label.split(" ")[0]):undefined} style={{cursor:clickable?"pointer":"default",transition:"background .1s"}} onMouseEnter={e=>{if(clickable)e.currentTarget.style.background="#F0EBE1";}} onMouseLeave={e=>{e.currentTarget.style.background="";}}>
                <span className="row-name">{o.label}{clickable&&<span style={{fontSize:10,color:"#A09890",marginLeft:6}}>→ apri</span>}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:60,height:6,background:"#EDE8E0",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:o.id==="normale"?"#1A1A1A":"#8B2635",borderRadius:3}}/>
                  </div>
                  <span className="row-val" style={{minWidth:28,textAlign:"right"}}>{pct}%</span>
                </div>
              </div>);
            });
          })()}
        </div>
      </div>

      <div style={{height:14}}/>
      <div className="three-col">
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🏆 Cliente del mese</p>
          {clientOfMonth?(
            <div>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:18,fontWeight:500,color:"#8B2635"}}>{clientOfMonth.client.name}</div>
              <div style={{fontSize:12,color:"#6B6560",marginTop:4}}>{clientOfMonth.count} acquisti questo mese</div>
              <div className="title-badge" style={{marginTop:6}}>{getTitle(clientOfMonth.client.history.length,clientOfMonth.client.totalCards)}</div>
            </div>
          ):<p style={{fontSize:13,color:"#6B6560"}}>Ancora presto… il mese è appena iniziato! 📅</p>}
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">📅 Mese migliore</p>
          {bestMonth?<div style={{fontSize:16,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:500,color:"#8B2635"}}>{bestMonth}</div>:<p style={{fontSize:13,color:"#6B6560"}}>Ancora pochi dati 📖</p>}
          {topBook&&<><p className="card-title" style={{marginTop:14,marginBottom:4,fontSize:13}}>📖 Libro più venduto</p><div style={{fontSize:14,fontFamily:"'Playfair Display',Georgia,serif",fontWeight:500}}>{topBook}</div></>}
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🎉 Premio da ritirare</p>
          {prizeDue.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessuno! Continuate così 🛍️</p>:prizeDue.map(c=>(
            <div key={c.id} className="row"><span className="row-name">{c.name}</span><span className="badge-prize">Premio!</span></div>
          ))}
          <div style={{marginTop:14}}>
            <p className="card-title" style={{marginBottom:8,fontSize:13}}>⏳ Vicini al premio</p>
            {nearPrize.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessuno vicino!</p>:nearPrize.slice(0,3).map(c=>(
              <div key={c.id} className="row"><span className="row-name">{c.name}</span><span className="badge-near">{c.stamps}/8</span></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{height:14}}/>
      <div className="two-col">
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🏅 Lettori top</p>
          {topClients.map(c=>(
            <div key={c.id} className="row"><span className="row-name">{c.name}</span><span style={{fontSize:12,color:"#6B6560"}}>{c.history.length} acq.</span></div>
          ))}
        </div>
        <div className="card" style={{marginBottom:0}}>
          <p className="card-title">🕐 Ultimi acquisti</p>
          {recent.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessuno ancora — aprite la cassa! 🎉</p>:recent.map((h,i)=>(
            <div key={i} className="row">
              <div style={{flex:1}}><span className="row-name">{h.clientName}</span><div className="row-sub">{h.note||"Acquisto"} · {h.date}</div></div>
              <span className="row-val">€{h.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditClientModal({client,onSave,onClose}){
  const [name,setName]=useState(client.name);
  const [phone,setPhone]=useState(client.phone);
  const [email,setEmail]=useState(client.email);
  const [notes,setNotes]=useState(client.notes||"");
  return(
    <div className="overlay">
      <div className="modal">
        <p className="modal-title">Modifica dati cliente</p>
        <label>Nome</label><input value={name} onChange={e=>setName(e.target.value)}/>
        <label>Telefono</label><input value={phone} onChange={e=>setPhone(e.target.value)}/>
        <label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/>
        <label>Note</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Ama i romanzi russi, diffidente verso i thriller... ogni lettore è un mondo 🌍"/>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-primary" style={{flex:1}} onClick={()=>onSave({...client,name:name.trim(),phone:phone.trim(),email:email.trim(),notes:notes.trim()})}>Salva</button>
          <button className="btn-sec" style={{flex:1}} onClick={onClose}>Annulla</button>
        </div>
      </div>
    </div>
  );
}

function ClientList({clients,setClients,onOpenClient}){
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [n,setN]=useState({name:"",phone:"",email:"",notes:""});
  const [editingClient,setEditingClient]=useState(null);
  const filtered=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search)||c.email.toLowerCase().includes(search.toLowerCase()));

  function addClient(){
    if(!n.name.trim())return;
    const c={id:Date.now(),name:n.name.trim(),phone:n.phone.trim(),email:n.email.trim(),notes:n.notes.trim(),stamps:0,history:[],totalCards:0};
    setClients(prev=>[...prev,c]);setN({name:"",phone:"",email:"",notes:""});setShowAdd(false);onOpenClient(c);
  }
  function saveClientEdit(updated){setClients(prev=>prev.map(c=>c.id===updated.id?updated:c));setEditingClient(null);}

  return(
    <div style={{position:"relative"}}>
      {editingClient&&<EditClientModal client={editingClient} onSave={saveClientEdit} onClose={()=>setEditingClient(null)}/>}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca tra i tuoi lettori… 📚"/>
      {showAdd?(
        <div className="card">
          <p className="card-title">Nuovo lettore 🌱</p>
          <label>Nome *</label><input value={n.name} onChange={e=>setN(p=>({...p,name:e.target.value}))} placeholder="Nome e cognome"/>
          <label>Telefono</label><input value={n.phone} onChange={e=>setN(p=>({...p,phone:e.target.value}))} placeholder="es. 333 1234567"/>
          <label>Email</label><input value={n.email} onChange={e=>setN(p=>({...p,email:e.target.value}))} placeholder="es. mario@email.com"/>
          <label>Note</label>
          <textarea value={n.notes} onChange={e=>setN(p=>({...p,notes:e.target.value}))} placeholder="Ama i romanzi russi, diffidente verso i thriller... ogni lettore è un mondo 🌍"/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn-primary" onClick={addClient} style={{flex:1}}>Aggiungi lettore</button>
            <button className="btn-sec" onClick={()=>setShowAdd(false)} style={{flex:1}}>Annulla</button>
          </div>
        </div>
      ):(
        <button className="btn-primary" onClick={()=>setShowAdd(true)} style={{marginBottom:16}}>+ Aggiungi nuovo lettore 🌱</button>
      )}
      {filtered.length===0&&<p style={{fontSize:14,color:"#6B6560"}}>Nessun lettore trovato… forse si è perso tra gli scaffali? 📚</p>}
      {filtered.map((c,i)=>(
        <div key={c.id} className="client-card" onClick={()=>onOpenClient(c)}>
          <div className="avatar" style={{width:44,height:44,background:BOOK_COLORS[i%BOOK_COLORS.length]+"18",color:BOOK_COLORS[i%BOOK_COLORS.length],fontSize:15}}>{getInitials(c.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:500,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              {c.name}
              {c.stamps>=8&&<span className="badge-prize">🎉 Premio!</span>}
              {c.stamps>=6&&c.stamps<8&&<span className="badge-near">⏳ {c.stamps}/8</span>}
            </div>
            <div className="title-badge">{getTitle(c.history.length,c.totalCards)}</div>
          </div>
          <div className="dots">{Array.from({length:8},(_,j)=><div key={j} className="dot" style={{background:j<c.stamps?(c.stamps>=8?"#8B2635":"#1A1A1A"):"#D8D0C4"}}/>)}</div>
          <button className="edit-btn" style={{marginLeft:8}} onClick={e=>{e.stopPropagation();setEditingClient(c);}}>✏</button>
        </div>
      ))}
    </div>
  );
}

function EditPurchaseModal({purchase,onSave,onDelete,onClose}){
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
        <div style={{marginBottom:10}}>{OCCASIONS.map(o=><span key={o.id} className={`occ-btn${occasion===o.id?" sel":""}`} onClick={()=>setOccasion(o.id)}>{o.label}</span>)}</div>
        {occasion==="bookclub"&&<><label>Bookclub</label><select value={occasionDetail} onChange={e=>setOccasionDetail(e.target.value)} style={{marginBottom:10}}><option value="">— seleziona —</option>{BOOKCLUBS.map(b=><option key={b} value={b}>{b}</option>)}</select></>}
        {occasion==="presentazione"&&<><label>Autore / evento</label><input value={occasionDetail} onChange={e=>setOccasionDetail(e.target.value)} placeholder="es. Woolf, Fitzgerald…"/></>}
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button className="btn-primary" style={{flex:1}} onClick={()=>onSave({...purchase,amount:Number(amount).toFixed(2),note,librarian,occasion,occasionDetail})}>Salva</button>
          <button className="btn-sec" style={{flex:1}} onClick={onClose}>Annulla</button>
        </div>
        <button className="btn-danger" style={{width:"100%",border:"1px solid #D4A0A0",borderRadius:8,padding:"8px"}} onClick={()=>onDelete(purchase.idx)}>Elimina acquisto</button>
      </div>
    </div>
  );
}

function ConfirmPurchaseModal({client,purchase,onConfirm,onCancel}){
  return(
    <div className="overlay">
      <div className="modal">
        <p className="modal-title">Conferma acquisto 📖</p>
        <div style={{background:"#F5F0E8",borderRadius:8,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontSize:13,color:"#6B6560",marginBottom:2}}>Cliente</div>
          <div style={{fontSize:15,fontWeight:500}}>{client.name}</div>
          {purchase.note&&<><div style={{fontSize:13,color:"#6B6560",marginTop:8,marginBottom:2}}>Libro</div><div style={{fontSize:14}}>{purchase.note}</div></>}
          <div style={{fontSize:13,color:"#6B6560",marginTop:8,marginBottom:2}}>Importo</div>
          <div style={{fontSize:22,fontWeight:500,fontFamily:"'Playfair Display',Georgia,serif",color:"#8B2635"}}>€{Number(purchase.amount).toFixed(2)}</div>
          <div style={{fontSize:13,color:"#6B6560",marginTop:8,marginBottom:6}}>Timbri dopo questo acquisto</div>
          <div style={{display:"flex",gap:4}}>
            {Array.from({length:8},(_,i)=><div key={i} style={{width:22,height:22,borderRadius:4,background:i<client.stamps+1?(i===client.stamps?"#8B2635":"#1A1A1A"):"#E0D8CC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{i<client.stamps+1?"📚":""}</div>)}
          </div>
          {client.stamps+1>=8&&<div style={{marginTop:10,fontSize:13,color:"#8B2635",fontWeight:500}}>🎉 Con questo acquisto completa la tessera!</div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-primary" style={{flex:1}} onClick={onConfirm}>Sì, conferma!</button>
          <button className="btn-sec" style={{flex:1}} onClick={onCancel}>Annulla</button>
        </div>
      </div>
    </div>
  );
}

function ClientDetail({clientId,clients,setClients,onDelete}){
  const client=clients.find(c=>c.id===clientId);
  const [showPurchase,setShowPurchase]=useState(false);
  const [purchase,setPurchase]=useState({amount:"",note:"",librarian:LIBRARIANS[0],occasion:"normale",occasionDetail:""});
  const [showConfirm,setShowConfirm]=useState(false);
  const [prize,setPrize]=useState(false);
  const [showConfetti,setShowConfetti]=useState(false);
  const [editing,setEditing]=useState(null);
  const [editingClient,setEditingClient]=useState(false);
  const [filterOccasion,setFilterOccasion]=useState("tutti");
  const [animStamp,setAnimStamp]=useState(null);
  const ci=clients.indexOf(client);

  if(!client)return<p style={{color:"#6B6560"}}>Cliente non trovato.</p>;

  const totalSpent=client.history.reduce((s,h)=>s+parseFloat(h.amount),0);
  const avgSpent=client.history.length?totalSpent/client.history.length:0;
  const firstDate=client.history.length?client.history[client.history.length-1].date:"–";
  const lastDate=client.history.length?client.history[0].date:"–";
  const filteredHistory=filterOccasion==="tutti"?client.history:client.history.filter(h=>h.occasion===filterOccasion);

  function handleConfirmPurchase(){
    const newStamps=client.stamps+1;const completed=newStamps>=8;
    const entry={date:nowDate(),time:nowTime(),amount:Number(purchase.amount).toFixed(2),note:purchase.note,librarian:purchase.librarian,occasion:purchase.occasion,occasionDetail:purchase.occasionDetail};
    setAnimStamp(client.stamps);
    setClients(prev=>prev.map(c=>{if(c.id!==clientId)return c;return{...c,stamps:completed?0:newStamps,history:[entry,...c.history],totalCards:c.totalCards+(completed?1:0)};}));
    setTimeout(()=>setAnimStamp(null),600);
    if(completed){setPrize(true);setShowConfetti(true);}
    setPurchase({amount:"",note:"",librarian:LIBRARIANS[0],occasion:"normale",occasionDetail:""});
    setShowPurchase(false);setShowConfirm(false);
  }
  function saveEdit(updated){setClients(prev=>prev.map(c=>{if(c.id!==clientId)return c;return{...c,history:c.history.map((h,i)=>i===updated.idx?{...h,amount:updated.amount,note:updated.note,librarian:updated.librarian,occasion:updated.occasion,occasionDetail:updated.occasionDetail}:h)};}));setEditing(null);}
  function deletePurchase(idx){setClients(prev=>prev.map(c=>{if(c.id!==clientId)return c;const h=c.history.filter((_,i)=>i!==idx);const cards=Math.floor(h.length/8);return{...c,history:h,stamps:h.length-cards*8,totalCards:cards};}));setEditing(null);}
  function saveClientEdit(updated){setClients(prev=>prev.map(c=>c.id===updated.id?updated:c));setEditingClient(false);}

  if(prize)return(
    <div className="prize-screen">
      {showConfetti&&<Confetti onDone={()=>setShowConfetti(false)}/>}
      <div style={{fontSize:64,marginBottom:16}}>🎉</div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:24,margin:"0 0 10px"}}>Tessera completata!</h2>
      <p style={{fontSize:15,color:"#6B6560",margin:"0 0 8px",lineHeight:1.6}}><strong>{client.name}</strong> ha completato la tessera!<br/>Ha diritto a uno sconto o un libro gratuito.</p>
      <p style={{fontSize:13,color:"#A09890",margin:"0 0 24px",fontStyle:"italic"}}>Che bello premiare un lettore fedele ❤️</p>
      <button className="btn-primary" style={{width:"auto",padding:"10px 32px"}} onClick={()=>setPrize(false)}>Continua →</button>
    </div>
  );

  return(
    <div style={{position:"relative"}}>
      {editing&&<EditPurchaseModal purchase={editing} onSave={saveEdit} onDelete={deletePurchase} onClose={()=>setEditing(null)}/>}
      {editingClient&&<EditClientModal client={client} onSave={saveClientEdit} onClose={()=>setEditingClient(false)}/>}
      {showConfirm&&<ConfirmPurchaseModal client={client} purchase={purchase} onConfirm={handleConfirmPurchase} onCancel={()=>setShowConfirm(false)}/>}

      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
        <div className="avatar" style={{width:54,height:54,background:BOOK_COLORS[ci%BOOK_COLORS.length]+"18",color:BOOK_COLORS[ci%BOOK_COLORS.length],fontSize:18}}>{getInitials(client.name)}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:500}}>{client.name}</div>
          <div style={{fontSize:13,color:"#6B6560",marginTop:2}}>{client.email||"–"}{client.phone?" · "+client.phone:""}</div>
          <div className="title-badge" style={{marginTop:4}}>{getTitle(client.history.length,client.totalCards)}</div>
          {client.notes&&<div style={{fontSize:12,color:"#8B6F5C",marginTop:6,fontStyle:"italic",background:"#FAF3EC",borderRadius:6,padding:"6px 10px",border:"1px solid #EDE0D0"}}>📝 {client.notes}</div>}
        </div>
        <button className="edit-btn" onClick={()=>setEditingClient(true)}>✏ Modifica</button>
      </div>

      <div className="card-dark">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="card-title-light">Tessera fedeltà</span>
          <span style={{fontSize:12,color:"#A09890"}}>{client.stamps} di 8</span>
        </div>
        <div className="card-inner-dark">
          <div className="stamp-grid">
            {Array.from({length:8},(_,i)=>(
              <div key={i} className={`stamp ${i<client.stamps?(client.stamps>=8?"prize":"filled"):"empty"}${animStamp===i?" pop":""}`}>
                {i<client.stamps?<span style={{fontSize:20}}>📚</span>:<span style={{fontSize:14,color:"#2A2A2A"}}>·</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginTop:12}}>
          {[{l:"Tessere completate",v:client.totalCards},{l:"Acquisti",v:client.history.length},{l:"Spesa",v:`€${Math.round(totalSpent)}`},{l:"Media acq.",v:`€${Math.round(avgSpent)}`},{l:"Ultimo acq.",v:lastDate==="–"?"–":lastDate.slice(0,5)}].map(m=>(
            <div key={m.l} className="stat-dark">
              <div style={{fontSize:9,color:"#A09890",textTransform:"uppercase",letterSpacing:".05em"}}>{m.l}</div>
              <div style={{fontSize:15,fontWeight:500,color:"#FDFAF5",fontFamily:"'Playfair Display',Georgia,serif",marginTop:3,fontVariantNumeric:"tabular-nums"}}>{m.v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:8,fontSize:11,color:"#6B6560",textAlign:"center"}}>Cliente dal {firstDate}</div>
      </div>

      {showPurchase?(
        <div className="card">
          <p className="card-title">Registra acquisto 📖</p>
          <label>Importo (€)</label><input type="number" value={purchase.amount} onChange={e=>setPurchase(p=>({...p,amount:e.target.value}))} placeholder="es. 18.50"/>
          <label>Titolo / nota (opzionale)</label><input value={purchase.note} onChange={e=>setPurchase(p=>({...p,note:e.target.value}))} placeholder="es. Il nome della rosa"/>
          <label>Librario</label>
          <select value={purchase.librarian} onChange={e=>setPurchase(p=>({...p,librarian:e.target.value}))}>
            {LIBRARIANS.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <label>Occasione</label>
          <div style={{marginBottom:10}}>{OCCASIONS.map(o=><span key={o.id} className={`occ-btn${purchase.occasion===o.id?" sel":""}`} onClick={()=>setPurchase(p=>({...p,occasion:o.id,occasionDetail:""}))}>{o.label}</span>)}</div>
          {purchase.occasion==="bookclub"&&<><label>Bookclub</label><select value={purchase.occasionDetail} onChange={e=>setPurchase(p=>({...p,occasionDetail:e.target.value}))} style={{marginBottom:10}}><option value="">— seleziona —</option>{BOOKCLUBS.map(b=><option key={b} value={b}>{b}</option>)}</select></>}
          {purchase.occasion==="presentazione"&&<><label>Autore / evento</label><input value={purchase.occasionDetail} onChange={e=>setPurchase(p=>({...p,occasionDetail:e.target.value}))} placeholder="es. Woolf, Fitzgerald…"/></>}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn-primary" style={{flex:1}} onClick={()=>{if(!purchase.amount||isNaN(Number(purchase.amount)))return;setShowConfirm(true);}}>Vai alla conferma →</button>
            <button className="btn-sec" style={{flex:1}} onClick={()=>setShowPurchase(false)}>Annulla</button>
          </div>
        </div>
      ):(
        <button className="btn-primary" onClick={()=>setShowPurchase(true)} style={{marginBottom:16}}>+ Dai, registra un acquisto! 📚</button>
      )}

      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
          <p className="card-title" style={{margin:0}}>Storico acquisti</p>
          <div>{["tutti",...OCCASIONS.map(o=>o.id)].map(id=>(
            <span key={id} className={`filter-btn${filterOccasion===id?" sel":""}`} onClick={()=>setFilterOccasion(id)}>
              {id==="tutti"?"Tutti":OCCASIONS.find(o=>o.id===id)?.label}
            </span>
          ))}</div>
        </div>
        {filteredHistory.length===0?<p style={{fontSize:13,color:"#6B6560"}}>Nessun acquisto in questa categoria ancora 🌱</p>:filteredHistory.map((h,idx)=>(
          <div key={idx} className="hist-row">
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",minWidth:0}}>
              <span style={{fontSize:13,fontWeight:500}}>{h.note||"Acquisto"}</span>
              {h.librarian&&<span className="lib-tag">{h.librarian}</span>}
              {h.occasion&&h.occasion!=="normale"&&<span className="occ-tag">{OCCASIONS.find(o=>o.id===h.occasion)?.label}{h.occasionDetail?` · ${h.occasionDetail}`:""}</span>}
              <span style={{fontSize:11,color:"#A09890"}}>{h.date}{h.time?` · ${h.time}`:""}</span>
            </div>
            <span className="row-val" style={{marginRight:10,flexShrink:0}}>€{h.amount}</span>
            <button onClick={()=>setEditing({...h,idx})} className="edit-btn">Modifica</button>
          </div>
        ))}
      </div>
      <button className="btn-danger" onClick={()=>{if(window.confirm("Sei sicuro di voler eliminare questo cliente? 😢"))onDelete(clientId);}}>Elimina cliente</button>
    </div>
  );
}

function CassaMode({clients,setClients,onExit}){
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [amount,setAmount]=useState("");
  const [note,setNote]=useState("");
  const [librarian,setLibrarian]=useState(LIBRARIANS[0]);
  const [showConfirm,setShowConfirm]=useState(false);
  const [done,setDone]=useState(null);
  const filtered=search.trim().length>1?clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search)):[];

  function handleConfirm(){
    if(!selected||!amount||isNaN(Number(amount)))return;
    const newStamps=selected.stamps+1;const completed=newStamps>=8;
    const entry={date:nowDate(),time:nowTime(),amount:Number(amount).toFixed(2),note,librarian,occasion:"normale",occasionDetail:""};
    setClients(prev=>prev.map(c=>{if(c.id!==selected.id)return c;return{...c,stamps:completed?0:newStamps,history:[entry,...c.history],totalCards:c.totalCards+(completed?1:0)};}));
    setDone({name:selected.name,completed,stamps:completed?0:newStamps,amount:Number(amount).toFixed(2)});
    setSelected(null);setAmount("");setNote("");setSearch("");setShowConfirm(false);
  }

  return(
    <div className="cassa-mode">
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,color:"#FDFAF5",fontWeight:600}}>🪶 Modalità cassa</div>
            <div style={{fontSize:11,color:"#6B6560",letterSpacing:".06em",textTransform:"uppercase",marginTop:2}}>Veloce e senza distrazioni</div>
          </div>
          <button onClick={onExit} style={{fontSize:12,color:"#A09890",background:"none",border:"1px solid #3A3A3A",borderRadius:6,padding:"6px 12px",cursor:"pointer"}}>← Torna all'app</button>
        </div>

        {done&&(
          <div style={{background:done.completed?"#6B1020":"#2A2A2A",border:`1px solid ${done.completed?"#8B2635":"#3A3A3A"}`,borderRadius:10,padding:"14px 18px",marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:6}}>{done.completed?"🎉":"✅"}</div>
            <div style={{color:"#FDFAF5",fontSize:15,fontWeight:500}}>{done.completed?`${done.name} ha completato la tessera! 🎁`:`${done.name} ha ora ${done.stamps}/8 timbri`}</div>
            <div style={{color:"#A09890",fontSize:12,marginTop:4}}>€{done.amount} · {nowTime()}</div>
            <button onClick={()=>setDone(null)} style={{marginTop:10,background:"none",border:"1px solid #555",borderRadius:6,padding:"5px 14px",color:"#A09890",cursor:"pointer",fontSize:12}}>Nuovo acquisto</button>
          </div>
        )}

        {!selected?(
          <>
            <div className="cassa-search">
              <span style={{fontSize:16,color:"#6B6560"}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca cliente…" autoFocus/>
              {search&&<span onClick={()=>setSearch("")} style={{color:"#6B6560",cursor:"pointer"}}>×</span>}
            </div>
            {filtered.map((c,i)=>(
              <div key={c.id} className="cassa-result" onClick={()=>setSelected(c)}>
                <div className="avatar" style={{width:40,height:40,background:BOOK_COLORS[i%BOOK_COLORS.length]+"30",color:BOOK_COLORS[i%BOOK_COLORS.length],fontSize:14}}>{getInitials(c.name)}</div>
                <div style={{flex:1}}>
                  <div style={{color:"#FDFAF5",fontWeight:500}}>{c.name}</div>
                  <div style={{color:"#6B6560",fontSize:12,marginTop:2}}>{c.stamps}/8 · {getTitle(c.history.length,c.totalCards)}</div>
                </div>
                {c.stamps>=8&&<span className="badge-prize">🎉 Premio!</span>}
                {c.stamps>=6&&c.stamps<8&&<span className="badge-near">⏳</span>}
                <span style={{color:"#555",fontSize:18}}>→</span>
              </div>
            ))}
            {search.length>1&&filtered.length===0&&<p style={{color:"#555",textAlign:"center",fontSize:13,marginTop:16}}>Nessun cliente trovato 🌱</p>}
          </>
        ):(
          <div style={{background:"#2A2A2A",border:"1px solid #3A3A3A",borderRadius:12,padding:"18px 20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingBottom:14,borderBottom:"1px solid #3A3A3A"}}>
              <div className="avatar" style={{width:44,height:44,background:BOOK_COLORS[0]+"30",color:BOOK_COLORS[0],fontSize:16}}>{getInitials(selected.name)}</div>
              <div style={{flex:1}}>
                <div style={{color:"#FDFAF5",fontWeight:500,fontSize:16}}>{selected.name}</div>
                <div style={{display:"flex",gap:4,marginTop:6}}>
                  {Array.from({length:8},(_,i)=><div key={i} style={{width:18,height:18,borderRadius:4,background:"#1A1A1A",border:`1px solid ${i<selected.stamps?"#555":"#333"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{i<selected.stamps?"📚":""}</div>)}
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{color:"#555",background:"none",border:"none",cursor:"pointer",fontSize:20}}>×</button>
            </div>
            <label style={{color:"#A09890"}}>Importo (€) *</label>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="es. 18.50" style={{background:"#1A1A1A",border:"1px solid #3A3A3A",color:"#FDFAF5"}}/>
            <label style={{color:"#A09890"}}>Titolo (opzionale)</label>
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="es. Il nome della rosa" style={{background:"#1A1A1A",border:"1px solid #3A3A3A",color:"#FDFAF5"}}/>
            <label style={{color:"#A09890"}}>Librario</label>
            <select value={librarian} onChange={e=>setLibrarian(e.target.value)} style={{background:"#1A1A1A",border:"1px solid #3A3A3A",color:"#FDFAF5"}}>
              {LIBRARIANS.map(l=><option key={l} value={l}>{l}</option>)}
            </select>
            {showConfirm?(
              <div style={{background:"#1A1A1A",borderRadius:8,padding:"12px",marginBottom:10,textAlign:"center"}}>
                <div style={{color:"#FDFAF5",fontSize:14,marginBottom:8}}>Confermi €{Number(amount).toFixed(2)} per <strong>{selected.name}</strong>?</div>
                {selected.stamps+1>=8&&<div style={{color:"#8B2635",fontSize:13,marginBottom:10}}>🎉 Completerà la tessera!</div>}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={handleConfirm} style={{flex:1,background:"#8B2635",color:"#FDFAF5",border:"none",borderRadius:8,padding:"10px",fontSize:14,cursor:"pointer",fontWeight:500}}>✓ Conferma</button>
                  <button onClick={()=>setShowConfirm(false)} style={{flex:1,background:"#2A2A2A",color:"#A09890",border:"1px solid #3A3A3A",borderRadius:8,padding:"10px",fontSize:14,cursor:"pointer"}}>Annulla</button>
                </div>
              </div>
            ):(
              <button onClick={()=>{if(!amount||isNaN(Number(amount)))return;setShowConfirm(true);}} style={{width:"100%",background:"#FDFAF5",color:"#1A1A1A",border:"none",borderRadius:8,padding:"12px",fontSize:15,fontWeight:500,cursor:"pointer"}}>Registra acquisto →</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [logged,setLogged]=useState(false);
  const [cassaMode,setCassaMode]=useState(false);
  const [clients,setClients]=useState(()=>{
    try{const s=JSON.parse(localStorage.getItem("lib_clients")||"null");return(s&&s.length>0)?s:DEMO_CLIENTS;}catch{return DEMO_CLIENTS;}
  });
  const [lastBackup,setLastBackup]=useState(()=>localStorage.getItem("lib_last_backup")||null);
  const [tabs,setTabs]=useState([
    {id:"dashboard",label:"Dashboard",icon:"⊞",closable:false},
    {id:"clienti",label:"Clienti",icon:"⊕",closable:false},
  ]);
  const [activeTab,setActiveTab]=useState("dashboard");
  const fileRef=useRef(null);

  useEffect(()=>{try{localStorage.setItem("lib_clients",JSON.stringify(clients));}catch{}},[clients]);

  function openSpecialTab(id,label,icon){
    setTabs(prev=>{if(prev.find(t=>t.id===id))return prev;return[...prev,{id,label,icon,closable:true}];});
    setActiveTab(id);
  }
  function openClientTab(c){
    const tabId=`client-${c.id}`;
    const ci=clients.findIndex(x=>x.id===c.id);
    setTabs(prev=>{if(prev.find(t=>t.id===tabId))return prev;return[...prev,{id:tabId,label:c.name,icon:"",closable:true,clientId:c.id,initials:getInitials(c.name),colorIdx:ci}];});
    setActiveTab(tabId);
  }
  function closeTab(tabId){setTabs(prev=>prev.filter(t=>t.id!==tabId));setActiveTab(prev=>prev===tabId?"clienti":prev);}
  function deleteClient(clientId){setClients(prev=>prev.filter(c=>c.id!==clientId));closeTab(`client-${clientId}`);}

  function handleExport(){
    const blob=new Blob([JSON.stringify(clients,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`lapagina_backup_${nowDate().replace(/\//g,"-")}.json`;a.click();URL.revokeObjectURL(url);
    const now=new Date().toISOString();setLastBackup(now);localStorage.setItem("lib_last_backup",now);
  }
  function handleImport(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{try{const data=JSON.parse(ev.target.result);if(Array.isArray(data)){setClients(data);alert(`✅ Importati ${data.length} clienti!`);}else alert("File non valido.");}catch{alert("Errore nella lettura del file.");}};
    reader.readAsText(file);e.target.value="";
  }

  if(!logged)return(<><style>{css}</style><div className="app"><LoginPage onLogin={()=>setLogged(true)}/></div></>);
  if(cassaMode)return(<><style>{css}</style><CassaMode clients={clients} setClients={setClients} onExit={()=>setCassaMode(false)}/></>);

  const activeTabData=tabs.find(t=>t.id===activeTab);
  return(
    <><style>{css}</style>
    <div className="app">
      <div className="hdr">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div className="hdr-icon">🪶</div>
          <div>
            <div className="hdr-title">La Pagina</div>
            <div className="hdr-sub">Gestione Programma Fedeltà · {clients.length} lettori</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setCassaMode(true)} style={{fontSize:12,color:"#FDFAF5",background:"#8B2635",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontWeight:500}}>🛒 Cassa</button>
          <button className="hdr-btn" onClick={()=>setLogged(false)}>Esci →</button>
        </div>
      </div>
      <TabBar tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} onClose={closeTab}/>
      <div className="content">
        {activeTab==="dashboard"&&<Dashboard clients={clients} onExport={handleExport} onImport={handleImport} fileRef={fileRef} lastBackup={lastBackup} onOpenClient={openClientTab} onOpenTab={openSpecialTab}/>}
        {activeTab==="clienti"&&<ClientList clients={clients} setClients={setClients} onOpenClient={openClientTab}/>}
        {activeTab==="bookclub"&&<BookclubTab clients={clients}/>}
        {activeTab==="presentazioni"&&<PresentazioniTab clients={clients}/>}
        {activeTabData?.clientId&&<ClientDetail clientId={activeTabData.clientId} clients={clients} setClients={setClients} onDelete={deleteClient}/>}
      </div>
    </div></>
  );
}