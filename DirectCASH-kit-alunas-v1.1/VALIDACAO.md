# Validação — automações e fluxos

Verificação local em 15/09/2026.

## Executado

- TypeScript: `npm run check`, sem erros.
- 12 testes automatizados passaram.
- D1 real no runtime local Miniflare: autenticação, proteção de origem, criptografia, licença, deduplicação concorrente, pausa e envio incerto sem repetição.
- Conversas: boas-vindas, rejeição de botão usado por outro perfil, confirmação de seguidor, validação e gravação de e-mail, mídia, botão com link, espera e bloqueio após vencimento da janela.
- Fluxo visual: gatilho de story, sequência de textos e vídeo, pausa curta, catálogo de dois itens e etiqueta de contato.
- Validação de mapas: ciclos e URLs de mídia inseguras rejeitados; início de comentário exige interação antes de sequências.
- Navegador: editor por etapas, seleção de post, salvamento de rascunho com API local simulada, navegação para fluxos e edição de catálogo.
- Largura de celular: editor em uma coluna; documento sem excesso horizontal. O mapa tem rolagem própria.

## Limites da verificação

Os testes usam respostas simuladas da Meta. Nenhuma mensagem foi enviada para terceiros. Ainda é necessário validar os formatos e as permissões na conta Instagram conectada após publicar a atualização. A integração de licença real que apresentou erro continua pendente e não foi removida.

Arquivos são fornecidos por URLs públicas; upload não está incluído. PDF usa botão com link. Não há bloco dinâmico externo nem importação do formato proprietário Manychat. Esperas têm precisão aproximada; retomadas podem aguardar o cron de cinco minutos.

Compilação `wrangler deploy --dry-run` concluída sem publicação: Worker de 57,12 KiB (15,28 KiB comprimido), 13 arquivos de assets.

## Acesso temporário

Teste adicional cobre variável ausente, formato inválido, prazo expirado, liberação vigente, conta ausente, ausência de gravação no cache e retorno à verificação normal ao remover a variável. TypeScript passou após a alteração.

## Atualização de perfis, licença e aplicativo
15 testes aprovados. Separação D1 por perfil, preservação da conta anterior e licença suspensa verificadas. Compilação local aprovada: 66,72 KiB, 21 assets. Guias Windows/Android/iOS e tema claro conferidos no navegador local. Não houve publicação ou teste físico de instalação nos sistemas. Esta atualização substitui as limitações anteriores de uma conta por instalação e exigência de licença.
