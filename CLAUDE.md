# Git / GitHub

Este projeto deve ficar sempre sincronizado com o repositório remoto
`https://github.com/thiagoabreuoc/AbreuFin` (branch `main`).

Sempre que uma tarefa pedida pelo usuário for concluída (uma feature, um
fix, um ajuste), faça commit das mudanças e dê `git push` para `origin
main` automaticamente, sem precisar perguntar antes. Não é necessário
commitar a cada arquivo editado individualmente — agrupe por tarefa.

# Figma

Este projeto usa o servidor MCP remoto do Figma (plugin `figma@claude-plugins-official`)
para trazer decisões de design do Figma para o código. Não existe sync automático
bidirecional — o fluxo é sempre "Figma → código", sob demanda:

1. O usuário manda o link de um frame/arquivo do Figma.
2. O Claude lê a spec (cores, espaçamento, tipografia, componentes, layout) via MCP.
3. O Claude aplica as mudanças correspondentes em `css/design-system.css`,
   `css/style.css` ou nos `partials/*.php`.

Não tentar automatizar ou simular um sync em tempo real — sempre que o usuário
quiser refletir uma mudança do Figma no app, ele vai enviar o link explicitamente.
