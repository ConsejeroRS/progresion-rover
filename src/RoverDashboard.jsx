import { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebase";
import {
  doc, onSnapshot, setDoc, getDoc
} from "firebase/firestore";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "firebase/auth";

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
const pKey = (sid, stId, sec, idx) => `${sid}|${stId}|${sec}|${idx}`;
const dKey = (sid, stId, sec, idx) => `d:${sid}|${stId}|${sec}|${idx}`;
const invKey = (sid, stId) => `inv:${sid}|${stId}`;
const attKey = (sid, date) => `att:${sid}|${date}`;

// ─── ASISTENCIA: ESTADOS ──────────────────────────────────────────────────────
const ATT_STATES = {
  presente: { label: "Presente", short: "P", color: "#27AE60" },
  ausente:  { label: "Ausente",  short: "A", color: "#D63031" },
  excusa:   { label: "Excusa",   short: "E", color: "#E67E22" }
};
const ATT_CYCLE = ["presente", "ausente", "excusa"];

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

// ─── HELPERS DE CÁLCULO (compartidos por export y UI) ──────────────────────────
function scoutStageStats(scout, stage, prog) {
  let t = 0, d = 0;
  stage.sections.forEach(sec => sec.items.forEach((_, i) => {
    t++; if (prog[pKey(scout.id, stage.id, sec.name, i)]) d++;
  }));
  return { t, d, pct: t ? Math.round(d / t * 100) : 0 };
}
function scoutTotalStats(scout, prog) {
  let t = 0, d = 0;
  STAGES.forEach(st => { const s = scoutStageStats(scout, st, prog); t += s.t; d += s.d; });
  return { t, d, pct: t ? Math.round(d / t * 100) : 0 };
}
function scoutAttendanceStats(scout, attendance) {
  const list = Object.entries(attendance)
    .filter(([k]) => k.startsWith(`att:${scout.id}|`))
    .map(([k, v]) => ({ date: k.split("|")[1], status: v.status, note: v.note || "" }));
  const t = list.length;
  const p = list.filter(r => r.status === "presente").length;
  const a = list.filter(r => r.status === "ausente").length;
  const e = list.filter(r => r.status === "excusa").length;
  return { t, p, a, e, pct: t ? Math.round(p / t * 100) : 0, list: list.sort((x,y)=>x.date.localeCompare(y.date)) };
}
function scoutCurrentStage(scout, prog) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    const s = scoutStageStats(scout, STAGES[i], prog);
    if (s.pct === 100 && i < STAGES.length - 1) return STAGES[i + 1];
    if (s.d > 0) return STAGES[i];
  }
  return STAGES[0];
}

