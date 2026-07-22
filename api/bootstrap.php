<?php
require_once __DIR__ . '/../config/session.php';

$userId = requireLogin();
$pdo = db();

$user = currentUserRow();

// Category migrations (versioned, run once per user)
$catsVerRow = $pdo->prepare('SELECT cats_ver FROM users WHERE id=?');
$catsVerRow->execute([$userId]);
$catsVer = (int)($catsVerRow->fetchColumn() ?? 0);
$ins = $pdo->prepare('INSERT INTO categories (user_id, tipo, name, emoji, subs) VALUES (?,?,?,?,?)');
if ($catsVer < 5) {
    $pdo->prepare('DELETE FROM categories WHERE user_id=?')->execute([$userId]);
    foreach (defaultCategories() as $c) {
        $ins->execute([$userId, $c['tipo'], $c['name'], $c['emoji'], json_encode($c['subs'], JSON_UNESCAPED_UNICODE)]);
    }
    $pdo->prepare('UPDATE users SET cats_ver=5 WHERE id=?')->execute([$userId]);
}

$groups = ['receita' => [], 'despesa' => [], 'investimento' => []];
$gStmt = $pdo->prepare('SELECT id, tipo, name FROM category_groups WHERE user_id = ? ORDER BY id');
$gStmt->execute([$userId]);
foreach ($gStmt->fetchAll() as $g) {
    $groups[$g['tipo']][] = ['id' => (int)$g['id'], 'name' => $g['name']];
}

$categories = ['receita' => [], 'despesa' => [], 'investimento' => []];
$stmt = $pdo->prepare('SELECT id, tipo, name, emoji, subs, group_id FROM categories WHERE user_id = ? ORDER BY id');
$stmt->execute([$userId]);
foreach ($stmt->fetchAll() as $row) {
    $categories[$row['tipo']][] = [
        'id'      => (int)$row['id'],
        'name'    => $row['name'],
        'emoji'   => $row['emoji'],
        'subs'    => json_decode($row['subs'], true) ?: [],
        'groupId' => $row['group_id'] !== null ? (int)$row['group_id'] : null,
    ];
}

$stmt = $pdo->prepare('SELECT id, tipo, categoria, subcategoria, valor, dd, mm, yyyy, status, obs, repetir, notif, repeat_index, repeat_total, repeat_group_id FROM entries WHERE user_id = ? ORDER BY yyyy, mm, dd');
$stmt->execute([$userId]);
$entries = array_map(function ($e) {
    $e['id'] = (int)$e['id'];
    $e['valor'] = (float)$e['valor'];
    $e['dd'] = (int)$e['dd'];
    $e['mm'] = (int)$e['mm'];
    $e['yyyy'] = (int)$e['yyyy'];
    $e['notif'] = (bool)$e['notif'];
    $e['repeat_index'] = (int)$e['repeat_index'];
    $e['repeat_total'] = (int)$e['repeat_total'];
    $e['repeat_group_id'] = (int)$e['repeat_group_id'];
    return $e;
}, $stmt->fetchAll());

// Envio de Web Push (uma vez por dia, se houver subscrições ativas)
$today = date('Y-m-d');
$pushLastRow = $pdo->prepare('SELECT push_last_notif FROM users WHERE id=?');
$pushLastRow->execute([$userId]);
$pushLast = $pushLastRow->fetchColumn();

if ($pushLast !== $today) {
    $subStmt = $pdo->prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id=?');
    $subStmt->execute([$userId]);
    $subs = $subStmt->fetchAll();
    if ($subs) {
        require_once __DIR__ . '/../lib/webpush.php';
        $todayDt = new DateTime('today');
        $in3Dt   = new DateTime('+3 days');
        $overdue = 0; $upcoming = 0;
        foreach ($entries as $e) {
            if ($e['tipo'] !== 'despesa' || $e['status'] !== 'pendente') continue;
            $d = new DateTime("{$e['yyyy']}-{$e['mm']}-{$e['dd']}");
            if ($d < $todayDt) $overdue++;
            elseif ($d <= $in3Dt) $upcoming++;
        }
        $parts = [];
        if ($overdue)  $parts[] = "{$overdue} despesa(s) vencida(s).";
        if ($upcoming) $parts[] = "{$upcoming} vencendo em 3 dias.";
        if ($parts) {
            $payload = json_encode(['title' => 'AB Finanças', 'body' => implode(' ', $parts)]);
            $sent = false;
            foreach ($subs as $sub) {
                $code = wpSend($sub['endpoint'], $sub['p256dh'], $sub['auth'], $payload);
                if ($code === 404 || $code === 410) {
                    $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint=?')->execute([$sub['endpoint']]);
                } elseif ($code >= 200 && $code < 300) {
                    $sent = true;
                }
            }
            if ($sent) $pdo->prepare('UPDATE users SET push_last_notif=? WHERE id=?')->execute([$today, $userId]);
        }
    }
}

// Insights proativos (calculados a cada carregamento; envio por push é throttled a 1x/dia)
require_once __DIR__ . '/../lib/insights.php';
$insights = computeInsights($entries);

if ($insights) {
    $insightLastRow = $pdo->prepare('SELECT insight_last_notif FROM users WHERE id=?');
    $insightLastRow->execute([$userId]);
    $insightLast = $insightLastRow->fetchColumn();

    if ($insightLast !== $today) {
        $subStmt = $pdo->prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id=?');
        $subStmt->execute([$userId]);
        $subs = $subStmt->fetchAll();
        if ($subs) {
            require_once __DIR__ . '/../lib/webpush.php';
            $topInsight = $insights[0];
            $payload = json_encode(['title' => $topInsight['title'], 'body' => $topInsight['message']]);
            $sent = false;
            foreach ($subs as $sub) {
                $code = wpSend($sub['endpoint'], $sub['p256dh'], $sub['auth'], $payload);
                if ($code === 404 || $code === 410) {
                    $pdo->prepare('DELETE FROM push_subscriptions WHERE endpoint=?')->execute([$sub['endpoint']]);
                } elseif ($code >= 200 && $code < 300) {
                    $sent = true;
                }
            }
            if ($sent) $pdo->prepare('UPDATE users SET insight_last_notif=? WHERE id=?')->execute([$today, $userId]);
        }
    }
}

jsonResponse(['ok' => true, 'user' => $user, 'groups' => $groups, 'categories' => $categories, 'entries' => $entries, 'insights' => $insights]);
