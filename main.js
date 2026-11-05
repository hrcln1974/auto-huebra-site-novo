(function () {
  var H = window.HB,
    $ = function (s, r) {
      return (r || document).querySelector(s);
    },
    $$ = function (s, r) {
      return [].slice.call((r || document).querySelectorAll(s));
    };
  var tg = $(".tg"),
    nv = $("nav");
  tg &&
    tg.addEventListener("click", function () {
      var o = nv.classList.toggle("on");
      tg.setAttribute("aria-expanded", o);
    });
  $$("[data-y]").forEach(function (e) {
    e.textContent = new Date().getFullYear();
  });
  function ga() {
    if (!H.ga || window.gtag) return;
    var s = document.createElement("script");
    s.async = 1;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + H.ga;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      dataLayer.push(arguments);
    };
    gtag("js", new Date());
    gtag("config", H.ga);
  }
  var ck = $(".ck"),
    c = localStorage.getItem("hb_ck");
  if (c === "1") ga();
  else if (!c && ck) ck.classList.add("on");
  $$("[data-ck]").forEach(function (b) {
    b.onclick = function () {
      localStorage.setItem("hb_ck", b.dataset.ck);
      ck.classList.remove("on");
      if (b.dataset.ck === "1") ga();
    };
  });
  $$('a[href^="https://wa.me"]').forEach(function (a) {
    a.addEventListener("click", function () {
      window.gtag && gtag("event", "whatsapp_click");
    });
  });
  var lb = $(".lb");
  $$("[data-lb]").forEach(function (b) {
    b.onclick = function () {
      lb.querySelector("img").src = b.dataset.lb;
      lb.classList.add("on");
    };
  });
  lb &&
    (lb.onclick = function () {
      lb.classList.remove("on");
    });
  // Leads (CRM)
  function leads() {
    try {
      return JSON.parse(localStorage.getItem("hb_leads") || "[]");
    } catch (e) {
      return [];
    }
  }
  $$("form[data-lead]").forEach(function (f) {
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true,
        d = {};
      $$("[name]", f).forEach(function (i) {
        var er = $('[data-e="' + i.name + '"]', f),
          m = "";
        var v = i.type === "checkbox" ? i.checked : i.value.trim();
        d[i.name] = v;
        if (i.name === "nome" && v.length < 3) m = "Informe seu nome completo.";
        if (i.name === "telefone" && v.replace(/\D/g, "").length < 10)
          m = "Informe um telefone com DDD.";
        if (i.name === "email" && v && !/^\S+@\S+\.\S+$/.test(v))
          m = "E-mail inválido.";
        if (i.name === "consent" && !v)
          m = "É necessário aceitar para enviarmos o contato.";
        if (er) er.textContent = m;
        i.classList.toggle("bad", !!m);
        if (m) ok = false;
      });
      if (!ok) {
        var b = $(".bad", f);
        b && b.focus();
        return;
      }
      d.id = Date.now();
      d.data = new Date().toISOString();
      d.status = "Novo";
      d.origem = location.pathname;
      delete d.consent;
      var L = leads();
      L.unshift(d);
      localStorage.setItem("hb_leads", JSON.stringify(L));
      window.gtag && gtag("event", "generate_lead");
      var go = function () {
        location.href =
          "obrigado.html?n=" + encodeURIComponent(d.nome.split(" ")[0]);
      };
      var btn = $("button[type=submit]", f);
      btn.disabled = true;
      btn.textContent = "Enviando…";
      if (H.endpoint) {
        fetch(H.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(d),
        }).then(go, function () {
          var m = $(".fm", f);
          m.textContent = "Não foi possível enviar agora. Chame no WhatsApp.";
          btn.disabled = false;
          btn.textContent = "Solicitar orçamento";
        });
      } else go();
    });
  });
  // Catálogo público
  var pg = $("#prods");
  if (pg) {
    var P = [];
    try {
      P = JSON.parse(localStorage.getItem("hb_prods") || "null");
    } catch (e) {}
    (P
      ? Promise.resolve(P)
      : fetch("products.json").then(function (r) {
          return r.json();
        })
    ).then(function (P) {
      var lim = +pg.dataset.n || 99,
        cats = ["Todos"].concat(
          P.map(function (p) {
            return p.cat;
          }).filter(function (v, i, a) {
            return a.indexOf(v) === i;
          }),
        );
      var fl = $("#cats");
      function draw(c) {
        pg.innerHTML = P.filter(function (p) {
          return c === "Todos" || p.cat === c;
        })
          .slice(0, lim)
          .map(function (p) {
            var s = +p.estoque > 0;
            return (
              '<article class="card pc"><div class="pi"><img src="' +
              p.img +
              '" alt="' +
              p.nome +
              '" loading="lazy" width="400" height="400"></div><span class="tag">' +
              p.cat +
              '</span> <span class="tag ' +
              (s ? "ok" : "no") +
              '">' +
              (s ? "Em estoque" : "Sob encomenda") +
              '</span><h3 style="margin-top:10px;font-size:1.15rem">' +
              p.nome +
              '</h3><p class="mu">' +
              p.desc +
              "</p><p><strong>" +
              (p.preco ? "R$ " + p.preco : "Consulte o preço") +
              '</strong></p><a class="btn bw sm" href="https://wa.me/' +
              H.wa +
              "?text=" +
              encodeURIComponent("Olá! Tenho interesse em: " + p.nome) +
              '" target="_blank" rel="noopener">Pedir no WhatsApp</a></article>'
            );
          })
          .join("");
      }
      if (fl) {
        fl.innerHTML = cats
          .map(function (c, i) {
            return '<button class="' + (i ? "" : "on") + '">' + c + "</button>";
          })
          .join("");
        fl.onclick = function (e) {
          if (e.target.tagName !== "BUTTON") return;
          $$("button", fl).forEach(function (b) {
            b.classList.remove("on");
          });
          e.target.classList.add("on");
          draw(e.target.textContent);
        };
      }
      draw("Todos");
    });
  }
  // Obrigado
  var n = $("[data-nome]");
  if (n) {
    var q = new URLSearchParams(location.search).get("n");
    if (q) n.textContent = ", " + q;
    window.gtag && gtag("event", "conversion_obrigado");
  }
})();
