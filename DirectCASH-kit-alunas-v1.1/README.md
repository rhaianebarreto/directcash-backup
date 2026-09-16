<!-- DIRECTCASH-BROWSER-START -->
## Instalar pelo navegador (celular ou computador)

[Instalar meu DirectCA$H](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Frhaianebarreto%2Fdirectcash)

Use contas Cloudflare e GitHub. Informe uma senha privada ADMIN_PASSWORD e uma chave aleatória APP_KEY (32 caracteres ou mais); mantenha o comando npm run deploy. Depois abra seu endereço workers.dev. Consulte INSTALAR-PELO-CELULAR.md.
<!-- DIRECTCASH-BROWSER-END -->

# DirectCA$H · Creator IA Club

Edição 1.1 de instalação individual para Cloudflare Workers + D1. Código novo, sem arquivos do DirectPro/MANY. A imagem de marca foi fornecida pela responsável pelo Creator IA Club.

## Para instalar

1. Instale Node.js LTS e extraia o ZIP.
2. Windows: abra `INSTALAR-WINDOWS.cmd`. macOS/Linux: `npm ci`, depois `npm run install:guided`.
3. O assistente pede autorização, cria D1, aplica o schema e publica na sua conta Cloudflare. Não contrata um plano pago.
4. Guarde a senha. No site publicado, abra **Configuração** e **Guia de instalação** para preparar a Meta.
5. Conecte o Instagram e teste sua automação. A exigência de licença está suspensa nesta entrega.

O guia completo está em `public/guia.html` e publicado em `/guia.html`. É necessário Node compatível com a versão de Wrangler fixada no package-lock.json.

## O que esta versão faz

- Até dez perfis profissionais na instalação, com alternância e dados separados por perfil.
- Licença suspensa por padrão: não é necessário código nem prazo de teste.
- Login administrativo por senha aleatória e sessão de 24h.
- Até 30 automações e fluxos, com busca, filtros, duplicação, edição e pausa.
- Comentário em post específico ou qualquer post, resposta a story e DM recebida; correspondência por palavra ou mensagem exata.
- DM recebida com palavra-chave → resposta com link dentro da janela permitida.
- Webhooks assinados, deduplicação persistente, fila no D1, lotes de até quatro envios e rotina a cada cinco minutos.
- Renovação de token próximo ao vencimento, status, diagnóstico e histórico com retenção de 30 dias.

Inclui editor por etapas com prévia, seleção visual de posts, boas-vindas com respostas rápidas, verificação de seguidores, captura de e-mail, mídia e acompanhamento. A área Fluxos oferece blocos conectados, ramificações por resposta, imagens, áudio, vídeo, catálogo de até 10 cartões, etiquetas, espera e importação/exportação JSON do DirectCA$H. Um bloco de mensagem pode agrupar até 12 conteúdos adicionais e pausas curtas. Arquivos são fornecidos por URLs HTTPS públicas. PDF pode ser entregue por botão com link. Não há upload de arquivos, importação de arquivos proprietários Manychat, conteúdo dinâmico de servidores externos, disparos em massa ou IA generativa nesta implementação.

## Conversas e intervalos

- Após um comentário, o primeiro bloco é uma mensagem simples com opções para avançar. Mídias e sequências vêm depois da resposta da pessoa.
- Esperas longas usam o cron de cinco minutos; não são horários exatos. Pausas de 1 a 10 segundos entre conteúdos são feitas durante a execução disponível. Em caso de retomada, limite de execução ou fila, a continuação pode aguardar o próximo cron.
- A API precisa confirmar que a pessoa segue o perfil; indisponibilidade da consulta bloqueia a entrega daquela etapa.
- Uma resposta durante uma espera cancela o acompanhamento. Uma nova automação de comentário para a mesma pessoa substitui a conversa anterior.
- Nome indisponível usa “você”. Coleta de e-mail valida o formato, sem confirmar a titularidade do endereço.
- Contatos → Excluir dados remove o contato, etiquetas e conversa e cancela envios pendentes para esse perfil.

## Segurança e limites

