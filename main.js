/* =============================================================
   DATE BOT — LANDING PAGE + MODAL
   ============================================================= */

(function () {
  'use strict';

  /* ===== SELETORES ===== */
  const btnIniciar    = document.getElementById('btnIniciarTeste');
  const modalOverlay  = document.getElementById('modalOverlay');
  const btnEntrar     = document.getElementById('btnEntrar');

  const checkboxIds   = ['check1', 'check2', 'check3'];
  const itemIds       = ['item1',  'item2',  'item3'];

  /* ===== CHECKBOXES DO MODAL ===== */
  itemIds.forEach((itemId, i) => {
    const item  = document.getElementById(itemId);
    const check = document.getElementById(checkboxIds[i]);

    item.addEventListener('click', function (e) {
      e.preventDefault();
      check.checked = !check.checked;
      item.classList.toggle('checked', check.checked);
      updateBtnEntrar();
    });
  });

  function updateBtnEntrar() {
    const allChecked = checkboxIds.every(id => document.getElementById(id).checked);
    btnEntrar.disabled = !allChecked;
    btnEntrar.classList.toggle('enabled', allChecked);
  }

  /* ===== ABRIR MODAL ===== */
  btnIniciar.addEventListener('click', () => {
    modalOverlay.classList.add('active');
  });

  /* ===== FECHAR MODAL CLICANDO NO FUNDO ===== */
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });

  /* ===== CONFIRMAR E REDIRECIONAR PARA VSL ===== */
  btnEntrar.addEventListener('click', () => {
    if (btnEntrar.disabled) return;
    window.location.href = 'chat/index.html';
  });

  /* ===== SOCIAL PROOF AO VIVO ===== */
  const counterEl = document.getElementById('socialCounter');
  const liveFeed  = document.getElementById('liveFeed');

  const nomes = [
    'Lucas', 'Pedro', 'Gabriel', 'Rafael', 'Matheus',
    'Bruno', 'Felipe', 'Gustavo', 'Thiago', 'André',
    'Henrique', 'Vinícius', 'Caio', 'Leonardo', 'Daniel',
    'Diego', 'Marcos', 'Igor', 'Rodrigo', 'João',
    'Carlos', 'Eduardo', 'Renato', 'Leandro', 'Fábio'
  ];

  const cidades = [
    'SP', 'RJ', 'MG', 'BA', 'PR',
    'RS', 'PE', 'CE', 'SC', 'GO',
    'DF', 'PA', 'MA', 'AM', 'ES'
  ];

  let contadorAtual = 4800;

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }

  // Incrementa o contador a cada 4-8s
  setInterval(() => {
    contadorAtual += Math.floor(Math.random() * 3) + 1;
    counterEl.textContent = formatNumber(contadorAtual);
    counterEl.style.color = '#fff';
    setTimeout(() => { counterEl.style.color = '#ccc'; }, 400);
  }, 4000 + Math.random() * 4000);

  // Mostra notificação de "fulano acabou de fazer" a cada 3-6s
  function showLiveNotification() {
    const nome   = pick(nomes);
    const cidade = pick(cidades);
    const tempo  = Math.floor(Math.random() * 30) + 1;

    const item = document.createElement('span');
    item.className   = 'live-feed-item';
    item.textContent = `${nome} de ${cidade} fez o teste há ${tempo}s`;
    liveFeed.innerHTML = '';
    liveFeed.appendChild(item);

    const delay = 3000 + Math.random() * 3000;
    setTimeout(showLiveNotification, delay);
  }

  // Inicia após 1.5s
  setTimeout(showLiveNotification, 1500);


  /* =============================================================
     SIMULADOR DE DM — Mini conversa estilo Instagram
     3 roteiros em loop com fade in/out entre cada um.
     ============================================================= */

  const dmMessages = document.getElementById('dmMessages');

  /**
   * Roteiros da conversa.
   * Cada roteiro é um array de "passos".
   * Tipos de passo:
   *   - { side: 'left',  text }                         → mensagem da garota
   *   - { side: 'right', text, label, labelCls }        → resposta com label acima
   *   - { side: 'right', text, correct, label, labelCls } → resposta correta com label
   *   - { type: 'photo', src }                          → imagem da garota
   */
  const roteiros = [
    /* ===== ROTEIRO 1: Foto academia ===== */
    [
      { type: 'photo', src: 'foto academia.webp' },
      { side: 'right', text: 'mt linda', strikethrough: true, label: '✕ Você responderia:', labelCls: 'wrong' },
      { side: 'right', text: 'Foi treinar de verdade ou só foi distrair a academia inteira? Hahah', correct: true, label: '✦ Responda assim:', labelCls: 'correct' },
      { side: 'left',  text: 'Hahahah gostei 😊' },
    ],
    /* ===== ROTEIRO 2: Foto hamburguer ===== */
    [
      { type: 'photo', src: 'foto hamburguer.webp' },
      { side: 'left',  text: 'Melhor burguer da cidade🍔' },
      { side: 'right', text: 'parece mt bom mesmo', strikethrough: true, label: '✕ Você responderia:', labelCls: 'wrong' },
      { side: 'right', text: 'Agora fiquei curioso... o burguer é bom mesmo ou você que tem talento pra escolher comida boa?', correct: true, label: '✦ Responda assim:', labelCls: 'correct' },
      { side: 'left',  text: 'Hahaha vamos testar 😏' },
    ],
    /* ===== ROTEIRO 3: Continuação de conversa ===== */
    [
      { side: 'left',  text: 'kkkk verdade' },
      { side: 'right', text: 'pse', strikethrough: true, label: '✕ Você responderia:', labelCls: 'wrong' },
      { side: 'right', text: 'Conversa assim sempre acaba em café ou em historia engraçada... oq vc prefere? Hahah', correct: true, label: '✦ Responda assim:', labelCls: 'correct' },
      { side: 'left',  text: 'café hahahaha' },
    ],
  ];

  let rotIndex = 0; // Índice do roteiro atual

  /**
   * dmWait(ms) — pausa
   */
  function dmWait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /**
   * Cria um elemento de foto no DM.
   */
  function createPhoto(src, delayMs) {
    const div = document.createElement('div');
    div.className = 'dm-photo';
    div.style.animationDelay = delayMs + 'ms';
    div.innerHTML = '<img src="' + src + '" />';
    return div;
  }

  /**
   * Cria uma label separada ("Você responderia:" / "Responda assim:")
   * Fica ACIMA do balão como elemento independente.
   */
  function createLabel(cls, text, delayMs) {
    const div = document.createElement('div');
    div.className = 'dm-label ' + cls;
    div.textContent = text;
    div.style.animationDelay = delayMs + 'ms';
    return div;
  }

  /**
   * Cria um balão de mensagem.
   */
  function createBubble(step, delayMs) {
    const row = document.createElement('div');
    row.className = 'dm-row ' + step.side;
    row.style.animationDelay = delayMs + 'ms';

    const bubble = document.createElement('div');
    bubble.className = 'dm-bubble';

    if (step.correct) bubble.classList.add('dm-correct');

    if (step.strikethrough) {
      bubble.innerHTML = '<span class="dm-strikethrough">' + step.text + '</span>';
    } else {
      bubble.textContent = step.text;
    }

    row.appendChild(bubble);
    return row;
  }

  /**
   * Exibe um roteiro completo com delays escalonados.
   */
  async function playRoteiro(roteiro) {
    dmMessages.innerHTML = '';
    dmMessages.classList.remove('fading');

    let delay = 0;

    roteiro.forEach(function (step) {
      var stepDelay;

      if (step.type === 'photo') {
        dmMessages.appendChild(createPhoto(step.src, delay));
        stepDelay = 1400;
      } else {
        /* Se tem label, renderiza ela ACIMA do balão */
        if (step.label) {
          dmMessages.appendChild(createLabel(step.labelCls, step.label, delay));
          delay += 400;             // Pequena pausa entre label e balão
        }
        dmMessages.appendChild(createBubble(step, delay));
        stepDelay = 1000 + Math.min(step.text.length * 18, 800);
      }

      delay += stepDelay;
    });

    // Espera todas as animações + tempo de leitura final
    await dmWait(delay + 3500);

    // Fade out
    dmMessages.classList.add('fading');
    await dmWait(500);
  }

  /**
   * Loop infinito dos roteiros.
   */
  async function dmLoop() {
    while (true) {
      await playRoteiro(roteiros[rotIndex]);
      rotIndex = (rotIndex + 1) % roteiros.length;
    }
  }

  // Inicia o simulador após 1s
  setTimeout(dmLoop, 1000);

})();
