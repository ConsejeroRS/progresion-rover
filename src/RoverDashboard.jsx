import { useState, useEffect, useRef } from "react";
import { db } from "./firebase.js";
import {
  doc, getDoc, setDoc, collection, getDocs, deleteDoc
} from "firebase/firestore";

// ─── ETAPAS COMPLETAS (Cartilla 2.0 – solo 3 etapas) ─────────────────────────
const STAGES = [
  {
    id: 1, numeral: "01", color: "#D63031", bg: "#2A0A0A",
    name: "Aspirante Rover", subtitle: "Etapa de Encuentro",
    investidura: "ENTREGA DE PAÑOLETA",
    description: "Primer acercamiento al clan rover. Espacio para conocer, observar y decidir con libertad sin compromisos formales.",
    areas: ["Corporalidad","Creatividad","Carácter","Afectividad","Sociabilidad","Espiritualidad"],
    areaDesc: [
      "Participación activa en reuniones y actividades iniciales",
      "Comprender estructura y funcionamiento del Clan",
      "Mostrar compromiso inicial y disciplina",
      "Integrarse sanamente al grupo",
      "Convivir y colaborar con el Clan",
      "Reflexionar sobre el lema Rover y propósito personal"
    ],
    sections: [
      { name: "Vida Rover", area: "Sociabilidad", items: [
        "Participar en actividades de encuentro mínimo 1 mes",
        "Conocer el Clan y el Grupo",
        "Divisa scout y su historia"
      ]},
      { name: "Administrativo", area: "Carácter", items: [
        "Estar inscrito en la Asociación de Scouts de Guatemala",
        "Renas vigente",
        "Safe From Harm (SFH)"
      ]},
      { name: "Espíritu Scout", area: "Espiritualidad", items: [
        "Promesa scout",
        "Ley scout",
        "Lema rover",
        "Oración rover",
        "Principios y virtudes",
        "Saludo scout y su historia",
        "La obligación diaria (buena acción)",
        "Historia del grupo",
        "Partes de la flor de lis nacional",
        "Partes de la flor de lis mundial"
      ]}
    ]
  },
  {
    id: 2, numeral: "02", color: "#E67E22", bg: "#261800",
    name: "Heraldo Rover", subtitle: "Etapa de Reflexión",
    investidura: "INVESTIDURA DE BORLAS Y HERALDO ROVER",
    description: "Momento de mirar hacia adentro y entender qué significa ser scout. Construir identidad y criterio propio sin presión.",
    areas: ["Corporalidad","Creatividad","Carácter","Afectividad","Sociabilidad","Espiritualidad"],
    areaDesc: [
      "Participación constante en actividades básicas del Clan",
      "Comprender historia, símbolos y fundamentos del escultismo",
      "Vivir la Ley, Promesa y principios Scout",
      "Desarrollar empatía mediante servicio inicial",
      "Fortalecer trabajo en equipo y disciplina grupal",
      "Interiorizar mística Rover y obligación diaria"
    ],
    sections: [
      { name: "Vida Rover", area: "Sociabilidad", items: [
        "¿Qué es el movimiento scout?",
        "Misión y visión del movimiento scout",
        "Obligación diaria y su aplicación",
        "Historia del grupo y del Clan"
      ]},
      { name: "Escultismo", area: "Creatividad", items: [
        "Historia del Escultismo Internacional",
        "Uniforme y sus partes",
        "Biografía de Baden Powell",
        "Estructura del Clan Rover"
      ]},
      { name: "Civismo", area: "Carácter", items: [
        "Declamar Jura a la Bandera",
        "Entonar Himno Nacional correctamente"
      ]},
      { name: "Lectura Formativa", area: "Espiritualidad", items: [
        "Rover: lo que son y lo que hacen",
        "Escultismo para muchachos – fogatas 1 al 3",
        "Iniciar lectura de Roverismo hacia el éxito"
      ]}
    ]
  },
  {
    id: 3, numeral: "03", color: "#27AE60", bg: "#031409",
    name: "Escudero Rover", subtitle: "Etapa de Compromiso",
    investidura: "INVESTIDURA DE ESCUDERO Y LISTONES",
    description: "Asumir responsabilidades reales. Desarrollar liderazgo, trabajo en equipo y servicio comunitario activo.",
    areas: ["Corporalidad","Creatividad","Carácter","Afectividad","Sociabilidad","Espiritualidad"],
    areaDesc: [
      "Dominio sólido de técnicas de aire libre, seguridad y auto cuidado",
      "Elaboración de heráldica, CV, proyectos y soluciones innovadoras",
      "Liderazgo, responsabilidad, disciplina, toma de decisiones",
      "Madurez emocional, empatía, mentoría y relaciones sanas",
      "Servicio activo, ciudadanía responsable y participación comunitaria",
      "Propósito, identidad Rover, coherencia con la Ley y Promesa"
    ],
    sections: [
      { name: "Vida Rover", area: "Creatividad", items: [
        "Elaboración y explicación del escudo Rover (heráldica)",
        "Diseño y significado de la horquilla",
        "Elaboración de CV Scout y CV personal",
        "Participar en una excursión de tu clan"
      ]},
      { name: "Liderazgo y Servicio", area: "Sociabilidad", items: [
        "Formar a un miembro nuevo (unidad, caminante o rover)",
        "2 reuniones de cubil (con bitácora)",
        "2 reuniones de manada o un acantonamiento (con bitácora)",
        "2 reuniones de unidad o un campamento (con bitácora)",
        "2 reuniones de caminantes o un campamento (con bitácora)"
      ]},
      { name: "Civismo", area: "Carácter", items: [
        "Historia del himno nacional",
        "Historia de jura de la bandera",
        "Conocimiento de los símbolos patrios",
        "Correcto izado, arriado y doblado de banderas",
        "Geografía nacional: volcanes, ríos, lagos y lagunas principales",
        "Conocimiento de pueblos indígenas e idiomas"
      ]},
      { name: "Escultismo", area: "Creatividad", items: [
        "Jerarquía y organización del Grupo",
        "Ejecución correcta del saludo y seña en cada circunstancia"
      ]},
      { name: "Nudos", area: "Corporalidad", items: [
        "Margarita","Ballestrinque","As de guía","Rizo","Pescador",
        "Vuelta de escota","Media llave","Corredizo","Vuelta de braza",
        "Presilla de alondra","Fugitivo","Arnés de hombre",
        "As de guía doble","Ballestrinque doble","Zarpa de gato"
      ]},
      { name: "Amarres", area: "Corporalidad", items: [
        "Diagonal","Cuadrado","Redondo","Ocho"
      ]},
      { name: "Observación y Señalización", area: "Corporalidad", items: [
        "Claves básicas","Pistas","Pruebas de Kim",
        "Señalización con silbato","Formaciones"
      ]},
      { name: "Campamento – Instalaciones", area: "Corporalidad", items: [
        "Mesa","Portada","Cercado","Asta",
        "Cocineta","Basurero","Fogata","Puente de 1-2-3 hilos",
        "Traspaso en cable","Croquis del campamento"
      ]},
      { name: "Campamento – Habilidades", area: "Corporalidad", items: [
        "Partes, cuidado y manejo de navaja, cuchillo, machete y hacha",
        "Corte adecuado de leña",
        "Mochila básica de campamento",
        "Cuidados, levantado y reparaciones de carpa de campaña",
        "Armado, uso y prevenciones de 6 tipos de fogata",
        "Cocina individual – Menú básico (pollo, arroz, carne, sopa, postre y bebida)",
        "¿Qué es? y elaboración de un croquis"
      ]},
      { name: "Seguridad y Primeros Auxilios", area: "Afectividad", items: [
        "Tipos de botiquín y contenido",
        "Armado o re abastecimiento del botiquín del Clan",
        "Manejo de emergencias y traslado de heridos",
        "Seguridad vial y desastres naturales en Guatemala",
        "Números de emergencia nacional y regional",
        "Ejercicios B.P.",
        "Vendajes scout"
      ]},
      { name: "Medio Ambiente", area: "Espiritualidad", items: [
        "Flora y fauna nacional",
        "Reservas y áreas protegidas del país",
        "Uso y conservación de la naturaleza",
        "Visitar dos parques ecológicos y documentar propósito"
      ]},
      { name: "Competencias Digitales", area: "Creatividad", items: [
        "Hardware y software",
        "Microsoft Office básico",
        "Perfiles Gmail y Outlook",
        "Seguridad en línea y huella digital",
        "TIC aplicadas a la realidad profesional"
      ]},
      { name: "Cultura y Patrimonio", area: "Espiritualidad", items: [
        "Folklore: comidas, bailes, leyendas y tradiciones",
        "Centros arqueológicos de Guatemala",
        "Regiones culturales del país"
      ]},
      { name: "Caminata Rover", area: "Corporalidad", items: [
        "Caminata mínimo 10 km con croquis, claves, fotos y bitácora"
      ]}
    ]
  }
];

