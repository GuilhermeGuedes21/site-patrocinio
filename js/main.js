'use strict';

// Menu mobile
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

function fecharMenu() {
  if (!hamburger || !navLinks) return;

  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menu');
  navLinks.classList.remove('mobile-ativo');
  document.body.classList.remove('menu-aberto');
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const aberto = hamburger.getAttribute('aria-expanded') === 'true';

    hamburger.setAttribute('aria-expanded', String(!aberto));
    hamburger.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
    navLinks.classList.toggle('mobile-ativo', !aberto);
    document.body.classList.toggle('menu-aberto', !aberto);
  });

  navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') fecharMenu();
  });
}

// Aparência da navegação ao rolar
function atualizarNavbar() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', atualizarNavbar, { passive: true });
atualizarNavbar();

// Rolagem suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const seletor = link.getAttribute('href');
    if (!seletor || seletor === '#') return;

    const destino = document.querySelector(seletor);
    if (!destino) return;

    event.preventDefault();
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Destaca a seção atual na navegação
const secoesNavegacao = document.querySelectorAll('main section[id]');
const linksNavegacao = document.querySelectorAll('.nav-links a[href^="#"]');

if ('IntersectionObserver' in window && secoesNavegacao.length) {
  const observerNavegacao = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      linksNavegacao.forEach(link => {
        const ativo = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('ativo', ativo);
      });
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  });

  secoesNavegacao.forEach(secao => observerNavegacao.observe(secao));
}

// Animações de entrada conforme o conteúdo aparece na tela
const elementosReveal = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && elementosReveal.length) {
  const observerReveal = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visivel');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px'
  });

  elementosReveal.forEach(elemento => observerReveal.observe(elemento));
} else {
  elementosReveal.forEach(elemento => elemento.classList.add('visivel'));
}

// Contagem regressiva para o Brasileiro de Verão
const dataAlvo = new Date('2026-11-24T00:00:00-03:00').getTime();

function atualizarCountdown() {
  const countdown = document.getElementById('countdown');
  const diasEl = document.getElementById('dias');
  const horasEl = document.getElementById('horas');
  const minutosEl = document.getElementById('minutos');

  if (!countdown || !diasEl || !horasEl || !minutosEl) return;

  const diferenca = dataAlvo - Date.now();

  if (diferenca <= 0) {
    diasEl.textContent = '00';
    horasEl.textContent = '00';
    minutosEl.textContent = '00';

    const legenda = countdown.parentElement?.querySelector('.countdown-label');
    if (legenda) legenda.textContent = 'O campeonato começou!';
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));

  diasEl.textContent = String(dias).padStart(2, '0');
  horasEl.textContent = String(horas).padStart(2, '0');
  minutosEl.textContent = String(minutos).padStart(2, '0');
}

atualizarCountdown();
window.setInterval(atualizarCountdown, 60000);

// Filtros da galeria
const botoesFiltro = document.querySelectorAll('.filtro-btn');
const itensGaleria = Array.from(document.querySelectorAll('.gallery-item'));

botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    const filtro = botao.dataset.filtro || 'todos';

    botoesFiltro.forEach(outroBotao => {
      const ativo = outroBotao === botao;
      outroBotao.classList.toggle('ativo', ativo);
      outroBotao.setAttribute('aria-pressed', String(ativo));
    });

    itensGaleria.forEach(item => {
      const categoria = item.dataset.categoria || 'foto';
      const mostrar = filtro === 'todos' || categoria === filtro;
      item.classList.toggle('oculto', !mostrar);
    });
  });
});

// Lightbox: fotos e vídeos
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let itensVisiveis = [];
let indiceAtual = 0;
let ultimoElementoAtivo = null;

function atualizarItensVisiveis() {
  itensVisiveis = itensGaleria.filter(item => !item.classList.contains('oculto'));
}

function mostrarItemLightbox(indice) {
  if (!lightbox || !lightboxImg || !lightboxVideo || itensVisiveis.length === 0) return;

  indiceAtual = (indice + itensVisiveis.length) % itensVisiveis.length;

  const item = itensVisiveis[indiceAtual];
  const imagem = item.querySelector('img');
  const urlVideo = item.dataset.video;

  lightboxVideo.src = '';
  lightboxVideo.classList.remove('visivel');
  lightboxImg.style.display = 'none';
  lightboxImg.removeAttribute('src');

  if (urlVideo) {
    lightboxVideo.src = urlVideo;
    lightboxVideo.classList.add('visivel');
  } else if (imagem) {
    lightboxImg.src = imagem.currentSrc || imagem.src;
    lightboxImg.alt = imagem.alt || 'Imagem da galeria';
    lightboxImg.style.display = 'block';
  }

  if (lightboxCounter) {
    lightboxCounter.textContent = `${indiceAtual + 1} / ${itensVisiveis.length}`;
  }
}

