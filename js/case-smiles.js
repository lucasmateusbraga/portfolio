// Clube Smiles+ case: two small interactive demos and the sales page auto-scroll.
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('DOMContentLoaded', function(){
    // plan selection demo
    var group = document.querySelector('.sm-plans');
    if(group){
      var plans = group.querySelectorAll('.sm-plan');
      var cont = group.querySelector('.sm-continue-btn');
      plans.forEach(function(p){
        p.addEventListener('click', function(){
          plans.forEach(function(o){
            var on = o === p;
            o.setAttribute('aria-checked', on ? 'true' : 'false');
            var cta = o.querySelector('.sm-cta'); cta.textContent = on ? cta.dataset.on : cta.dataset.idle;
          });
          group.classList.add('has-choice');
          cont.textContent = cont.dataset.on;
        });
      });
    }

    // monthly switch demo
    var sw = document.querySelector('.sm-switch');
    if(sw){
      var active = sw.querySelector('[data-active]');
      var msg = sw.querySelector('[data-switch-msg]');
      var items = sw.querySelectorAll('.sm-partner');
      var setState = function(state){
        sw.dataset.state = state;
        msg.textContent = state === 'used' ? msg.dataset.used : msg.dataset.available;
        items.forEach(function(it){
          var isActive = it.classList.contains('is-active');
          it.querySelector('small').textContent = isActive ? 'Ativo' : (state === 'used' ? 'Troca já usada' : 'Trocar');
          it.setAttribute('aria-disabled', (!isActive && state === 'used') ? 'true' : 'false');
        });
      };
      items.forEach(function(it){
        it.addEventListener('click', function(){
          if(it.classList.contains('is-active') || sw.dataset.state === 'used') return;
          items.forEach(function(o){ o.classList.remove('is-active'); });
          it.classList.add('is-active');
          active.textContent = it.dataset.name;
          setState('used');
        });
      });
      var reset = document.querySelector('.sm-reset');
      if(reset) reset.addEventListener('click', function(){
        items.forEach(function(o, i){ o.classList.toggle('is-active', i === 0); });
        active.textContent = items[0].dataset.name;
        setState('available');
      });
      setState('available');
    }

    // long page auto-scroll, only while visible
    if(reduce || !('IntersectionObserver' in window)) return;
    var views = document.querySelectorAll('[data-autoscroll]');
    if(!views.length) return;
    document.documentElement.classList.add('sm-autoscroll-on');
    views.forEach(function(view){
      var img = view.querySelector('img');
      var measure = function(){
        var dist = Math.max(0, img.getBoundingClientRect().height - view.getBoundingClientRect().height);
        view.style.setProperty('--dist', (-dist) + 'px');
        view.style.setProperty('--dur', Math.max(12, dist / 110).toFixed(1) + 's');
      };
      if(img.complete) measure(); else img.addEventListener('load', measure);
      window.addEventListener('resize', measure);
      new IntersectionObserver(function(e){ view.classList.toggle('is-visible', e[0].isIntersecting); }, { threshold: .3 }).observe(view);
    });
  });
})();