// ─── EXPORT: HTML/PDF — TODOS LOS ROVERS, DISEÑO DINÁMICO ─────────────────────
function exportAllHTML(scouts, prog, dates, attendance) {
  const today = new Date().toLocaleDateString("es-GT", { day: "2-digit", month: "long", year: "numeric" });

  const clanD = scouts.reduce((a, sc) => a + scoutTotalStats(sc, prog).d, 0);
  const clanT = scouts.reduce((a, sc) => a + scoutTotalStats(sc, prog).t, 0);
  const clanPct = clanT ? Math.round(clanD / clanT * 100) : 0;

  const cards = scouts.map(sc => {
    const tot = scoutTotalStats(sc, prog);
    const cs  = scoutCurrentStage(sc, prog);
    const att = scoutAttendanceStats(sc, attendance);

    const stageBars = STAGES.map(st => {
      const s = scoutStageStats(sc, st, prog);
      return `
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:#6B5644;margin-bottom:3px">
            <span style="font-weight:700;color:${st.color}">${st.numeral} · ${st.name}</span>
            <span>${s.d}/${s.t} · ${s.pct}%</span>
          </div>
          <div style="height:7px;background:#EFE8DD;border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${s.pct}%;background:${st.color};border-radius:4px"></div>
          </div>
        </div>`;
    }).join("");

    const attBlock = att.t ? `
      <div style="margin-top:10px;padding-top:10px;border-top:1px dashed #E0D5C5;display:flex;gap:10px;font-size:11px;color:#6B5644;flex-wrap:wrap">
        <span>📋 Asistencia: <strong style="color:#2E6E8E">${att.pct}%</strong></span>
        <span style="color:#1B7A3E">✓ ${att.p}</span>
        <span style="color:#C0392B">✕ ${att.a}</span>
        <span style="color:#B9770E">⚠ ${att.e}</span>
        <span>Total: ${att.t}</span>
      </div>` : "";

    return `
      <div style="background:#fff;border:1px solid #EAE0D2;border-radius:14px;padding:18px 20px;
        margin-bottom:16px;page-break-inside:avoid;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;background:${cs.color};color:#fff;
              display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;
              font-size:18px;font-weight:700;flex-shrink:0">${(sc.name||"?")[0].toUpperCase()}</div>
            <div>
              <div style="font-size:16px;font-weight:700;color:#241008">${sc.name}</div>
              <div style="font-size:11.5px;color:${cs.color};font-weight:600">${cs.name} — ${cs.subtitle}</div>
              ${sc.group ? `<div style="font-size:11px;color:#9A7A60">${sc.group}</div>` : ""}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:26px;font-weight:700;color:#C0392B;font-family:Georgia,serif;line-height:1">${tot.pct}%</div>
            <div style="font-size:10.5px;color:#9A7A60">${tot.d}/${tot.t} requisitos</div>
          </div>
        </div>
        ${stageBars}
        ${attBlock}
      </div>`;
  }).join("");

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Progresión Rover — Clan</title>
<style>
  * { box-sizing:border-box; }
  body{font-family:'Helvetica Neue',Arial,sans-serif;max-width:880px;margin:0 auto;
    padding:28px 20px 50px;color:#241008;background:#FAF6F0;font-size:13px}
  @media print{ body{padding:6px;background:#fff} .noprint{display:none!important} @page{margin:1.2cm} }
  @media (max-width:600px){ body{padding:14px} }
</style></head><body>

<div style="text-align:center;margin-bottom:26px">
  <div style="font-size:13px;letter-spacing:3px;color:#B9770E;font-weight:700;margin-bottom:4px">CARTILLA 2.0 · GUATEMALA</div>
  <div style="font-size:28px;font-weight:700;color:#8B1A1A;font-family:Georgia,serif">⚜ Progresión del Clan</div>
  <div style="font-size:12.5px;color:#7A5A40;margin-top:6px">${scouts.length} Rover${scouts.length===1?"":"s"} registrado${scouts.length===1?"":"s"} · Generado el ${today}</div>
</div>

<div style="display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap">
  <div style="flex:1;min-width:140px;background:linear-gradient(135deg,#8B1A1A,#C0392B);border-radius:14px;
    padding:16px 18px;color:#fff">
    <div style="font-size:30px;font-weight:700;font-family:Georgia,serif">${clanPct}%</div>
    <div style="font-size:11px;opacity:.9">Progreso promedio del Clan</div>
  </div>
  <div style="flex:1;min-width:140px;background:#fff;border:1px solid #EAE0D2;border-radius:14px;padding:16px 18px">
    <div style="font-size:30px;font-weight:700;color:#241008;font-family:Georgia,serif">${scouts.length}</div>
    <div style="font-size:11px;color:#9A7A60">Total de Rovers</div>
  </div>
  <div style="flex:1;min-width:140px;background:#fff;border:1px solid #EAE0D2;border-radius:14px;padding:16px 18px">
    <div style="font-size:30px;font-weight:700;color:#241008;font-family:Georgia,serif">${clanD}/${clanT}</div>
    <div style="font-size:11px;color:#9A7A60">Requisitos completados</div>
  </div>
</div>

<button class="noprint" onclick="window.print()" style="display:block;margin:0 auto 24px;padding:9px 24px;
  background:#C0392B;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600">
  🖨️ Imprimir / Guardar como PDF
</button>

${cards}

<div style="margin-top:30px;padding:12px;text-align:center;font-size:10.5px;color:#9A7A60">
  Cartilla 2.0 · Progresión Rover · Generado el ${today}
</div>
</body></html>`;
}

// ─── EXPORT: CSV — TODOS LOS ROVERS, PROGRESIÓN COMPLETA ──────────────────────
function exportAllCSV(scouts, prog, dates) {
  const rows = [["Rover","Grupo/Clan","Etapa","Sección","Área","Requisito","Completado","Fecha"]];
  scouts.forEach(scout => {
    STAGES.forEach(st => st.sections.forEach(sec => sec.items.forEach((item, idx) => {
      rows.push([
        scout.name, scout.group || "",
        st.name, sec.name, sec.area, item,
        prog[pKey(scout.id, st.id, sec.name, idx)] ? "Sí" : "No",
        dates[dKey(scout.id, st.id, sec.name, idx)] || ""
      ]);
    })));
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Progresion_Clan_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

// ─── EXPORT: CSV — ASISTENCIA DE TODOS LOS ROVERS ─────────────────────────────
function exportAllAttendanceCSV(scouts, attendance) {
  const rows = [["Rover","Grupo/Clan","Fecha","Estado","Observaciones"]];
  scouts.forEach(scout => {
    Object.entries(attendance || {})
      .filter(([k]) => k.startsWith(`att:${scout.id}|`))
      .map(([k, v]) => ({ date: k.split("|")[1], status: v.status, note: v.note || "" }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach(r => {
        rows.push([
          scout.name, scout.group || "", r.date,
          (ATT_STATES[r.status] || {}).label || r.status,
          r.note
        ]);
      });
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Asistencia_Clan_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}

// ─── ESTILOS GLOBALES ──────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; }
body { margin:0; }
.rv-root { font-family:'Source Sans 3',sans-serif; }
::-webkit-scrollbar { width:7px; height:7px; }
::-webkit-scrollbar-thumb { background:rgba(201,162,39,0.25); border-radius:4px; }
::-webkit-scrollbar-track { background:transparent; }
.fade-in { animation: fadeIn 0.25s ease; }
@keyframes fadeIn { from{opacity:0; transform:translateY(3px);} to{opacity:1; transform:translateY(0);} }
input, textarea, select, button { font-family:inherit; }
.ni { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:5px;
  color:#EDE8E1; outline:none; font-size:12px; }
.ni:focus { border-color:rgba(201,162,39,0.4); }
.di { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:5px;
  color:#EDE8E1; outline:none; font-size:12px; padding:4px 7px; color-scheme:dark; }
.add-btn:hover { background:rgba(139,26,26,0.22)!important; }
.del-btn:hover { color:#D63031!important; }
.scout-row:hover { background:rgba(28,13,5,0.8)!important; }
.sec-hdr:hover { background:rgba(255,255,255,0.02); }
.check-row:hover { background:rgba(255,255,255,0.025); border-color:rgba(255,255,255,0.05)!important; }
.expbtn:hover { color:#C9A227!important; }
.stab:hover { opacity:0.82; }
.ebtn:hover { background:rgba(201,162,39,0.18)!important; }
.att-nav:hover{background:rgba(91,143,168,0.2)!important}
.att-cell:hover{transform:scale(1.18)}
.move-btn:hover{background:rgba(201,162,39,0.18)!important}
.login-input:focus{border-color:rgba(201,162,39,0.5)!important}
.login-btn:hover{background:#A52E27!important}
.viewer-badge{ }
.hamburger:hover{background:rgba(255,255,255,0.06)!important}

/* ── RESPONSIVE: tablet ── */
@media (max-width: 980px) {
  .rv-sidebar { width:180px!important; }
}

/* ── RESPONSIVE: móvil ── */
@media (max-width: 700px) {
  .hamburger { display:flex!important; align-items:center; justify-content:center; }
  .rv-edit-badge { display:none!important; }
  .rv-header { padding:8px 12px!important; flex-wrap:wrap; gap:8px!important; }
  .rv-header-title { font-size:11px!important; letter-spacing:1.5px!important; }
  .rv-header-sub { display:none!important; }
  .rv-body { flex-direction:column!important; position:relative; }
  .rv-overlay {
    display:block!important; position:absolute; inset:0; z-index:40;
    background:rgba(0,0,0,0.55);
  }
  .rv-sidebar {
    position:absolute!important; top:0; left:0; z-index:50;
    width:84%!important; max-width:300px; height:100%;
    box-shadow:6px 0 24px rgba(0,0,0,0.5);
    transform:translateX(-105%); transition:transform 0.2s ease;
  }
  .rv-sidebar.open-mobile { transform:translateX(0); }
  .rv-main { padding-bottom:30px; width:100%; }
  .ov-grid { grid-template-columns:repeat(2,1fr)!important; }
  .att-table-wrap { font-size:9px!important; }
  .radar-svg-wrap { max-width:260px!important; }
  .rv-overview-pad { padding:14px!important; }
  .rv-detail-pad { padding:12px 14px!important; }
}
@media (max-width: 420px) {
  .ov-grid { grid-template-columns:1fr 1fr!important; gap:8px!important; }
}
`;

// ─── PANTALLA DE LOGIN (solo para administrador) ──────────────────────────────
function LoginScreen({ onClose }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      onClose();
    } catch (ex) {
      setErr("Correo o contraseña incorrectos.");
    }
    setBusy(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(5,2,1,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000,
      padding:"16px" }} onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleLogin}
        style={{ background:"#150B05", border:"1px solid rgba(201,162,39,0.25)",
          borderRadius:"14px", padding:"28px 26px", width:"100%", maxWidth:"340px",
          display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ textAlign:"center", marginBottom:"6px" }}>
          <div style={{ fontSize:"30px", color:"#D63031" }}>⚜</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"15px", fontWeight:"700",
            color:"#EDE8E1", marginTop:"4px" }}>Acceso de Dirigente</div>
          <div style={{ fontSize:"11.5px", color:"#9A7A60", marginTop:"3px" }}>
            Inicia sesión para editar la progresión
          </div>
        </div>
        <input className="login-input" type="email" placeholder="Correo electrónico"
          value={email} onChange={e => setEmail(e.target.value)} required autoFocus
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"7px", padding:"10px 12px", color:"#EDE8E1", fontSize:"13px", outline:"none" }} />
        <input className="login-input" type="password" placeholder="Contraseña"
          value={pass} onChange={e => setPass(e.target.value)} required
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"7px", padding:"10px 12px", color:"#EDE8E1", fontSize:"13px", outline:"none" }} />
        {err && <div style={{ fontSize:"12px", color:"#E74C3C" }}>{err}</div>}
        <button className="login-btn" type="submit" disabled={busy}
          style={{ marginTop:"4px", padding:"10px", background:"#8B1A1A", border:"none",
            borderRadius:"7px", color:"#fff", fontSize:"14px", fontWeight:"700",
            cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1,
            transition:"background 0.15s" }}>
          {busy ? "Ingresando…" : "Ingresar"}
        </button>
        <button type="button" onClick={onClose}
          style={{ background:"none", border:"none", color:"#7A5A40", fontSize:"12px",
            cursor:"pointer", marginTop:"2px" }}>Cancelar — solo ver</button>
      </form>
    </div>
  );
}

