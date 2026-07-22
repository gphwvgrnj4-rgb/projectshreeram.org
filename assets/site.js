/* Project Shree Ram — shared site behaviour */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Language dropdown (globe)
  function closeAll(except) {
    var open = document.querySelectorAll('.langpick.open');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== except) {
        open[i].classList.remove('open');
        var b = open[i].querySelector('.langpick-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    }
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.langpick-btn') : null;
    if (btn) {
      e.preventDefault();
      var pick = btn.closest('.langpick');
      var willOpen = !pick.classList.contains('open');
      closeAll(pick);
      pick.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }
    if (!(e.target.closest && e.target.closest('.langpick-menu'))) closeAll(null);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.keyCode === 27) closeAll(null); });

  // Devanagari / Roman script toggle (Hindi page only)
  var st = document.querySelector('.script-toggle');
  if (st) {
    st.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-script]');
      if (!b) return;
      var mode = b.getAttribute('data-script'); // 'deva' | 'roman'
      document.querySelectorAll('[data-deva]').forEach(function (el) {
        el.hidden = (mode !== 'deva');
      });
      document.querySelectorAll('[data-roman]').forEach(function (el) {
        el.hidden = (mode !== 'roman');
      });
      st.querySelectorAll('button').forEach(function (x) { x.classList.toggle('active', x === b); });
      // reveal any scroll-animated elements inside the now-visible script block
      document.querySelectorAll('.reveal, .stagger').forEach(function (el) { el.classList.add('in'); });
    });
  }

  // Scroll reveal
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }
})();

/* share buttons: wire to the current page */
(function(){
  function wire(){
    var url=encodeURIComponent(location.href), t=document.title.split(' | ')[0]||document.title, title=encodeURIComponent(t);
    var m={whatsapp:'https://wa.me/?text='+title+'%20'+url, telegram:'https://t.me/share/url?url='+url+'&text='+title, x:'https://twitter.com/intent/tweet?url='+url+'&text='+title, facebook:'https://www.facebook.com/sharer/sharer.php?u='+url, email:'mailto:?subject='+title+'&body='+url};
    document.querySelectorAll('.share .sh[data-sh]').forEach(function(el){var k=el.getAttribute('data-sh'); if(m[k]) el.setAttribute('href',m[k]);});
    var cp=document.querySelector('.share .sh[data-sh="copy"]');
    if(cp) cp.addEventListener('click',function(e){e.preventDefault(); if(navigator.clipboard) navigator.clipboard.writeText(location.href).then(function(){cp.classList.add('copied'); setTimeout(function(){cp.classList.remove('copied');},1500);});});
  }
  if(document.readyState!=='loading') wire(); else document.addEventListener('DOMContentLoaded',wire);
})();
