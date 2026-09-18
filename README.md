# Central de Ajuda ao Candidato — SophIA

Site completo e estático, pronto para GitHub Pages. Versão 1.0.0 · setembro de 2026.

## Publicar com GitHub Desktop

1. Crie ou abra o repositório que será usado para a central de ajuda.
2. Extraia o ZIP e copie **o conteúdo da pasta `sophia-ajuda`** para a pasta local desse repositório. O `index.html` deve ficar **na raiz**, junto com `styles.css`, `app.js` e `config.js`.
3. No GitHub Desktop, confira os arquivos, faça **Commit to main** e depois **Publish repository** ou **Push origin**.
4. No site do GitHub, abra o repositório e entre em **Settings → Pages**.
5. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
6. Escolha a branch **main**, a pasta **/(root)** e clique em **Save**.
7. Aguarde a publicação e abra o endereço que o GitHub mostrar em Pages.

Não é necessário executar npm, instalar dependências, contratar um servidor ou gerar uma pasta de build. O GitHub Pages publica diretamente o HTML, CSS, JavaScript e a imagem. O arquivo `.nojekyll` foi incluído para publicação estática.

Todos os caminhos dos arquivos são relativos. Isso permite usar tanto um endereço de repositório do GitHub Pages quanto um domínio próprio. O ZIP não inclui `CNAME`, para não vincular a nova central ao domínio do site comercial. Se desejar um domínio próprio, configure o endereço correto em Pages e no seu DNS.

Orientação oficial: [configurar a origem de publicação no GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## O que está incluído

- **49 perguntas**, organizadas em seis assuntos.
- Busca sem diferenciar acentos ou maiúsculas, com palavras relacionadas aos problemas mais comuns.
- Ajuda guiada com opções, navegação para voltar e caminhos para continuar buscando ajuda.
- Conferência do **formato** do código, sem alterar o trecho depois do hífen e sem consultar vagas.
- Checagem local de tamanho, identificação do tipo e início de PDF, sem transmitir o arquivo.
- Orientações sobre Word → PDF, limite de 5 MB, permissões, pop-ups, vídeo de 40 segundos, CORE10, áudio, cadastro, tempo, retomada e nova entrevista.
- Separação entre suporte de uso da plataforma e assuntos da empresa contratante.
- Links diretos para perguntas e botão para copiar a URL de cada resposta.
- Layout adaptável, navegação por teclado, foco visível, respeito à preferência por movimento reduzido e perguntas acessíveis mesmo com JavaScript desativado.
- Identidade visual baseada nos arquivos enviados do site SophIA: cores, marca, avatar, tipografia, cabeçalho e rodapé.

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html` | Página inteira, perguntas, respostas e modelos das ferramentas locais. |
| `styles.css` | Identidade visual e adaptações para celular e computador. |
| `app.js` | Busca, filtros, ajuda guiada, menu, links diretos e conferidores. |
| `config.js` | Links institucionais e contatos públicos. |
| `assets/sophia.webp` | Avatar original fornecido no site de referência. |
| `.nojekyll` | Publicação estática no GitHub Pages. |
| `package.json` e `preview.mjs` | Prévia local opcional com Node; não são necessários à publicação. |
| `docs/ANALISE_APP.md` | Análise funcional e observações do app enviado. |
| `docs/VALIDACAO.md` | Escopo e resultado das verificações. |

## Conferir antes de divulgar

Os contatos e dados institucionais foram copiados do site de referência enviado: `contato@starmindai.ai`, WhatsApp `(11) 4040-9152` e CNPJ `41.233.730/0001-10`. O arquivo `config.js` permite atualizar os principais links e contatos na interface. Ao trocar contatos, atualize também os valores de fallback no HTML, para leitores sem JavaScript.

O app fornecido já contém um link de dúvidas para `https://sophiaresponde.starmindai.ai/`. Se essa for a central que substituirá aquele endereço, configure esse domínio para o novo repositório. Se preferir outro endereço, ajuste o link “Dúvidas?” no app de entrevistas quando publicar. **O aplicativo de entrevistas não foi modificado neste trabalho.**

O site orienta o candidato a voltar ao convite original para participar. Não existe redirecionamento para um app genérico, pois o link correto pode variar conforme o convite.

## Atualizar o conteúdo

As perguntas e respostas ficam no `index.html`, em elementos `<details>` com IDs iniciados por `faq-`. Você pode editar o texto diretamente. A ajuda guiada reutiliza o conteúdo dessas respostas; não há uma segunda cópia para manter.

Ao adicionar uma pergunta, defina um ID único, `data-category` e palavras de busca em `data-keywords`. As categorias disponíveis são `code`, `pdf`, `camera`, `interview`, `recruiter` e `before`. Os filtros calculam os resultados a partir do conteúdo; atualize os números dos botões no HTML ao incluir ou excluir perguntas. Se quiser incluir a nova pergunta na ajuda guiada, adicione `q:ID-SEM-O-PREFIXO-faq` em `groups`, no `app.js`.

Os limites e comportamentos foram conferidos na **versão 2.0.3 do app fornecido**. Se mudar o limite do PDF, a gravação de vídeo, a duração ou a lógica da entrevista, revise as respostas e os conferidores. O padrão de quatro letras maiúsculas, hífen e código da empresa foi estabelecido pelo proprietário do produto.

## Dados e limites

Não há backend, conexão com banco de candidatos, chatbot de IA, analytics, pixels nem formulário que envie dados. Não são usados cookies ou armazenamento persistente por este código. A hospedagem pode manter seus próprios registros de acesso. Links externos seguem as políticas dos respectivos serviços.

O código digitado permanece na página. O PDF é lido localmente apenas para uma checagem básica: tamanho, tipo informado pelo navegador e os primeiros 12 bytes. O site não converte, comprime, armazena ou envia o currículo e não garante a integridade do PDF nem a aceitação no app. Ao sair dessa ferramenta, seu resultado é descartado.

A conferência de código não confirma que a vaga existe, está aberta ou corresponde ao convite. As respostas de “Essa orientação ajudou?” apenas mudam o conteúdo exibido, sem registrar avaliações em um servidor.

Nunca adicione chaves OpenAI, tokens, credenciais Supabase ou dados de candidatos ao repositório público. Este pacote não contém o backend nem os arquivos originais do aplicativo.

## Prévia local opcional

Você pode abrir `index.html` diretamente no navegador. Para conferir por HTTP, se tiver Node.js 18 ou superior:

```bash
npm run dev
```

Abra o endereço mostrado no terminal. A prévia usa apenas módulos nativos do Node e não requer `npm install`. Para verificar a sintaxe:

```bash
npm run check
```

O servidor de prévia não realiza entrevistas, não recebe uploads e não é usado pelo GitHub Pages.
