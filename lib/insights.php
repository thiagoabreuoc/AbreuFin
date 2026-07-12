<?php
/* Insights proativos — regras simples sobre os lançamentos confirmados
   do mês corrente, sem dependência externa. Retorna todos os insights
   aplicáveis (ordenados por prioridade), pra exibir na tela de Insights;
   o push usa apenas o primeiro (mais prioritário). */

function computeInsights(array $entries): array {
    $confirmedStatus = ['receita' => 'recebido', 'despesa' => 'pago', 'investimento' => 'investido'];

    $today = new DateTime('today');
    $curY = (int)$today->format('Y');
    $curM = (int)$today->format('n');
    $prevDt = (clone $today)->modify('first day of this month')->modify('-1 day');
    $prevY = (int)$prevDt->format('Y');
    $prevM = (int)$prevDt->format('n');

    $curDespesaByCat  = [];
    $prevDespesaByCat = [];
    $curDespesaTotal  = 0.0;
    $curReceitaTotal  = 0.0;

    foreach ($entries as $e) {
        if (($confirmedStatus[$e['tipo']] ?? null) !== $e['status']) continue;
        $cat = $e['categoria'] !== '' ? $e['categoria'] : 'Outros';
        if ($e['tipo'] === 'despesa') {
            if ($e['yyyy'] === $curY && $e['mm'] === $curM) {
                $curDespesaTotal += $e['valor'];
                $curDespesaByCat[$cat] = ($curDespesaByCat[$cat] ?? 0) + $e['valor'];
            } elseif ($e['yyyy'] === $prevY && $e['mm'] === $prevM) {
                $prevDespesaByCat[$cat] = ($prevDespesaByCat[$cat] ?? 0) + $e['valor'];
            }
        } elseif ($e['tipo'] === 'receita' && $e['yyyy'] === $curY && $e['mm'] === $curM) {
            $curReceitaTotal += $e['valor'];
        }
    }

    $insights = [];

    // Regra 1 (mais urgente): despesas confirmadas já superam receitas confirmadas no mês.
    if ($curDespesaTotal > 0 && $curDespesaTotal > $curReceitaTotal) {
        $insights[] = [
            'key'     => 'balance_negative',
            'title'   => 'Atenção ao saldo',
            'message' => sprintf(
                'Suas despesas confirmadas este mês (R$ %s) já superam as receitas confirmadas (R$ %s).',
                insightFmt($curDespesaTotal), insightFmt($curReceitaTotal)
            ),
        ];
    }

    // Regra 2: categoria com alta relevante frente ao mês anterior.
    $bestSpike = null;
    foreach ($curDespesaByCat as $cat => $cur) {
        $prev = $prevDespesaByCat[$cat] ?? 0;
        if ($prev < 30 || $cur < 50) continue;
        $pct = ($cur - $prev) / $prev;
        if ($pct >= 0.3 && ($bestSpike === null || $pct > $bestSpike['pct'])) {
            $bestSpike = ['cat' => $cat, 'cur' => $cur, 'prev' => $prev, 'pct' => $pct];
        }
    }
    if ($bestSpike) {
        $insights[] = [
            'key'     => 'cat_spike',
            'title'   => 'Gasto em alta',
            'message' => sprintf(
                'Seus gastos em %s aumentaram %d%% em relação ao mês passado (R$ %s → R$ %s).',
                $bestSpike['cat'], (int)round($bestSpike['pct'] * 100), insightFmt($bestSpike['prev']), insightFmt($bestSpike['cur'])
            ),
        ];
    }

    // Regra 3: concentração de gastos em uma única categoria (exige 3+ categorias, senão é trivial).
    if ($curDespesaTotal >= 100 && count($curDespesaByCat) >= 3) {
        $sorted = $curDespesaByCat;
        arsort($sorted);
        $topCat = array_key_first($sorted);
        $topVal = $sorted[$topCat];
        $pct = $topVal / $curDespesaTotal;
        if ($pct >= 0.4) {
            $insights[] = [
                'key'     => 'concentration',
                'title'   => 'Concentração de gastos',
                'message' => sprintf(
                    '%d%% dos seus gastos confirmados este mês estão concentrados em %s (R$ %s).',
                    (int)round($pct * 100), $topCat, insightFmt($topVal)
                ),
            ];
        }
    }

    // Regra 4: boa economia no mês — saldo positivo relevante frente à receita
    // (contraponto "positivo" à regra 1, que só alerta quando o saldo é ruim).
    if ($curReceitaTotal >= 100 && $curReceitaTotal > $curDespesaTotal) {
        $saldo = $curReceitaTotal - $curDespesaTotal;
        $pct = $saldo / $curReceitaTotal;
        if ($pct >= 0.2) {
            $insights[] = [
                'key'     => 'good_savings',
                'title'   => 'Boa economia',
                'message' => sprintf(
                    'Você guardou %d%% da sua renda confirmada este mês (R$ %s de R$ %s). Continue assim!',
                    (int)round($pct * 100), insightFmt($saldo), insightFmt($curReceitaTotal)
                ),
            ];
        }
    }

    $todayLabel = $today->format('d/m/Y');
    foreach ($insights as &$ins) { $ins['date'] = $todayLabel; }
    unset($ins);

    return $insights;
}

function insightFmt(float $v): string {
    return number_format($v, 2, ',', '.');
}
