/* Robótica na escola: progresso, quiz, conquistas e busca no glossário.
   O progresso é salvo no navegador (localStorage) do aparelho de cada aluna. */
(function () {
  'use strict';

  // Quantidade de temas e passos de cada módulo (gerado automaticamente).
  var MODULOS = {"1": {"temas": 5, "passos": 3}, "2": {"temas": 5, "passos": 3}, "3": {"temas": 6, "passos": 3}, "4": {"temas": 6, "passos": 3}, "5": {"temas": 6, "passos": 3}, "6": {"temas": 6, "passos": 4}};
  var CHAVE = 'robotica-escola-v1';
  var NIVEIS = [
    { min: 0, nome: 'Iniciante' },
    { min: 100, nome: 'Exploradora' },
    { min: 250, nome: 'Construtora' },
    { min: 400, nome: 'Programadora' },
    { min: 600, nome: 'Engenheira' }
  ];

  var estado = { temas: {}, passos: {}, quiz: {} };

  function carregar() {
    try {
      var bruto = window.localStorage.getItem(CHAVE);
      if (bruto) { estado = JSON.parse(bruto); }
    } catch (e) { /* sem armazenamento: o site funciona, mas não salva */ }
    estado.temas = estado.temas || {};
    estado.passos = estado.passos || {};
    estado.quiz = estado.quiz || {};
  }

  function salvar() {
    try { window.localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignora */ }
  }

  function lista(obj, n) { obj[n] = obj[n] || []; return obj[n]; }

  function alternar(arr, i, ligado) {
    var pos = arr.indexOf(i);
    if (ligado && pos === -1) { arr.push(i); }
    if (!ligado && pos !== -1) { arr.splice(pos, 1); }
  }

  function percentual(n) {
    var cfg = MODULOS[n];
    var feitos = lista(estado.temas, n).length + lista(estado.passos, n).length + (estado.quiz[n] ? 1 : 0);
    var total = cfg.temas + cfg.passos + 1;
    return Math.round(feitos / total * 100);
  }

  function xpTotal() {
    var xp = 0;
    for (var n in MODULOS) {
      xp += lista(estado.temas, n).length * 10 + lista(estado.passos, n).length * 15 + (estado.quiz[n] ? 20 : 0);
    }
    return xp;
  }

  function nivel(xp) {
    var atual = 0;
    for (var i = 0; i < NIVEIS.length; i++) { if (xp >= NIVEIS[i].min) { atual = i; } }
    return { numero: atual + 1, nome: NIVEIS[atual].nome };
  }

  /* ---------- Página de módulo ---------- */
  function iniciarModulo(n) {
    var temas = document.querySelectorAll('details[data-tema]');
    var passos = document.querySelectorAll('.passo');
    var barra = document.getElementById('prog-modulo');
    var barraBox = document.getElementById('barra-modulo');
    var texto = document.getElementById('prog-texto');
    var barraPratica = document.getElementById('prog-pratica');
    var contagem = document.getElementById('contagem');
    var resp = document.getElementById('resposta');

    function pintarTema(el) {
      var i = parseInt(el.getAttribute('data-tema'), 10);
      var feito = lista(estado.temas, n).indexOf(i) !== -1;
      el.classList.toggle('feito', feito);
      el.querySelector('.estado').textContent = feito ? 'Concluído' : 'A fazer';
      var b = el.querySelector('.concluir');
      b.textContent = feito ? 'Desmarcar' : b.getAttribute('data-rotulo');
    }

    function atualizar() {
      var p = percentual(n);
      barra.style.width = p + '%';
      barraBox.setAttribute('aria-valuenow', p);
      texto.textContent = p === 100 ? '100% · missão cumprida!' : p + '%';
      var feitos = lista(estado.passos, n).length;
      barraPratica.style.width = Math.round(feitos / passos.length * 100) + '%';
      contagem.textContent = feitos + ' de ' + passos.length + ' passos';
    }

    Array.prototype.forEach.call(temas, function (el) {
      var b = el.querySelector('.concluir');
      b.setAttribute('data-rotulo', b.textContent);
      pintarTema(el);
      b.addEventListener('click', function () {
        var i = parseInt(el.getAttribute('data-tema'), 10);
        var feito = lista(estado.temas, n).indexOf(i) !== -1;
        alternar(lista(estado.temas, n), i, !feito);
        pintarTema(el);
        salvar();
        atualizar();
      });
    });

    Array.prototype.forEach.call(passos, function (cx) {
      var i = parseInt(cx.getAttribute('data-i'), 10);
      cx.checked = lista(estado.passos, n).indexOf(i) !== -1;
      cx.addEventListener('change', function () {
        alternar(lista(estado.passos, n), i, cx.checked);
        salvar();
        atualizar();
      });
    });

    if (estado.quiz[n]) { resp.textContent = 'Você já acertou este quiz. Parabéns!'; resp.className = 'certo'; }
    document.getElementById('conferir').addEventListener('click', function () {
      var marcada = document.querySelector('input[name="q"]:checked');
      resp.className = '';
      if (!marcada) { resp.textContent = 'Escolha uma alternativa primeiro.'; return; }
      if (marcada.getAttribute('data-certo') === 'sim') {
        resp.textContent = 'Isso aí! Acertou.';
        resp.className = 'certo';
        estado.quiz[n] = true;
        salvar();
        atualizar();
      } else {
        resp.textContent = 'Quase! Releia a teoria e tente de novo.';
        resp.className = 'errado';
      }
    });

    atualizar();
  }

  /* ---------- Página inicial ---------- */
  function iniciarInicio() {
    Array.prototype.forEach.call(document.querySelectorAll('.card[data-modulo]'), function (c) {
      var n = c.getAttribute('data-modulo');
      c.querySelector('.mini > div').style.width = percentual(n) + '%';
    });
    Array.prototype.forEach.call(document.querySelectorAll('.badge[data-modulo]'), function (b) {
      var n = b.getAttribute('data-modulo');
      var ok = percentual(n) === 100;
      b.classList.toggle('on', ok);
      b.querySelector('small').textContent = ok ? 'Conquistada!' : 'Bloqueada';
    });
    var xp = xpTotal();
    var nv = nivel(xp);
    document.getElementById('nivel').textContent = 'Nível ' + nv.numero + ' · ' + nv.nome;
    document.getElementById('xp').textContent = xp + ' XP';
    document.getElementById('reiniciar').addEventListener('click', function () {
      if (window.confirm('Apagar todo o seu progresso neste aparelho?')) {
        estado = { temas: {}, passos: {}, quiz: {} };
        salvar();
        iniciarInicio();
      }
    });
  }

  /* ---------- Glossário ---------- */
  function normalizar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function iniciarGlossario() {
    var campo = document.getElementById('busca');
    var itens = document.querySelectorAll('.termo');
    var aviso = document.getElementById('sem-resultado');
    campo.addEventListener('input', function () {
      var q = normalizar(campo.value.trim());
      var visiveis = 0;
      Array.prototype.forEach.call(itens, function (it) {
        var mostra = normalizar(it.textContent).indexOf(q) !== -1;
        it.hidden = !mostra;
        if (mostra) { visiveis++; }
      });
      aviso.hidden = visiveis !== 0;
    });
  }

  carregar();
  var corpo = document.body;
  if (corpo.classList.contains('pagina-modulo')) { iniciarModulo(corpo.getAttribute('data-modulo')); }
  if (document.getElementById('xp')) { iniciarInicio(); }
  if (document.getElementById('busca')) { iniciarGlossario(); }
})();

// Abas de conteúdo, apresentação e materiais adicionais
(function () {
  const tabs = document.querySelectorAll('[data-aba]');
  const paineis = document.querySelectorAll('.painel-aba');
  if (!tabs.length || !paineis.length) return;

  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(b => {
      const ativa = b === t;
      b.classList.toggle('ativa', ativa);
      b.setAttribute('aria-selected', ativa ? 'true' : 'false');
    });

    const alvoId = 'painel-' + t.dataset.aba;
    paineis.forEach(p => {
      p.hidden = p.id !== alvoId;
    });
  }));
})();
