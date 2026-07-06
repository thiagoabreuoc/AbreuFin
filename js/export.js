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
  downloadFile([headers,...rows].join('\n'),'finflow_export.csv','text/csv;charset=utf-8');
  showToast('CSV exportado!','success');
}

function exportJSON() {
  downloadFile(JSON.stringify({entries,categories,exportedAt:new Date().toISOString()},null,2),'finflow_backup.json','application/json');
  showToast('JSON exportado!','success');
}

function exportTxt() {
  const yr=getYearTotals();
  const lines=['AbreuFin — Relatório Anual 2026','='.repeat(40),''];
  MONTHS.forEach((m,i)=>{
    const d=getMonthTotals(i);
    if (d.receita+d.despesa+d.investimento===0) return;
    lines.push(`${m} 2026`);
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
  downloadFile(lines.join('\n'),'finflow_relatorio_2026.txt','text/plain;charset=utf-8');
  showToast('Relatório exportado!','success');
}
