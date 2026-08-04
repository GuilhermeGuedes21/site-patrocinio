// ===== MENU HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-ativo');
});

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const alvo = document.querySelector(link.getAttribute('href'));
    if (alvo) {
      alvo.scrollIntoView({ behavior: 'smooth' });
      navLinks.classList.remove('mobile-ativo');
    }
  });
});

// ===== COUNTDOWN =====
const dataAlvo = new Date('2026-11-09T00:00:00').getTime();
function atualizarCountdown() {
  const agora = new Date().getTime();
  const diff = dataAlvo - agora;
  if (diff <= 0) return;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const elDias = document.getElementById('dias');
  const elHoras = document.getElementById('horas');
  const elMinutos = document.getElementById('minutos');

  if (elDias) elDias.textContent = String(dias).padStart(2, '0');
  if (elHoras) elHoras.textContent = String(horas).padStart(2, '0');
  if (elMinutos) elMinutos.textContent = String(minutos).padStart(2, '0');
}
setInterval(atualizarCountdown, 1000);
atualizarCountdown();

// ===== FILTRO DA GALERIA (se existir) =====
const filtroBtns = document.querySelectorAll('.filtro-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroBtns.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    const filtro = btn.dataset.filtro;

    galleryItems.forEach(item => {
      const categoria = item.dataset.categoria;
      if (filtro === 'todos' || categoria === filtro) {
        item.classList.remove('oculto');
        item.classList.remove('filtrando');
        void item.offsetWidth;
        item.classList.add('filtrando');
      } else {
        item.classList.add('oculto');
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let imagensVisiveis = [];
let indiceAtual = 0;

function atualizarImagensVisiveis() {
  imagensVisiveis = Array.from(galleryItems)
    .filter(item => !item.classList.contains('oculto'))
    .map(item => item.querySelector('img').src);
}

function abrirLightbox(index) {
  atualizarImagensVisiveis();
  indiceAtual = index;
  lightboxImg.src = imagensVisiveis[indiceAtual];
  lightboxCounter.textContent = `${indiceAtual + 1} / ${imagensVisiveis.length}`;
  lightbox.classList.add('ativo');
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    atualizarImagensVisiveis();
    const imgSrc = item.querySelector('img').src;
    const index = imagensVisiveis.indexOf(imgSrc);
    abrirLightbox(index);
  });
});

lightboxClose.addEventListener('click', () => lightbox.classList.remove('ativo'));

lightboxPrev.addEventListener('click', () => {
  indiceAtual = (indiceAtual - 1 + imagensVisiveis.length) % imagensVisiveis.length;
  lightboxImg.src = imagensVisiveis[indiceAtual];
  lightboxCounter.textContent = `${indiceAtual + 1} / ${imagensVisiveis.length}`;
});

lightboxNext.addEventListener('click', () => {
  indiceAtual = (indiceAtual + 1) % imagensVisiveis.length;
  lightboxImg.src = imagensVisiveis[indiceAtual];
  lightboxCounter.textContent = `${indiceAtual + 1} / ${imagensVisiveis.length}`;
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('ativo');
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('ativo')) return;
  if (e.key === 'Escape') lightbox.classList.remove('ativo');
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});