// ─── DOCUMENTO ÚNICO EN FIRESTORE ─────────────────────────────────────────────
const DOC_REF = doc(db, "rover_app", "data");
const EMPTY_DATA = { scouts: [], prog: {}, dates: {}, invDates: {}, attendance: {}, order: [] };

export default function RoverDashboard() {
  // ── Auth ──
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const isAdmin = !!user;

  // ── Datos (sincronizados con Firestore) ──
  const [scouts, setScouts] = useState([]);
  const [prog, setProg]     = useState({});
  const [dates, setDates]   = useState({});
  const [invDates, setInvDates] = useState({});
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveErr, setSaveErr] = useState(false);

  // ── UI local ──
  const [selId, setSelId]       = useState(null);
  const [view, setView]         = useState("overview");
  const [stageId, setStageId]   = useState(1);
  const [adding, setAdding]     = useState(false);
  const [newName, setNewName]   = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [expItem, setExpItem]   = useState(null);
  const [exportMenu, setExportMenu] = useState(false);
  const [collapsedSecs, setCollapsedSecs] = useState({});
  const [attMonth, setAttMonth] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // móvil

  const dataRef = useRef(EMPTY_DATA);

  // ── Auth listener ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true); });
    return unsub;
  }, []);

  // ── Firestore: escucha en tiempo real ──
  const initialSelDone = useRef(false);
  const pendingWrites = useRef(0);
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF,
      (snap) => {
        const d = snap.exists() ? snap.data() : EMPTY_DATA;
        const merged = { ...EMPTY_DATA, ...d };
        setLoading(false);
        setSaveErr(false);
        if (!initialSelDone.current && (merged.scouts || []).length) {
          initialSelDone.current = true;
          setSelId(merged.scouts[0].id);
        }
        // Si hay escrituras locales aún sin confirmar, no pisamos dataRef/estado
        // con este snapshot (podría reflejar un punto del servidor anterior a
        // un clic que el usuario ya hizo y que está en cola para guardarse).
        if (pendingWrites.current > 0) return;
        dataRef.current = merged;
        setScouts(merged.scouts || []);
        setProg(merged.prog || {});
        setDates(merged.dates || {});
        setInvDates(merged.invDates || {});
        setAttendance(merged.attendance || {});
      },
      (error) => { setLoading(false); setSaveErr(true); }
    );
    return unsub;
  }, []);

  // ── Guardado: persiste el documento en Firestore, en cola secuencial ──
  // (evita que clics rápidos disparen escrituras en paralelo que se pisen entre sí)
  const writeQueue = useRef(Promise.resolve());
  const persist = (patch) => {
    const next = { ...dataRef.current, ...patch };
    dataRef.current = next;
    pendingWrites.current += 1;
    writeQueue.current = writeQueue.current
      .catch(() => {}) // no dejar que un fallo anterior bloquee la cola
      .then(() => setDoc(DOC_REF, next, { merge: true }))
      .then(() => setSaveErr(false))
      .catch(() => setSaveErr(true))
      .finally(() => { pendingWrites.current = Math.max(0, pendingWrites.current - 1); });
    return writeQueue.current;
  };
  const saveScouts = (v) => { setScouts(v); persist({ scouts: v }); };
  const saveProg   = (v) => { setProg(v);   persist({ prog: v }); };
  const saveDates  = (v) => { setDates(v);  persist({ dates: v }); };
  const saveInv    = (v) => { setInvDates(v); persist({ invDates: v }); };
  const saveAtt    = (v) => { setAttendance(v); persist({ attendance: v }); };

  // ── Scouts CRUD (solo admin) ──
  const addScout = () => {
    if (!isAdmin || !newName.trim()) return;
    const sc = { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), name: newName.trim(), group: newGroup.trim() };
    const upd = [...dataRef.current.scouts, sc];
    saveScouts(upd);
    setSelId(sc.id); setNewName(""); setNewGroup(""); setAdding(false);
  };
  const deleteScout = (id) => {
    if (!isAdmin) return;
    const cur = dataRef.current;
    const upd = cur.scouts.filter(s => s.id !== id);
    saveScouts(upd); if (selId === id) setSelId(upd[0]?.id || null);
    const na = { ...cur.attendance };
    Object.keys(na).forEach(k => { if (k.startsWith(`att:${id}|`)) delete na[k]; });
    saveAtt(na);
  };
  const moveScout = (id, dir) => {
    if (!isAdmin) return;
    const list = dataRef.current.scouts;
    const i = list.findIndex(s => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    const upd = [...list];
    [upd[i], upd[j]] = [upd[j], upd[i]];
    saveScouts(upd);
  };

  // ── Progresión ──
  const toggleItem = (stId, sec, idx) => {
    if (!isAdmin || !selId) return;
    const cur = dataRef.current;
    const k = pKey(selId, stId, sec, idx);
    const now = !cur.prog[k];
    const np = { ...cur.prog, [k]: now };
    const ndt = { ...cur.dates };
    const dk = dKey(selId, stId, sec, idx);
    if (now && !ndt[dk]) ndt[dk] = new Date().toISOString().split("T")[0];
    setProg(np); setDates(ndt);
    persist({ prog: np, dates: ndt });
  };
  const setItemDate = (stId, sec, idx, val) => {
    if (!isAdmin || !selId) return;
    const nd = { ...dataRef.current.dates, [dKey(selId, stId, sec, idx)]: val };
    saveDates(nd);
  };
  const toggleInv = (stId) => {
    if (!isAdmin || !selId) return;
    const cur = dataRef.current;
    const k = invKey(selId, stId);
    const ni = { ...cur.invDates, [k]: cur.invDates[k] ? "" : new Date().toISOString().split("T")[0] };
    saveInv(ni);
  };
  const toggleSec = (key) => setCollapsedSecs(p => ({ ...p, [key]: !p[key] }));

  // ── Asistencia (solo admin marca; todos ven) ──
  const cycleAttStatus = (scoutId, date) => {
    if (!isAdmin) return;
    const cur = dataRef.current.attendance;
    const k = attKey(scoutId, date);
    const curr = cur[k];
    if (!curr) { saveAtt({ ...cur, [k]: { status: "presente", note: "" } }); return; }
    const idx = ATT_CYCLE.indexOf(curr.status);
    if (idx === ATT_CYCLE.length - 1) {
      const na = { ...cur };
      delete na[k];
      saveAtt(na);
    } else {
      saveAtt({ ...cur, [k]: { ...curr, status: ATT_CYCLE[idx + 1] } });
    }
  };

  // ── Stats helpers (atados a este componente) ──
  const stageStats = (scoutId, stage) => {
    let t = 0, d = 0;
    stage.sections.forEach(sec => sec.items.forEach((_, i) => {
      t++; if (prog[pKey(scoutId, stage.id, sec.name, i)]) d++;
    }));
    return { t, d, pct: t ? Math.round(d / t * 100) : 0 };
  };
  const totalStats = (scoutId) => {
    let t = 0, d = 0;
    STAGES.forEach(st => { const s = stageStats(scoutId, st); t += s.t; d += s.d; });
    return { t, d, pct: t ? Math.round(d / t * 100) : 0 };
  };
  const getCurrStage = (scoutId) => {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      const s = stageStats(scoutId, STAGES[i]);
      if (s.pct === 100 && i < STAGES.length - 1) return STAGES[i + 1];
      if (s.d > 0) return STAGES[i];
    }
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
  const attendanceList = (scoutId) => Object.entries(attendance)
    .filter(([k]) => k.startsWith(`att:${scoutId}|`))
    .map(([k, v]) => ({ date: k.split("|")[1], status: v.status, note: v.note || "" }))
    .sort((a, b) => b.date.localeCompare(a.date));
  const attendanceStats = (scoutId) => {
    const list = attendanceList(scoutId);
    const t = list.length;
    const p = list.filter(r => r.status === "presente").length;
    const a = list.filter(r => r.status === "ausente").length;
    const e = list.filter(r => r.status === "excusa").length;
    return { t, p, a, e, pct: t ? Math.round(p / t * 100) : 0 };
  };

  const selScout = scouts.find(s => s.id === selId) || null;
  const activeSt = STAGES.find(s => s.id === stageId) || STAGES[0];
  const totStats = selScout ? totalStats(selId) : { t:0, d:0, pct:0 };

  if (loading || !authReady) {
    return (
      <div className="rv-root" style={{ minHeight:"100vh", background:"#0A0604",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <style>{CSS}</style>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"40px", color:"#D63031", opacity:.4 }}>⚜</div>
          <div style={{ fontSize:"12px", color:"#7A5A40", marginTop:"8px",
            fontFamily:"'Source Sans 3',sans-serif" }}>Cargando progresión…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rv-root" style={{ height:"100vh", display:"flex", flexDirection:"column",
      background:"#0A0604", color:"#EDE8E1", overflow:"hidden" }}>
      <style>{CSS}</style>
      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="rv-header" style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", padding:"10px 18px",
        borderBottom:"1px solid rgba(201,162,39,0.1)", flexShrink:0, gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"11px", minWidth:0 }}>
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}
            style={{ display:"none", background:"none", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"6px", color:"#C9A227", width:"30px", height:"30px",
              cursor:"pointer", fontSize:"14px", flexShrink:0 }}>☰</button>
          <span style={{ fontSize:"24px", color:"#D63031", lineHeight:1, flexShrink:0 }}>⚜</span>
          <div style={{ minWidth:0 }}>
            <div className="rv-header-title" style={{ fontFamily:"'Cinzel',serif", fontSize:"14px", fontWeight:"700",
              letterSpacing:"2.5px", color:"#F0ECE8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>PROGRESIÓN ROVER</div>
            <div className="rv-header-sub" style={{ fontSize:"11px", color:"#7A5A40", letterSpacing:"1.5px",
              fontFamily:"'Source Sans 3',sans-serif" }}>CARTILLA 2.0 · GUATEMALA</div>
          </div>
          <button onClick={() => setView("attendance")}
            style={{ marginLeft:"6px", padding:"6px 12px",
              background: view === "attendance" ? "rgba(91,143,168,0.22)" : "rgba(91,143,168,0.1)",
              border:"1px solid rgba(91,143,168,0.35)", borderRadius:"7px",
              color:"#7FB3D5", fontSize:"12px", fontWeight:"600", cursor:"pointer",
              fontFamily:"'Source Sans 3',sans-serif", flexShrink:0 }}>
            📋
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
          {saveErr && (
            <span style={{ fontSize:"11px", color:"#E74C3C",
              fontFamily:"'Source Sans 3',sans-serif" }}>⚠ Sin conexión</span>
          )}
          {isAdmin ? (
            <>
              <span className="rv-edit-badge" style={{ fontSize:"11px", color:"#27AE60", fontFamily:"'Source Sans 3',sans-serif",
                display:"flex", alignItems:"center", gap:"4px" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#27AE60" }} />
                Editando
              </span>
              <button onClick={() => signOut(auth)}
                style={{ padding:"6px 12px", background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.1)", borderRadius:"7px",
                  color:"#9A7A60", fontSize:"12px", cursor:"pointer",
                  fontFamily:"'Source Sans 3',sans-serif" }}>Salir</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)}
              style={{ padding:"6px 14px", background:"rgba(139,26,26,0.12)",
                border:"1px solid rgba(139,26,26,0.35)", borderRadius:"7px",
                color:"#E07A6E", fontSize:"12px", fontWeight:"600", cursor:"pointer",
                fontFamily:"'Source Sans 3',sans-serif", whiteSpace:"nowrap" }}>🔒 Dirigente</button>
          )}
        </div>
      </header>

      <div className="rv-body" style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* Overlay móvil (cierra el sidebar al tocar fuera) */}
        {sidebarOpen && (
          <div className="rv-overlay" onClick={() => setSidebarOpen(false)}
            style={{ display:"none" }} />
        )}

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className={`rv-sidebar${sidebarOpen ? " open-mobile" : ""}`}
          style={{ width:"218px", flexShrink:0, background:"#0D0704",
          borderRight:"1px solid rgba(201,162,39,0.08)", padding:"10px 8px",
          overflowY:"auto", display:"flex", flexDirection:"column", gap:"5px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 4px 8px", borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:"2px" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:"10px", color:"#7A5A30",
              letterSpacing:"1.5px" }}>ROVERS</span>
            {isAdmin && (
              <div style={{ display:"flex", gap:"5px" }}>
                <button className="add-btn" title="Ordenar por % de progreso (mayor a menor)"
                  onClick={() => {
                    const upd = [...dataRef.current.scouts].sort((a, b) => totalStats(b.id).pct - totalStats(a.id).pct);
                    saveScouts(upd);
                  }}
                  style={{ width:"22px", height:"22px", background:"rgba(201,162,39,0.08)",
                    border:"1px solid rgba(201,162,39,0.25)", borderRadius:"50%", color:"#C9A227",
                    fontSize:"11px", lineHeight:1, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"background 0.15s" }}>%</button>
                <button className="add-btn" onClick={() => setAdding(a => !a)}
                  style={{ width:"22px", height:"22px", background:"rgba(139,26,26,0.1)",
                    border:"1px solid rgba(139,26,26,0.3)", borderRadius:"50%", color:"#D63031",
                    fontSize:"16px", lineHeight:1, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"background 0.15s" }}>+</button>
              </div>
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
                {isAdmin ? "Agrega tu primer Rover para comenzar" : "Aún no hay Rovers registrados"}
              </div>
            </div>
          )}

          {scouts.map((sc, idx) => {
            const cs = getCurrStage(sc.id);
            const ts = totalStats(sc.id);
            const isSel = sc.id === selId;
            return (
              <div key={sc.id} className="scout-row"
                style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 7px",
                  background: isSel ? "rgba(28,13,5,0.99)" : "rgba(16,8,3,0.5)",
                  border:`1px solid ${isSel ? cs.color+"44" : "transparent"}`,
                  borderRadius:"8px", cursor:"pointer", transition:"all 0.15s" }}
                onClick={() => { setSelId(sc.id); setView("overview"); setSidebarOpen(false); }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%",
                  background:cs.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"'Cinzel',serif", fontSize:"14px", fontWeight:"700",
                  color:"#fff", flexShrink:0 }}>
                  {sc.name[0].toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:"#EDE8E1",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sc.name}</div>
                  {sc.group && <div style={{ fontSize:"10px", color:"#7A5A40",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{sc.group}</div>}
                  <div style={{ fontSize:"10px", color:cs.color, marginTop:"1px" }}>{cs.name}</div>
                  <div style={{ height:"2px", background:"rgba(255,255,255,0.05)",
                    borderRadius:"1px", overflow:"hidden", marginTop:"4px" }}>
                    <div style={{ height:"100%", width:`${ts.pct}%`,
                      background:cs.color, transition:"width 0.5s" }} />
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"3px" }}>
                  <span style={{ fontSize:"11px", fontWeight:"700", color:cs.color }}>{ts.pct}%</span>
                  {isAdmin && (
                    <div style={{ display:"flex", gap:"2px" }}>
                      <button className="move-btn" disabled={idx===0}
                        style={{ background:"none", border:"none",
                          color: idx===0 ? "#241208" : "#5A4030", fontSize:"10px",
                          cursor: idx===0 ? "default" : "pointer", padding:"0 2px" }}
                        onClick={e => { e.stopPropagation(); moveScout(sc.id, -1); }}>▲</button>
                      <button className="move-btn" disabled={idx===scouts.length-1}
                        style={{ background:"none", border:"none",
                          color: idx===scouts.length-1 ? "#241208" : "#5A4030", fontSize:"10px",
                          cursor: idx===scouts.length-1 ? "default" : "pointer", padding:"0 2px" }}
                        onClick={e => { e.stopPropagation(); moveScout(sc.id, 1); }}>▼</button>
                      <button className="del-btn" style={{ background:"none", border:"none",
                        color:"#3A2010", fontSize:"10px", cursor:"pointer", padding:"0 2px",
                        transition:"color 0.12s" }}
                        onClick={e => { e.stopPropagation(); deleteScout(sc.id); }}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────────────────── */}
        <main className="rv-main" style={{ flex:1, overflow:"auto", background:"#0A0604" }}
          onClick={() => exportMenu && setExportMenu(false)}>

          {/* Vacío */}
          {!selScout && view !== "attendance" && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:"14px", padding:"20px", textAlign:"center" }}>
              <div style={{ fontSize:"80px", opacity:.05 }}>⚜</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"18px",
                color:"#D63031", letterSpacing:"1px" }}>Selecciona un Rover</div>
              <div style={{ fontSize:"13px", color:"#5A3A28",
                fontFamily:"'Source Sans 3',sans-serif" }}>
                {isAdmin ? "o agrega uno en el panel lateral" : "elige uno en el panel lateral para ver su progresión"}
              </div>
            </div>
          )}

          {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
          {selScout && view === "overview" && (
            <div className="fade-in rv-overview-pad" style={{ padding:"20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"16px", color:"#EDE8E1", fontWeight:"600" }}>
                    Etapas de Progresión — <span style={{ color:"#D63031" }}>{selScout.name}</span>
                  </div>
                  <div style={{ fontSize:"12px", color:"#9A7A60", marginTop:"4px",
                    fontFamily:"'Source Sans 3',sans-serif" }}>
                    {totStats.d} de {totStats.t} requisitos completados · {totStats.pct}% total
                  </div>
                </div>

                {/* Export menu — global, todos los rovers */}
                <div style={{ position:"relative" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setExportMenu(m => !m)}
                    style={{ padding:"8px 14px", background:"rgba(201,162,39,0.1)",
                      border:"1px solid rgba(201,162,39,0.3)", borderRadius:"8px",
                      color:"#C9A227", fontSize:"12px", fontWeight:"600", cursor:"pointer",
                      fontFamily:"'Source Sans 3',sans-serif" }}>
                    ↓ Exportar Clan
                  </button>
                  {exportMenu && (
                    <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)",
                      background:"#150B05", border:"1px solid rgba(201,162,39,0.25)",
                      borderRadius:"9px", padding:"6px", zIndex:200, minWidth:"260px",
                      boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                      {[
                        ["📄 Reporte HTML / PDF — todo el Clan", () => { const html = exportAllHTML(scouts, prog, dates, attendance); const w = window.open("", "_blank"); w.document.write(html); w.document.close(); setExportMenu(false); }],
                        ["📊 Excel / CSV — Progresión (todos)", () => { exportAllCSV(scouts, prog, dates); setExportMenu(false); }],
                        ["📋 Excel / CSV — Asistencia (todos)", () => { exportAllAttendanceCSV(scouts, attendance); setExportMenu(false); }],
                      ].map(([lbl, fn], i) => (
                        <button key={i} className="ebtn" onClick={fn}
                          style={{ display:"block", width:"100%", textAlign:"left",
                            padding:"9px 10px", background:"none", border:"none",
                            borderRadius:"6px", color:"#D8D0C8", fontSize:"12.5px",
                            cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif",
                            transition:"background 0.15s" }}>{lbl}</button>
                      ))}
                      <div style={{ padding:"3px 10px 4px", fontSize:"10px", color:"#5A3A28",
                        fontFamily:"'Source Sans 3',sans-serif", lineHeight:"1.5" }}>
                        El reporte HTML incluye progresión y asistencia de todos los Rovers
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ height:"3px", background:"rgba(255,255,255,0.05)", borderRadius:"2px",
                overflow:"hidden", marginBottom:"22px" }}>
                <div style={{ height:"100%", width:`${totStats.pct}%`,
                  background:"linear-gradient(90deg,#7B0F0F,#D63031,#E74C3C)",
                  borderRadius:"2px", transition:"width 0.7s" }} />
              </div>

              <div className="ov-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:"12px" }}>
                {STAGES.map(st => {
                  const s = stageStats(selId, st);
                  const isCurr = activeSt === st;
                  return (
                    <div key={st.id} className="fade-in" onClick={() => { setStageId(st.id); setView("detail"); }}
                      style={{ background:"rgba(14,7,2,0.97)", border:`1px solid ${st.color}30`,
                        borderRadius:"12px", padding:"14px", cursor:"pointer",
                        transition:"transform 0.15s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"flex-start", marginBottom:"8px" }}>
                        <span style={{ fontFamily:"'Cinzel',serif", fontSize:"22px",
                          fontWeight:"700", color:st.color, opacity:.5 }}>{st.numeral}</span>
                        <span style={{ fontSize:"15px", fontWeight:"700", color:st.color }}>{s.pct}%</span>
                      </div>
                      <div style={{ fontSize:"13.5px", fontWeight:"700", color:"#EDE8E1" }}>{st.name}</div>
                      <div style={{ fontSize:"10.5px", color:"#9A7A60", marginTop:"1px" }}>{st.subtitle}</div>
                      <div style={{ height:"3px", background:"rgba(255,255,255,0.05)",
                        borderRadius:"2px", overflow:"hidden", marginTop:"9px" }}>
                        <div style={{ height:"100%", width:`${s.pct}%`, background:st.color,
                          borderRadius:"2px", transition:"width 0.5s" }} />
                      </div>
                      <div style={{ fontSize:"10px", color:"#5A3A28", marginTop:"6px" }}>{s.d}/{s.t} requisitos</div>
                    </div>
                  );
                })}
                <div onClick={() => setView("radar")}
                  style={{ background:"rgba(201,162,39,0.05)", border:"1px solid rgba(201,162,39,0.2)",
                    borderRadius:"12px", padding:"14px", cursor:"pointer",
                    display:"flex", flexDirection:"column", alignItems:"center",
                    justifyContent:"center", gap:"6px", minHeight:"110px" }}>
                  <span style={{ fontSize:"22px" }}>📊</span>
                  <span style={{ fontSize:"12px", fontWeight:"600", color:"#C9A227",
                    fontFamily:"'Source Sans 3',sans-serif" }}>Ver Radar</span>
                </div>
              </div>
            </div>
          )}

          {/* ── RADAR VIEW ─────────────────────────────────────────────────── */}
          {selScout && view === "radar" && (
            <div className="fade-in" style={{ padding:"16px 20px" }}>
              <button className="back-btn" onClick={() => setView("overview")}
                style={{ padding:"6px 12px", background:"none",
                  border:"1px solid rgba(255,255,255,0.09)", borderRadius:"6px",
                  color:"#9A7A60", fontSize:"12px", cursor:"pointer", marginBottom:"14px",
                  fontFamily:"'Source Sans 3',sans-serif" }}>← Resumen</button>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
                gap:"18px" }}>
                {STAGES.map(st => (
                  <div key={st.id} style={{ background:"rgba(14,7,2,0.97)",
                    border:`1px solid ${st.color}25`, borderRadius:"12px", padding:"16px" }}>
                    <div style={{ textAlign:"center", marginBottom:"6px" }}>
                      <span style={{ fontFamily:"'Cinzel',serif", fontSize:"13px",
                        fontWeight:"700", color:st.color }}>{st.name}</span>
                    </div>
                    <div className="radar-svg-wrap">
                      <RadarChart stage={st} scoutId={selId} prog={prog} size={220} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ATTENDANCE VIEW (Planilla: filas=chicos, columnas=días) ────────── */}
          {view === "attendance" && (() => {
            const { y, m } = attMonth;
            const monthLabel = new Date(y, m, 1).toLocaleDateString("es-GT", { month: "long", year: "numeric" });
            const daysInMonth = new Date(y, m + 1, 0).getDate();
            const todayStr = new Date().toISOString().split("T")[0];
            const pad2 = (n) => String(n).padStart(2, "0");
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
              .filter(d => [5, 6, 0].includes(new Date(y, m, d).getDay()));
            const dateOf = (d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
            const dowShort = (d) => ["D","L","M","X","J","V","S"][new Date(y, m, d).getDay()];

            return (
              <div className="fade-in" style={{ padding:"14px 18px", display:"flex",
                flexDirection:"column", gap:"10px" }}>

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  flexWrap:"wrap", gap:"8px" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"15px",
                    fontWeight:"700", color:"#7FB3D5" }}>📋 Cuadro de Asistencia — Todos los Rovers <span style={{ fontSize:"11px", color:"#5A7A8A", fontWeight:"600" }}>(Vie · Sáb · Dom)</span></div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <button className="att-nav" onClick={() => { setAttMonth(({y,m}) => m===0 ? {y:y-1,m:11} : {y,m:m-1}); }}
                      style={{ padding:"4px 10px", background:"rgba(91,143,168,0.1)",
                        border:"1px solid rgba(91,143,168,0.3)", borderRadius:"6px",
                        color:"#7FB3D5", fontSize:"12px", cursor:"pointer",
                        fontFamily:"'Source Sans 3',sans-serif" }}>←</button>
                    <div style={{ fontFamily:"'Cinzel',serif", fontSize:"12.5px",
                      fontWeight:"700", color:"#EDE8E1", textTransform:"capitalize",
                      minWidth:"130px", textAlign:"center" }}>{monthLabel}</div>
                    <button className="att-nav" onClick={() => { setAttMonth(({y,m}) => m===11 ? {y:y+1,m:0} : {y,m:m+1}); }}
                      style={{ padding:"4px 10px", background:"rgba(91,143,168,0.1)",
                        border:"1px solid rgba(91,143,168,0.3)", borderRadius:"6px",
                        color:"#7FB3D5", fontSize:"12px", cursor:"pointer",
                        fontFamily:"'Source Sans 3',sans-serif" }}>→</button>
                  </div>
                </div>

                <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", padding:"4px 9px",
                  background:"rgba(255,255,255,0.015)", borderRadius:"6px",
                  border:"1px solid rgba(255,255,255,0.04)" }}>
                  {Object.values(ATT_STATES).map(s => (
                    <span key={s.label} style={{ fontSize:"10.5px", color:s.color,
                      fontFamily:"'Source Sans 3',sans-serif" }}>● {s.short} = {s.label}</span>
                  ))}
                  {isAdmin && <span style={{ fontSize:"10.5px", color:"#5A3A28",
                    fontFamily:"'Source Sans 3',sans-serif" }}>— clic en la celda para marcar/cambiar</span>}
                </div>

                {scouts.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"36px 12px", opacity:.6 }}>
                    <div style={{ fontSize:"32px", opacity:.2, marginBottom:"8px" }}>⚜</div>
                    <div style={{ fontSize:"12px", color:"#5A3A28",
                      fontFamily:"'Source Sans 3',sans-serif" }}>Aún no hay Rovers registrados</div>
                  </div>
                ) : (
                  <div className="att-table-wrap" style={{ overflowX:"auto", border:"1px solid rgba(91,143,168,0.18)",
                    borderRadius:"9px", background:"rgba(14,7,2,0.97)" }}>
                    <table style={{ borderCollapse:"collapse", width:"100%", fontSize:"10.5px" }}>
                      <thead>
                        <tr>
                          <th style={{ position:"sticky", left:0, background:"rgba(19,10,5,0.99)",
                            zIndex:2, textAlign:"left", padding:"6px 10px", minWidth:"118px",
                            borderBottom:"1px solid rgba(255,255,255,0.06)",
                            borderRight:"1px solid rgba(255,255,255,0.06)",
                            fontFamily:"'Cinzel',serif", fontSize:"9.5px", color:"#7A5A30",
                            letterSpacing:"0.5px" }}>ROVER</th>
                          {days.map((d, di) => {
                            const isToday = dateOf(d) === todayStr;
                            const isFri = new Date(y, m, d).getDay() === 5;
                            const weekStart = isFri && di > 0;
                            return (
                              <th key={d} style={{ padding:"4px 2px", textAlign:"center",
                                minWidth:"22px", borderBottom:"1px solid rgba(255,255,255,0.06)",
                                borderLeft: weekStart ? "2px solid rgba(201,162,39,0.25)" : "none",
                                background: isToday ? "rgba(201,162,39,0.1)" : "transparent" }}>
                                <div style={{ color: isToday ? "#C9A227" : "#7A5A40",
                                  fontWeight: isToday ? "700" : "600",
                                  fontFamily:"'Source Sans 3',sans-serif" }}>{d}</div>
                                <div style={{ color:"#3A2818", fontSize:"8px",
                                  fontFamily:"'Source Sans 3',sans-serif" }}>{dowShort(d)}</div>
                              </th>
                            );
                          })}
                          <th style={{ padding:"4px 8px", textAlign:"center", minWidth:"46px",
                            borderBottom:"1px solid rgba(255,255,255,0.06)",
                            borderLeft:"1px solid rgba(255,255,255,0.06)",
                            fontFamily:"'Cinzel',serif", fontSize:"9px", color:"#7A5A30" }}>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scouts.map((sc, ri) => {
                          const stats = attendanceStats(sc.id);
                          return (
                            <tr key={sc.id} style={{ background: ri % 2 ? "rgba(255,255,255,0.012)" : "transparent" }}>
                              <td style={{ position:"sticky", left:0,
                                background: ri % 2 ? "rgba(20,11,5,0.99)" : "rgba(16,9,4,0.99)",
                                zIndex:1, padding:"4px 10px", whiteSpace:"nowrap",
                                borderRight:"1px solid rgba(255,255,255,0.06)",
                                borderBottom:"1px solid rgba(255,255,255,0.03)",
                                color:"#D8D0C8", fontWeight:"600", fontSize:"11px",
                                fontFamily:"'Source Sans 3',sans-serif", cursor:"pointer" }}
                                onClick={() => { setSelId(sc.id); setView("overview"); }}
                                title="Ver progresión">
                                {sc.name}
                              </td>
                              {days.map((d, di) => {
                                const date = dateOf(d);
                                const rec = attendance[attKey(sc.id, date)];
                                const st = rec ? ATT_STATES[rec.status] : null;
                                const weekStart = new Date(y, m, d).getDay() === 5 && di > 0;
                                return (
                                  <td key={d} style={{ padding:"2px", textAlign:"center",
                                    borderBottom:"1px solid rgba(255,255,255,0.03)",
                                    borderLeft: weekStart ? "2px solid rgba(201,162,39,0.12)" : "none" }}>
                                    <div className="att-cell" onClick={() => cycleAttStatus(sc.id, date)}
                                      title={rec?.note || (isAdmin ? "Clic para marcar" : "")}
                                      style={{ width:"19px", height:"19px", margin:"0 auto",
                                        borderRadius:"4px", cursor: isAdmin ? "pointer" : "default",
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        background: st ? `${st.color}30` : "rgba(255,255,255,0.025)",
                                        border: st ? `1px solid ${st.color}77` : "1px solid rgba(255,255,255,0.05)",
                                        color: st ? st.color : "transparent",
                                        fontSize:"9px", fontWeight:"700",
                                        fontFamily:"'Source Sans 3',sans-serif",
                                        transition:"transform 0.1s" }}>
                                      {st ? st.short : ""}
                                    </div>
                                  </td>
                                );
                              })}
                              <td style={{ padding:"4px 8px", textAlign:"center",
                                borderLeft:"1px solid rgba(255,255,255,0.06)",
                                borderBottom:"1px solid rgba(255,255,255,0.03)",
                                color:"#7FB3D5", fontWeight:"700", fontSize:"11px",
                                fontFamily:"'Source Sans 3',sans-serif" }}>
                                {stats.t > 0 ? `${stats.pct}%` : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ fontSize:"10.5px", color:"#5A3A28",
                  fontFamily:"'Source Sans 3',sans-serif" }}>
                  Clic en el nombre de un Rover para ver su progresión completa.
                </div>
              </div>
            );
          })()}

          {/* ── DETAIL VIEW ──────────────────────────────────────────────────── */}
          {selScout && view === "detail" && (
            <div className="fade-in rv-detail-pad" style={{ padding:"16px 20px", display:"flex",
              flexDirection:"column", gap:"12px" }}>
              {(() => {
                const s = stageStats(selId, activeSt);
                const inv = invDates[invKey(selId, activeSt.id)];
                return (<>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", flexWrap:"wrap" }}>
                    <button className="back-btn" onClick={() => setView("overview")}
                      style={{ padding:"6px 12px", background:"none",
                        border:"1px solid rgba(255,255,255,0.09)", borderRadius:"6px",
                        color:"#9A7A60", fontSize:"12px", cursor:"pointer", flexShrink:0,
                        marginTop:"4px", fontFamily:"'Source Sans 3',sans-serif" }}>← Resumen</button>
                    <div style={{ flex:1, minWidth:"200px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                        <span style={{ fontFamily:"'Cinzel',serif", fontSize:"20px",
                          fontWeight:"700", color:activeSt.color, opacity:.6 }}>{activeSt.numeral}</span>
                        <span style={{ fontFamily:"'Cinzel',serif", fontSize:"17px",
                          fontWeight:"700", color:"#EDE8E1" }}>{activeSt.name}</span>
                      </div>
                      <div style={{ fontSize:"12px", color:"#9A7A60", marginTop:"2px" }}>{activeSt.subtitle}</div>
                      <div style={{ fontSize:"11.5px", color:"#7A5A40", marginTop:"6px", maxWidth:"480px",
                        lineHeight:"1.5", fontFamily:"'Source Sans 3',sans-serif" }}>{activeSt.description}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"28px",
                        fontWeight:"700", color:activeSt.color, lineHeight:1 }}>{s.pct}%</div>
                      <div style={{ fontSize:"11px", color:"#9A7A60", marginTop:"4px" }}>{s.d}/{s.t} requisitos</div>
                    </div>
                  </div>

                  {/* Selector de etapa */}
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {STAGES.map(st => (
                      <button key={st.id} className="stab" onClick={() => setStageId(st.id)}
                        style={{ padding:"5px 12px", background: st.id === stageId ? `${st.color}22` : "rgba(255,255,255,0.03)",
                          border:`1px solid ${st.id === stageId ? st.color+"55" : "rgba(255,255,255,0.06)"}`,
                          borderRadius:"6px", color: st.id === stageId ? st.color : "#7A5A40",
                          fontSize:"11.5px", fontWeight:"600", cursor:"pointer",
                          fontFamily:"'Source Sans 3',sans-serif" }}>{st.numeral} {st.name}</button>
                    ))}
                    <button className="stab" onClick={() => setView("radar")}
                      style={{ padding:"5px 12px",
                        background:`${activeSt.color}18`,
                        border:`1px solid ${activeSt.color}44`,
                        borderRadius:"6px", color:activeSt.color, fontSize:"11.5px",
                        cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif",
                        fontWeight:"600" }}>📊 Ver Radar</button>
                  </div>

                  {/* Investidura */}
                  <div onClick={() => toggleInv(activeSt.id)}
                    style={{ display:"flex", alignItems:"center", gap:"9px", padding:"10px 14px",
                      background: inv ? `${activeSt.color}14` : "rgba(255,255,255,0.02)",
                      border:`1px solid ${inv ? activeSt.color+"44" : "rgba(255,255,255,0.05)"}`,
                      borderRadius:"9px", cursor: isAdmin ? "pointer" : "default" }}>
                    <div style={{ width:"18px", height:"18px", borderRadius:"5px",
                      border:`1.5px solid ${inv ? activeSt.color : "rgba(255,255,255,0.2)"}`,
                      background: inv ? activeSt.color : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0, fontSize:"11px", color:"#fff" }}>{inv && "✓"}</div>
                    <div>
                      <div style={{ fontSize:"12.5px", fontWeight:"700", color: inv ? activeSt.color : "#9A7A60",
                        fontFamily:"'Source Sans 3',sans-serif" }}>🎖️ {activeSt.investidura}</div>
                      {inv && <div style={{ fontSize:"10.5px", color:"#7A5A40", marginTop:"1px" }}>Realizada el {inv}</div>}
                    </div>
                  </div>

                  {/* Secciones */}
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
                            alignItems:"center", padding:"9px 12px", cursor:"pointer" }}>
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
                              const chk      = !!prog[k];
                              const itemDate = dates[dk] || "";
                              const expK     = `${activeSt.id}|${sec.name}|${idx}`;
                              const isExp    = expItem === expK;
                              return (
                                <div key={idx}>
                                  <div className="check-row"
                                    style={{ display:"flex", alignItems:"flex-start",
                                      gap:"7px", padding:"5px 5px", borderRadius:"5px",
                                      border:"1px solid transparent" }}>
                                    <div onClick={() => toggleItem(activeSt.id, sec.name, idx)}
                                      style={{ width:"16px", height:"16px", borderRadius:"4px",
                                        border:`1.5px solid ${chk ? activeSt.color : "rgba(255,255,255,0.2)"}`,
                                        background: chk ? activeSt.color : "transparent",
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        flexShrink:0, fontSize:"10px", color:"#fff",
                                        marginTop:"2px", cursor: isAdmin ? "pointer" : "default" }}>
                                      {chk && "✓"}
                                    </div>
                                    <span onClick={() => toggleItem(activeSt.id, sec.name, idx)}
                                      style={{ fontSize:"13px",
                                        color: chk ? "#5A4030" : "#D8D0C8",
                                        textDecoration: chk ? "line-through" : "none",
                                        lineHeight:"1.45", flex:1, cursor: isAdmin ? "pointer" : "default",
                                        fontFamily:"'Source Sans 3',sans-serif" }}>
                                      {item}
                                    </span>
                                    <button className="expbtn"
                                      style={{ background:"none", border:"none",
                                        color: isExp ? "#C9A227" : "#3A2818",
                                        fontSize:"10px", cursor:"pointer",
                                        padding:"2px 4px", flexShrink:0,
                                        marginTop:"2px" }}
                                      title="Fecha de cumplimiento"
                                      onClick={() => setExpItem(isExp ? null : expK)}>
                                      {isExp ? "▲" : "▼"}
                                    </button>
                                  </div>
                                  {isExp && (
                                    <div className="fade-in"
                                      style={{ marginLeft:"23px", marginBottom:"4px",
                                        padding:"8px 9px", background:"rgba(30,15,5,0.7)",
                                        border:"1px solid rgba(201,162,39,0.1)",
                                        borderRadius:"6px", display:"flex",
                                        alignItems:"center", gap:"7px" }}>
                                      <span style={{ fontSize:"11px", color:"#5A7A8A",
                                        whiteSpace:"nowrap",
                                        fontFamily:"'Source Sans 3',sans-serif" }}>📅 Fecha:</span>
                                      <input type="date" className="di"
                                        disabled={!isAdmin}
                                        value={itemDate}
                                        onChange={e => setItemDate(activeSt.id, sec.name, idx, e.target.value)} />
                                      {itemDate && isAdmin && (
                                        <button onClick={() => setItemDate(activeSt.id, sec.name, idx, "")}
                                          style={{ background:"none", border:"none",
                                            color:"#3A2818", fontSize:"10px",
                                            cursor:"pointer", padding:"0 3px" }}>✕</button>
                                      )}
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
                </>);
              })()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
