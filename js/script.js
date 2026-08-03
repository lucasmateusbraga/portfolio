// =========================================================
// lucasbraga - portfolio interactions
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollSpy();
  initReveal();
  initProjectModals();
  initContactForm();
  setYear();
});

/* ---------- mobile nav ---------- */
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/* ---------- scrollspy: nav links + ruler label ---------- */
function initScrollSpy(){
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const rulerLabel = document.querySelector('.ruler-label');
  const rulerProgress = document.querySelector('.ruler-progress');

  if(sections.length === 0) return;

  const setActive = (id) => {
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
    });
    if(rulerLabel){
      const target = document.getElementById(id);
      const label = target?.dataset.rulerLabel || id;
      rulerLabel.textContent = label;
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  if(rulerProgress){
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
      rulerProgress.style.height = pct + '%';
    }, { passive: true });
  }
}

/* ---------- reveal-on-scroll ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if(items.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    items.forEach(i => i.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(i => observer.observe(i));
}

/* ---------- project case-study modal ---------- */
// The Banco do Brasil case stays as an in-page modal since it's an internal
// banking flow with no public site of its own to theme a dedicated page
// after. Leapfone and Gol Smiles+ each have their own themed page instead,
// linked directly from their project cards in index.html.
const PROJECTS = {
  bb: {
    kicker: 'Case study 01 · App bancário',
    title: 'Banco do Brasil × Leapfone',
    summary: 'Estruturação do fluxo de assinatura de smartphones para clientes Ourocard do BB, do discovery ao handoff com engenharia.',
    body: `
      <h4>Contexto</h4>
      <p>O <strong>Banco do Brasil</strong>, em parceria com a startup <strong>Leapfone</strong>, passou a oferecer aos seus clientes a possibilidade de alugar smartphones por assinatura, com condições especiais e benefícios exclusivos. O desafio era estruturar um fluxo digital eficiente e intuitivo para contratação do serviço, acessível via app e site, garantindo clareza, segurança e adesão.</p>
      <p><strong>Objetivo:</strong> projetar uma jornada fluida e confiável para a assinatura de smartphones, respeitando as diretrizes do BB, as particularidades do modelo BYOD e integrando a oferta da Leapfone à experiência digital dos clientes.</p>

      <figure class="modal-figure">
        <img src="assets/img/bb-app-mockup.jpg" alt="Tela inicial do app do Banco do Brasil com o novo módulo de assinatura de smartphones" loading="lazy">
        <figcaption>Ponto de entrada do serviço dentro do app do BB.</figcaption>
      </figure>

      <h4>Discovery</h4>
      <p>Analisei o cenário de mercado e modelos de aluguel de dispositivos de concorrentes diretos (Itaú, Claro, Vivo, Amazon, Apple Trade-in), levantando aprendizados sobre tom de comunicação, etapas de decisão e fatores de confiança.</p>
      <p>Mapeei, com o time de produto, os pontos de entrada (app, site, Ponto BB), as etapas decisórias (aparelho, plano, benefícios) e as principais dores: <em>"é aluguel ou compra?"</em>, <em>"é seguro?"</em>, <em>"qual o plano ideal?"</em>.</p>
      <p>A partir de dados do time e entrevistas rápidas com clientes do perfil Ourocard, priorizamos os fluxos para três perfis: quem busca sempre o último modelo, quem tem receio de alugar, e quem busca custo-benefício e praticidade.</p>

      <h4>Estruturação da solução</h4>
      <ul>
        <li>Fluxos de comparação de planos e adição de benefícios extras</li>
        <li>Fechamento e pagamento</li>
        <li>Pós-venda e gerenciamento da assinatura</li>
      </ul>
      <p>Toda a estruturação foi feita em FigJam + Figma, validando continuamente com produto e engenharia.</p>

      <div class="modal-compare">
        <figure>
          <img src="assets/img/bb-catalogo.jpg" alt="Catálogo de aparelhos disponíveis para assinatura" loading="lazy">
          <figcaption>Escolha do aparelho</figcaption>
        </figure>
        <figure>
          <img src="assets/img/bb-produto.jpg" alt="Tela de configuração do aparelho, com opções de cor, armazenamento e plano" loading="lazy">
          <figcaption>Configuração do plano</figcaption>
        </figure>
      </div>

      <h4>Testes e validação</h4>
      <p>Conduzi sessões de design review com o time de design e produto, refinando microinterações e mensagens de erro. Em parceria com o time, aplicamos testes de usabilidade com usuários reais, o que gerou melhorias em três frentes: clareza sobre o modelo de aluguel (vs. compra), confiança na oferta, com termos exibidos em linguagem acessível, e simplificação da etapa de pagamento.</p>

      <div class="modal-compare">
        <figure>
          <img src="assets/img/bb-timeline.jpg" alt="Tela explicando o funcionamento da assinatura em três etapas ao longo do tempo" loading="lazy">
          <figcaption>Explicando o modelo</figcaption>
        </figure>
        <figure>
          <img src="assets/img/bb-comparativo.jpg" alt="Comparativo entre assinar e comprar o aparelho" loading="lazy">
          <figcaption>Assinar x comprar</figcaption>
        </figure>
      </div>

      <h4>Handoff</h4>
      <p>Entreguei documentação funcional detalhada por tela: regras de negócio, comportamentos esperados em cada etapa, estágios de integração com a Leapfone e componentes usados do design system. Tudo direto no Figma, com specs interativas para os squads de engenharia.</p>

      <h4>Resultados</h4>
      <ul class="modal-results">
        <li>Redução no tempo médio de contratação no protótipo validado</li>
        <li>Melhora na compreensão da oferta após ajustes de microcopy</li>
        <li>Prototipação validada em 3 ciclos rápidos, com boa receptividade</li>
        <li>Fluxo implementado no app do BB, com previsão de expansão para outros canais</li>
      </ul>

      <p class="modal-note"><strong>Nota:</strong> algumas informações de negócio foram adaptadas ou camufladas para preservar dados sensíveis e respeitar acordos de confidencialidade. A essência do projeto, os processos de design e as soluções propostas foram mantidos para fins de apresentação.</p>
    `
  }
};

