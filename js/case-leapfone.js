// Leapfone case: plays the hero video and the long-page auto-scroll only while they are on screen.
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('DOMContentLoaded', function(){
    var video = document.querySelector('.lf-video');
    var views = document.querySelectorAll('[data-autoscroll]');
    if(!('IntersectionObserver' in window)) return;

    // hero video: autoplay in view, pause out of view. With reduced motion it shows the poster and native controls.
    if(video){
      if(reduce){ video.setAttribute('controls',''); }
      else{
        new IntersectionObserver(function(e){
          if(e[0].isIntersecting){ var p = video.play(); if(p && p.catch) p.catch(function(){}); }
          else video.pause();
        }, { threshold: .35 }).observe(video);
      }
    }

    if(reduce || !views.length) return;
    document.documentElement.classList.add('lf-autoscroll-on');
    views.forEach(function(view){
      var img = view.querySelector('img');
      var measure = function(){
        var dist = Math.max(0, img.getBoundingClientRect().height - view.getBoundingClientRect().height);
        view.style.setProperty('--dist', (-dist) + 'px');
        view.style.setProperty('--dur', Math.max(12, dist / 110).toFixed(1) + 's');   // ~110px per second
      };
      if(img.complete) measure(); else img.addEventListener('load', measure);
      window.addEventListener('resize', measure);
      new IntersectionObserver(function(e){ view.classList.toggle('is-visible', e[0].isIntersecting); }, { threshold: .3 }).observe(view);
    });
  });
})();
