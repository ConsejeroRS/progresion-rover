import { useState, useEffect } from "react";
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
const nKey = (sid, stId, sec, idx) => `n:${sid}|${stId}|${sec}|${idx}`;
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

// ─── EXPORT: HTML/PDF ─────────────────────────────────────────────────────────
function exportHTML(scout, prog, dates, notes, attendance) {
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

  // Asistencia: filtrar registros de este scout, ordenar por fecha
  const attRecords = Object.entries(attendance || {})
    .filter(([k]) => k.startsWith(`att:${scout.id}|`))
    .map(([k, v]) => ({ date: k.split("|")[1], status: v.status, note: v.note || "" }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const attTotal = attRecords.length;
  const attP = attRecords.filter(r => r.status === "presente").length;
  const attA = attRecords.filter(r => r.status === "ausente").length;
  const attE = attRecords.filter(r => r.status === "excusa").length;
  const attPct = attTotal ? Math.round(attP / attTotal * 100) : 0;
  const attHTML = attTotal ? `
    <div style="margin-bottom:28px;page-break-inside:avoid">
      <div style="background:#2a1208;color:#fff;padding:9px 14px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:15px;font-weight:700">📋 Asistencia a Reuniones</span>
        <span style="font-size:13px;font-weight:600">${attPct}% asistencia — ${attP}/${attTotal}</span>
      </div>
      <div style="border:1px solid #e0d8d0;border-top:none;border-radius:0 0 6px 6px;padding:14px">
        <div style="display:flex;gap:14px;margin-bottom:12px;font-size:12px;color:#555">
          <span>✓ Presente: <strong style="color:#1B7A3E">${attP}</strong></span>
          <span>✕ Ausente: <strong style="color:#C0392B">${attA}</strong></span>
          <span>⚠ Excusa: <strong style="color:#B9770E">${attE}</strong></span>
          <span>Total reuniones: <strong>${attTotal}</strong></span>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#fafaf8">
            <th style="text-align:left;padding:4px 8px;font-size:11px;color:#888;font-weight:600;width:100px">Fecha</th>
            <th style="padding:4px 8px;font-size:11px;color:#888;font-weight:600;width:90px">Estado</th>
            <th style="text-align:left;padding:4px 8px;font-size:11px;color:#888;font-weight:600">Observaciones</th>
          </tr></thead>
          <tbody>${attRecords.map(r => {
            const st = ATT_STATES[r.status] || { label: r.status, color: "#999" };
            return `
            <tr>
              <td style="padding:5px 8px;font-size:12px;border-bottom:1px solid #f0ece8">${r.date}</td>
              <td style="padding:5px 8px;text-align:center;font-size:11px;border-bottom:1px solid #f0ece8;color:${st.color};font-weight:600">${st.label}</td>
              <td style="padding:5px 8px;font-size:11px;border-bottom:1px solid #f0ece8;color:#666">${r.note || ""}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
    </div>` : `
    <div style="margin-bottom:28px;padding:14px;background:#f9f5f0;border:1px solid #e0d0c0;border-radius:6px;font-size:12px;color:#9a7a60;text-align:center">
      Sin registros de asistencia aún
    </div>`;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Progresión Rover – ${scout.name}</title>
<style>
body{font-family:Georgia,serif;max-width:960px;margin:0 auto;padding:32px;color:#1a0a04;background:#fffdf8;font-size:13px}
@media print{body{padding:10px}button{display:none!important}@page{margin:1.5cm}}
h1{color:#C0392B;font-size:22px;margin:0 0 4px}
</style></head><body>
<div style="text-align:center;border-bottom:2px solid #C0392B;padding-bottom:20px;margin-bottom:28px">
  <div style="font-size:32px;color:#C0392B;margin-bottom:6px">⚜ PROGRESIÓN ROVER</div>
  <div style="font-size:20px;font-weight:700;color:#2a1208">${scout.name}${scout.group ? " · " + scout.group : ""}</div>
  <div style="font-size:13px;color:#7a5a40;margin-top:8px">
    Progreso Total: <strong style="color:#C0392B">${pct}%</strong> &nbsp;(${totalD} / ${totalT} requisitos) &nbsp;·&nbsp; Asistencia: <strong style="color:#C0392B">${attPct}%</strong> &nbsp;·&nbsp; Generado: ${today}
  </div>
  <div style="margin-top:14px">
    <div style="height:8px;background:#f0e8e0;border-radius:4px;overflow:hidden;max-width:400px;margin:0 auto">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#8B1A1A,#C0392B);border-radius:4px"></div>
    </div>
  </div>
  <button onclick="window.print()" style="margin-top:14px;padding:7px 20px;background:#C0392B;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:13px">🖨️ Imprimir / Guardar como PDF</button>
</div>
${attHTML}
${stHTML}
<div style="margin-top:32px;padding:12px;background:#f9f5f0;border:1px solid #e0d0c0;border-radius:5px;font-size:11px;color:#9a7a60;text-align:center">
  Cartilla 2.0 · Progresión Rover · Asociación de Scouts de Guatemala · ${today}
</div>
</body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Reporte_Rover_${scout.name.replace(/\s+/g,"_")}.html`;
  a.click();
}

function exportCSV(scout, prog, dates, notes) {
  const rows = [["Rover","Grupo/Clan","Etapa","Sección","Área","Requisito","Completado","Fecha","Observaciones"]];
  STAGES.forEach(st => st.sections.forEach(sec => sec.items.forEach((item, idx) => {
    rows.push([
      scout.name, scout.group || "",
      st.name, sec.name, sec.area, item,
      prog[pKey(scout.id, st.id, sec.name, idx)] ? "Sí" : "No",
      dates[dKey(scout.id, st.id, sec.name, idx)] || "",
      (notes[nKey(scout.id, st.id, sec.name, idx)] || "").replace(/"/g,'""')
    ]);
  })));
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Progresion_${scout.name.replace(/\s+/g,"_")}.csv`;
  a.click();
}

function exportAttendanceCSV(scout, attendance) {
  const rows = [["Rover","Grupo/Clan","Fecha","Estado","Observaciones"]];
  Object.entries(attendance || {})
    .filter(([k]) => k.startsWith(`att:${scout.id}|`))
    .map(([k, v]) => ({ date: k.split("|")[1], status: v.status, note: v.note || "" }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(r => {
      rows.push([
        scout.name, scout.group || "", r.date,
        (ATT_STATES[r.status] || {}).label || r.status,
        r.note.replace(/"/g,'""')
      ]);
    });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Asistencia_${scout.name.replace(/\s+/g,"_")}.csv`;
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
.att-nav:hover{background:rgba(91,143,168,0.2)!important}
.att-cell:hover{transform:scale(1.18)}
`;


// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RoverDashboard() {
  const [scouts, setScouts]     = useState([]);
  const [selId, setSelId]       = useState(null);
  const [prog, setProg]         = useState({});
  const [dates, setDates]       = useState({});
  const [notes, setNotes]       = useState({});
  const [invDates, setInvDates] = useState({});
  const [attendance, setAttendance] = useState({});
  const [view, setView]         = useState("overview"); // overview | detail | radar | attendance
  const [stageId, setStageId]   = useState(1);
  const [adding, setAdding]     = useState(false);
  const [newName, setNewName]   = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [loading, setLoading]   = useState(true);
  const [expItem, setExpItem]   = useState(null);
  const [exportMenu, setExportMenu] = useState(false);
  const [collapsedSecs, setCollapsedSecs] = useState({});
  const [attMonth, setAttMonth] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() }; // m: 0-11
  });

  // ── Storage (localStorage del navegador) ────────────────────────────────────
  useEffect(() => {
    try {
      const load = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
      const s = load("rv4:scouts");
      const p = load("rv4:prog");
      const d = load("rv4:dates");
      const n = load("rv4:notes");
      const iv = load("rv4:inv");
      const at = load("rv4:att");
      if (s) { setScouts(s); if (s.length) setSelId(s[0].id); }
      if (p) setProg(p);
      if (d) setDates(d);
      if (n) setNotes(n);
      if (iv) setInvDates(iv);
      if (at) setAttendance(at);
    } catch {}
    setLoading(false);
  }, []);

  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const saveScouts = (v) => { setScouts(v); save("rv4:scouts", v); };
  const saveProg   = (v) => { setProg(v);   save("rv4:prog", v); };
  const saveDates  = (v) => { setDates(v);  save("rv4:dates", v); };
  const saveNotes  = (v) => { setNotes(v);  save("rv4:notes", v); };
  const saveInv    = (v) => { setInvDates(v); save("rv4:inv", v); };
  const saveAtt    = (v) => { setAttendance(v); save("rv4:att", v); };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const addScout = () => {
    if (!newName.trim()) return;
    const sc = { id: `r${Date.now()}`, name: newName.trim(), group: newGroup.trim() };
    const upd = [...scouts, sc];
    saveScouts(upd); setSelId(sc.id); setNewName(""); setNewGroup(""); setAdding(false);
  };
  const deleteScout = (id) => {
    const upd = scouts.filter(s => s.id !== id);
    saveScouts(upd); if (selId === id) setSelId(upd[0]?.id || null);
    const na = { ...attendance };
    Object.keys(na).forEach(k => { if (k.startsWith(`att:${id}|`)) delete na[k]; });
    saveAtt(na);
  };
  const toggleItem = (stId, sec, idx) => {
    if (!selId) return;
    const k = pKey(selId, stId, sec, idx);
    const np = { ...prog, [k]: !prog[k] };
    if (np[k] && !dates[dKey(selId, stId, sec, idx)]) {
      saveDates({ ...dates, [dKey(selId, stId, sec, idx)]: new Date().toISOString().split("T")[0] });
    }
    saveProg(np);
  };
  const setItemDate = (stId, sec, idx, val) => {
    if (!selId) return;
    saveDates({ ...dates, [dKey(selId, stId, sec, idx)]: val });
  };
  const setItemNote = (stId, sec, idx, val) => {
    if (!selId) return;
    saveNotes({ ...notes, [nKey(selId, stId, sec, idx)]: val });
  };
  const setInvDate = (stId, val) => {
    if (!selId) return;
    saveInv({ ...invDates, [invKey(selId, stId)]: val });
  };
  const toggleSec = (key) => setCollapsedSecs(p => ({ ...p, [key]: !p[key] }));

  // ── Asistencia ────────────────────────────────────────────────────────────
  const cycleAttStatus = (scoutId, date) => {
    const k = attKey(scoutId, date);
    const curr = attendance[k];
    if (!curr) { saveAtt({ ...attendance, [k]: { status: "presente", note: "" } }); return; }
    const idx = ATT_CYCLE.indexOf(curr.status);
    if (idx === ATT_CYCLE.length - 1) {
      // último estado del ciclo -> limpiar día (vuelve a "sin marcar")
      const na = { ...attendance };
      delete na[k];
      saveAtt(na);
    } else {
      saveAtt({ ...attendance, [k]: { ...curr, status: ATT_CYCLE[idx + 1] } });
    }
  };

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

  const selScout  = scouts.find(s => s.id === selId);
  const activeSt  = STAGES.find(s => s.id === stageId) || STAGES[0];
  const totStats  = selId ? totalStats(selId) : null;
  const currStage = selId ? getCurrStage(selId) : STAGES[0];

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ background:"#0A0604", height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize:"48px", animation:"spin 3s linear infinite", color:"#D63031" }}>⚜</div>
      <div style={{ color:"#7A5A40", fontFamily:"'Cinzel',serif", letterSpacing:"4px", fontSize:"12px" }}>CARGANDO...</div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#0A0604",
      fontFamily:"'Source Sans 3',sans-serif", color:"#EDE8E1", overflow:"hidden" }}>
      <style>{CSS}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"9px 16px", background:"linear-gradient(90deg,#0E0804,#130B06)",
        borderBottom:"1px solid rgba(201,162,39,0.12)", flexShrink:0, gap:"12px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
          <span style={{ fontSize:"24px", color:"#D63031", lineHeight:1 }}>⚜</span>
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:"14px", fontWeight:"700",
              letterSpacing:"2.5px", color:"#F0ECE8" }}>PROGRESIÓN ROVER</div>
            <div style={{ fontSize:"11px", color:"#7A5A40", letterSpacing:"1.5px",
              fontFamily:"'Source Sans 3',sans-serif" }}>CARTILLA 2.0 · GUATEMALA</div>
          </div>
          <button onClick={() => setView("attendance")}
            style={{ marginLeft:"6px", padding:"6px 12px",
              background: view === "attendance" ? "rgba(91,143,168,0.22)" : "rgba(91,143,168,0.1)",
              border:"1px solid rgba(91,143,168,0.35)", borderRadius:"7px",
              color:"#7FB3D5", fontSize:"12px", fontWeight:"600", cursor:"pointer",
              fontFamily:"'Source Sans 3',sans-serif", display:"flex",
              alignItems:"center", gap:"6px", transition:"background 0.15s" }}>
            📋 Asistencia
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", justifyContent:"flex-end" }}>
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
                  borderRadius:"9px", padding:"6px", zIndex:200, minWidth:"260px",
                  display:"flex", flexDirection:"column", gap:"3px",
                  boxShadow:"0 10px 36px rgba(0,0,0,0.7)" }}>
                  <div style={{ fontSize:"9px", color:"#7A5A40", letterSpacing:"1px",
                    padding:"3px 10px 5px", fontFamily:"'Cinzel',serif" }}>FORMATO</div>
                  {[
                    ["📄 Reporte HTML / PDF (progresión + asistencia)", () => { exportHTML(selScout, prog, dates, notes, attendance); setExportMenu(false); }],
                    ["📊 Excel / CSV — Progresión",        () => { exportCSV(selScout, prog, dates, notes);  setExportMenu(false); }],
                    ["📋 Excel / CSV — Asistencia",        () => { exportAttendanceCSV(selScout, attendance); setExportMenu(false); }],
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
                    El reporte HTML incluye asistencia y plan de progresión · botón imprimir/PDF
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ══ BODY ════════════════════════════════════════════════════════════ */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside style={{ width:"218px", flexShrink:0, background:"#0D0704",
          borderRight:"1px solid rgba(201,162,39,0.08)", padding:"10px 8px",
          overflowY:"auto", display:"flex", flexDirection:"column", gap:"5px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"0 4px 8px", borderBottom:"1px solid rgba(255,255,255,0.04)", marginBottom:"2px" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:"10px", color:"#7A5A30",
              letterSpacing:"1.5px" }}>ROVERS</span>
            <button className="add-btn" onClick={() => setAdding(a => !a)}
              style={{ width:"22px", height:"22px", background:"rgba(139,26,26,0.1)",
                border:"1px solid rgba(139,26,26,0.3)", borderRadius:"50%", color:"#D63031",
                fontSize:"16px", lineHeight:1, cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"background 0.15s" }}>+</button>
          </div>

          {adding && (
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
                fontFamily:"'Source Sans 3',sans-serif" }}>Agrega tu primer Rover para comenzar</div>
            </div>
          )}

          {scouts.map(sc => {
            const cs = getCurrStage(sc.id);
            const ts = totalStats(sc.id);
            const isSel = sc.id === selId;
            return (
              <div key={sc.id} className="scout-row"
                style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 7px",
                  background: isSel ? "rgba(28,13,5,0.99)" : "rgba(16,8,3,0.5)",
                  border:`1px solid ${isSel ? cs.color+"44" : "transparent"}`,
                  borderRadius:"8px", cursor:"pointer", transition:"all 0.15s" }}
                onClick={() => { setSelId(sc.id); setView("overview"); }}>
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
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
                  <span style={{ fontSize:"11px", fontWeight:"700", color:cs.color }}>{ts.pct}%</span>
                  <button className="del-btn" style={{ background:"none", border:"none",
                    color:"#3A2010", fontSize:"10px", cursor:"pointer", padding:"1px 2px",
                    transition:"color 0.12s" }}
                    onClick={e => { e.stopPropagation(); deleteScout(sc.id); }}>✕</button>
                </div>
              </div>
            );
          })}
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────────────────── */}
        <main style={{ flex:1, overflow:"auto", background:"#0A0604" }}
          onClick={() => exportMenu && setExportMenu(false)}>

          {/* Vacío */}
          {!selScout && view !== "attendance" && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:"14px" }}>
              <div style={{ fontSize:"80px", opacity:.05 }}>⚜</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:"18px",
                color:"#D63031", letterSpacing:"1px" }}>Selecciona un Rover</div>
              <div style={{ fontSize:"13px", color:"#5A3A28",
                fontFamily:"'Source Sans 3',sans-serif" }}>o agrega uno en el panel lateral</div>
            </div>
          )}

          {/* ── OVERVIEW ───────────────────────────────────────────────────── */}
          {selScout && view === "overview" && (
            <div className="fade-in" style={{ padding:"20px" }}>
              <div style={{ marginBottom:"16px" }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"16px", color:"#EDE8E1", fontWeight:"600" }}>
                  Etapas de Progresión — <span style={{ color:"#D63031" }}>{selScout.name}</span>
                </div>
                <div style={{ fontSize:"12px", color:"#9A7A60", marginTop:"4px",
                  fontFamily:"'Source Sans 3',sans-serif" }}>
                  {totStats.d} de {totStats.t} requisitos completados · {totStats.pct}% total
                </div>
              </div>
              <div style={{ height:"3px", background:"rgba(255,255,255,0.05)", borderRadius:"2px",
                overflow:"hidden", marginBottom:"22px" }}>
                <div style={{ height:"100%", width:`${totStats.pct}%`,
                  background:"linear-gradient(90deg,#7B0F0F,#D63031,#E74C3C)",
                  borderRadius:"2px", transition:"width 0.7s" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))", gap:"12px" }}>
                {STAGES.map(st => {
                  const ss = stageStats(selId, st);
                  const circ = 2 * Math.PI * 28;
                  const done = ss.pct === 100;
                  return (
                    <div key={st.id} className="stage-card"
                      style={{ background:"rgba(14,7,2,0.97)",
                        border:`1px solid ${done ? st.color+"BB" : ss.pct > 0 ? st.color+"35" : "#1A0C06"}`,
                        borderRadius:"12px", padding:"16px", position:"relative", overflow:"hidden" }}
                      onClick={() => { setStageId(st.id); setView("detail"); }}>
                      {done && (
                        <div style={{ position:"absolute", top:"8px", right:"8px",
                          fontSize:"9px", background:"rgba(39,174,96,0.14)", color:"#27AE60",
                          border:"1px solid rgba(39,174,96,0.35)", borderRadius:"8px",
                          padding:"2px 7px", fontWeight:"700", letterSpacing:"0.5px",
                          fontFamily:"'Source Sans 3',sans-serif" }}>✓ LISTO</div>
                      )}
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"26px",
                        fontWeight:"700", color:st.color, lineHeight:1 }}>{st.numeral}</div>
                      <div style={{ fontFamily:"'Cinzel',serif", fontSize:"12px",
                        fontWeight:"700", color:"#EDE8E1", marginTop:"5px", lineHeight:1.3 }}>{st.name}</div>
                      <div style={{ fontSize:"11px", color:"#7A5A40", marginTop:"2px",
                        fontFamily:"'Source Sans 3',sans-serif" }}>{st.subtitle}</div>
                      <svg viewBox="0 0 64 64" width="60" height="60"
                        style={{ margin:"10px auto 0", display:"block" }}>
                        <circle cx="32" cy="32" r="28" fill="none"
                          stroke="rgba(255,255,255,0.04)" strokeWidth="5"/>
                        <circle cx="32" cy="32" r="28" fill="none" stroke={st.color}
                          strokeWidth="5" strokeDasharray={circ}
                          strokeDashoffset={circ * (1 - ss.pct / 100)}
                          strokeLinecap="round" transform="rotate(-90 32 32)"
                          style={{ transition:"stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }}/>
                        <text x="32" y="37" textAnchor="middle" fill={st.color}
                          fontSize="12" fontWeight="bold" fontFamily="Georgia,serif">{ss.pct}%</text>
                      </svg>
                      <div style={{ fontSize:"11px", color:"#7A5A40", textAlign:"center",
                        marginTop:"5px", fontFamily:"'Source Sans 3',sans-serif" }}>{ss.d} de {ss.t} req.</div>
                      <div style={{ marginTop:"10px", display:"flex", gap:"5px" }}>
                        <div style={{ flex:1, padding:"5px 0", borderRadius:"5px",
                          fontSize:"12px", fontWeight:"600", color:"#fff", textAlign:"center",
                          background:st.color, letterSpacing:"0.3px",
                          fontFamily:"'Source Sans 3',sans-serif" }}>Ver detalle →</div>
                        <div onClick={(e) => { e.stopPropagation(); setStageId(st.id); setView("radar"); }}
                          style={{ padding:"5px 9px", borderRadius:"5px", fontSize:"12px",
                            color:st.color, background:`${st.color}18`,
                            border:`1px solid ${st.color}44`, cursor:"pointer",
                            fontFamily:"'Source Sans 3',sans-serif", transition:"opacity 0.15s" }}
                          title="Ver diagrama radar">📊</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RADAR VIEW ─────────────────────────────────────────────────── */}
          {selScout && view === "radar" && (
            <div className="fade-in" style={{ padding:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
                <button className="back-btn" onClick={() => setView("overview")}
                  style={{ padding:"6px 13px", background:"none",
                    border:"1px solid rgba(255,255,255,0.09)", borderRadius:"6px",
                    color:"#9A7A60", fontSize:"12px", cursor:"pointer",
                    fontFamily:"'Source Sans 3',sans-serif", transition:"color 0.15s" }}>← Resumen</button>
                <div>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"15px",
                    fontWeight:"700", color:"#EDE8E1" }}>
                    Áreas de Crecimiento — <span style={{ color:activeSt.color }}>{activeSt.name}</span>
                  </div>
                  <div style={{ fontSize:"12px", color:"#9A7A60", marginTop:"2px",
                    fontFamily:"'Source Sans 3',sans-serif" }}>{selScout.name}</div>
                </div>
              </div>
              {/* Tabs */}
              <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
                {STAGES.map(st => (
                  <button key={st.id} className="stab"
                    style={{ padding:"5px 14px",
                      background: stageId === st.id ? st.color : "rgba(20,10,3,0.7)",
                      border:`1px solid ${stageId === st.id ? st.color : "rgba(255,255,255,0.07)"}`,
                      borderRadius:"16px",
                      color: stageId === st.id ? "#fff" : "#9A7A60",
                      fontSize:"12px", fontFamily:"'Cinzel',serif", cursor:"pointer",
                      fontWeight: stageId === st.id ? "700" : "500",
                      transition:"all 0.15s" }}
                    onClick={() => setStageId(st.id)}>{st.numeral} {st.name}</button>
                ))}
              </div>
              {/* Grid radar + áreas */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
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

          {/* ── ATTENDANCE VIEW (Planilla: filas=chicos, columnas=días) ────────── */}
          {view === "attendance" && (() => {
            const { y, m } = attMonth;
            const monthLabel = new Date(y, m, 1).toLocaleDateString("es-GT", { month: "long", year: "numeric" });
            const daysInMonth = new Date(y, m + 1, 0).getDate();
            const todayStr = new Date().toISOString().split("T")[0];
            const pad2 = (n) => String(n).padStart(2, "0");
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
              .filter(d => [5, 6, 0].includes(new Date(y, m, d).getDay())); // Vie(5), Sáb(6), Dom(0)
            const dateOf = (d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
            const dowShort = (d) => ["D","L","M","X","J","V","S"][new Date(y, m, d).getDay()];

            return (
              <div className="fade-in" style={{ padding:"14px 18px", display:"flex",
                flexDirection:"column", gap:"10px" }}>

                {/* Cabecera */}
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

                {/* Leyenda */}
                <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", padding:"4px 9px",
                  background:"rgba(255,255,255,0.015)", borderRadius:"6px",
                  border:"1px solid rgba(255,255,255,0.04)" }}>
                  {Object.values(ATT_STATES).map(s => (
                    <span key={s.label} style={{ fontSize:"10.5px", color:s.color,
                      fontFamily:"'Source Sans 3',sans-serif" }}>● {s.short} = {s.label}</span>
                  ))}
                  <span style={{ fontSize:"10.5px", color:"#5A3A28",
                    fontFamily:"'Source Sans 3',sans-serif" }}>— clic en la celda para marcar/cambiar</span>
                </div>

                {/* Sin rovers */}
                {scouts.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"36px 12px", opacity:.6 }}>
                    <div style={{ fontSize:"32px", opacity:.2, marginBottom:"8px" }}>⚜</div>
                    <div style={{ fontSize:"12px", color:"#5A3A28",
                      fontFamily:"'Source Sans 3',sans-serif" }}>Agrega Rovers en el panel lateral para registrar asistencia</div>
                  </div>
                ) : (
                  /* Tabla planilla */
                  <div style={{ overflowX:"auto", border:"1px solid rgba(91,143,168,0.18)",
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
                                      title={rec?.note || "Clic para marcar"}
                                      style={{ width:"19px", height:"19px", margin:"0 auto",
                                        borderRadius:"4px", cursor:"pointer",
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
            <div className="fade-in" style={{ padding:"16px 20px", display:"flex",
              flexDirection:"column", gap:"12px" }}>

              {/* Cabecera */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
                <button className="back-btn" onClick={() => setView("overview")}
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
                    <button className="stab" onClick={() => setView("radar")}
                      style={{ marginTop:"6px", padding:"4px 10px",
                        background:`${activeSt.color}18`,
                        border:`1px solid ${activeSt.color}44`,
                        borderRadius:"5px", color:activeSt.color, fontSize:"11px",
                        cursor:"pointer", fontFamily:"'Source Sans 3',sans-serif",
                        fontWeight:"600", transition:"opacity 0.15s" }}>📊 Ver Radar</button>
                  </>); })()}
                </div>
              </div>

              {/* Descripción */}
              <div style={{ padding:"10px 14px", background:"rgba(20,10,3,0.6)",
                border:`1px solid ${activeSt.color}22`, borderRadius:"8px",
                fontSize:"13px", color:"#9A7A60", lineHeight:"1.65",
                fontFamily:"'Source Sans 3',sans-serif" }}>
                {activeSt.description}
              </div>

              {/* Tabs etapas */}
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

              {/* Leyenda */}
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

              {/* Bloque de Investidura */}
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
                  <input type="date" className="di"
                    style={{ width:"130px", fontSize:"12px" }}
                    value={invDates[invKey(selId, activeSt.id)] || ""}
                    onChange={e => setInvDate(activeSt.id, e.target.value)} />
                </div>
              </div>

              {/* Grid de secciones */}
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
                      {/* Cabecera sección */}
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
                      {/* Barra progreso sección */}
                      <div style={{ height:"2px", background:"rgba(255,255,255,0.04)" }}>
                        <div style={{ height:"100%", width:`${secPct}%`,
                          background:activeSt.color, transition:"width 0.4s" }} />
                      </div>
                      {/* Items */}
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
                                  {/* Checkbox */}
                                  <div onClick={() => toggleItem(activeSt.id, sec.name, idx)}
                                    style={{ width:"16px", height:"16px", borderRadius:"4px",
                                      border:`1.5px solid ${chk ? activeSt.color : "rgba(255,255,255,0.2)"}`,
                                      background: chk ? activeSt.color : "transparent",
                                      display:"flex", alignItems:"center", justifyContent:"center",
                                      flexShrink:0, fontSize:"10px", color:"#fff",
                                      transition:"all 0.15s", marginTop:"2px", cursor:"pointer" }}>
                                    {chk && "✓"}
                                  </div>
                                  {/* Texto */}
                                  <span onClick={() => toggleItem(activeSt.id, sec.name, idx)}
                                    style={{ fontSize:"13px",
                                      color: chk ? "#5A4030" : "#D8D0C8",
                                      textDecoration: chk ? "line-through" : "none",
                                      lineHeight:"1.45", flex:1, cursor:"pointer",
                                      fontFamily:"'Source Sans 3',sans-serif" }}>
                                    {item}
                                  </span>
                                  {/* Toggle expand */}
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
                                </div>
                                {/* Panel expandido */}
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
                                      <input type="date" className="di"
                                        value={itemDate}
                                        onChange={e => setItemDate(activeSt.id, sec.name, idx, e.target.value)} />
                                      {itemDate && (
                                        <button onClick={() => setItemDate(activeSt.id, sec.name, idx, "")}
                                          style={{ background:"none", border:"none",
                                            color:"#3A2818", fontSize:"10px",
                                            cursor:"pointer", padding:"0 3px" }}>✕</button>
                                      )}
                                    </div>
                                    <div style={{ display:"flex", alignItems:"flex-start", gap:"7px" }}>
                                      <span style={{ fontSize:"11px", color:"#5A8A5A",
                                        whiteSpace:"nowrap", marginTop:"4px",
                                        fontFamily:"'Source Sans 3',sans-serif" }}>📝 Obs.:</span>
                                      <textarea className="ni" rows={2}
                                        placeholder="Evidencia, notas, observaciones…"
                                        value={itemNote}
                                        onChange={e => setItemNote(activeSt.id, sec.name, idx, e.target.value)} />
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
        </main>
      </div>
    </div>
  );
}

