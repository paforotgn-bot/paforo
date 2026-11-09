/**
 * Traduce el "Libro del Residente" (export DOCENTIS) ES→EN y genera un HTML
 * maquetado en tablas. Parsea el texto extraído (pdftotext -layout).
 * Uso: node scripts/translate-libro.mjs <book_layout.txt> <salida.html>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [inTxt, outHtml] = process.argv.slice(2);
const T = readFileSync(inTxt, 'utf8');

// ---------- Diccionario de tipos de actividad / servicios ----------
const ACT = {
  'Asistencia a partos normales': 'Attendance at normal births',
  'Asistencia a parturientas de alto riesgo': 'Care of high-risk women in labour',
  'Asistencia a parturientas de bajo riesgo': 'Care of low-risk women in labour',
  'Supervisión y cuidado de puérperas': 'Supervision and care of postpartum women',
  'Supervisión, cuidados y reconocimiento de recién nacidos sanos': 'Supervision, care and examination of healthy newborns',
  'Observación y cuidado de recién nacidos que necesiten cuidados especiales': 'Observation and care of newborns requiring special care',
  'Toma de muestras': 'Sample collection',
  'Reconocimientos prenatales': 'Prenatal examinations',
  'Entrevista y confección de HC obstétrico-ginecológica': 'Interview and preparation of obstetric-gynaecological clinical history',
  'Asesoramiento y cuidado contraceptivo y sexual': 'Contraceptive and sexual advice and care',
  'Asesoramiento y cuidado en materia de ginecología': 'Advice and care in gynaecology',
  'Asesoramiento y cuidado en materia de ETS': 'Advice and care regarding STDs',
  'Asesoramiento y cuidado en materia de climaterio': 'Advice and care in the climacteric',
  'Asistencia y asesoramiento individual a jóvenes': 'Individual care and advice for young people',
  'Instrumentación de cesáreas': 'Instrumentation of caesarean sections',
  'Programa de Preparación al Nacimiento': 'Birth Preparation Programme',
  'Vigilancia y asistencia a gestantes de riesgo': 'Monitoring and care of high-risk pregnant women',
  // categorías de complementarias
  'Asistencia curso/taller': 'Course/workshop attendance',
  'Comunicación oral': 'Oral communication',
  'Ponente en sesiones': 'Speaker in sessions',
  'Poster': 'Poster',
};
const SERV = {
  'Ginecologia i Obstetrícia': 'Gynaecology and Obstetrics',
  'Atenció Primària': 'Primary Care',
  'Neonatologia': 'Neonatology',
};
const DENOM = {
  'Abordaje no farmacológico del síndrome premenstrual.': 'Non-pharmacological approach to premenstrual syndrome.',
  'Atención al parto de mínima intervención': 'Minimal-intervention birth care',
  'Consulta preconcepcional: hábitos a favor de la reproducción.': 'Preconception consultation: habits that favour reproduction.',
  'Curso de lactancia': 'Breastfeeding course',
  'Curso RCP neonatal básico': 'Basic neonatal CPR course',
  'Diseño e implementación de un programa de apoyo integral a la lactancia materna: intervención en planta, atención domiciliaria y seguimiento por matronas.': 'Design and implementation of a comprehensive breastfeeding support programme: ward intervention, home care and midwife-led follow-up.',
  'Endometriosis y dieta antiinflamatoria.': 'Endometriosis and anti-inflammatory diet.',
  'Experiencias y realidades en el embarazo del hombre trans.': 'Experiences and realities in the pregnancy of trans men.',
  'Factores que influyen en la adherencia a los nuevos métodos de alimentación complementaria.': 'Factors influencing adherence to new complementary feeding methods.',
  'Mutilación genital femenina. Impacto en la salud sexual y reproductiva.': 'Female genital mutilation. Impact on sexual and reproductive health.',
  'Percepción de los padres y madres de prematuros sobre la humanización de los cuidados en la unidad de cuidados intensivos neonatales.': "Parents' perceptions of preterm infants regarding the humanisation of care in the neonatal intensive care unit.",
  'Percepción del rol autónomo de enfermería en urgencias pediátricas del HSJD.': 'Perception of the autonomous nursing role in paediatric emergencies at HSJD.',
  'Sexualidad en el posparto.': 'Sexuality in the postpartum period.',
  'Suturas': 'Sutures',
  'Uso de pantallas en pacientes pediátricos hemato-oncológicos hospitalizados: un estudio randomizado.': 'Screen use in hospitalised paediatric haemato-oncology patients: a randomised study.',
  'Abordaje de la amenorrea funcional en la consulta de la matrona': "Management of functional amenorrhoea in the midwife's clinic",
  'Asesoramiento individualizado en métodos anticonceptivos': 'Individualised counselling on contraceptive methods',
  'Extracción precoz de calostro': 'Early colostrum expression',
  'Ingesta durante el trabajo de parto': 'Oral intake during labour',
  'Las disfunciones del suelo pélvico asociadas al parto, prevención y abordaje': 'Pelvic floor dysfunctions associated with childbirth: prevention and management',
  'Presencia de microplásticos en la placenta y su impacto en la salud fetal': 'Presence of microplastics in the placenta and its impact on fetal health',
  'Sesión clínica: Vaginal seeding': 'Clinical session: Vaginal seeding',
  'Sesión clínica: Depresión posparto': 'Clinical session: Postpartum depression',
  'Abordaje de la depresión posparto mediante identificación de factores de riesgo': 'Management of postpartum depression through identification of risk factors',
};
const tAct = (s) => ACT[s.trim()] || s.trim();
const tServ = (s) => SERV[s.trim()] || s.trim();
const tDenom = (s) => { const k = s.replace(/\s+/g, ' ').trim(); return DENOM[k] || k; };
const tDesc = (s) => {
  let x = s.replace(/\s+/g, ' ').trim();
  if (!x) return '';
  x = x.replace(/^Teoría \+ práctica con lenguas$/i, 'Theory + practice (suturing on ox tongues)');
  x = x.replace(/\bimpartida por\b/gi, 'given by').replace(/\bPor\b/g, 'By').replace(/\bpor\b/g, 'by').replace(/\basistente\b/gi, 'attendee').replace(/ y /g, ' and ');
  return x;
};
const esc = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Utilidades de recorte ----------
const between = (txt, a, b) => { const i = txt.indexOf(a); if (i < 0) return ''; const j = b ? txt.indexOf(b, i + a.length) : txt.length; return txt.slice(i + a.length, j < 0 ? txt.length : j); };

// ---------- Cabecera ----------
const g = (re) => { const m = T.match(re); return m ? m[1].trim() : ''; };
const header = {
  nombre: g(/Nombre del residente:\s*(.+)/),
  especialidad: g(/Especialidad:\s*(.+)/),
  inicio: g(/Fecha de inicio:\s*(.+)/),
  fin: g(/Fecha fin:\s*(.+)/),
  descarga: g(/Fecha de descarga:\s*(.+)/),
};

// ---------- Rotaciones ----------
const rotText = between(T, 'ROTACIONES', 'ENTREVISTAS FORMATIVAS');
const rotations = [...rotText.matchAll(/Fecha de inicio:\s*(.+?)\s*\n\s*Fecha fin:\s*(.+?)\s*\n\s*Centro\/Unidad:\s*(.+?)\s*\n\s*Servicio:\s*(.+?)\s*(?:\n|$)/g)]
  .map((m) => ({ ini: m[1].trim(), fin: m[2].trim(), centro: m[3].trim(), serv: tServ(m[4]) }));

// ---------- Entrevistas ----------
const entText = between(T, 'ENTREVISTAS FORMATIVAS', 'REGISTRO DE ACTIVIDADES');
const trim = { '1 - Primer trimestre': '1 - First quarter', '2 - Segundo trimestre': '2 - Second quarter', '3 - Tercer trimestre': '3 - Third quarter' };
const interviews = entText.split('\n').map((l) => l.trim()).filter((l) => /^[123] - /.test(l)).map((l) => {
  const m = l.match(/^([123] - \w+ trimestre)\s+(.*)$/);
  const label = trim[m[1]] || m[1];
  const rest = (m[2] || '').trim();
  return { label, rest };
});

// ---------- Complementarias (periodo 1) ----------
const compText = between(T, 'Tipo de actividad: Actividades complementarias', 'Tipo de actividad: servicios centrales');
const complementary = compText.split(/\n\s*\d+\s+Fecha:/).slice(1).map((chunk) => {
  const cat = (chunk.match(/Actividad:\s*(.+)/) || [])[1] || '';
  const den = (chunk.match(/Denominación:\s*([\s\S]*?)\s*(?:\n\s*Descripción:|$)/) || [])[1] || '';
  const des = (chunk.match(/Descripción:\s*([\s\S]*)$/) || [])[1] || '';
  return { cat: tAct(cat), titulo: tDenom(den), desc: tDesc(des) };
}).filter((c) => c.cat);

// ---------- Servicios centrales (por periodo) ----------
const pIdx = T.indexOf('Periodo:2025-2026');
const p1 = T.slice(0, pIdx < 0 ? T.length : pIdx);
const p2 = pIdx < 0 ? '' : T.slice(pIdx);
const recRe = /Actividad:\s*(.+?)\s*\n\s*Centro:\s*(.+?)\s*\n\s*Día:\s*(.+?)\s*\n\s*Matrona responsable:\s*(.+?)\s*\n\s*NHC:\s*(.+?)\s*\n\s*Nº:\s*(.+?)\s*\n/g;
const parseRecs = (txt) => [...txt.matchAll(recRe)].map((m) => ({ act: tAct(m[1]), centro: m[2].trim(), dia: m[3].trim(), matrona: m[4].trim(), nhc: m[5].trim(), num: m[6].trim() }));
const recs1 = parseRecs(between(p1, 'Tipo de actividad: servicios centrales', null));
const recs2 = parseRecs(between(p2, 'Tipo de actividad: servicios centrales', null));

// resumen por tipo
const summary = (recs) => { const m = new Map(); for (const r of recs) m.set(r.act, (m.get(r.act) || 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]); };

// ---------- Render ----------
const recTable = (recs) => `<table class="rec"><thead><tr><th>#</th><th>Date</th><th>Activity</th><th>Center</th><th>Responsible midwife</th><th>Clinical record no.</th></tr></thead><tbody>${recs.map((r) => `<tr><td>${esc(r.num)}</td><td>${esc(r.dia)}</td><td>${esc(r.act)}</td><td>${esc(r.centro)}</td><td>${esc(r.matrona)}</td><td>${esc(r.nhc)}</td></tr>`).join('')}</tbody></table>`;
const sumTable = (recs) => `<table class="sum"><thead><tr><th>Activity type</th><th>Count</th></tr></thead><tbody>${summary(recs).map(([k, n]) => `<tr><td>${esc(k)}</td><td class="c">${n}</td></tr>`).join('')}<tr class="tot"><td>TOTAL</td><td class="c">${recs.length}</td></tr></tbody></table>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Resident's Logbook — ${esc(header.nombre)}</title>
<style>
*{box-sizing:border-box}body{font-family:"Calibri","Segoe UI",Arial,sans-serif;color:#1a1a1a;font-size:10.5pt;line-height:1.35;margin:0}
h1{font-size:20pt;color:#1f3b64;margin:0 0 4px}
h2{font-size:14pt;color:#1f3b64;border-bottom:2px solid #1f3b64;padding-bottom:3px;margin:24px 0 8px;page-break-after:avoid}
h3{font-size:12pt;color:#2b4a75;margin:16px 0 6px;page-break-after:avoid}
.cover{text-align:center;padding-top:150px;page-break-after:always}
.meta p{margin:3px 0}.band{background:#e9edf3;border-left:4px solid #1f3b64;padding:8px 12px;margin:10px 0}
table{border-collapse:collapse;width:100%;margin:8px 0;font-size:9pt}
th,td{border:1px solid #bbb;padding:3px 6px;vertical-align:top;text-align:left}
th{background:#1f3b64;color:#fff;font-weight:600}
tr{page-break-inside:avoid}
table.rec td:first-child,table.rec th:first-child{text-align:center;width:32px}
table.rec td:nth-child(2){white-space:nowrap}
table.rec td:nth-child(6){white-space:nowrap;text-align:right}
.sum .c{text-align:center;width:70px}.sum .tot td{font-weight:700;background:#eef1f6}
.note{color:#666;font-size:8.5pt;font-style:italic}
ul{margin:6px 0;padding-left:18px}li{margin:3px 0}
</style></head><body>
<div class="cover"><h1>Resident's Logbook</h1>
<div class="band meta" style="text-align:left;display:inline-block;margin-top:30px">
<p><b>Resident's name:</b> ${esc(header.nombre)}</p>
<p><b>Specialty:</b> Obstetric-Gynaecological Nursing (Midwifery)</p>
<p><b>Start date:</b> ${esc(header.inicio)}</p>
<p><b>End date:</b> ${esc(header.fin)}</p>
<p><b>Download date:</b> ${esc(header.descarga)}</p>
</div>
<p class="note" style="margin-top:40px">Hospital Sant Joan de Déu — Barcelona · Working English translation</p>
</div>

<h2>Rotations</h2>
<table><thead><tr><th>#</th><th>Start date</th><th>End date</th><th>Center/Unit</th><th>Service</th></tr></thead><tbody>
${rotations.map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.ini)}</td><td>${esc(r.fin)}</td><td>${esc(r.centro)}</td><td>${esc(r.serv)}</td></tr>`).join('')}
</tbody></table>

<h2>Formative Interviews</h2>
<table><thead><tr><th>Quarter</th><th>Details (dates / signatures)</th></tr></thead><tbody>
${interviews.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.rest)}</td></tr>`).join('')}
</tbody></table>

<h2>Activity Log</h2>
<h3>Complementary activities (2024–2025)</h3>
<table><thead><tr><th>#</th><th>Category</th><th>Title</th><th>Description</th></tr></thead><tbody>
${complementary.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(c.cat)}</td><td>${esc(c.titulo)}</td><td>${esc(c.desc)}</td></tr>`).join('')}
</tbody></table>

<h3>Central services — clinical activities · Period 2024–2025 (${recs1.length} records)</h3>
${sumTable(recs1)}
${recTable(recs1)}

<h3>Central services — clinical activities · Period 2025–2026 (${recs2.length} records)</h3>
${sumTable(recs2)}
${recTable(recs2)}

<h2>Annual Evaluation Reports by the Evaluation Committee</h2>
<p>Evaluation of the period 2024–2025</p>
<p>Evaluation of the period 2025–2026</p>
<h2>Final Evaluation Report of the Residency Period by the Evaluation Committee</h2>
<p class="note">(Sections included in the original export; content completed by the Evaluation Committee.)</p>
</body></html>`;

writeFileSync(outHtml, html);
console.log(`Rotaciones: ${rotations.length} · Entrevistas: ${interviews.length} · Complementarias: ${complementary.length}`);
console.log(`Fichas periodo 2024-2025: ${recs1.length} · periodo 2025-2026: ${recs2.length}`);
console.log(`HTML: ${outHtml}`);