// ─── KEYS ─────────────────────────────────────────────────────────────────────
const pKey  = (sid, stId, sec, idx) => `${sid}|${stId}|${sec}|${idx}`;
const dKey  = (sid, stId, sec, idx) => `d:${sid}|${stId}|${sec}|${idx}`;
const nKey  = (sid, stId, sec, idx) => `n:${sid}|${stId}|${sec}|${idx}`;
const invKey = (sid, stId) => `inv:${sid}|${stId}`;

// ─── RADAR CHART ─────────────────────────────────────────────────────────────
function RadarChart({ stage, scoutId, prog, size = 200 }) {
  const cx = size / 2, cy = size / 2 + 6, r = size * 0.36;
  const areas = stage.areas;
  const n = areas.length;
  const scores = areas.map(area => {
    let t = 0, d = 0;
    stage.sections.forEach(sec => {
      if (sec.area === area) sec.items.forEach((_, i) => {
        t++; if (prog[pKey(scoutId, stage.id, sec.name, i)]) d++;
      });
    });
    return t ? d / t : 0;
  });
  const angle = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const pt = (i, radius) => [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
  const polyStr = pts => pts.map(p => p.join(",")).join(" ");
  const gridLvs = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg viewBox={`0 0 ${size} ${size + 12}`} width="100%" style={{ maxWidth: size + "px", display: "block", margin: "0 auto" }}>
      {gridLvs.map((lv, gi) => (
        <polygon key={gi} points={polyStr(areas.map((_, i) => pt(i, r * lv)))}
          fill="none" stroke={gi === 3 ? "rgba(201,162,39,0.2)" : "rgba(201,162,39,0.1)"} strokeWidth={gi === 3 ? 1.2 : 0.8} />
      ))}
      {areas.map((_, i) => {
        const [x, y] = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(201,162,39,0.15)" strokeWidth="0.8" />;
      })}
      <polygon points={polyStr(areas.map((_, i) => pt(i, r * scores[i])))}
        fill={`${stage.color}28`} stroke={stage.color} strokeWidth="2" strokeLinejoin="round" />
      {areas.map((_, i) => {
        const [x, y] = pt(i, r * scores[i]);
        return <circle key={i} cx={x} cy={y} r="4" fill={stage.color} stroke="#0A0604" strokeWidth="1.5" />;
      })}
      {areas.map((a, i) => {
        const lr = r + 20;
        const [lx, ly] = pt(i, lr);
        return (
          <g key={i}>
            <text x={lx} y={ly - 2} textAnchor="middle" fill="#EDE8E1" fontSize="8"
              fontFamily="'Cinzel',serif" fontWeight="600">{a}</text>
            <text x={lx} y={ly + 9} textAnchor="middle" fill={stage.color} fontSize="8.5"
              fontFamily="'Source Sans 3',sans-serif" fontWeight="700">{Math.round(scores[i]*100)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── EXPORT HTML ─────────────────────────────────────────────────────────────
function exportHTML(scout, prog, dates, notes) {
  const today = new Date().toLocaleDateString("es-GT", { day: "2-digit", month: "long", year: "numeric" });
  let totalD = 0, totalT = 0;
  const stagesData = STAGES.map(st => {
    const secs = st.sections.map(sec => {
      const its = sec.items.map((item, idx) => {
        const done = !!prog[pKey(scout.id, st.id, sec.name, idx)];
        return { item, done, date: dates[dKey(scout.id, st.id, sec.name, idx)] || "", note: notes[nKey(scout.id, st.id, sec.name, idx)] || "" };
      });
      const d = its.filter(i => i.done).length;
      return { name: sec.name, items: its, d, t: its.length };
    });
    const d = secs.reduce((a, s) => a + s.d, 0);
    const t = secs.reduce((a, s) => a + s.t, 0);
    totalD += d; totalT += t;
    return { ...st, secs, d, t, pct: t ? Math.round(d / t * 100) : 0 };
  });
  const pct = totalT ? Math.round(totalD / totalT * 100) : 0;
  const stHTML = stagesData.map(st => {
    const secsHTML = st.secs.map(sec => {
      const itemsHTML = sec.items.map(i => `
        <tr>
          <td style="padding:5px 8px;font-size:12px;border-bottom:1px solid #f0ece8">${i.item}</td>
          <td style="padding:5px 8px;text-align:center;font-size:13px;border-bottom:1px solid #f0ece8;color:${i.done ? "#1B7A3E" : "#999"}">${i.done ? "✓" : "○"}</td>
          <td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #f0ece8;color:#666">${i.date || "—"}</td>
          <td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #f0ece8;color:#666">${i.note || ""}</td>
        </tr>`).join("");
      return `
        <div style="margin-bottom:12px">
          <div style="background:#f7f3ef;padding:5px 10px;font-weight:700;font-size:12px;border-left:3px solid ${st.color};color:#2a1208">
            ${sec.name} — ${sec.d}/${sec.t}
          </div>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr style="background:#fafaf8">
              <th style="text-align:left;padding:4px 8px;font-size:11px;color:#888;font-weight:600">Requisito</th>
              <th style="padding:4px 8px;font-size:11px;color:#888;font-weight:600;width:55px">Estado</th>
              <th style="text-align:left;padding:4px 8px;font-size:11px;color:#888;font-weight:600;width:100px">Fecha</th>
              <th style="text-align:left;padding:4px 8px;font-size:11px;color:#888;font-weight:600">Observaciones</th>
            </tr></thead>
            <tbody>${itemsHTML}</tbody>
          </table>
        </div>`;
    }).join("");
    return `
      <div style="margin-bottom:28px;page-break-inside:avoid">
        <div style="background:${st.color};color:#fff;padding:9px 14px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:15px;font-weight:700">${st.numeral} · ${st.name}</span>
          <span style="font-size:13px;font-weight:600">${st.pct}% — ${st.d}/${st.t} req.</span>
        </div>
        <div style="border:1px solid #e0d8d0;border-top:none;border-radius:0 0 6px 6px;padding:14px">${secsHTML}</div>
      </div>`;
  }).join("");
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Progresión Rover – ${scout.name}</title>
<style>body{font-family:Georgia,serif;max-width:960px;margin:0 auto;padding:32px;color:#1a0a04;background:#fffdf8;font-size:13px}@media print{body{padding:10px}button{display:none!important}@page{margin:1.5cm}}h1{color:#C0392B;font-size:22px;margin:0 0 4px}</style>
</head><body>
<div style="text-align:center;border-bottom:2px solid #C0392B;padding-bottom:20px;margin-bottom:28px">
  <div style="font-size:32px;color:#C0392B;margin-bottom:6px">⚜ PROGRESIÓN ROVER</div>
  <div style="font-size:20px;font-weight:700;color:#2a1208">${scout.name}${scout.group ? " · " + scout.group : ""}</div>
  <div style="font-size:13px;color:#7a5a40;margin-top:8px">Progreso Total: <strong style="color:#C0392B">${pct}%</strong> &nbsp;(${totalD} / ${totalT} requisitos) &nbsp;·&nbsp; Generado: ${today}</div>
</div>
<button onclick="window.print()" style="margin-bottom:24px;padding:8px 20px;background:#C0392B;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:600">🖨 Imprimir / Guardar PDF</button>
${stHTML}
</body></html>`;
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}

function exportCSV(scout, prog, dates, notes) {
  const rows = [["Etapa","Sección","Requisito","Completado","Fecha","Observaciones"]];
  STAGES.forEach(st => {
    st.sections.forEach(sec => {
      sec.items.forEach((item, idx) => {
        rows.push([
          st.name, sec.name, item,
          prog[pKey(scout.id, st.id, sec.name, idx)] ? "Sí" : "No",
          dates[dKey(scout.id, st.id, sec.name, idx)] || "",
          (notes[nKey(scout.id, st.id, sec.name, idx)] || "").replace(/\n/g," ")
        ]);
      });
    });
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
  a.download = `Progresion_${scout.name.replace(/\s+/g,"_")}.csv`;
  a.click();
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:#2A1208;border-radius:2px}
.fade-in{animation:fi 0.22s ease}
@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.scout-row:hover{background:rgba(30,14,5,0.99)!important}
.stage-card{transition:transform 0.18s,box-shadow 0.18s;cursor:pointer}
.stage-card:hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(0,0,0,0.65)}
.check-row:hover{background:rgba(255,255,255,0.025)!important}
.add-btn:hover{background:rgba(139,26,26,0.28)!important}
.del-btn:hover{color:#D63031!important}
.back-btn:hover{color:#D63031!important}
.stab:hover{opacity:0.8}
.expbtn:hover{opacity:0.7}
.sec-hdr:hover{background:rgba(255,255,255,0.025)!important}
input[type=date]{color-scheme:dark;font-family:'Source Sans 3',sans-serif}
input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.45) sepia(1) saturate(1.2) hue-rotate(330deg);cursor:pointer;opacity:0.8}
.di{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:2px 6px;color:#B8A898;font-size:11px;outline:none;width:118px}
.di:focus{border-color:rgba(201,162,39,0.4)}
.ni{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:5px;padding:4px 7px;color:#C0B0A0;font-size:12px;outline:none;width:100%;resize:none}
.ni:focus{border-color:rgba(201,162,39,0.3)}
.ebtn:hover{background:rgba(201,162,39,0.18)!important}
@media(max-width:640px){
  .mobile-sidebar{position:fixed;top:0;left:0;height:100vh;width:80vw;max-width:300px;z-index:300;transform:translateX(-100%);transition:transform 0.25s ease}
  .mobile-sidebar.open{transform:translateX(0)}
  .mobile-overlay{display:block!important}
  .radar-grid{grid-template-columns:1fr!important}
}
@media(min-width:641px){
  .mobile-sidebar{position:relative;transform:none!important}
  .mobile-menu-btn{display:none!important}
}
`;


// ─── FIREBASE HELPERS ────────────────────────────────────────────────────────
async function fbGet(docPath) {
  try {
    const snap = await getDoc(doc(db, ...docPath.split("/")));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}
async function fbSet(docPath, data) {
  try {
    await setDoc(doc(db, ...docPath.split("/")), data, { merge: true });
  } catch (e) { console.error("fbSet error", e); }
}
async function fbDel(docPath) {
  try {
    await deleteDoc(doc(db, ...docPath.split("/")));
  } catch (e) { console.error("fbDel error", e); }
}
async function fbList(colPath) {
  try {
    const snap = await getDocs(collection(db, colPath));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RoverDashboard({ isAdmin = false }) {
  const [scouts, setScouts]     = useState([]);
  const [selId, setSelId]       = useState(null);
  const [prog, setProg]         = useState({});
  const [dates, setDates]       = useState({});
  const [notes, setNotes]       = useState({});
  const [invDates, setInvDates] = useState({});
  const [currentView, setCurrentView] = useState("overview");
  const [stageId, setStageId]   = useState(1);
  const [adding, setAdding]     = useState(false);
  const [newName, setNewName]   = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [expItem, setExpItem]   = useState(null);
  const [exportMenu, setExportMenu] = useState(false);
  const [collapsedSecs, setCollapsedSecs] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const saveTimer = useRef(null);

  // ── Load from Firebase ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const scoutList = await fbList("scouts");
      if (scoutList.length) {
        setScouts(scoutList);
        setSelId(scoutList[0].id);
      }
      const globalData = await fbGet("data/global");
      if (globalData) {
        if (globalData.prog)     setProg(globalData.prog);
        if (globalData.dates)    setDates(globalData.dates);
        if (globalData.notes)    setNotes(globalData.notes);
        if (globalData.invDates) setInvDates(globalData.invDates);
      }
      setLoading(false);
    })();
  }, []);

  // ── Debounced save to Firebase ────────────────────────────────────────────
  const scheduleSave = (p, d, n, iv) => {
    if (!isAdmin) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(async () => {
      await fbSet("data/global", { prog: p, dates: d, notes: n, invDates: iv });
      setSaving(false);
    }, 1200);
  };

  const saveScouts = async (v) => {
    if (!isAdmin) return;
    setScouts(v);
    for (const sc of v) {
      await fbSet(`scouts/${sc.id}`, { name: sc.name, group: sc.group || "" });
    }
  };
  const saveProg   = (v) => { setProg(v);   scheduleSave(v, dates, notes, invDates); };
  const saveDates  = (v) => { setDates(v);  scheduleSave(prog, v, notes, invDates); };
  const saveNotes  = (v) => { setNotes(v);  scheduleSave(prog, dates, v, invDates); };
  const saveInv    = (v) => { setInvDates(v); scheduleSave(prog, dates, notes, v); };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const addScout = async () => {
    if (!newName.trim() || !isAdmin) return;
    const sc = { id: `r${Date.now()}`, name: newName.trim(), group: newGroup.trim() };
    const upd = [...scouts, sc];
    setScouts(upd);
    await fbSet(`scouts/${sc.id}`, { name: sc.name, group: sc.group });
    setSelId(sc.id); setNewName(""); setNewGroup(""); setAdding(false);
  };

  const deleteScout = async (id) => {
    if (!isAdmin) return;
    const upd = scouts.filter(s => s.id !== id);
    setScouts(upd);
    await fbDel(`scouts/${id}`);
    if (selId === id) setSelId(upd[0]?.id || null);
  };

  const toggleItem = (stId, sec, idx) => {
    if (!selId || !isAdmin) return;
    const k = pKey(selId, stId, sec, idx);
    const np = { ...prog, [k]: !prog[k] };
    if (np[k] && !dates[dKey(selId, stId, sec, idx)]) {
      saveDates({ ...dates, [dKey(selId, stId, sec, idx)]: new Date().toISOString().split("T")[0] });
    }
    saveProg(np);
  };

  const setItemDate = (stId, sec, idx, val) => {
    if (!selId || !isAdmin) return;
    saveDates({ ...dates, [dKey(selId, stId, sec, idx)]: val });
  };

  const setItemNote = (stId, sec, idx, val) => {
    if (!selId || !isAdmin) return;
    saveNotes({ ...notes, [nKey(selId, stId, sec, idx)]: val });
  };

  const setInvDate = (stId, val) => {
    if (!selId || !isAdmin) return;
    saveInv({ ...invDates, [invKey(selId, stId)]: val });
  };

  const toggleSec = (key) => setCollapsedSecs(p => ({ ...p, [key]: !p[key] }));

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stageStats = (scoutId, stage) => {
    let t = 0, d = 0;
    stage.sections.forEach(sec => sec.items.forEach((_, i) => {
      t++; if (prog[pKey(scoutId, stage.id, sec.name, i)]) d++;
    }));
    return { d, t, pct: t ? Math.round(d / t * 100) : 0 };
  };
  const totalStats = (scoutId) => {
    let t = 0, d = 0;
    STAGES.forEach(st => { const s = stageStats(scoutId, st); t += s.t; d += s.d; });
    return { d, t, pct: t ? Math.round(d / t * 100) : 0 };
  };
  const getCurrStage = (scoutId) => {
    for (let i = STAGES.length - 1; i >= 0; i--)
      if (stageStats(scoutId, STAGES[i]).d > 0) return STAGES[i];
    return STAGES[0];
  };
  const areaScore = (scoutId, stage, area) => {
    let t = 0, d = 0;
    stage.sections.forEach(sec => {
      if (sec.area === area) sec.items.forEach((_, i) => {
        t++; if (prog[pKey(scoutId, stage.id, sec.name, i)]) d++;
      });
    });
    return t ? Math.round(d / t * 100) : 0;
  };

  const selScout  = scouts.find(s => s.id === selId);
  const activeSt  = STAGES.find(s => s.id === stageId) || STAGES[0];
  const totStats  = selId ? totalStats(selId) : null;
  const currStage = selId ? getCurrStage(selId) : STAGES[0];

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ background:"#0A0604", height:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:"16px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:"48px", animation:"spin 3s linear infinite", color:"#D63031" }}>⚜</div>
      <div style={{ color:"#7A5A40", fontFamily:"'Cinzel',serif", letterSpacing:"4px", fontSize:"12px" }}>CARGANDO...</div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#0A0604",
      fontFamily:"'Source Sans 3',sans-serif", color:"#EDE8E1", overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"9px 16px", background:"linear-gradient(90deg,#0E0804,#130B06)",
        borderBottom:"1px solid rgba(201,162,39,0.12)", flexShrink:0, gap:"12px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
          <button className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(o => !o)}
            style={{ background:"none", border:"none", color:"#C9A227", fontSize:"20px",
              cursor:"pointer", padding:"4px", lineHeight:1 }}>☰</button>
          <span style={{ fontSize:"24px", color:"#D63031", lineHeight:1 }}>⚜</span>
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"14px", fontWeight:"700",
              letterSpacing:"2.5px", color:"#F0ECE8" }}>PROGRESIÓN ROVER</div>
            <div style={{ fontSize:"11px", color:"#7A5A40", letterSpacing:"1.5px",
              fontFamily:"'Source Sans 3',sans-serif" }}>CARTILLA 2.0 · GUATEMALA</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", justifyContent:"flex-end" }}>
          {/* Modo lectura badge */}
          {!isAdmin && (
            <div style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"8px",
              background:"rgba(255,255,255,0.04)", color:"#5A4030",
              border:"1px solid rgba(255,255,255,0.07)", letterSpacing:"1px",
              fontFamily:"'Cinzel',serif" }}>MODO LECTURA</div>
          )}
          {saving && isAdmin && (
            <div style={{ fontSize:"10px", color:"#C9A227", fontFamily:"'Source Sans 3',sans-serif",
              opacity:0.7 }}>guardando...</div>
          )}
          {selScout && totStats && (
            <>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"13px", color:"#F0ECE8", fontWeight:"600" }}>{selScout.name}</div>
              {selScout.group && <div style={{ fontSize:"11px", color:"#9A7A60", borderLeft:"1px solid rgba(255,255,255,0.08)", paddingLeft:"8px" }}>{selScout.group}</div>}
              <div style={{ fontSize:"11px", padding:"2px 9px", borderRadius:"10px",
                background:`${currStage.color}22`, color:currStage.color,
                border:`1px solid ${currStage.color}55`, fontWeight:"600" }}>{currStage.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                <div style={{ width:"85px", height:"3px", background:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${totStats.pct}%`,
                    background:"linear-gradient(90deg,#7B0F0F,#D63031)", borderRadius:"2px", transition:"width 0.6s" }} />
                </div>
                <span style={{ fontSize:"12px", color:"#9A7A60", fontWeight:"600", minWidth:"34px" }}>{totStats.pct}%</span>
              </div>
            </>
          )}
          {selScout && (
            <div style={{ position:"relative" }}>
              <button className="ebtn"
                style={{ padding:"5px 12px", background:"rgba(201,162,39,0.08)",
                  border:"1px solid rgba(201,162,39,0.28)", borderRadius:"6px", color:"#C9A227",
                  fontSize:"12px", fontWeight:"600", cursor:"pointer",
                  fontFamily:"'Source Sans 3',sans-serif", letterSpacing:"0.3px",
                  display:"flex", alignItems:"center", gap:"5px", transition:"background 0.15s" }}
                onClick={() => setExportMenu(m => !m)}>
                ↓ Exportar
              </button>
              {exportMenu && (
                <div className="fade-in" style={{ position:"absolute", right:0, top:"36px",
                  background:"#130B06", border:"1px solid rgba(201,162,39,0.2)",
                  borderRadius:"9px", padding:"6px", zIndex:200, minWidth:"190px",
                  display:"flex", flexDirection:"column", gap:"3px",
                  boxShadow:"0 10px 36px rgba(0,0,0,0.7)" }}>
                  <div style={{ fontSize:"9px", color:"#7A5A40", letterSpacing:"1px",
                    padding:"3px 10px 5px", fontFamily:"'Cinzel',serif" }}>FORMATO</div>
                  {[
                    ["📄 Reporte HTML / PDF", () => { exportHTML(selScout, prog, dates, notes); setExportMenu(false); }],
                    ["📊 Excel / CSV",        () => { exportCSV(selScout, prog, dates, notes);  setExportMenu(false); }],
                  ].map(([lbl, fn], i) => (
                    <button key={i} onClick={fn}
                      style={{ padding:"7px 12px", background:"transparent", border:"none",
                        color:"#D8CFC8", fontSize:"13px", cursor:"pointer", textAlign:"left",
                        borderRadius:"5px", fontFamily:"'Source Sans 3',sans-serif",
                        transition:"background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {lbl}
                    </button>
                  ))}
                  <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", margin:"3px 2px" }} />
                  <div style={{ padding:"3px 10px 4px", fontSize:"10px", color:"#5A3A28",
                    fontFamily:"'Source Sans 3',sans-serif", lineHeight:"1.5" }}>
                    HTML incluye botón imprimir/PDF
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative" }}>
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:299 }} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`mobile-sidebar${mobileMenuOpen ? " open" : ""}`}
          style={{ width:"218px", flexShrink:0, background:"#0D0704",
          borderRight:"1px solid rgba(201,162,39,0.08)", padding:"10px 8px",
          overflowY:"auto", display:"flex", flexDirection:"column", gap:"5px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 4px 8px", borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:"2px" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:"10px", color:"#7A5A30",
              letterSpacing:"1.5px" }}>ROVERS</span>
            {isAdmin && (
              <button className="add-btn" onClick={() => setAdding(a => !a)}
                style={{ width:"22px", height:"22px", background:"rgba(139,26,26,0.1)",
                  border:"1px solid rgba(139,26,26,0.3)", borderRadius:"50%", color:"#D63031",
                  fontSize:"16px", lineHeight:1, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background 0.15s" }}>+</button>
            )}
          </div>

          {isAdmin && adding && (
            <div className="fade-in" style={{ background:"rgba(20,10,4,0.96)",
              border:"1px solid rgba(201,162,39,0.12)", borderRadius:"8px",
              padding:"10px", marginBottom:"4px" }}>
              <input
                style={{ width:"100%", background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:"5px",
                  padding:"7px 9px", color:"#EDE8E1", fontSize:"13px", outline:"none",
                  marginBottom:"6px", fontFamily:"'Source Sans 3',sans-serif" }}
                placeholder="Nombre completo"
                value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addScout()} autoFocus />
              <input
                style={{ width:"100%", background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:"5px",
                  padding:"6px 9px", color:"#EDE8E1", fontSize:"12px", outline:"none",
                  marginBottom:"8px", fontFamily:"'Source Sans 3',sans-serif" }}
                placeholder="Grupo / Clan (opcional)"
                value={newGroup} onChange={e => setNewGroup(e.target.value)} />
              <div style={{ display:"flex", gap:"5px" }}>
                <button style={{ flex:1, padding:"6px", background:"#8B1A1A", border:"none",
                  borderRadius:"5px", color:"#fff", fontSize:"13px", cursor:"pointer",
                  fontFamily:"'Source Sans 3',sans-serif", fontWeight:"600" }}
                  onClick={addScout}>Agregar</button>
                <button style={{ padding:"6px 10px", background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.08)", borderRadius:"5px",
                  color:"#7A5A40", fontSize:"12px", cursor:"pointer",
                  fontFamily:"'Source Sans 3',sans-serif" }}
                  onClick={() => setAdding(false)}>✕</button>
              </div>
            </div>
          )}

          {scouts.length === 0 && !adding && (
            <div style={{ textAlign:"center", padding:"28px 8px" }}>
              <div style={{ fontSize:"32px", opacity:.15, marginBottom:"8px" }}>⚜</div>
              <div style={{ fontSize:"12px", color:"#5A3A28", lineHeight:"1.6",
                fontFamily:"'Source Sans 3',sans-serif" }}>
                {isAdmin ? "Agrega tu primer Rover para comenzar" : "No hay rovers registrados aún"}
              </div>
            </div>
          )}

          {scouts.map(sc => {
            const cs = getCurrStage(sc.id);
            const ts = totalStats(sc.id);
            const isSel = sc.id === selId;
            return (
              <div key={sc.id} className="scout-row"
                style={{ background: isSel ? "rgba(30,14,5,0.99)" : "transparent",
                  border:`1px solid ${isSel ? "rgba(201,162,39,0.12)" : "transparent"}`,
                  borderRadius:"8px", padding:"8px 10px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:"8px",
                  transition:"background 0.12s" }}
                onClick={() => { setSelId(sc.id); setCurrentView("overview"); setMobileMenuOpen(false); }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color: isSel ? "#F0ECE8" : "#9A7A60",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                    fontFamily:"'Source Sans 3',sans-serif" }}>{sc.name}</div>
                  {sc.group && <div style={{ fontSize:"10px", color:"#5A3A28", marginTop:"1px",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                    fontFamily:"'Source Sans 3',sans-serif" }}>{sc.group}</div>}
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"4px" }}>
                    <div style={{ flex:1, height:"2px", background:"rgba(255,255,255,0.06)", borderRadius:"1px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${ts.pct}%`, background:cs.color, borderRadius:"1px" }} />
                    </div>
                    <span style={{ fontSize:"10px", color:cs.color, fontWeight:"700",
                      fontFamily:"'Source Sans 3',sans-serif" }}>{ts.pct}%</span>
                  </div>
                </div>
                {isAdmin && (
                  <button className="del-btn"
                    style={{ background:"none", border:"none", color:"#2A1208",
                      fontSize:"14px", cursor:"pointer", padding:"2px", flexShrink:0,
                      transition:"color 0.15s" }}
                    title="Eliminar"
                    onClick={e => { e.stopPropagation(); if(confirm(`¿Eliminar a ${sc.name}?`)) deleteScout(sc.id); }}>✕</button>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, overflowY:"auto", background:"#0A0604" }}>

          {/* ── OVERVIEW ── */}
          {selScout && currentView === "overview" && (
            <div className="fade-in" style={{ padding:"20px", display:"flex",
              flexDirection:"column", gap:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"22px",
                    fontWeight:"700", color:"#F0ECE8" }}>{selScout.name}</div>
                  {selScout.group && <div style={{ fontSize:"13px", color:"#7A5A40",
                    marginTop:"2px", fontFamily:"'Source Sans 3',sans-serif" }}>{selScout.group}</div>}
                </div>
                {totStats && (
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"36px",
                      fontWeight:"700", color:"#D63031", lineHeight:1 }}>{totStats.pct}%</div>
                    <div style={{ fontSize:"12px", color:"#7A5A40", marginTop:"4px",
                      fontFamily:"'Source Sans 3',sans-serif" }}>{totStats.d}/{totStats.t} requisitos totales</div>
                  </div>
                )}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"12px" }}>
                {STAGES.map(st => {
                  const ss = stageStats(selId, st);
                  return (
                    <div key={st.id} className="stage-card"
                      style={{ background:`linear-gradient(135deg,${st.bg},#0D0704)`,
                        border:`1px solid ${st.color}33`, borderRadius:"14px",
                        padding:"18px", display:"flex", flexDirection:"column", gap:"12px" }}
                      onClick={() => { setStageId(st.id); setCurrentView("detail"); }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"28px",
                            fontWeight:"700", color:st.color, lineHeight:1 }}>{st.numeral}</div>
                          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"14px",
                            fontWeight:"700", color:"#EDE8E1", marginTop:"6px" }}>{st.name}</div>
                          <div style={{ fontSize:"11px", color:"#7A5A40", marginTop:"2px",
                            fontFamily:"'Source Sans 3',sans-serif" }}>{st.subtitle}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"28px",
                            fontWeight:"700", color:st.color, lineHeight:1 }}>{ss.pct}%</div>
                          <div style={{ fontSize:"11px", color:"#7A5A40", marginTop:"4px",
                            fontFamily:"'Source Sans 3',sans-serif" }}>{ss.d}/{ss.t}</div>
                        </div>
                      </div>
                      <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${ss.pct}%`, background:st.color,
                          borderRadius:"2px", transition:"width 0.5s" }} />
                      </div>
                      <div style={{ fontSize:"12px", color:"#7A5A40", lineHeight:"1.55",
                        fontFamily:"'Source Sans 3',sans-serif" }}>{st.description}</div>
                      <div style={{ fontSize:"11px", padding:"4px 10px",
                        background:`${st.color}14`, borderRadius:"6px", color:st.color,
                        fontFamily:"'Cinzel',serif", letterSpacing:"0.5px", fontWeight:"600",
                        alignSelf:"flex-start" }}>Ver detalle →</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RADAR VIEW ── */}
          {selScout && currentView === "radar" && (
            <div className="fade-in" style={{ padding:"20px", display:"flex",
              flexDirection:"column", gap:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <button className="back-btn" onClick={() => setCurrentView("detail")}
                  style={{ padding:"6px 12px", background:"none",
                    border:"1px solid rgba(255,255,255,0.09)", borderRadius:"6px",
                    color:"#9A7A60", fontSize:"12px", cursor:"pointer",
                    transition:"color 0.15s", fontFamily:"'Source Sans 3',sans-serif" }}>← Detalle</button>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"16px",
                  fontWeight:"700", color:"#EDE8E1" }}>Diagrama Radar · {selScout.name}</div>
              </div>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                {STAGES.map(st => (
                  <button key={st.id} className="stab"
                    style={{ padding:"4px 13px",
                      background: stageId === st.id ? st.color : "rgba(20,10,3,0.7)",
                      border:`1px solid ${stageId === st.id ? st.color : "rgba(255,255,255,0.07)"}`,
                      borderRadius:"14px", color: stageId === st.id ? "#fff" : "#9A7A60",
                      fontSize:"12px", fontFamily:"'Cinzel',serif", cursor:"pointer",
                      fontWeight: stageId === st.id ? "700" : "500",
                      transition:"all 0.15s" }}
                    onClick={() => setStageId(st.id)}>{st.numeral} {st.name}</button>
                ))}
              </div>
              <div className="radar-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div style={{ background:"rgba(14,7,2,0.97)",
                  border:`1px solid ${activeSt.color}33`, borderRadius:"12px", padding:"20px" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"10px",
                    color:"#C9A227", letterSpacing:"1.5px", marginBottom:"14px",
                    textAlign:"center" }}>DIAGRAMA RADAR · ÁREAS DE CRECIMIENTO</div>
                  <RadarChart stage={activeSt} scoutId={selId} prog={prog} size={210} />
                </div>
                <div style={{ background:"rgba(14,7,2,0.97)",
                  border:`1px solid ${activeSt.color}33`, borderRadius:"12px",
                  padding:"18px", display:"flex", flexDirection:"column", gap:"11px" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"10px",
                    color:"#C9A227", letterSpacing:"1.5px", marginBottom:"2px" }}>DETALLE POR ÁREA</div>
                  {activeSt.areas.map((area, i) => {
                    const sc = areaScore(selId, activeSt, area);
                    return (
                      <div key={area}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                          <span style={{ fontSize:"13px", fontWeight:"600", color:"#EDE8E1",
                            fontFamily:"'Source Sans 3',sans-serif" }}>{area}</span>
                          <span style={{ fontSize:"13px", fontWeight:"700", color:activeSt.color,
                            fontFamily:"'Source Sans 3',sans-serif" }}>{sc}%</span>
                        </div>
                        <div style={{ fontSize:"11px", color:"#7A5A40", marginBottom:"5px",
                          fontFamily:"'Source Sans 3',sans-serif", lineHeight:"1.4" }}>
                          {activeSt.areaDesc[i]}
                        </div>
                        <div style={{ height:"4px", background:"rgba(255,255,255,0.06)",
                          borderRadius:"2px", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${sc}%`,
                            background:activeSt.color, borderRadius:"2px", transition:"width 0.5s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── DETAIL VIEW ── */}
          {selScout && currentView === "detail" && (
            <div className="fade-in" style={{ padding:"16px 20px", display:"flex",
              flexDirection:"column", gap:"12px" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
                <button className="back-btn" onClick={() => setCurrentView("overview")}
                  style={{ padding:"6px 12px", background:"none",
                    border:"1px solid rgba(255,255,255,0.09)", borderRadius:"6px",
                    color:"#9A7A60", fontSize:"12px", cursor:"pointer", flexShrink:0,
                    marginTop:"4px", transition:"color 0.15s",
                    fontFamily:"'Source Sans 3',sans-serif" }}>← Resumen</button>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"28px",
                    fontWeight:"700", color:activeSt.color, lineHeight:1 }}>{activeSt.numeral}</div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"17px",
                    fontWeight:"700", color:"#EDE8E1", marginTop:"5px" }}>{activeSt.name}</div>
                  <div style={{ fontSize:"12px", color:"#7A5A40", marginTop:"2px",
                    fontFamily:"'Source Sans 3',sans-serif" }}>{activeSt.subtitle}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  {(() => { const s = stageStats(selId, activeSt); return (<>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"32px",
                      fontWeight:"700", color:activeSt.color, lineHeight:1 }}>{s.pct}%</div>
                    <div style={{ fontSize:"12px", color:"#9A7A60", marginTop:"4px",
                      fontFamily:"'Source Sans 3',sans-serif" }}>{s.d}/{s.t} requisitos</div>
                    <button className="stab" onClick={() => setCurrentView("radar")}
                      style={{ marginTop:"6px", padding:"4px 10px",
                        background:`${activeSt.color}18`,
                        border:`1px solid ${activeSt.color}44`,
                        borderRadius:"5px", color:activeSt.color, fontSize:"11px",
                        cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif",
                        fontWeight:"600", transition:"opacity 0.15s" }}>📊 Ver Radar</button>
                  </>); })()}
                </div>
              </div>

              <div style={{ padding:"10px 14px", background:"rgba(20,10,3,0.6)",
                border:`1px solid ${activeSt.color}22`, borderRadius:"8px",
                fontSize:"13px", color:"#9A7A60", lineHeight:"1.65",
                fontFamily:"'Source Sans 3',sans-serif" }}>
                {activeSt.description}
              </div>

              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                {STAGES.map(st => {
                  const ss = stageStats(selId, st);
                  const isA = st.id === stageId;
                  return (
                    <button key={st.id} className="stab"
                      style={{ padding:"4px 13px",
                        background: isA ? st.color : "rgba(20,10,3,0.7)",
                        border:`1px solid ${isA ? st.color : "rgba(255,255,255,0.07)"}`,
                        borderRadius:"14px", color: isA ? "#fff" : "#9A7A60",
                        fontSize:"12px", fontFamily:"'Cinzel',serif",
                        cursor:"pointer", transition:"all 0.15s",
                        fontWeight: isA ? "700" : "500" }}
                      onClick={() => setStageId(st.id)}>
                      {st.numeral}{ss.pct === 100 ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>

              {!isAdmin && (
                <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 12px",
                  background:"rgba(255,255,255,0.03)", borderRadius:"6px",
                  border:"1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize:"11px", color:"#5A4030",
                    fontFamily:"'Source Sans 3',sans-serif" }}>
                    👁 Modo solo lectura — solo el admin puede editar
                  </span>
                </div>
              )}

              {isAdmin && (
                <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", padding:"5px 10px",
                  background:"rgba(255,255,255,0.015)", borderRadius:"6px",
                  border:"1px solid rgba(255,255,255,0.04)" }}>
                  {[
                    ["#7A5A40","☐ Pendiente"],
                    [activeSt.color,"☑ Completado"],
                    ["#5A8AAA","📅 Fecha"],
                    ["#7A8A5A","📝 Observación"],
                  ].map(([c, t]) => (
                    <span key={t} style={{ fontSize:"11px", color:c,
                      fontFamily:"'Source Sans 3',sans-serif" }}>{t}</span>
                  ))}
                </div>
              )}

              <div style={{ background:"rgba(201,162,39,0.06)",
                border:"1px solid rgba(201,162,39,0.15)", borderRadius:"9px",
                padding:"10px 14px", display:"flex",
                alignItems:"center", justifyContent:"space-between",
                flexWrap:"wrap", gap:"8px" }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"9px",
                    color:"#C9A227", letterSpacing:"1.5px", marginBottom:"2px" }}>HITO DE INVESTIDURA</div>
                  <div style={{ fontSize:"14px", fontWeight:"700", color:"#EDE8E1",
                    fontFamily:"'Source Sans 3',sans-serif" }}>{activeSt.investidura}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontSize:"12px", color:"#9A7A60",
                    fontFamily:"'Source Sans 3',sans-serif" }}>Fecha:</span>
                  {isAdmin ? (
                    <input type="date" className="di"
                      style={{ width:"130px", fontSize:"12px" }}
                      value={invDates[invKey(selId, activeSt.id)] || ""}
                      onChange={e => setInvDate(activeSt.id, e.target.value)} />
                  ) : (
                    <span style={{ fontSize:"12px", color:"#7A5A40",
                      fontFamily:"'Source Sans 3',sans-serif" }}>
                      {invDates[invKey(selId, activeSt.id)] || "—"}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))", gap:"8px" }}>
                {activeSt.sections.map(sec => {
                  let sd = 0;
                  sec.items.forEach((_, i) => { if (prog[pKey(selId, activeSt.id, sec.name, i)]) sd++; });
                  const secPct = Math.round(sd / sec.items.length * 100);
                  const secKey = `${activeSt.id}|${sec.name}`;
                  const collapsed = !!collapsedSecs[secKey];
                  return (
                    <div key={sec.name} style={{ background:"rgba(14,7,2,0.97)",
                      border:"1px solid rgba(201,162,39,0.06)", borderRadius:"10px",
                      overflow:"hidden" }}>
                      <div className="sec-hdr" onClick={() => toggleSec(secKey)}
                        style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", padding:"9px 12px", cursor:"pointer",
                          transition:"background 0.14s" }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"9.5px",
                            fontWeight:"700", color:"#C9A227", letterSpacing:"1px",
                            textTransform:"uppercase" }}>{sec.name}</div>
                          <div style={{ fontSize:"10px", color:activeSt.color, marginTop:"1px",
                            fontFamily:"'Source Sans 3',sans-serif" }}>Área: {sec.area}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
                          <span style={{ fontSize:"12px", fontWeight:"700", color:activeSt.color,
                            fontFamily:"'Source Sans 3',sans-serif" }}>{sd}/{sec.items.length}</span>
                          <span style={{ fontSize:"10px", color:"#5A3A28" }}>{collapsed ? "▼" : "▲"}</span>
                        </div>
                      </div>
                      <div style={{ height:"2px", background:"rgba(255,255,255,0.04)" }}>
                        <div style={{ height:"100%", width:`${secPct}%`,
                          background:activeSt.color, transition:"width 0.4s" }} />
                      </div>
                      {!collapsed && (
                        <div style={{ padding:"6px 8px", display:"flex",
                          flexDirection:"column", gap:"0px" }}>
                          {sec.items.map((item, idx) => {
                            const k  = pKey(selId, activeSt.id, sec.name, idx);
                            const dk = dKey(selId, activeSt.id, sec.name, idx);
                            const nk = nKey(selId, activeSt.id, sec.name, idx);
                            const chk      = !!prog[k];
                            const itemDate = dates[dk] || "";
                            const itemNote = notes[nk] || "";
                            const expK     = `${activeSt.id}|${sec.name}|${idx}`;
                            const isExp    = expItem === expK;
                            return (
                              <div key={idx}>
                                <div className="check-row"
                                  style={{ display:"flex", alignItems:"flex-start",
                                    gap:"7px", padding:"5px 5px", borderRadius:"5px",
                                    border:"1px solid transparent",
                                    transition:"background 0.12s" }}>
                                  <div onClick={() => isAdmin && toggleItem(activeSt.id, sec.name, idx)}
                                    style={{ width:"16px", height:"16px", borderRadius:"4px",
                                      border:`1.5px solid ${chk ? activeSt.color : "rgba(255,255,255,0.2)"}`,
                                      background: chk ? activeSt.color : "transparent",
                                      display:"flex", alignItems:"center", justifyContent:"center",
                                      flexShrink:0, fontSize:"10px", color:"#fff",
                                      transition:"all 0.15s", marginTop:"2px",
                                      cursor: isAdmin ? "pointer" : "default",
                                      opacity: isAdmin ? 1 : 0.7 }}>
                                    {chk && "✓"}
                                  </div>
                                  <span onClick={() => isAdmin && toggleItem(activeSt.id, sec.name, idx)}
                                    style={{ fontSize:"13px",
                                      color: chk ? "#5A4030" : "#D8D0C8",
                                      textDecoration: chk ? "line-through" : "none",
                                      lineHeight:"1.45", flex:1,
                                      cursor: isAdmin ? "pointer" : "default",
                                      fontFamily:"'Source Sans 3',sans-serif" }}>
                                    {item}
                                  </span>
                                  {(isAdmin || itemDate || itemNote) && (
                                    <button className="expbtn"
                                      style={{ background:"none", border:"none",
                                        color: isExp ? "#C9A227" : "#3A2818",
                                        fontSize:"10px", cursor:"pointer",
                                        padding:"2px 4px", flexShrink:0,
                                        transition:"color 0.12s", marginTop:"2px" }}
                                      title="Fecha y observaciones"
                                      onClick={() => setExpItem(isExp ? null : expK)}>
                                      {isExp ? "▲" : "▼"}
                                    </button>
                                  )}
                                </div>
                                {isExp && (
                                  <div className="fade-in"
                                    style={{ marginLeft:"23px", marginBottom:"4px",
                                      padding:"8px 9px", background:"rgba(30,15,5,0.7)",
                                      border:"1px solid rgba(201,162,39,0.1)",
                                      borderRadius:"6px", display:"flex",
                                      flexDirection:"column", gap:"6px" }}>
                                    <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                                      <span style={{ fontSize:"11px", color:"#5A7A8A",
                                        whiteSpace:"nowrap",
                                        fontFamily:"'Source Sans 3',sans-serif" }}>📅 Fecha:</span>
                                      {isAdmin ? (
                                        <>
                                          <input type="date" className="di"
                                            value={itemDate}
                                            onChange={e => setItemDate(activeSt.id, sec.name, idx, e.target.value)} />
                                          {itemDate && (
                                            <button onClick={() => setItemDate(activeSt.id, sec.name, idx, "")}
                                              style={{ background:"none", border:"none",
                                                color:"#3A2818", fontSize:"10px",
                                                cursor:"pointer", padding:"0 3px" }}>✕</button>
                                          )}
                                        </>
                                      ) : (
                                        <span style={{ fontSize:"12px", color:"#7A6A5A",
                                          fontFamily:"'Source Sans 3',sans-serif" }}>
                                          {itemDate || "—"}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display:"flex", alignItems:"flex-start", gap:"7px" }}>
                                      <span style={{ fontSize:"11px", color:"#5A8A5A",
                                        whiteSpace:"nowrap", marginTop:"4px",
                                        fontFamily:"'Source Sans 3',sans-serif" }}>📝 Obs.:</span>
                                      {isAdmin ? (
                                        <textarea className="ni" rows={2}
                                          placeholder="Evidencia, notas, observaciones…"
                                          value={itemNote}
                                          onChange={e => setItemNote(activeSt.id, sec.name, idx, e.target.value)} />
                                      ) : (
                                        <span style={{ fontSize:"12px", color:"#7A6A5A",
                                          fontFamily:"'Source Sans 3',sans-serif", lineHeight:"1.5" }}>
                                          {itemNote || "Sin observaciones"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!selScout && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", height:"100%", gap:"16px", opacity:0.4 }}>
              <div style={{ fontSize:"64px", color:"#D63031" }}>⚜</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"14px", color:"#7A5A40",
                letterSpacing:"2px" }}>SELECCIONA UN ROVER</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
