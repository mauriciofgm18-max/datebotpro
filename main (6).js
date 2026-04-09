/* =============================================================
   DATE BOT — CHAT (Script de Conversa)

   Este arquivo controla toda a lógica do chat:
   - Envio de mensagens do bot (com animação de digitação)
   - Envio de mensagens do usuário
   - Envio de imagens
   - Exibição de botões de resposta (single e multi-select)
   - Fluxo completo da conversa (etapas)
   - Prova social animada no header
   ============================================================= */

(function () {
  'use strict';


  /* =============================================================
     1. SELETORES
     Referências aos elementos do HTML que o JS vai manipular.
     ============================================================= */

  var chatMessages = document.getElementById('chatMessages');   // Container de todas as mensagens
  var chatScroll = document.getElementById('chatScroll');     // Área scrollável (pai do chatMessages)
  var socialCount = document.getElementById('socialCount');    // Número da prova social no header


  /* =============================================================
     2. PROVA SOCIAL ANIMADA
     Contador que oscila entre um valor mínimo e máximo,
     simulando pessoas entrando e saindo em tempo real.
     ============================================================= */

  var contadorBase = 847;                                       // Valor inicial exibido

  setInterval(function () {
    /* Oscila entre -3 e +5 a cada intervalo */
    var variacao = Math.floor(Math.random() * 9) - 3;          // Gera número entre -3 e +5
    contadorBase = Math.max(800, contadorBase + variacao);      // Nunca desce abaixo de 800

    socialCount.textContent = contadorBase;                     // Atualiza o número no HTML

    /* Flash branco ao atualizar (chama atenção) */
    socialCount.style.color = '#fff';                           // Fica branco por um instante
    setTimeout(function () {
      socialCount.style.color = '#999';                         // Volta ao cinza normal
    }, 400);
  }, 3000 + Math.random() * 2000);                              // Intervalo de 3 a 5 segundos


  /* =============================================================
     3. HELPERS — FUNÇÕES AUXILIARES
     Funções reutilizáveis usadas por todo o script.
     ============================================================= */

  /**
   * scrollChat()
   * Rola o chat até o final para mostrar a mensagem mais recente.
   * Usa requestAnimationFrame para garantir que o DOM já atualizou.
   */
  function scrollChat() {
    requestAnimationFrame(function () {
      chatScroll.scrollTop = chatScroll.scrollHeight + 5000;    // Valor alto para garantir que vai até o fim
    });
  }

  /**
   * wait(ms)
   * Pausa a execução por X milissegundos.
   * Usado entre mensagens para simular ritmo de conversa.
   * Exemplo: await wait(500) → pausa de meio segundo
   */
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  /**
   * addBotMessage(text)
   * Exibe o indicador de digitação (3 bolinhas), depois mostra a mensagem.
   * O tempo de digitação é proporcional ao tamanho do texto.
   * - Mínimo: 900ms (mensagens curtas)
   * - Máximo: 2200ms (mensagens longas)
   */
  function addBotMessage(text) {
    return new Promise(function (resolve) {

      /* Cria e exibe o indicador de digitação */
      var typingRow = document.createElement('div');
      typingRow.className = 'msg-row bot';
      typingRow.innerHTML =
        '<div class="typing-bubble">' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '</div>';
      chatMessages.appendChild(typingRow);                      // Adiciona ao chat
      scrollChat();                                             // Rola para mostrar

      /* Calcula tempo de digitação baseado no tamanho do texto */
      var delay = Math.min(900 + text.length * 22, 2200);

      /* Após o delay, remove digitação e mostra a mensagem real */
      setTimeout(function () {
        typingRow.remove();                                     // Remove as bolinhas
        var row = document.createElement('div');
        row.className = 'msg-row bot';
        row.innerHTML = '<div class="msg-bubble">' + text + '</div>';
        chatMessages.appendChild(row);                          // Adiciona a mensagem
        scrollChat();                                           // Rola para mostrar
        resolve();                                              // Libera o await
      }, delay);
    });
  }

  /**
   * addUserMessage(text)
   * Adiciona uma mensagem do usuário (sem delay, sem digitação).
   * Aparece instantaneamente alinhada à direita.
   */
  function addUserMessage(text) {
    var row = document.createElement('div');
    row.className = 'msg-row user';
    row.innerHTML = '<div class="msg-bubble">' + text + '</div>';
    chatMessages.appendChild(row);
    scrollChat();
  }

  /**
   * addBotImage(src)
   * Exibe digitação, depois mostra uma imagem.
   * IMPORTANTE: Só faz resolve() APÓS a imagem carregar completamente.
   * Isso evita que a próxima mensagem apareça antes da imagem ser visível.
   */
  function addBotImage(src) {
    return new Promise(function (resolve) {
      var resolved = false;                                     // Flag para evitar resolve duplo

      /**
       * safeResolve()
       * Garante que resolve() só é chamado uma vez.
       * Necessário porque img.onload e o fallback img.complete
       * podem disparar ao mesmo tempo em imagens cacheadas.
       */
      function safeResolve() {
        if (resolved) return;                                   // Já resolveu? Ignora
        resolved = true;
        scrollChat();
        setTimeout(function () {
          scrollChat();                                         // Scroll extra após render
          resolve();                                            // Libera o await
        }, 400);
      }

      /* Cria e exibe o indicador de digitação */
      var typingRow = document.createElement('div');
      typingRow.className = 'msg-row bot';
      typingRow.innerHTML =
        '<div class="typing-bubble">' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '</div>';
      chatMessages.appendChild(typingRow);
      scrollChat();

      /* Após 1.5s de "digitação", mostra a imagem */
      setTimeout(function () {
        typingRow.remove();

        var row = document.createElement('div');
        row.className = 'msg-row bot';

        var img = document.createElement('img');                // Cria elemento de imagem
        img.src = src;                                          // Define o caminho da imagem

        var bubble = document.createElement('div');
        bubble.className = 'msg-bubble msg-image';
        bubble.appendChild(img);                                // Coloca imagem dentro do balão
        row.appendChild(bubble);
        chatMessages.appendChild(row);                          // Adiciona ao chat
        scrollChat();

        /* Quando a imagem terminar de carregar */
        img.onload = safeResolve;

        /* Se a imagem já estava em cache, img.complete já é true */
        if (img.complete) safeResolve();

      }, 1500);                                                 // 1.5s de digitação para imagens
    });
  }


  /* =============================================================
     4. FUNÇÕES DE INTERFACE — BOTÕES E OPÇÕES
     ============================================================= */

  /**
   * clearOptions()
   * Remove o bloco de opções atual do chat (se existir).
   * Chamado antes de criar novas opções para evitar duplicatas.
   */
  function clearOptions() {
    var existing = chatMessages.querySelector('.chat-options-inline');
    if (existing) existing.remove();
  }

  /**
   * showSingleButton(text, callback)
   * Exibe um botão grande roxo (ex: "Bora!", "Vamos!", "Continuar").
   * Quando clicado: remove o botão, mostra resposta do lead, executa callback.
   *
   * @param {string}   text     — Texto do botão
   * @param {function} callback — Função executada após o clique
   */
  function showSingleButton(text, callback) {
    clearOptions();

    var wrapper = document.createElement('div');
    wrapper.className = 'chat-options-inline';                  // Container das opções

    var btn = document.createElement('button');
    btn.className = 'chat-action-btn';                          // Estilo: botão grande roxo
    btn.textContent = text;

    btn.onclick = function () {
      wrapper.remove();                                         // Remove o botão do chat
      addUserMessage(text);                                     // Mostra a resposta do lead
      callback();                                               // Executa a próxima etapa
    };

    wrapper.appendChild(btn);
    chatMessages.appendChild(wrapper);                          // Adiciona ao chat (inline)
    scrollChat();
  }

  /**
   * showOptions(options, callback)
   * Exibe múltiplos botões de opção (A, B, C, D) para o lead escolher.
   * Quando clicado: remove todas as opções, mostra a escolha, executa callback.
   *
   * @param {string[]} options  — Array com os textos das opções
   * @param {function} callback — callback(textoEscolhido, indiceEscolhido)
   */
  function showOptions(options, callback) {
    clearOptions();

    var wrapper = document.createElement('div');
    wrapper.className = 'chat-options-inline';
    var letters = ['A', 'B', 'C', 'D', 'E', 'F'];             // Letras para cada opção

    options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.className = 'chat-opt-btn';
      btn.innerHTML =
        '<span class="chat-opt-letter">' + letters[i] + '</span>' +  // Letra (A, B, C...)
        '<span>' + opt + '</span>';                                    // Texto da opção

      btn.onclick = function () {
        wrapper.remove();                                       // Remove todas as opções
        addUserMessage(opt);                                    // Mostra a escolha do lead
        callback(opt, i);                                       // Passa texto e índice
      };

      wrapper.appendChild(btn);
    });

    chatMessages.appendChild(wrapper);
    scrollChat();
  }


  /* =============================================================
     5. FLUXO DA CONVERSA
     Cada função é uma etapa da conversa.
     O fluxo vai: etapa1 → etapa2 → etapa3 → etapa4 → ON/OFF → posResposta
     ============================================================= */

  /* ----- ETAPA 1: Apresentação ----- */
  async function etapa1() {
    await addBotMessage('Opa irmão 👀');
    await wait(400);
    await addBotMessage('Eu sou o robô que vai salvar seu direct hoje!');
    await wait(500);
    await addBotMessage('Antes de liberar, deixa eu entender como está seu jogo!');
    await wait(400);
    await addBotMessage('Pode ser?');

    /* Botão "Bora!" → vai para etapa 2 */
    showSingleButton('Bora!', function () {
      setTimeout(etapa2, 600);                                  // 600ms de pausa antes da próxima etapa
    });
  }

  /* ----- ETAPA 2: Pergunta sobre travar ----- */
  async function etapa2() {
    await addBotMessage('Seja sincero...');
    await wait(500);
    await addBotMessage('você já travou alguma vez quando você tentou responder alguma mulher?');

    /* 3 opções — qualquer uma vai para etapa 3 */
    showOptions(
      ['muitas vezes', 'já ocorreu comigo', 'toda hora!'],
      function () {
        setTimeout(etapa3, 600);
      }
    );
  }

  /* ----- ETAPA 3: Transição para as situações ----- */
  async function etapa3() {
    await addBotMessage('Relaxa… isso é mais comum do que você imagina 😅');
    await wait(500);
    await addBotMessage('o problema não é você!!');
    await wait(400);
    await addBotMessage('é que ninguém te falou o que mandar.');
    await wait(500);
    await addBotMessage('Vou fazer um teste com você mostrando 2 situações reais e quero ver como você responderia.');
    await wait(400);
    await addBotMessage('Vamos?');

    /* Botão "Vamos!" → vai para etapa 4 */
    showSingleButton('Vamos!', function () {
      setTimeout(etapa4, 600);
    });
  }

  /* ----- ETAPA 4: Situação da foto + opções ON/OFF ----- */
  async function etapa4() {
    await addBotMessage('Se a garota no qual você tem interesse postasse uma foto, como você responderia??');
    await wait(600);
    await addBotImage('media/foto1.webp');                      // Mostra a foto da garota
    await wait(800);                                            // Pausa extra após imagem

    /* Opções de resposta */
    var opcoes = [
      'Que beldade!😍 Ta indo pra praia??',                    // A — OFF (errada)
      'Oi! Ta indo fazer oque?',                                // B — OFF (errada)
      'Ta muito linda! Vamos tomar um vinho no fim de semana?', // C — OFF (errada)
      'Vai tomar banho de biquini? Hahahah'                     // D — ON  (correta)
    ];

    var respostaCorretaIndex = 3;                               // Índice da resposta correta (D)

    showOptions(opcoes, function (opt, index) {
      if (index === respostaCorretaIndex) {
        setTimeout(respostaON, 600);                            // Acertou → caminho ON
      } else {
        setTimeout(respostaOFF, 600);                           // Errou → caminho OFF
      }
    });
  }

  /* ----- RESPOSTA OFF: Lead errou a resposta ----- */
  async function respostaOFF() {
    await addBotMessage('Errado...');
    await wait(500);
    await addBotMessage('Se você mandasse isso, você com certeza iria ficar no vácuo ou no máximo ela te mandaria um "kkk".');
    await wait(500);
    await addBotMessage('Isso porque ela recebe esse tipo de mensagem todo dia! E é algo que ela já espera e não desperta interesse!');
    await wait(500);
    await addBotMessage('Elogio? Quer aprovação.');
    await wait(350);
    await addBotMessage('Pergunta genérica? Quer atenção.');
    await wait(350);
    await addBotMessage('Convite direto? Emocionado!');
    await wait(500);
    await addBotMessage('Quando ela vê esse tipo de mensagem ela entende que ela é desejada e isso MATA a atração!');

    /* Botão para revelar a resposta correta */
    showSingleButton('Liberar resposta Correta', async function () {
      await addBotMessage('A resposta certa era a D: "Vai tomar banho de biquíni?! Hahaha"');
      await wait(600);
      await posResposta();                                      // Segue para o caminho comum
    });
  }

  /* ----- RESPOSTA ON: Lead acertou a resposta ----- */
  async function respostaON() {
    await addBotMessage('Isso mesmo! Essa é resposta que vai chamar atenção dela!');
    await wait(600);
    await posResposta();                                        // Segue para o caminho comum
  }

  /* ----- PÓS-RESPOSTA: Caminho comum (ON e OFF convergem aqui) ----- */
  async function posResposta() {
    await addBotMessage('O Motivo?');
    await wait(500);
    await addBotMessage('Essa mina recebe 50 mensagens por dia.');
    await wait(400);
    await addBotMessage('"Oi linda"');
    await wait(350);
    await addBotMessage('"Vamo sair"');
    await wait(500);
    await addBotMessage('Parece um desesperado querendo loucamente a atenção dela.');
    await wait(500);
    await addBotMessage('O cérebro dela filtra automaticamente e ela te ignora.');
    await wait(500);
    await addBotMessage('Mas olha o que acontece quando você PROVOCA!');
    await wait(600);
    await addBotImage('media/foto2.webp');                      // Print de conversa 1
    await wait(800);                                            // Pausa extra após imagem
    await addBotImage('media/foto3.webp');                      // Print de conversa 2
    await wait(600);
    await addBotMessage('Entendeu?');
    await wait(400);
    await addBotMessage('Ele não elogiou, apenas a provocou!');
    await wait(400);
    await addBotMessage('E ela fez questão de responder!');

    /* Botão "Continuar" → vai para etapa 5 */
    showSingleButton('Continuar', function () {
      setTimeout(etapa5, 600);
    });
  }


  /* ----- ETAPA 5: Segunda situação — vácuo + opções ON/OFF ----- */
  async function etapa5() {
    await addBotMessage('Segunda situação:');
    await wait(500);
    await addBotMessage('Você a chamou pra sair mas ela apenas visualizou e não respondeu...');
    await wait(600);
    await addBotImage('media/foto4.webp');                          // Print do vácuo
    await wait(800);
    await addBotMessage('Como você reagiria a esta situação?');

    /* Opções de resposta — D é a correta (ON) */
    var opcoes = [
      'Eu pergunto se ela viu a mensagem kk',                      // A — OFF
      'Espero ela responder, pode ser que ela esteja ocupada.',     // B — OFF
      'Mando alguma coisa pra "quebrar o gelo"',                   // C — OFF
      'Sumo e espero ela responder e dou vácuo também'             // D — ON (correta)
    ];

    showOptions(opcoes, function (opt, index) {
      if (index === 3) {
        setTimeout(respostaON5, 600);                               // Acertou → caminho ON
      } else {
        setTimeout(respostaOFF5, 600);                              // Errou → caminho OFF
      }
    });
  }

  /* ----- RESPOSTA OFF (Etapa 5): Lead errou ----- */
  async function respostaOFF5() {
    await addBotMessage('Mandar outra mensagem? Emocionado!');
    await wait(500);
    await addBotMessage('Meme? Kkk ela vai perceber que você ta desesperado tentando salvar a conversa.');
    await wait(500);
    await addBotMessage('Tudo isso comunica a mesma coisa:');
    await wait(400);
    await addBotMessage('"Eu preciso muito de sua ATENÇÃO!🥺"');
    await wait(500);
    await addBotMessage('Esse é o BEIJO MORTAL!');

    /* Botão para revelar a resposta correta */
    showSingleButton('Liberar resposta Correta', async function () {
      await addBotMessage('A resposta certa era a D: IGNORAR.');
      await wait(600);
      await posResposta5();                                         // Segue para o caminho comum
    });
  }

  /* ----- RESPOSTA ON (Etapa 5): Lead acertou ----- */
  async function respostaON5() {
    await addBotMessage('Essa é a jogada meu pequeno gafanhoto!');
    await wait(600);
    await posResposta5();                                           // Segue para o caminho comum
  }

  /* ----- PÓS-RESPOSTA 5: Caminho comum (ON e OFF convergem) ----- */
  async function posResposta5() {
    await addBotMessage('Quando você some assim do nada');
    await wait(400);
    await addBotMessage('Ela entende que você tem vida e afazeres!');
    await wait(400);
    await addBotMessage('Que também tem outras opções!');
    await wait(500);
    await addBotMessage('E quando ela mandar mensagem a você e simplesmente ignora-la');
    await wait(500);
    await addBotMessage('O cérebro dela dá um BUG!');
    await wait(500);
    await addBotMessage('" Porque ele não esta me bajulando e implorando por atenção?"');
    await wait(500);
    await addBotMessage('Isso gera uma coisa chamado " ATRAÇÃO INVOLUNTÁRIA!"');
    await wait(500);
    await addBotMessage('Ela não escolhe esse sentimento');
    await wait(400);
    await addBotMessage('Ela apenas sente involuntariamente');
    await wait(600);
    await addBotImage('media/foto5.webp');                          // Print de resultado 1
    await wait(800);
    await addBotImage('media/foto6.webp');                          // Print de resultado 2
    await wait(600);

    /* Botão "Continuar" → vai para etapa 6 */
    showSingleButton('Continuar', function () {
      setTimeout(etapa6, 600);
    });
  }


  /* ----- ETAPA 6: Provas sociais + resultados ----- */
  async function etapa6() {
    await addBotMessage('E não para por ai');
    await wait(400);
    await addBotMessage('Quando você começa a jogar O JOGO DE VERDADE');
    await wait(500);
    await addBotMessage('As conversas viram ISSO:');
    await wait(600);
    await addBotImage('media/foto7.webp');                          // Print de conversa resultado
    await wait(800);
    await addBotMessage('Ela mandando mensagem.');
    await wait(400);
    await addBotMessage('Sem você pedir.');
    await wait(400);
    await addBotMessage('Porque ela QUER te impressionar.');
    await wait(500);
    await addBotMessage('Porque você virou o prêmio.');
    await wait(600);
    await addBotImage('media/foto8.webp');                          // Print de depoimento
    await wait(800);
    await addBotMessage('Esse cara usou o robô na quinta.');
    await wait(400);
    await addBotMessage('Saiu com ela no sábado.');
    await wait(500);
    await addBotMessage('E a mina ainda mandou isso depois:');
    await wait(600);
    await addBotImage('media/foto9.webp');                          // Print da mensagem dela
    await wait(600);

    /* Botão "Quero ISSO" → vai para etapa 7 */
    showSingleButton('QUERO ISSO', function () {
      setTimeout(etapa7, 600);
    });
  }


  /* ----- ETAPA 7: Pergunta sobre mina no radar + ON/OFF ----- */
  async function etapa7() {
    await addBotMessage('Perfeito Irmão!');
    await wait(400);
    await addBotMessage('O seu robô está quase pronto!');
    await wait(500);
    await addBotMessage('Mas antes, preciso saber de uma coisa:');
    await wait(400);
    await addBotMessage('tem alguma mina no seu radar hoje?');

    /* Opções — A e B são ON, C é OFF */
    var opcoes = [
      'Sim, tem uma que to querendo',                              // A — ON
      'Já tenho alguns contatinhos',                                // B — ON
      'Não, to na seca TOTAL'                                      // C — OFF
    ];

    showOptions(opcoes, function (opt, index) {
      if (index === 2) {
        setTimeout(respostaOFF7, 600);                              // Seca → caminho OFF
      } else {
        setTimeout(respostaON7, 600);                               // Tem mina → caminho ON
      }
    });
  }

  /* ----- RESPOSTA OFF (Etapa 7): Lead na seca ----- */
  async function respostaOFF7() {
    await addBotMessage('Sem problemas! Eu também funciono para abordagem!');
    await wait(500);
    await addBotMessage('Você acha uma mina no Instagram, no Tinder ou no Whats…');
    await wait(500);
    await addBotMessage('Mande a foto dela para mim');
    await wait(400);
    await addBotMessage('Eu te dou a primeira mensagem');
    await wait(500);
    await addBotMessage('E você já pode ter o seu date marcado pra AMANHÃ!');
    await wait(600);
    await posResposta7();                                           // Segue para o caminho comum
  }

  /* ----- RESPOSTA ON (Etapa 7): Lead tem mina no radar ----- */
  async function respostaON7() {
    await addBotMessage('Ai sim meu garoto!');
    await wait(400);
    await addBotMessage('Então você precisa usar HOJE!');
    await wait(500);
    await addBotMessage('Me manda o print da conversa');
    await wait(400);
    await addBotMessage('Eu te dou a mensagem certa no contexto correto');
    await wait(400);
    await addBotMessage('Você copia e cola');
    await wait(500);
    await addBotMessage('E pode tá com ela ainda HOJE À NOITE.');
    await wait(600);
    await posResposta7();                                           // Segue para o caminho comum
  }

  /* ----- PÓS-RESPOSTA 7: Caminho comum ----- */
  async function posResposta7() {
    await addBotMessage('A vantagem é que eu já venho personalizado para o seu caso!');

    /* Botão "Começar a personalização" → vai para etapa 8 */
    showSingleButton('Começar a personalização', function () {
      setTimeout(etapa8, 600);
    });
  }


  /**
   * showMultiSelect(options, buttonText, callback)
   * Exibe múltiplas opções com checkbox que o lead pode marcar/desmarcar.
   * O botão de confirmar só aparece ativo quando pelo menos 1 opção é marcada.
   *
   * @param {string[]} options    — Array com os textos das opções
   * @param {string}   buttonText — Texto do botão de confirmar
   * @param {function} callback   — callback(arrayDeEscolhidas)
   */
  function showMultiSelect(options, buttonText, callback) {
    clearOptions();

    var wrapper = document.createElement('div');
    wrapper.className = 'chat-options-inline';

    var selected = [];                                              // Índices selecionados

    /* Cria cada opção com checkbox visual */
    options.forEach(function (opt, i) {
      var btn = document.createElement('div');
      btn.className = 'chat-multi-opt';
      btn.innerHTML =
        '<div class="multi-checkbox">' +
        '<svg width="12" height="12" viewBox="0 0 12 10" fill="none">' +
        '<path d="M1 5L4.5 8.5L11 1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '</div>' +
        '<span>' + opt + '</span>';

      btn.onclick = function () {
        var idx = selected.indexOf(i);
        if (idx === -1) {
          selected.push(i);                                         // Marca
          btn.classList.add('selected');
        } else {
          selected.splice(idx, 1);                                  // Desmarca
          btn.classList.remove('selected');
        }
        /* Ativa/desativa o botão confirmar */
        if (selected.length > 0) {
          confirmBtn.classList.add('ativo');
        } else {
          confirmBtn.classList.remove('ativo');
        }
      };

      wrapper.appendChild(btn);
    });

    /* Botão confirmar — desabilitado por padrão */
    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-confirmar';
    confirmBtn.textContent = buttonText;

    confirmBtn.onclick = function () {
      if (selected.length === 0) return;                            // Ignora se nada selecionado
      var escolhidas = selected.map(function (i) { return options[i]; });
      wrapper.remove();
      addUserMessage(escolhidas.join(', '));                         // Mostra as escolhas do lead
      callback(escolhidas);
    };

    wrapper.appendChild(confirmBtn);
    chatMessages.appendChild(wrapper);
    scrollChat();
  }


  /* ----- ETAPA 8: Objetivo + Tom de personalidade (multi-select) ----- */
  async function etapa8() {
    await addBotMessage('Qual o seu objetivo principal??');

    /* Opções de objetivo — single choice */
    var objetivos = [
      '🔥 Sair mais',
      '💍 Conseguir namorada',
      '😈 Ter várias ficantes',
      '🆘 Sair da seca'
    ];

    showOptions(objetivos, function () {
      setTimeout(etapa8b, 600);
    });
  }

  /* ----- ETAPA 8B: Tom de personalidade (multi-select) ----- */
  async function etapa8b() {
    await addBotMessage('E qual tom combina mais contigo?');
    await wait(400);
    await addBotMessage('( marque quantas quiser)');

    var tons = [
      'Alfa',
      'Cafajeste',
      'Cavalheiro Sedutor',
      'Homem de Sucesso',
      'Debochado',
      'Cachorro',
      'Jogador Marrento',
      'Romântico',
      'Don Juan'
    ];

    showMultiSelect(tons, 'Continuar', function () {
      setTimeout(etapa9, 600);
    });
  }


  /* ----- ETAPA 9 FINAL: Vídeo tutorial + redirect para VSL ----- */
  async function etapa9() {
    await addBotMessage('Perfeito! Vou começar a realizar a configuração de acordo com suas respostas.');
    await wait(500);
    await addBotMessage('Enquanto isso...');
    await wait(500);
    await addBotMessage('Assiste esse vídeo que explica como usar da forma correta pra ter resultado HOJE!');
    await wait(500);
    await addBotMessage('É Sério!');
    await wait(400);
    await addBotMessage('Tem cara que consegue resultado no mesmo dia!');
    await wait(500);
    await addBotMessage('Vê com atenção.');

    /* Botão que redireciona para a VSL */
    showSingleButton('ASSISTIR VIDEO TUTORIAL', function () {
      window.location.href = '../vsl/index.html';
    });
  }


  /* =============================================================
     6. INICIAR A CONVERSA
     Chamado automaticamente quando a página carrega.
     ============================================================= */

  etapa1();

})();
