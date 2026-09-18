# Análise do app e decisões para a central de ajuda

Base analisada: `sophiatextowhatsecurity-main(1).zip`, aplicativo SophIA Texto **2.0.3**. Referência visual: `sophia-main(1).zip`. Data: 18/09/2026.

## Escopo e conclusão

A análise acompanhou o fluxo do navegador até as regras do servidor: tela pública, gravações, upload, motor de entrevista, consulta de vaga, sessões persistentes, integração de relatórios, tratamento de erros e testes existentes. A central foi construída com base nesse pacote e nas regras comerciais informadas pelo proprietário. Não foi feita uma entrevista em produção nem uma consulta aos bancos ou contas reais.

O app oferece um fluxo de conversa por texto e áudio no navegador. A navegação e os nomes de funções têm inspiração em mensageria, mas **essa versão não integra a API do WhatsApp**. Não se deve orientar o candidato a enviar currículo ou respostas a um número de WhatsApp para concluir a entrevista.

As principais fontes de dificuldade para o candidato são: código copiado incorretamente; currículo em formato ou tamanho incompatível; permissões de câmera e microfone; diferença entre selecionar e enviar; cronômetro global; retomada confundida com uma nova entrevista; e expectativa de obter informações da contratação com o fornecedor da tecnologia.

## 1. Fluxo confirmado no código

| Etapa | Comportamento observado | Orientação usada no site |
| --- | --- | --- |
| Apresentação | Vídeo do YouTube e botão Iniciar Entrevista. | Preparar os dados antes de iniciar; o vídeo inicial é diferente da gravação do candidato. |
| Consentimento | A sessão e o prazo são criados antes da resposta; recusa encerra a sessão. A mensagem declara mais de 18 anos. | Ler os termos e não confirmar uma declaração de idade incorreta. |
| Código | Consulta `job_descriptions.codigo` por igualdade, sem converter o texto para maiúsculas. | Copiar o código recebido, preservando o trecho após o hífen. |
| Currículo | Solicitado quando `anexar_curriculo_obrigatorio` está ativo; avanço depende do upload. | Anexar PDF verdadeiro de até 5 MB; um link não substitui o arquivo. |
| Cadastro | Nome, e-mail, telefone, CPF, CEP, número/complemento e salário/pretensão. | Um dado por pergunta; cadastro digitado; conferir antes de enviar. |
| CEP | Consulta ViaCEP; após duas falhas, segue sem bloquear o candidato. | Repetir corretamente uma vez e seguir a mensagem da tela. |
| Salário | Aceita a opção `pular`. | É possível pular; a informação não representa a oferta da vaga. |
| Vídeo | Ativado por `video`; pergunta configurável; até 40 segundos. | Autorizar câmera e microfone, preparar a fala antes de gravar e aguardar confirmação. |
| CORE10 | Ativado por `testecomportamental`; dez situações; A/B/C/D por texto/botões. | Responder com sinceridade; microfone ausente é esperado. |
| Técnica | Roteiro preparado por IA; texto ou áudio transcrito; controle de pergunta pelo servidor. | Responder ao que foi perguntado e distinguir reformulação de falha técnica. |
| Encerramento | Por conclusão, prazo, recusa, desistência ou sequência de respostas inválidas. | Conferir confirmação de salvamento; encerramento não informa aprovação. |
| Experiência | Nota opcional inteira de 5 a 10, após conclusão confirmada. | A nota é sobre a experiência com o app, não sobre o candidato. |

Fontes locais: `src/interview.js`, `src/interviewService.js`, `src/inputPolicy.js`, `src/database.js`, `public/index.html` e `public/script.js`, no ZIP original.

## 2. Código da vaga

A consulta usa `.eq('codigo', codigo)` e não aplica conversão de caixa. O motor remove espaços nas extremidades da resposta, mas não reconstrói um código digitado de forma incorreta. O campo aceita até 128 caracteres. Erro de consulta é tratado separadamente de código não encontrado.

O padrão **quatro letras maiúsculas + hífen + código exato da empresa** veio da instrução do proprietário. O backend desta versão não contém uma expressão regular que imponha esse formato por si só: busca o valor cadastrado. A central explica o padrão de operação, mas não afirma que a conferência local valida a vaga.

O exemplo `ABCD-Vaga01` é explicitamente fictício. Não foi aplicado `text-transform: uppercase`, autocorreção ou conversão automática ao campo de conferência: isso poderia alterar o sufixo e induzir o mesmo erro que queremos evitar. O conferidor verifica somente estrutura, limite e alguns caracteres invisíveis. A conferência real continua sendo a comparação com o convite e a consulta feita no aplicativo.

## 3. Currículo PDF

O limite real é **5 × 1024 × 1024 bytes (5.242.880)**, apresentado como 5 MB. Há verificações no navegador, no recebimento multipart e em `src/media.js`.

