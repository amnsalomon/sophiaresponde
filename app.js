/* Central estática: nenhuma API, envio de arquivo, gravação ou persistência de dados. */
"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const questions = Array.from(document.querySelectorAll("#faq-list details"));
  const guide = $("guide-main");
  const search = $("search");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const groupLabels = { code: "Código da vaga", pdf: "Currículo em PDF", camera: "Câmera, vídeo e permissões", interview: "Durante a entrevista", recruiter: "Vaga, resultado e contato", before: "Antes de começar" };
  const groups = {
    root: { title: "Qual parte está gerando dúvida?", intro: "Toque em uma opção. Você não precisa conhecer termos técnicos.", options: [
      ["Não consigo usar o código da vaga", "code"], ["Preciso enviar meu currículo", "pdf"], ["Câmera, vídeo ou microfone", "camera"], ["Algo aconteceu na entrevista", "interview"], ["Quero saber sobre a vaga", "recruiter"], ["Ainda vou começar", "before"]
    ] },
    code: { title: "O que aconteceu com o código?", intro: "Use sempre o código completo enviado pela empresa.", options: [
      ["Quero conferir como preencher", "q:codigo-formato"], ["Apareceu código inválido", "q:codigo-invalido"], ["Não recebi o código", "q:sem-codigo"], ["Apareceu outra vaga", "q:vaga-errada"]
    ] },
    pdf: { title: "Qual é a dificuldade com o currículo?", intro: "O app recebe PDF de até 5 MB. Vamos conferir o seu caso.", options: [
      ["Quero conferir meu arquivo", "q:pdf-regras"], ["Não sei como anexar", "q:pdf-enviar"], ["Meu currículo está no Word", "q:pdf-converter"], ["O arquivo tem mais de 5 MB", "q:pdf-grande"], ["Não encontro o arquivo no celular", "q:pdf-nao-aparece"], ["O envio continua dando erro", "q:pdf-erro"], ["Quero continuar sem currículo", "q:pdf-obrigatorio"]
    ] },
    camera: { title: "Em qual parte você precisa de ajuda?", intro: "Permissão de câmera e microfone é diferente de permissão de pop-ups.", options: [
      ["Preciso liberar câmera e microfone", "device"], ["Apareceu pop-up bloqueado", "q:popups"], ["Quero entender como gravar", "q:video-gravar"], ["Quero continuar sem vídeo", "q:video-pular"], ["Quero refazer o vídeo", "q:video-refazer"], ["A câmera continua sem funcionar", "q:camera-nao-funciona"], ["O vídeo inicial não carrega", "q:video-inicial"], ["Não encontro o botão de áudio", "q:microfone-sumiu"]
    ] },
    device: { title: "Em qual aparelho está a entrevista?", intro: "As permissões devem ser ajustadas no site da entrevista.", options: [
      ["Celular Android", "q:camera-android"], ["iPhone ou iPad", "q:camera-iphone"], ["Computador ou notebook", "q:camera-computador"]
    ] },
    interview: { title: "O que você precisa resolver?", intro: "Confira a situação e siga a orientação correspondente.", options: [
      ["Cadastro ou teste CORE10", "registration"], ["Responder por texto ou áudio", "q:audio"], ["Tempo restante ou prazo encerrado", "time"], ["Falha, travamento ou internet", "connection"], ["Retomar ou iniciar outra entrevista", "session"], ["Conclusão e confirmação", "completion"], ["Corrigir um dado ou resposta", "q:corrigir"]
    ] },
    registration: { title: "Em qual pergunta do cadastro?", options: [
      ["Como preencher meus dados", "q:cadastro"], ["CPF, telefone ou e-mail recusado", "q:cpf-telefone"], ["CEP não encontrado", "q:cep"], ["Salário e pretensão salarial", "q:pretensao"], ["Teste comportamental CORE10", "q:core10"], ["O microfone sumiu", "q:microfone-sumiu"]
    ] },
    time: { title: "Qual é a dúvida sobre o tempo?", options: [
      ["Quando começa? Posso pausar?", "q:tempo"], ["O tempo acabou antes de terminar", "q:tempo-acabou"], ["Preciso de uma adaptação", "q:acessibilidade"]
    ] },
    connection: { title: "Qual mensagem aparece para você?", options: [
      ["Processando ou sem conexão", "q:conexao"], ["Atualizei ou fechei a página", "q:atualizar"], ["A pergunta foi repetida", "q:pergunta-repetida"], ["Muitas requisições ou limite", "q:muitas-tentativas"], ["Não foi possível salvar no final", "q:conclusao"]
    ] },
    session: { title: "Você quer continuar ou começar outra?", options: [
      ["Continuar a entrevista atual", "q:atualizar"], ["Fazer uma nova entrevista", "q:nova-entrevista"], ["Usar outro aparelho ou aba", "q:outro-aparelho"], ["Apareceu a vaga errada", "q:vaga-errada"]
    ] },
    completion: { title: "O que aconteceu no final?", options: [
      ["Quero confirmar se foi salva", "q:conclusao"], ["Não recebi e-mail", "q:email-conclusao"], ["Apareceu uma nota de 5 a 10", "q:feedback"], ["Quero saber o resultado", "q:resultado"], ["Quero fazer outra entrevista", "q:nova-entrevista"]
    ] },
    recruiter: { title: "Qual informação você está procurando?", intro: "Condições da vaga e decisões da seleção são da empresa contratante.", options: [
      ["Salário, contrato e benefícios", "q:vaga-condicoes"], ["Resultado ou próxima etapa", "q:resultado"], ["Contato do recrutador", "q:contato-empresa"], ["Código para participar", "q:sem-codigo"], ["Meus dados e privacidade", "q:privacidade"], ["Suporte para um erro técnico", "q:ajuda-tecnica"]
    ] },
    before: { title: "Vamos preparar a sua entrevista?", options: [
      ["O que separar antes de começar", "q:antes-comecar"], ["Como funciona a entrevista", "q:como-funciona"], ["Link, navegador ou instalação", "q:onde-acessar"], ["Autorização e idade", "q:idade-consentimento"], ["Preciso de uma adaptação", "q:acessibilidade"]
    ] }
  };
  let path = ["root"];
  let activeCategory = "all";
  let searchTimer;
  let toastTimer;
  let fileRun = 0;
  const indexes = questions.map((element) => ({
    element, title: normalize(element.querySelector("summary").textContent),
    text: normalize(element.textContent + " " + element.dataset.keywords), category: element.dataset.category
  }));
  const synonyms = {
    cv: "curriculo", curriculum: "curriculo", curriculo: "curriculo", camera: "camera", microfone: "microfone", webcam: "camera",
    popups: "pop", popup: "pop", "pop-up": "pop", codigo: "codigo", invalid: "invalido", video: "video", gravacao: "gravacao",
    travou: "trav", travado: "trav", travando: "trav", lento: "lento", audio: "audio", atualizar: "atualiz", atualizado: "atualiz",
    salario: "salario", pdf: "pdf", curriculos: "curriculo", permissao: "permis", permissoes: "permis"
  };
  const stopWords = new Set(["a","o","as","os","um","uma","de","da","do","das","dos","no","na","nos","nas","em","e","ou","com","por","para","eu","me","meu","minha","meus","minhas","que","qual","como","quando","porque","pq","preciso","quero","consigo","nao","esta","estou","foi","tenho","tem","mais","posso","fazer","faz","ao","se","so","muito","oquefazer"]);
  function filterQuestions() {
    const raw = search.value.trim();
    const clean = normalize(raw);
    const terms = clean.split(/[^a-z0-9-]+/).filter((term) => term && !stopWords.has(term)).map((term) => synonyms[term] || term);
    let count = 0;
    for (const item of indexes) {
      const categoryMatches = activeCategory === "all" || item.category === activeCategory;
      const matches = !raw || (terms.length ? terms.every((term) => item.text.includes(term)) : item.text.includes(clean));
      const visible = categoryMatches && matches;
      item.element.hidden = !visible;
      if (visible) count++;
    }
    $("results-summary").textContent = raw ? `${count} ${count === 1 ? "resposta encontrada" : "respostas encontradas"} para “${raw}”.` : `${count} ${count === 1 ? "dúvida" : "dúvidas"}${activeCategory === "all" ? " para ajudar você" : " sobre " + groupLabels[activeCategory].toLowerCase()}.`;
    $("empty-state").hidden = count !== 0;
    $("clear-search").hidden = !raw && activeCategory === "all";
    document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === activeCategory)));
  }
  function resetSearch() {
    clearTimeout(searchTimer);
    search.value = "";
    activeCategory = "all";
    filterQuestions();
  }
  function scrollToElement(element, focus = false) {
    if (focus) {
      element.setAttribute("tabindex", "-1");
      element.focus({ preventScroll: true });
    }
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").hidden = false;
    toastTimer = setTimeout(() => { $("toast").hidden = true; }, 4200);
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function button(label, fn, className = "guide-choice") {
    const b = element("button", className);
    b.type = "button";
    b.append(element("span", "", label));
    if (className === "guide-choice") {
      const arrow = element("span", "", "→"); arrow.setAttribute("aria-hidden", "true"); b.append(arrow);
    }
    b.addEventListener("click", fn);
    return b;
  }
  function navigate(key, reset = false) {
    if (reset) path = ["root"];
    if (key !== path[path.length - 1]) path.push(key);
    renderGuide(true);
  }
  function renderGuide(moveFocus = false) {
    fileRun++;
    const key = path[path.length - 1];
    guide.replaceChildren();
    const toolbar = element("div", "guide-toolbar");
    if (path.length > 1) {
      toolbar.append(button("← Voltar", () => { path.pop(); renderGuide(true); }, "guide-back"));
      toolbar.append(button("Escolher outro assunto", () => { path = ["root"]; renderGuide(true); }, "guide-reset"));
    } else toolbar.append(element("p", "guide-crumb", "AJUDA PASSO A PASSO"));
    guide.append(toolbar);
    let title;
    if (key.startsWith("q:")) {
      const id = key.slice(2);
      const source = $("faq-" + id);
      if (!source) { path = ["root"]; renderGuide(moveFocus); return; }
      guide.append(element("p", "guide-crumb", groupLabels[source.dataset.category]));
      title = element("h3", "guide-title", source.querySelector("summary > span").textContent);
      guide.append(title);
      const answer = source.querySelector(".answer").cloneNode(true);
      answer.querySelector(".answer-meta")?.remove();
      guide.append(answer);
      if (["codigo-formato", "codigo-invalido"].includes(id)) {
        guide.append($("code-tool").content.cloneNode(true));
        $("code-form").addEventListener("submit", checkCode);
      }
      if (["pdf-regras", "pdf-grande", "pdf-erro"].includes(id)) {
        guide.append($("pdf-tool").content.cloneNode(true));
        $("pdf-file").addEventListener("change", checkPdf);
      }
      const link = element("a", "guide-view-question", "Ver esta resposta nas dúvidas frequentes");
      link.href = "#faq-" + id;
      guide.append(link);
      const feedback = element("div", "feedback");
      feedback.append(element("span", "", "Essa orientação ajudou?"));
      feedback.append(button("Sim, ajudou", () => showFeedback(true, source.dataset.category), "feedback-button"));
      feedback.append(button("Ainda preciso de ajuda", () => showFeedback(false, source.dataset.category), "feedback-button"));
      guide.append(feedback);
    } else {
      const group = groups[key] || groups.root;
      title = element("h3", "guide-title", group.title);
      guide.append(title);
      if (group.intro) guide.append(element("p", "", group.intro));
      const options = element("div", "guide-options");
      group.options.forEach(([label, target]) => options.append(button(label, () => navigate(target))));
      guide.append(options);
    }
    title.setAttribute("tabindex", "-1");
    if (moveFocus) {
      title.focus({ preventScroll: true });
      scrollToElement(guide);
    }
  }
  function showFeedback(helped, category) {
    guide.querySelector(".guide-status")?.remove();
    const status = element("div", "guide-status");
    status.setAttribute("role", "status");
    if (helped) {
      status.append(element("p", "", "Que bom! Volte à aba da entrevista quando estiver pronto. Use o link original do seu convite."));
      status.append(button("Tenho outra dúvida", () => navigate("root", true), "text-link"));
    } else {
      status.append(element("p", "", category === "recruiter" || category === "code" ? "Se a dúvida é sobre o código ou a vaga, procure a empresa que enviou o convite. Se há uma falha de uso, conte ao suporte em qual etapa aconteceu." : "Vamos tentar outro caminho. Se o erro continuar, o suporte pode orientar você."));
      status.append(button("Ver outras orientações", () => navigate(category, true), "text-link"));
      const contact = element("a", "", "Ver os contatos de ajuda →"); contact.href = "#contato"; status.append(contact);
    }
    guide.append(status);
    scrollToElement(status, true);
  }
  function resultBox(target, state, heading, messages) {
    if (!target?.isConnected) return;
    target.hidden = false;
    target.dataset.state = state;
    target.replaceChildren(element("strong", "", heading));
    messages.forEach((message) => target.append(element("p", "", message)));
  }
  function checkCode(event) {
    event.preventDefault();
    const value = $("job-code").value;
    const result = $("code-result");
    const problems = [];
    if (!value) problems.push("Cole o código completo que você recebeu da empresa.");
    else {
      if (value !== value.trim()) problems.push("Há espaços antes ou depois do código. Confira a mensagem original e retire o que foi acrescentado.");
      if (!/^[A-Z]{4}-/.test(value)) problems.push("O início deve ter quatro letras maiúsculas e um hífen comum (-). Não altere as letras depois do hífen.");
      if (/^[A-Z]{4}-$/.test(value) || (/^[A-Z]{4}-/.test(value) && !value.slice(5).trim())) problems.push("Falta o código da empresa depois do hífen.");
      if (value.length > 128) problems.push("O código está maior que o campo aceito pelo app. Confira se colou somente o código, sem a mensagem inteira.");
      if (/[\r\n\t\u200b-\u200d\ufeff]/.test(value)) problems.push("Há um caractere invisível ou uma quebra de linha. Copie novamente apenas o código do convite.");
    }
    if (problems.length) resultBox(result, "warning", "Vale conferir estes pontos:", problems);
    else resultBox(result, "success", "O formato básico está compatível.", ["Isso não confirma que a vaga existe ou que o código está correto. Compare a parte depois do hífen com o convite, incluindo maiúsculas, minúsculas e qualquer espaço. Depois, envie o código no app da entrevista."]);
  }
  async function checkPdf(event) {
    const file = event.target.files?.[0];
    const result = $("pdf-result");
    const thisRun = ++fileRun;
    if (!file) { result.hidden = true; return; }
    resultBox(result, "", "Conferindo no seu aparelho…", []);
    const size = (file.size / (1024 * 1024)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const problems = [];
    if (file.size === 0) problems.push("O arquivo está vazio. Salve ou baixe o currículo novamente.");
    if (file.size > 5 * 1024 * 1024) problems.push("O arquivo está acima do limite de 5 MB. Exporte uma versão menor e confira se o texto continua legível.");
    try {
      const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      if (thisRun !== fileRun || !result.isConnected) return;
      const isPdf = header.length >= 12 && String.fromCharCode(...header.slice(0, 5)) === "%PDF-";
      if (!isPdf) problems.push("O início do arquivo não foi reconhecido como PDF. Exporte um PDF pelo Word ou pelo aplicativo de origem; mudar a extensão não converte o documento.");
      if (!/\.pdf$/i.test(file.name)) problems.push("O nome não termina em .pdf. Confira se escolheu a cópia exportada no formato PDF.");
      if (isPdf && file.type !== "application/pdf") problems.push("O navegador não identificou o tipo como PDF. O app pode rejeitar esse envio. Exporte ou baixe uma nova cópia PDF e selecione-a novamente.");
      const sizeLabel = file.size > 5 * 1024 * 1024 && file.size < 5.01 * 1024 * 1024 ? "um pouco mais de 5 MB" : `${size} MB`;
      const description = `${file.name} · ${sizeLabel}`;
      if (problems.length) resultBox(result, "warning", description, problems);
      else resultBox(result, "success", description, ["Tamanho dentro de 5 MB e início reconhecido como PDF. Abra o arquivo para conferir todas as páginas. Essa checagem básica não garante integridade, ausência de senha ou aceitação pelo app.", "Para enviar, volte à entrevista, selecione o PDF e toque em Enviar Currículo. O arquivo não foi enviado por esta central."]);
    } catch (_) {
      if (thisRun !== fileRun) return;
      resultBox(result, "warning", "Não foi possível ler esse arquivo.", ["Baixe o PDF para o aparelho e selecione-o novamente. A conferência não enviou nenhum arquivo."]);
    }
  }
  function openQuestion(hash, scroll = true) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
    if (!id.startsWith("faq-")) return;
    const item = $(id);
    if (!item || !questions.includes(item)) return;
    resetSearch();
    item.open = true;
    if (scroll) {
      item.querySelector("summary").focus({ preventScroll: true });
      scrollToElement(item);
    }
  }
  function applyConfig() {
    const config = window.SOPHIA_HELP_CONFIG || {};
    document.querySelectorAll("[data-config-link]").forEach((a) => {
      try { const url = new URL(config[a.dataset.configLink]); if (url.protocol === "https:") a.href = url.href; } catch (_) { /* Mantém o link original. */ }
    });
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail || "")) {
      document.querySelectorAll('[data-support="email"]').forEach((a) => {
        a.href = "mailto:" + config.supportEmail;
        if (a.textContent.includes("@")) a.textContent = config.supportEmail;
      });
    }
    if (/^\d{10,15}$/.test(config.supportWhatsApp || "")) {
      document.querySelectorAll('[data-support="whatsapp"]').forEach((a) => {
        a.href = "https://wa.me/" + config.supportWhatsApp;
        if (a.textContent.startsWith("WhatsApp:")) {
          const n = config.supportWhatsApp;
          a.textContent = /^55\d{10}$/.test(n) ? `WhatsApp: (${n.slice(2,4)}) ${n.slice(4,8)}-${n.slice(8)}` : "WhatsApp: +" + n;
        }
      });
    }
  }
  document.querySelectorAll("[data-guide]").forEach((b) => b.addEventListener("click", () => navigate(b.dataset.guide, true)));
  document.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    activeCategory = b.dataset.filter; filterQuestions();
  }));
  search.addEventListener("input", () => {
    clearTimeout(searchTimer); activeCategory = "all";
    searchTimer = setTimeout(filterQuestions, 120);
  });
  $("search-form").addEventListener("submit", (event) => {
    event.preventDefault(); clearTimeout(searchTimer); filterQuestions(); scrollToElement($("duvidas"));
    $("faq-title").setAttribute("tabindex", "-1"); $("faq-title").focus({ preventScroll: true });
  });
  $("clear-search").addEventListener("click", resetSearch);
  $("reset-results").addEventListener("click", resetSearch);
  document.addEventListener("click", async (event) => {
    const link = event.target.closest('a[href^="#faq-"]');
    if (link) {
      event.preventDefault();
      const hash = link.getAttribute("href");
      if (location.hash !== hash) {
        try { history.pushState(null, "", hash); } catch (_) { location.hash = hash; }
      }
      openQuestion(hash);
    }
    const copy = event.target.closest("[data-copy]");
    if (copy) {
      const url = new URL(location.href); url.hash = copy.dataset.copy;
      try {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(url.href); toast("Link da resposta copiado.");
      } catch (_) {
        const input = element("textarea", "sr-only"); input.value = url.href; document.body.append(input); input.select();
        let copied = false; try { copied = document.execCommand("copy"); } catch (_) { /* Fallback pela barra de endereço. */ }
        input.remove(); copy.focus({ preventScroll: true });
        if (copied) toast("Link da resposta copiado.");
        else { location.hash = copy.dataset.copy; toast("Copie o endereço desta resposta na barra do navegador."); }
      }
    }
  });
  window.addEventListener("hashchange", () => openQuestion(location.hash));
  window.addEventListener("popstate", () => openQuestion(location.hash));
  const menu = document.querySelector(".menu-toggle");
  const nav = $("navigation");
  function closeMenu() { menu.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && nav.classList.contains("is-open")) { closeMenu(); menu.focus(); } });
  document.addEventListener("click", (event) => { if (!event.target.closest(".header")) closeMenu(); });
  applyConfig(); renderGuide(); filterQuestions();
  $("year").textContent = String(Math.max(2026, new Date().getFullYear()));
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");
  if (location.hash.startsWith("#faq-")) requestAnimationFrame(() => openQuestion(location.hash));
})();
