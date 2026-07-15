<?php
require_once __DIR__ . '/../config/session.php';
startSession();
requireCsrf();
/* Encerra a autenticação sem destruir a sessão inteira: o app é uma SPA
   e não recarrega a página ao sair, então window.__CSRF_TOKEN__ continua
   valendo o token atual — destruir a sessão (e o csrf junto) quebrava
   qualquer ação seguinte, como logar de novo sem dar F5. */
unset($_SESSION['user_id']);
session_regenerate_id(true);
jsonResponse(['ok' => true]);
