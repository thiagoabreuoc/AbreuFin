# Design System — AbreuFin

Este documento descreve o sistema de design do AbreuFin: de onde vêm os
tokens visuais, como estão organizados nos arquivos CSS, quais os padrões
de componente já existentes e as convenções a seguir ao adicionar algo
novo. É a referência para manter a UI consistente conforme o app cresce.

## 1. Visão geral

A base é o **Material Design 3** (M3 — https://m3.material.io/), mas
implementado sem nenhum framework/lib de componentes M3 pronta: o app usa
Bootstrap 5 (tema Bootswatch "Flatly") para o esqueleto de layout/grid/
utilitários, e uma camada própria de **tokens e overrides M3** por cima,
que redefine cor, forma, elevação e tipografia para bater com o padrão
M3 — inclusive sobrescrevendo estilos nativos do Bootstrap quando preciso
(daí o uso de `!important` em vários pontos: é a forma de vencer a
especificidade das classes `.btn-primary`, `.card`, `.badge` etc. do
Bootstrap sem reescrever essas classes do zero).

Não há build step nem bundler — é PHP puro (`index.php` inclui os
`partials/screen-*.php`) com CSS/JS carregados diretamente via `<link>`/
`<script>`, versionados por `filemtime()` para cache-busting.

## 2. Arquitetura de arquivos

```
css/material3-tokens.css   # ÚNICA fonte de verdade dos tokens M3 (cor, forma,
                            # elevação, tipografia, movimento, state layer)
css/style.css               # componentes e overrides — consome os tokens acima
                            # via var(--md-sys-*), nunca hardcoda cor/raio
js/theme.js                  # só alterna claro/escuro ([data-theme="dark"]);
                            # não guarda nem aplica paleta de cor via JS
js/ripple.js                 # feedback tátil (ripple) M3 — delegação de evento
                            # num seletor central, funciona em elementos
                            # injetados dinamicamente
```

Não existe mais um arquivo `design-system.css` com um prefixo `ds-`
separado — havia um experimento assim (cards KPI estilo dashboard) que
nunca chegou a ser usado em nenhuma tela e foi removido para não deixar
dois sistemas paralelos no projeto.

## 3. Tokens M3 (`css/material3-tokens.css`)

Todos nomeados na convenção oficial do M3, para quem já conhece a spec
reconhecer de cara:

| Prefixo | Para quê | Exemplos |
|---|---|---|
| `--md-sys-color-*` | Cor semântica por *role* (primary, surface, error...) | `--md-sys-color-primary`, `--md-sys-color-on-surface-variant` |
| `--md-extended-color-*` | Cor de domínio, fora dos roles padrão do M3 | `--md-extended-color-receita-color`, `-investimento-*`, `-aviso-*`, `-success-*`, `-info-*`, `-lilac-*` |
| `--md-sys-shape-corner-*` | Escala de raio de borda | `none/extra-small/small/medium/large/extra-large/full` (0/4/8/12/16/28/999px) |
| `--md-sys-elevation-level*` | Sombra (0 a 5), valores oficiais do spec M3 | `box-shadow` pronto, não monta sombra na mão |
| `--md-ref-typeface-*`, `--md-sys-typescale-*` | Fonte (Poppins) e escala tipográfica | usado nos headings (`h4/h5/h6`) e em `.btn`; o resto do texto usa utilitários do Bootstrap |
| `--md-sys-motion-easing-*`, `-duration-*` | Curvas/duração de transição oficiais do M3 | usado em toda transição/animação do app |
| `--md-sys-state-*-opacity` | Opacidade da camada de estado (hover/focus/pressed) | hoje usado nos `status-cell` |

Cada token existe em **duas variantes**: `:root { ... }` (claro, default)
e `:root[data-theme="dark"] { ... }` (escuro). A troca de tema é feita
por `js/theme.js` só ligando/desligando o atributo `data-theme="dark"`
no `<html>` — todo o resto é resolvido pelo CSS sozinho, sem JS
recalculando ou reaplicando cor nenhuma.

> **Importante:** não crie uma segunda fonte de verdade para tokens de
> cor (por exemplo, reintroduzindo um objeto JS tipo o antigo
> `MATERIAL_THEMES`). O app já passou por isso e o resultado era um
> *flash* da paleta antiga antes do JS rodar, além de valores duplicados
> e divergentes entre CSS e JS. Qualquer variação de cor deve ser
> resolvida em `material3-tokens.css`, mesmo que dependente de estado
> (o padrão `:root[data-theme="..."]` é o jeito correto de fazer isso).

## 4. Paleta ativa: Verde AbreuFin

O app tem **uma única paleta de cor**, com seed `#0f9b7e` (a mesma cor do
gradiente do header e das telas de login/cadastro) — não há mais seletor
de tema de cor (existiu um carrossel com 8 paletas em Personalização;
foi removido porque a decisão de produto foi fixar a identidade visual
em verde). Se um dia isso mudar, o lugar certo pra reintroduzir múltiplas
paletas é de volta em `material3-tokens.css` (um bloco de tokens por
paleta, trocado por classe/atributo no `<html>`), não em JS.

## 5. Padrões de componente (`css/style.css`)

| Padrão | Classe(s) | Onde é usado |
|---|---|---|
| Botão pill | `.btn-primary`, `.btn-outline-primary`, `.btn-danger` | `border-radius:var(--md-sys-shape-corner-full)` — todo botão de ação primária/secundária |
| Chip de status | `.status-cell`, `.status-cell-success/-neutral/-white/-receita/-despesa/-investimento/-warning/-lilac` | tabs de tipo (Receita/Despesa/Investimento), filtros de status (Pago/A pagar...) |
| Campo de formulário outlined | `.form-box` (fieldset) + `.form-box-lbl` (legend) + `.form-control-borderless`/`.form-select-borderless` | todo campo do formulário de lançamento e telas de conta |
| Header em gradiente | `.app-header-gradient` + `.app-body-rounded` + `.app-header-watermark` | topo de toda tela interna (Home, Listagem, Categorias, Perfil, Form, etc.) — corpo da tela "sobe" por cima do header com `border-radius` nos cantos superiores |
| Tela de autenticação | `.auth-screen` (gradiente animado) + `.auth-input-box`, `.auth-btn-primary`, `.auth-social-circle`, `.auth-check`, `.auth-spinner` | Splash, Boas-vindas, Login, Criar conta, Esqueci senha |
| FAB | `.fab-main-btn` + `.fab-item`/`.fab-item-receita/-despesa/-investimento` | botão "Novo" e seu menu de ações |
| Menu lateral (drawer) | `#drawer`, `.drawer-item`, `#drawer-overlay` | menu do hambúrguer |
| Select customizado com busca | `.cs-btn`, `.cs-panel`, `.cs-item`, `.cs-search` (JS: `js/form.js`, funções `cs*`) | Categoria/Sub-categoria no formulário de lançamento — operável por teclado (trigger focável, setas navegam, Enter seleciona, Esc fecha) |
| Ripple (feedback tátil M3) | `.md-ripple` | aplicado via delegação de evento (`js/ripple.js`) num seletor central que cobre botões, cards, itens de lista, tabs etc. |

## 6. Convenções

- **Prefixo por domínio:** `--md-sys-*`/`--md-extended-*` (tokens M3),
  `.auth-*` (telas de autenticação), `.app-*` (chrome do app: header/body
  arredondado), `.status-cell*` (chips de status/tipo), `.drawer-*`,
  `.cs-*` (select customizado), `.fab-*`. Ao criar um componente novo,
  siga esse padrão em vez de nomes genéricos que colidam com o Bootstrap.
- **`!important`:** usado deliberadamente para sobrescrever CSS do
  Bootstrap/Bootswatch (que carrega antes e tem suas próprias regras de
  cor/raio). Não é sinal de bug — é a estratégia de integração escolhida
  neste projeto (documentado desde o início do arquivo `style.css`).
- **Sem hardcode de cor/raio em componente novo:** sempre `var(--md-sys-*)`
  ou `var(--md-extended-*)`; só a paleta em si (`material3-tokens.css`)
  tem valores hex fixos.
- **Cor em JS:** quando um gráfico/badge precisa da cor "ao vivo" (ex.:
  `js/home.js`, `js/listing.js`), leia via `cssVar('--md-sys-color-...')`
  (helper em `js/data.js`, usa `getComputedStyle`) — nunca hex fixo no
  JS, senão a cor não acompanha o tema claro/escuro.
- **Sem código morto:** antes de deixar uma classe/token "pronto pra usar
  depois", prefira adicionar quando for realmente consumido. Este
  documento nasceu de uma auditoria que encontrou um arquivo CSS inteiro
  (`design-system.css`) e ~15 classes nunca referenciadas em nenhuma tela.

## 7. Acessibilidade

Pontos já resolvidos e que devem ser mantidos em componentes novos:

- Todo botão só-ícone tem `aria-label` (ex.: botões de voltar, editar,
  excluir).
- Todo campo dentro de `.form-box` tem indicador de foco visível
  (`.form-box:focus-within` — borda + `box-shadow` na cor primária);
  nunca zere `outline`/`box-shadow` de foco sem um substituto visível.
- Controles customizados (o select com busca) são navegáveis 100% por
  teclado: gatilho com `role="button"`/`tabindex="0"`, lista com
  `role="listbox"`/`role="option"`, setas para navegar, Enter para
  selecionar, Esc para fechar.

## 8. Como estender

- **Nova cor de domínio** (ex.: uma 4ª categoria financeira): adicionar
  o quarteto `--md-extended-color-<nome>-color/-on-color/-color-container/
  -on-color-container` em `material3-tokens.css` (claro e escuro), depois
  criar `.status-cell-<nome>` em `style.css` seguindo o padrão dos
  existentes.
- **Novo componente visual reaproveitável:** siga a tabela da seção 5 —
  procure primeiro se já existe algo parecido (`status-cell`, `form-box`,
  `cs-*`) antes de criar um padrão novo do zero.
- **Dúvida sobre "isso já existe?":** faça uma busca por classe em
  `css/style.css` antes de escrever CSS novo — o arquivo é pequeno
  (~300 linhas) e vale a leitura completa antes de duplicar um padrão.