A validação do servidor verifica tamanho, tipo `application/pdf` e a assinatura inicial `%PDF-`. Um Word renomeado para `.pdf` pode passar pela seleção inicial do navegador, mas falha na verificação de conteúdo. A assinatura inicial não prova que todas as páginas estejam íntegras; por isso a central orienta abrir o documento.

O site oferece instruções para exportar pelo Word/Google Docs, reduzir imagens grandes e localizar o arquivo no celular. O conferidor local lê somente tamanho, tipo informado pelo navegador e os primeiros 12 bytes. Não consulta o servidor, não faz upload e não se apresenta como certificação completa do documento. O limite é calculado em bytes, não a partir do tamanho arredondado exibido.

PDF com senha é tratado como uma questão de acesso/legibilidade para quem vai receber. Não foi criada uma alegação de que o backend valida criptografia: ele não faz essa análise completa.

## 4. Vídeo, microfone e pop-ups

`public/script.js` usa `navigator.mediaDevices.getUserMedia` com **vídeo e áudio**. As duas permissões são necessárias para essa gravação. O vídeo é apresentado na própria tela; não há `window.open` para iniciar a gravação. Portanto, liberar pop-ups não é equivalente a liberar câmera ou microfone.

As respostas da central separam:

- Permissões no Android/Chrome, iPhone/Safari e computador.
- Pop-ups de links externos, somente quando o navegador realmente indicar bloqueio.
- Gravação do candidato, com limite de 40 segundos e envio ao parar ou ao atingir o limite.
- Vídeo inicial do YouTube, que é outro recurso.
- Problemas de dispositivo, navegador interno e câmera ocupada.

A versão aceita **recusar ou pular o vídeo**. Além disso, uma falha na abertura dos dispositivos pode avançar automaticamente para as perguntas. A central não promete que essa ausência seja indiferente para a avaliação da empresa.

Não existe revisão do vídeo antes do envio nem mecanismo normal para substituir um vídeo já recebido. Nova tentativa pode aparecer diante de erro técnico. O limite de upload de vídeo no servidor é 50 MB, embora a principal orientação ao candidato seja o tempo de 40 segundos.

As instruções de navegador foram conferidas em páginas oficiais de Google e Apple, vinculadas às respostas. Os nomes de menus podem variar por versão.

## 5. Texto, áudio, cadastro e CORE10

`src/inputPolicy.js` permite áudio nas etapas de consentimento, consentimento de vídeo e entrevista técnica. O serviço possui uma rota separada para áudio da nota final. Dados cadastrais e CORE10 recusam áudio no servidor, além de ocultarem o botão na interface.

O telefone é normalizado para dígitos e exige 10 ou 11. Por isso a orientação evita `+55`, que aumentaria a contagem. O CPF exige 11 dígitos e recusa sequências repetidas, mas **não implementa uma verificação completa dos dígitos verificadores**. A central pede o CPF real, sem sugerir que a aceitação confirme a identidade.

A resposta digitada é enviada com Enter; Shift + Enter insere linha. As respostas enviadas não têm botão de edição. O candidato deve aguardar a confirmação do áudio e pode cancelá-lo antes do envio. O limite padrão de áudio é 20 MB, configurável; por isso não foi apresentado como regra universal no conteúdo de ajuda.

O CORE10 possui exatamente dez situações, com alternativas A/B/C/D e distribuição nos fatores C/O/R/E. O site explica como responder, sem ensinar a manipular um resultado ou tratar esse teste como diagnóstico.

## 6. Prazo, persistência e novas entrevistas

O cronômetro é **global**. Começa quando a sessão é criada, na apresentação do consentimento, e inclui cadastro, currículo, vídeo, CORE10 e técnica. O valor padrão do pacote é 12 minutos, mas a variável de ambiente permite outra duração. O site utiliza a orientação “veja Tempo Restante”, evitando fixar uma duração que pode estar diferente em produção.

Não existe pausa. Atualização de página, troca de aba, consulta à ajuda ou falha de conexão não repõe minutos. Há uma tolerância técnica padrão de 120 segundos para finalização, mas ela não é tempo extra para novas perguntas; portanto não é apresentada ao candidato como extensão do prazo.

A sessão é persistida no servidor e identificada no navegador por `sophia.text.session.v2`, em `localStorage`. A retomada depende de conservar essa identificação e usar o mesmo contexto de acesso. Os dados já confirmados podem ser recuperados; gravações pendentes ainda em memória podem ser perdidas ao fechar ou atualizar. A central não promete recuperar tudo em qualquer dispositivo.

O botão **Nova entrevista** pede confirmação, encerra a sessão ativa e volta à apresentação. Os registros enviados não são apagados. A próxima sessão recebe outra identidade. Abrir outra aba ou somente recarregar pode retomar a sessão anterior, incluindo uma já concluída. A central mostra o caminho explícito para nova vaga e orienta confirmar com a empresa a possibilidade de repetir a mesma vaga.

## 7. Processamento e confirmação

