<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Date Bot — Configurando seu Date Bot</title>
  <link rel="icon" href="../logo.png.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <script src="https://cdn.utmify.com.br/scripts/utms/latest.js" data-utmify-prevent-xcod-sck data-utmify-prevent-subids async defer></script>
  <script>
    window.pixelId = "69ae2f13308feb91c8146d39";
    var a = document.createElement("script");
    a.setAttribute("async", "");
    a.setAttribute("defer", "");
    a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
    document.head.appendChild(a);
  </script>
</head>

<body>

  <!-- ===================== BARRA TOPO ===================== -->
  <div class="top-warning">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"
      style="vertical-align:middle;margin-right:6px;">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    Não feche esta janela. Configuração em andamento.
  </div>

  <!-- ===================== ÁREA PRINCIPAL ===================== -->
  <div class="main-container">

    <!-- PROGRESSO -->
    <div class="progress-wrapper">
      <div class="config-label" id="configLabel">Configurando seu robô personalizado...</div>
      <div class="progress-track">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <div class="progress-pct" id="progressPct">0%</div>
    </div>

    <!-- VÍDEO (9:16) -->
    <div class="video-wrapper">
      <div class="video-frame">
        <script src="https://fast.wistia.com/player.js" async></script>
        <script src="https://fast.wistia.com/embed/2stjti09cp.js" async type="module"></script>
        <style>
          wistia-player[media-id='2stjti09cp']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/2stjti09cp/swatch');
            display: block;
            filter: blur(5px);
            padding-top: 178.06%;
          }
        </style>
        <wistia-player media-id="2stjti09cp" aspect="0.5616224648985959" style="width:100%;"></wistia-player>
      </div>
    </div>

    <!-- BOTÃO CTA — aparece quando progresso chega em 100% -->
    <div class="cta-section" id="ctaSection">
      <a href="https://pay.cakto.com.br/hwi92as_837732" class="btn-cta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px;">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Escolher meu Robô
      </a>
      <p class="cta-note">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"
          stroke-linecap="round" style="vertical-align:middle;margin-right:4px;">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Acesso exclusivo — vagas limitadas
      </p>
    </div>

  </div><!-- /main-container -->

  <!-- CONFETE -->
  <div class="confetti-container" id="confetti"></div>

  <script src="main.js"></script>
</body>

</html>