function initProjectModals(){
  const overlay = document.querySelector('.modal-overlay');
  const modal = document.querySelector('.modal');
  const modalInner = document.querySelector('.modal-inner');
  const triggers = document.querySelectorAll('[data-project]');
  if(!overlay || !modal || !modalInner) return;

  const openModal = (key) => {
    const data = PROJECTS[key];
    if(!data || data.locked) return;

    modalInner.innerHTML = `
      <button class="modal-close" aria-label="Fechar case study" data-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </button>
      <p class="modal-kicker">${data.kicker}</p>
      <h2>${data.title}</h2>
      <p class="modal-summary">${data.summary}</p>
      <div class="modal-body">${data.body}</div>
    `;
    overlay.classList.add('open');
    document.body.classList.add('modal-locked');
    modalInner.querySelector('[data-close]').addEventListener('click', closeModal);
    modal.scrollTop = 0;
  };

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('modal-locked');
  };

  triggers.forEach(t => {
    t.addEventListener('click', () => openModal(t.dataset.project));
  });

  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
  });
}

/* ---------- contact form (Formspree) ---------- */
function initContactForm(){
  const form = document.querySelector('.contact-form');
  if(!form) return;
  const msg = form.querySelector('.form-msg');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if(form.action.includes('SEU_FORM_ID')){
      msg.textContent = 'Configure seu endpoint do Formspree em contact-form (veja o README).';
      msg.className = 'form-msg error';
      return;
    }

    submitBtn.disabled = true;
    msg.textContent = 'Enviando…';
    msg.className = 'form-msg';

    try{
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if(res.ok){
        msg.textContent = 'Mensagem enviada. Retorno em breve.';
        msg.className = 'form-msg success';
        form.reset();
      } else {
        throw new Error('request failed');
      }
    } catch(err){
      msg.textContent = 'Não consegui enviar agora. Tenta de novo ou manda um e-mail direto.';
      msg.className = 'form-msg error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function setYear(){
  const el = document.querySelector('[data-year]');
  if(el) el.textContent = new Date().getFullYear();
}