function abrirLightbox(item) {
  if (!lightbox) return;

  atualizarItensVisiveis();

  const indice = itensVisiveis.indexOf(item);
  if (indice < 0) return;

  ultimoElementoAtivo = item;
  mostrarItemLightbox(indice);

  lightbox.classList.add('ativo');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-aberto');
  lightboxClose?.focus();
}

function fecharLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('ativo');
  lightbox.setAttribute('aria-hidden', 'true');

  if (lightboxVideo) {
    lightboxVideo.src = '';
    lightboxVideo.classList.remove('visivel');
  }

  if (lightboxImg) {
    lightboxImg.style.display = 'none';
    lightboxImg.removeAttribute('src');
  }

  document.body.classList.remove('lightbox-aberto');
  ultimoElementoAtivo?.focus();
}

itensGaleria.forEach(item => {
  item.addEventListener('click', () => abrirLightbox(item));
});

lightboxClose?.addEventListener('click', fecharLightbox);
lightboxPrev?.addEventListener('click', () => mostrarItemLightbox(indiceAtual - 1));
lightboxNext?.addEventListener('click', () => mostrarItemLightbox(indiceAtual + 1));

lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) fecharLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('ativo')) return;

  if (event.key === 'Escape') fecharLightbox();
  if (event.key === 'ArrowLeft') mostrarItemLightbox(indiceAtual - 1);
  if (event.key === 'ArrowRight') mostrarItemLightbox(indiceAtual + 1);
});

// Quiz: perfil de natação
const swimQuiz = document.getElementById('swimQuiz');
const quizResult = document.getElementById('quizResult');
const quizTitle = document.getElementById('quizTitle');
const quizRecommendation = document.getElementById('quizRecommendation');
const quizConnection = document.getElementById('quizConnection');
const quizRetry = document.getElementById('quizRetry');

const swimProfiles = {
  sprint: {
    title: 'Você tem perfil de velocista!',
    recommendation: 'Seu perfil pode combinar com provas curtas e intensas, como 50 m e 100 m.',
    connection: 'Guilherme também tem perfil velocista: 50 m Livre — 23s61.'
  },
  meio: {
    title: 'Você tem perfil de meio-fundista!',
    recommendation: 'Seu perfil pode combinar com provas que pedem velocidade e controle de ritmo, como 200 m e 400 m.',
    connection: ''
  },
  fundo: {
    title: 'Você tem perfil de fundista!',
    recommendation: 'Seu perfil pode combinar com provas longas, como 800 m, 1.500 m ou provas de águas abertas.',
    connection: ''
  },
  medley: {
    title: 'Você tem perfil versátil — pode gostar de medley!',
    recommendation: 'Seu perfil pode combinar com provas variadas, que reúnem os quatro estilos: borboleta, costas, peito e livre.',
    connection: ''
  }
};

if (swimQuiz && quizResult && quizTitle && quizRecommendation && quizConnection) {
  swimQuiz.addEventListener('submit', event => {
    event.preventDefault();

    if (!swimQuiz.reportValidity()) return;

    const respostas = new FormData(swimQuiz);
    const pontuacoes = {
      sprint: 0,
      meio: 0,
      fundo: 0,
      medley: 0
    };

    for (let pergunta = 1; pergunta <= 5; pergunta += 1) {
      const resposta = respostas.get(`q${pergunta}`);

      if (resposta && Object.prototype.hasOwnProperty.call(pontuacoes, resposta)) {
        pontuacoes[resposta] += 1;
      }
    }

    const maiorPontuacao = Math.max(...Object.values(pontuacoes));
    const perfisEmpatados = Object.keys(pontuacoes)
      .filter(perfil => pontuacoes[perfil] === maiorPontuacao);

    // Em caso de empate, apresenta um perfil versátil.
    const perfilEscolhido = perfisEmpatados.length === 1
      ? perfisEmpatados[0]
      : 'medley';

    const resultado = swimProfiles[perfilEscolhido];

    quizTitle.textContent = resultado.title;
    quizRecommendation.textContent = resultado.recommendation;
    quizConnection.textContent = resultado.connection;
    quizConnection.hidden = !resultado.connection;
    quizResult.hidden = false;

    quizResult.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  });
}

