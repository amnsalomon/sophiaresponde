# Verificações da entrega

Central SophIA 1.0.0 · 18/09/2026.

## Aplicativo de referência

- Inspeção das regras no navegador, servidor, motor, serviço, mídia e persistência.
- Execução de cinco arquivos de testes existentes do app: motor, mídia, serviço, compatibilidade e regressões de IA.
- Resultado: **67 testes passaram; zero falhas**.
- Dependências externas nesses testes são simuladas. Não houve chamada ao Supabase, OpenAI ou ViaCEP reais, nem entrevista de produção.
- A suíte HTTP do backend não foi executada. A central entregue não altera o app original.

## Central de ajuda

| Verificação | Resultado |
| --- | --- |
| Sintaxe de `app.js`, `config.js` e `preview.mjs` | Aprovada com `node --check`. |
| 49 perguntas e IDs únicos | Conferidos. |
| Arquivos locais referenciados no HTML | Todos presentes. |
| Âncoras e respostas usadas na ajuda guiada | Todos os destinos existentes. |
| Identidade visual | Conferida no navegador, com marca, avatar, cores, cabeçalho e rodapé. |
| Layout desktop | Inspecionado no navegador, sem rolagem horizontal. |
| Layout estreito | Inspecionado em um quadro de 390 px; conteúdo útil de 375 px com barra de rolagem, sem largura excedente. |
| Menu de celular | Abre, navega e fecha corretamente. |
| Ajuda para código e currículo | Caminhos e respostas conferidos por interação. |
| Prefixo minúsculo no código | Recebe orientação de correção. |
| `ABCD-Vaga01` | Formato aceito, com aviso explícito de que não valida uma vaga; o sufixo permanece inalterado. |
| Busca com acentos | `código inválido` encontra a orientação aplicável. |
| Busca sem resultados | Exibe orientação e botão para restaurar todas as perguntas. |
| Filtro de câmera e vídeo | Exibe as nove dúvidas da categoria. |
| Arquivo renomeado para `.pdf` | Rejeitado na checagem da assinatura inicial. |
| Arquivo acima de 5 MB | Rejeitado, inclusive quando o excesso é pequeno. A exibição evita aparentar estar exatamente no limite. |
| Arquivo de teste com assinatura PDF e tamanho permitido | Mostra compatibilidade básica e ressalva sobre integridade, senha e envio no app. Não o declara um documento totalmente válido. |
| Link interno para uma pergunta | Abre a resposta correta e restaura a visibilidade quando necessário. |
| Copiar link de resposta | Confirmado no navegador. |
| Hospedagem em subpasta | Recursos e interações carregados sob um caminho de repositório na prévia. |
| Ausência de transmissão pelos conferidores | Código inspecionado: sem fetch, XHR, beacon, câmera, microfone ou armazenamento persistente. |
| Links externos em nova aba | Protegidos por `noopener noreferrer`. |
| Credenciais | Nenhuma chave ou credencial dos sistemas originais foi incluída. |

## Limites da verificação

O quadro estreito verifica o layout responsivo e as interações em largura de celular; não equivale a homologação física em todos os aparelhos Android/iPhone. Câmera e microfone não são utilizados por esta central — ela explica como autorizá-los no aplicativo de entrevista.

A publicação no repositório e a configuração de domínio serão feitas pelo proprietário, conforme solicitado. Não foi validado um endereço final do GitHub Pages. Os links e contatos institucionais foram preservados da referência fornecida; não foi realizado contato com suporte nem enviada mensagem para terceiros.

As perguntas ficam no HTML e podem ser abertas sem JavaScript. Busca, filtros, menu compacto e ferramentas guiadas dependem de JavaScript. A checagem básica de PDF não substitui a validação de um leitor de PDF ou a aceitação pelo aplicativo.