O serviço usa credencial da sessão, revisões, bloqueio de concorrência e identificadores de requisição para reduzir duplicidade e impedir que uma resposta seja associada inadvertidamente à pergunta de outra aba. A sincronização do relatório pode ficar pendente e gerar um erro recuperável. A interface distingue entrevista encerrada de conclusão com salvamento confirmado.

Por isso a central orienta usar **Tentar novamente**, conferir a pergunta atual e não iniciar outra sessão ou limpar o navegador para “destravar” uma mídia pendente.

O código aguarda a transcrição e as chamadas de geração de IA no processamento da requisição. O planejamento técnico começa ao chegar à etapa técnica, depois do vídeo/CORE10 quando existentes. **Este pacote não antecipa as perguntas ao momento de digitar o código nem implementa uma fila durável de geração em segundo plano.** O tempo de processamento e os limites da hospedagem merecem acompanhamento separado. A central não promete uma latência ou disponibilidade que o código não garante.

## 8. Responsabilidades e privacidade

O site distingue dúvidas de operação e dúvidas sobre a seleção. Código correto, salário, benefícios, contrato, local de trabalho, etapas, resultado e nova tentativa são assuntos da empresa/recrutador. Os contatos institucionais da StarMind são apresentados para dificuldades no uso da plataforma.

O backend fornecido não implementa disparo de e-mail de conclusão. Sistemas relacionados podem fazê-lo, mas isso não é comprovado pelo pacote. A ajuda orienta acompanhar a mensagem na tela e não repetir a entrevista só pela ausência de e-mail.

A central não recebe dados de entrevista, não se conecta ao Supabase/OpenAI e não coleta currículo ou gravações. Os links institucionais vieram do site fornecido. A política vinculada no consentimento do aplicativo real continua sendo a referência aplicável à participação.

## 9. Observações para uma revisão futura do app

Estas observações não foram implementadas, pois o escopo desta entrega é a central de ajuda:

1. **Pedido de vídeo contraditório:** o texto diz que é necessário, mas permite recusa e avanço. Pode causar receio no candidato. Convém alinhar a linguagem com a regra comercial adotada pela empresa.
2. **Falha de câmera avança a etapa:** não há oportunidade consistente de corrigir a permissão antes de pular. Uma revisão futura pode tornar essa decisão mais explícita ao candidato.
3. **Tempo gasto antes das perguntas:** o cadastro e a preparação consomem o prazo global. Isso aumenta a importância do preparo e pode demandar revisão de duração ou de regra de início, se for a intenção do produto.
4. **Consentimento/idade:** a mensagem exige uma declaração específica; o app não coleta data de nascimento nem possui um fluxo distinto para candidatos fora dessa declaração. A empresa deve orientar casos como jovem aprendiz.
5. **Política de privacidade:** o fallback em `src/config.js`/`src/interview.js` usa um domínio de exemplo. É necessário conferir a variável real na implantação. O pacote não prova como ela está configurada em produção.
6. **PDF:** assinatura inicial e MIME são uma proteção básica, não validação completa do documento. Diferenças de tipo retornado por alguns navegadores também podem causar rejeição de um PDF legítimo.
7. **Retomada:** o uso de uma chave única do navegador explica por que um candidato pode voltar à entrevista antiga. A UX de Nova entrevista e as regras de convites específicos merecem atenção em versões futuras.
8. **Geração síncrona:** chamadas aguardadas no mesmo pedido HTTP podem esbarrar em latência/limites da infraestrutura. Não se deve descrever este pacote como processamento antecipado em segundo plano.
9. **Mensagens finais semelhantes:** conclusão, desistência e prazo usam texto final genérico semelhante. O estado interno diferencia os motivos, mas a mensagem ao candidato pode gerar dúvida sobre término completo.
10. **Rodapé do app:** o HTML enviado ainda mostra 2025. A central nova usa 2026 e atualização automática do ano.
11. **Documentação do pacote original:** o README manda copiar `.env.example`, mas esse arquivo não aparece no ZIP recebido. Isso não afeta a central estática, porém merece ajuste no pacote do app.
12. **Acesso aos arquivos:** o backend persiste URLs no formato público e usa URLs assinadas para reprodução autorizada. A exposição efetiva depende das políticas do bucket real, que não foram inspecionadas. Não se conclui segurança de armazenamento apenas pelo código.

## 10. Verificação realizada

Foram executados 67 testes existentes, sem chamadas aos serviços reais, nos arquivos `engine.test.js`, `media.test.js`, `service.test.js`, `compatibility.test.js` e `ai-flow-regression.test.js`: **67 passaram, zero falharam**. Os testes cobrem regras, fluxos, mídia, recuperação e compatibilidade. Não foi executada a suíte HTTP que depende da instalação completa do backend nem uma homologação com contas reais.

As verificações da central de ajuda estão em `VALIDACAO.md`. Os arquivos originais de entrevista foram mantidos sem alterações.