if (quizRetry && swimQuiz && quizResult) {
  quizRetry.addEventListener('click', () => {
    swimQuiz.reset();
    quizResult.hidden = true;
    swimQuiz.querySelector('input')?.focus();
  });
}

// Jogo de tempo de reação
const reactionStage = document.getElementById('reactionStage');
const reactionButton = document.getElementById('reactionButton');
const reactionSignal = document.getElementById('reactionSignal');
const reactionHeading = document.getElementById('reactionHeading');
const reactionMessage = document.getElementById('reactionMessage');
const reactionResult = document.getElementById('reactionResult');
const reactionTime = document.getElementById('reactionTime');
const reactionFeedback = document.getElementById('reactionFeedback');

let reactionState = 'idle';
let reactionTimer = null;
let reactionStartedAt = 0;
let bestReaction = null;

if (
  reactionStage &&
  reactionButton &&
  reactionSignal &&
  reactionHeading &&
  reactionMessage &&
  reactionResult &&
  reactionTime &&
  reactionFeedback
) {
  reactionButton.addEventListener('click', () => {
    // Se a pessoa clicar antes do sinal verde, registra falsa largada.
    if (reactionState === 'waiting') {
      window.clearTimeout(reactionTimer);
      reactionState = 'result';

      reactionStage.classList.remove('is-waiting', 'is-ready');
      reactionSignal.textContent = 'Falsa largada';
      reactionHeading.textContent = 'Você antecipou o sinal!';
      reactionMessage.textContent = 'Espere o verde aparecer antes de tocar no botão.';
      reactionButton.textContent = 'Tentar novamente';
      reactionResult.hidden = true;
      return;
    }

    // Registra o tempo depois que o sinal verde aparece.
    if (reactionState === 'ready') {
      const tempoDecorrido = Math.round(performance.now() - reactionStartedAt);
      const boaReacao = tempoDecorrido < 800;

      reactionState = 'result';
      reactionStage.classList.remove('is-ready');
      reactionButton.textContent = 'Tentar novamente';

      if (bestReaction === null || tempoDecorrido < bestReaction) {
        bestReaction = tempoDecorrido;
      }

      if (boaReacao) {
        reactionSignal.textContent = 'Tempo registrado';
        reactionHeading.textContent = 'Boa reação!';
        reactionMessage.textContent = 'Pronto para tentar mais uma vez?';
      } else {
        reactionSignal.textContent = 'Tente novamente';
        reactionHeading.textContent = 'Concentre-se!';
        reactionMessage.textContent = 'Seu tempo foi de 0,80 s ou mais. Concentre-se e tente de novo.';
      }

      // Exibe segundos com duas casas decimais, por exemplo: 0,64 s.
      const tempoFormatado = (tempoDecorrido / 1000).toFixed(2).replace('.', ',');
      const melhorTempoFormatado = (bestReaction / 1000).toFixed(2).replace('.', ',');

      reactionTime.textContent = `${tempoFormatado} s`;
      reactionFeedback.textContent =
        `Seu melhor tempo nesta sessão: ${melhorTempoFormatado} s.`;
      reactionResult.hidden = false;
      return;
    }

    // Inicia uma nova tentativa com espera aleatória.
    reactionState = 'waiting';
    reactionResult.hidden = true;
    reactionStage.classList.remove('is-ready');
    reactionStage.classList.add('is-waiting');

    reactionSignal.textContent = 'Atenção';
    reactionHeading.textContent = 'Aguarde o verde…';
    reactionMessage.textContent = 'Não toque antes do sinal.';
    reactionButton.textContent = 'Aguardando sinal…';

    const atraso = 1500 + Math.random() * 3500;

    reactionTimer = window.setTimeout(() => {
      if (reactionState !== 'waiting') return;

      reactionState = 'ready';
      reactionStartedAt = performance.now();

      reactionStage.classList.remove('is-waiting');
      reactionStage.classList.add('is-ready');

      reactionSignal.textContent = 'AGORA!';
      reactionHeading.textContent = 'TOQUE!';
      reactionMessage.textContent = 'Clique no botão o mais rápido que puder.';
      reactionButton.textContent = 'TOQUE AGORA!';
    }, atraso);
  });
}