- APP_KEY e ADMIN_PASSWORD são secrets do Worker; o instalador mantém cópia privada em `.install-secrets.json`. Não distribua sua pasta instalada.
- Chave do aplicativo Meta e token são criptografados no D1 (AES-GCM). APP_KEY não deve ser perdida ou substituída sem reconectar as contas.
- Cookies HttpOnly/SameSite, verificação de Origin nas alterações, token OAuth de uso único vinculado à sessão e rate limit de login.
- Eventos próprios, ecos, replies em threads e Lives são ignorados. Uma regra por evento; regras mais antigas têm prioridade em sobreposição.
- Uma resposta privada por comentário, expira após sete dias do timestamp do evento Meta. DM expira 24h após o timestamp recebido. Continuações e acompanhamento só são enviados depois de uma interação por mensagem e dentro de 24 horas do último evento recebido.
- Resultado desconhecido de envio é marcado incerto e não é repetido automaticamente para evitar duplicações. Falhas conhecidas também exigem novo teste após correção. Não há garantia de entrega.
- Limite local conservador de 60 operações aceitas/incertas por hora; não representa a cota oficial da Meta. Conexões simultâneas podem ultrapassar levemente esse limite local; limites da Meta continuam sendo aplicados pela plataforma.
- Jobs pendentes são cancelados ao pausar a regra no próximo dreno. Um envio já em andamento pode concluir.
- O uso real precisa caber nos limites de CPU, solicitações, banco e armazenamento do plano Free. O kit não cria serviços pagos; ao atingir limites, o serviço pode falhar.
- Licenças são verificadas na ativação e depois com cache de até cinco minutos. Suspensão/removal no servidor bloqueia os próximos envios após o cache vencer; envio em andamento pode concluir. Falhas de rede após o cache vencer também bloqueiam os envios. Quem controla o código e a hospedagem ainda pode remover a verificação; não é proteção inviolável.
- Em produção, mantenha o contato da página de privacidade atualizado e atenda pedidos de exclusão. Para excluir dados de um participante, use consultas parametrizadas no D1 ou a opção de apagar todo o histórico no painel. Backups seguem as políticas da Cloudflare.

## Desenvolvimento local

```
npm ci
```

Copie `.dev.vars.example` para `.dev.vars` (somente desenvolvimento local). Depois:

```
npm run types
npm run db:local
npm run dev
```

Abra o endereço exibido. Credenciais fictícias servem apenas para testar telas. OAuth e eventos reais exigem um endereço público e configuração Meta válida.

## Verificação e publicação manual

```
npm run types
npm run check
npm test
npx wrangler deploy --dry-run
```

Para publicação manual: crie um D1, substitua o ID e nome em wrangler.jsonc, aplique `npm run db:remote`, publique com `npm run deploy` e registre APP_KEY e ADMIN_PASSWORD com `wrangler secret put`. Sem esses secrets, a API retorna instalação incompleta.

## Antes de distribuir às alunas

Valide a publicação em sua conta, o OAuth e um envio real com outra conta de teste, inclusive deduplicação e pausa. Faça o teste de público real após obter os níveis de acesso exigidos pela Meta. Instalação própria não elimina automaticamente App Review ou verificação de negócio.

## Fontes técnicas

- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/d1/worker-api/prepared-statements/
- https://developers.cloudflare.com/workers/wrangler/commands/
- https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login

Nenhum aplicativo, hospedagem ou assinatura é provisionado simplesmente ao baixar o kit. O instalador realiza ações somente quando executado pela titular da conta.

## Perfis, aparência e aplicativo instalado

No rodapé do menu, clique no perfil para conectar outra conta em nova aba ou alternar entre perfis. Ao voltar da autorização, clique em Atualizar contas. Automações, contatos e conversas pertencem ao perfil selecionado. Todos usam o mesmo aplicativo Meta configurado nesta instalação. O nome e a foto disponíveis na Meta aparecem na prévia; se não houver foto disponível, aparece a inicial.

Tema claro/escuro fica salvo neste navegador. Instalar aplicativo abre guias específicos para Windows (Edge/Chrome), Android (Chrome) e iPhone/iPad (Safari). O botão nativo aparece quando o navegador permite. É um aplicativo web instalado pelo navegador, com o ícone fornecido; precisa de internet. Não há publicação em lojas de aplicativos.

## Licença suspensa

Esta entrega dispensa licença por padrão, sem TEST_ACCESS_UNTIL. A verificação central só volta se a responsável configurar LICENSE_ENFORCEMENT=enabled. Nesse modo, a integração central anterior e a exceção temporária voltam a valer. Não altere APP_KEY ou ADMIN_PASSWORD.
