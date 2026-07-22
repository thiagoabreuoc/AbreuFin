# Abreu Finanças

Aplicativo web pessoal de controle financeiro (receitas, despesas e
investimentos), em PHP + SQLite no backend e JS puro (sem framework) no
frontend, com PWA (service worker + push notifications).

## Stack

- **Backend:** PHP nativo, sem framework. Persistência em SQLite via PDO
  (`config/db.php`), com migrations simples aplicadas no boot (`ALTER TABLE`
  condicionais).
- **Frontend:** HTML/CSS/JS vanilla, Bootstrap 5 (Bootswatch "flatly") como
  base de layout/utilitários, com uma camada própria de tokens e componentes
  Material 3 por cima (veja [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)), e Material
  Symbols (ícones) via CDN. Uma única página (`index.php`) que inclui todas as
  "telas" (`partials/screen-*.php`) e alterna visibilidade via JS
  (`js/navigation.js`).
- **PWA:** `sw.js` (service worker) + Web Push (`lib/webpush.php`,
  `api/push_subscribe.php`).
- **Auth:** login/senha próprio (com reset de senha por e-mail) e login com
  Google OAuth (`api/google_login.php`, `api/google_callback.php`,
  `config/google_oauth.php`).

## Estrutura

```
index.php            # shell da SPA, monta sidebar/drawer e inclui as telas
router.php            # router do servidor embutido do PHP (dev)
api/                   # endpoints JSON (auth, entries, categories, push, etc.)
config/                # conexão com banco, sessão, OAuth, rate limit
lib/                   # utilitários compartilhados (ex: webpush)
partials/              # telas da SPA (screen-home, screen-listing, ...)
css/, js/              # estilos e lógica de frontend
```

## Domínio

- **Lançamentos** (`entries`): receita, despesa ou investimento, com
  categoria/subcategoria, valor, data (dd/mm/yyyy), status e recorrência
  (`repetir`).
- **Categorias** (`categories` + `category_groups`): por usuário, com emoji e
  subcategorias; existe um conjunto de categorias padrão pré-populado
  (`defaultCategories()` em `config/db.php`).
- **Notificações**: push web e WhatsApp (via API externa) para lançamentos
  a vencer.

## Rodando localmente

```
php -S localhost:8000 router.php
```

O banco SQLite é criado automaticamente fora do webroot (`../../data/`
relativo a `config/db.php`) na primeira execução.

## Repositório

`https://github.com/thiagoabreuoc/AbreuFin` (branch `main`). Veja
`CLAUDE.md` para convenções de commit/push usadas neste projeto.
