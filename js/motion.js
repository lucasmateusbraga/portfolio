// =========================================================
// lucasbraga - motion layer
// Loaded after script.js. Adds entrance and scroll motion to
// the existing markup without changing the layout:
//   1. hero headline and lead come in word by word, out of a blur
//   2. section titles fill from grey to ink, letter by letter
//   3. project covers go from blurred to sharp (CSS only, keyed off .in)
//   4. the clients row turns into a slow marquee
//   5. grouped items (highlights, testimonials, contact) stagger in
// html.motion is set by a tiny inline script in <head>; if it is
// missing (reduced motion, or JS off) none of this runs.
// =========================================================
(function(){
  var root = document.documentElement;
  if(!root.classList.contains('motion')) return;
  window.__lbMotion = true;

  document.addEventListener('DOMContentLoaded', function(){
    var run = function(name, fn){
      try { fn(); } catch(err){ console.error('[lucasbraga motion] ' + name + ' failed:', err); }
    };
    run('hero', initHero);
    run('fill', function(){ initFill(false); });
    run('marquee', initMarquee);
    run('stagger', initStagger);

    // script.js rewrites innerHTML on language change, which removes the split spans
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        run('hero', function(){ splitHero(); });
        run('fill', function(){ initFill(true); });
      });
    });
  });

  /* ---------- split helper: wraps words (or chars inside words) of text nodes, keeping inline tags ---------- */
  function wrapText(el, mode, make){
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    var i = 0;
    nodes.forEach(function(node){
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function(part){
        if(!part) return;
        if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
        if(mode === 'word'){ frag.appendChild(make(part, i++)); return; }
        var word = document.createElement('span');
        word.className = 'm-w';
        Array.from(part).forEach(function(ch){ word.appendChild(make(ch, i++)); });
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return i;
  }

  /* ---------- 1. hero ---------- */
  function initHero(){
    var hero = document.querySelector('.hero');
    if(!hero) return;
    var eyebrow = hero.querySelector('.eyebrow');
    var h1 = hero.querySelector('h1');
    var lead = hero.querySelector('p.lead');
    var ctas = hero.querySelector('.hero-ctas');
    var clients = hero.querySelector('.clients');
    if(h1) h1.setAttribute('data-words', '');
    if(lead) lead.setAttribute('data-words', '');
    if(eyebrow) eyebrow.setAttribute('data-in', '');
    var words = splitHero();
    hero.classList.add('is-split');
    // buttons and clients follow the text, timed off the headline length
    var afterText = 0.35 + words.h1 * 0.07 + 0.5;
    if(ctas){ ctas.setAttribute('data-in', ''); ctas.style.setProperty('--in-delay', afterText.toFixed(2) + 's'); }
    if(clients){ clients.setAttribute('data-in', ''); clients.style.setProperty('--in-delay', (afterText + 0.2).toFixed(2) + 's'); }
    // two frames so the hidden state paints before the transition starts
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ hero.classList.add('is-ready'); }); });
  }

  function splitHero(){
    var h1 = document.querySelector('.hero h1[data-words]');
    var lead = document.querySelector('.hero p.lead[data-words]');
    var make = function(txt, i){
      var s = document.createElement('span');
      s.className = 'm-w'; s.textContent = txt; s.style.setProperty('--i', i);
      return s;
    };
    var n = h1 ? wrapText(h1, 'word', make) : 0;
    if(h1){ h1.style.setProperty('--base', '.15s'); h1.style.setProperty('--step', '70ms'); }
    if(lead){
      wrapText(lead, 'word', make);
      lead.style.setProperty('--base', (0.35 + n * 0.07).toFixed(2) + 's');
      lead.style.setProperty('--step', '18ms');
    }
    return { h1: n };
  }

  /* ---------- 2. section titles ---------- */
  var fillIO = null;
  function initFill(rebuild){
    var heads = document.querySelectorAll('.section-head h2, .contact-intro h2');
    if(!heads.length || !('IntersectionObserver' in window)) return;
    heads.forEach(function(h){
      h.setAttribute('data-fill', '');
      var words = h.textContent.trim().split(/\s+/);
      var keep = Math.max(1, Math.floor(words.length * 0.45));   // first ~45% of the words stay dark
      wrapText(h, 'char', function(ch){
        var s = document.createElement('span');
        s.className = 'm-c'; s.textContent = ch;
        return s;
      });
      var w = 0, muted = 0;
      h.querySelectorAll(':scope > .m-w').forEach(function(word){
        if(w++ < keep) return;
        word.querySelectorAll('.m-c').forEach(function(c){
          c.classList.add('is-muted');
          c.style.setProperty('--i', rebuild && h.classList.contains('is-filled') ? 0 : muted++);
        });
      });
    });
    if(fillIO) return;
    fillIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-filled'); fillIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -25% 0px', threshold: 1 });
    heads.forEach(function(h){ fillIO.observe(h); });
  }

  /* ---------- 4. clients marquee ---------- */
  function initMarquee(){
    var row = document.querySelector('.clients-row');
    if(!row) return;
    var items = Array.prototype.slice.call(row.children);
    // four copies = two identical halves, so translateX(-50%) loops seamlessly on wide screens
    for(var k = 0; k < 3; k++){
      items.forEach(function(item){
        var c = item.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        row.appendChild(c);
      });
    }
    var mask = document.createElement('div');
    mask.className = 'clients-mask';
    row.parentNode.insertBefore(mask, row);
    mask.appendChild(row);
    row.classList.add('is-marquee');
  }

  /* ---------- 5. staggered groups ---------- */
  function initStagger(){
    document.querySelectorAll('.about-highlights, .testimonial-grid, .contact-cards').forEach(function(group){
      group.setAttribute('data-stagger', '');
      Array.prototype.forEach.call(group.children, function(child, i){ child.style.setProperty('--i', i); });
    });
  }
})();
