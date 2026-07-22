/* ═══════════════════════════════════════
   EXPORT
═══════════════════════════════════════ */
function openExport(){showScreen('export')}

function downloadFile(content, filename, type) {
  const blob=new Blob([content],{type});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
}

function exportCSV() {
  const headers='ID,Tipo,Categoria,Sub-categoria,Valor,DD,MM,AAAA,Status,Observação,Repetir,Notif';
  const rows=entries.map(e=>[e.id,e.tipo,e.categoria,e.subcategoria,e.valor.toFixed(2),e.dd,e.mm,e.yyyy,e.status,`"${e.obs}"`,e.repetir,e.notif].join(','));
  downloadFile([headers,...rows].join('\n'),'abreu_financas_export.csv','text/csv;charset=utf-8');
  showToast('CSV exportado!','success');
}

function exportJSON() {
  downloadFile(JSON.stringify({entries,categories,exportedAt:new Date().toISOString()},null,2),'abreu_financas_backup.json','application/json');
  showToast('JSON exportado!','success');
}

function buildAnnualReportText() {
  const anoAtual=new Date().getFullYear();
  const yr=getYearTotals(anoAtual);
  const lines=[`Abreu Finanças — Relatório Anual ${anoAtual}`,'='.repeat(40),''];
  MONTHS.forEach((m,i)=>{
    const d=getMonthTotals(i,anoAtual);
    if (d.receita+d.despesa+d.investimento===0) return;
    lines.push(`${m} ${anoAtual}`);
    lines.push(`  Receita:      ${fmt(d.receita)}`);
    lines.push(`  Despesa:      ${fmt(d.despesa)}`);
    lines.push(`  Investido:${fmt(d.investimento)}`);
    lines.push(`  Saldo:        ${fmt(d.receita-d.despesa-d.investimento)}`);
    lines.push('');
  });
  lines.push('TOTAL ANUAL');
  lines.push(`  Receita:      ${fmt(yr.receita)}`);
  lines.push(`  Despesa:      ${fmt(yr.despesa)}`);
  lines.push(`  Investido:${fmt(yr.investimento)}`);
  lines.push(`  Saldo:        ${fmt(yr.receita-yr.despesa-yr.investimento)}`);
  return { text: lines.join('\n'), anoAtual };
}

function exportTxt() {
  const { text, anoAtual } = buildAnnualReportText();
  downloadFile(text,`abreu_financas_relatorio_${anoAtual}.txt`,'text/plain;charset=utf-8');
  showToast('Relatório exportado!','success');
}

function exportEmail() {
  const { text, anoAtual } = buildAnnualReportText();
  const subject = encodeURIComponent(`Abreu Finanças — Relatório Anual ${anoAtual}`);
  const body = encodeURIComponent(text);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function exportWhatsapp() {
  const { text } = buildAnnualReportText();
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
