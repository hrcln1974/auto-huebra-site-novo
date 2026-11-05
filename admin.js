(function () {
  var H = window.HB,
    $ = function (s) {
      return document.querySelector(s);
    },
    A = $("#app");
  function J(k, d) {
    try {
      return JSON.parse(localStorage.getItem(k)) || d;
    } catch (e) {
      return d;
    }
  }
  function login() {
    A.innerHTML =
      '<div class="card" style="max-width:380px;margin:60px auto"><h2>Painel Huebra</h2><div class="f"><label for="pw">Senha</label><input id="pw" type="password"></div><p class="er" id="pe"></p><button class="btn b1" id="go">Entrar</button></div>';
    $("#go").onclick = function () {
      if ($("#pw").value === H.adminPass) {
        sessionStorage.setItem("hb_ok", "1");
        app();
      } else $("#pe").textContent = "Senha incorreta.";
    };
  }
  function dl(n, t, m) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([t], { type: m }));
    a.download = n;
    a.click();
  }
  var tab = "leads";
  function app() {
    if (sessionStorage.getItem("hb_ok") !== "1") return login();
    A.innerHTML =
      '<div class="fl"><button data-t="leads">CRM / Leads</button><button data-t="prods">Estoque e catálogo</button><button id="out">Sair</button></div><div id="v"></div>';
    [].forEach.call(A.querySelectorAll("[data-t]"), function (b) {
      b.className = b.dataset.t === tab ? "on" : "";
      b.onclick = function () {
        tab = b.dataset.t;
        app();
      };
    });
    $("#out").onclick = function () {
      sessionStorage.clear();
      login();
    };
    tab === "leads" ? leadsV() : prodsV();
  }
  var ST = ["Novo", "Em contato", "Orçamento enviado", "Fechado", "Perdido"];
  function leadsV() {
    var L = J("hb_leads", []);
    $("#v").innerHTML =
      '<p class="mu">Leads capturados neste navegador. Para receber de todos os visitantes, configure <code>endpoint</code> em config.js.</p><div class="fl"><button id="ex">Exportar CSV</button></div>' +
      (L.length
        ? '<div style="overflow:auto"><table><tr><th>Data</th><th>Nome</th><th>Telefone</th><th>Veículo</th><th>Serviço</th><th>Status</th><th></th></tr>' +
          L.map(function (l, i) {
            return (
              "<tr><td>" +
              new Date(l.data).toLocaleDateString("pt-BR") +
              "</td><td>" +
              esc(l.nome) +
              '</td><td><a href="https://wa.me/55' +
              l.telefone.replace(/\D/g, "") +
              '" target="_blank" rel="noopener">' +
              esc(l.telefone) +
              "</a></td><td>" +
              esc(l.veiculo || "") +
              "</td><td>" +
              esc(l.servico || "") +
              '</td><td><select data-i="' +
              i +
              '">' +
              ST.map(function (s) {
                return (
                  "<option" +
                  (s === l.status ? " selected" : "") +
                  ">" +
                  s +
                  "</option>"
                );
              }).join("") +
              '</select></td><td><button data-d="' +
              i +
              '">✕</button></td></tr>'
            );
          }).join("") +
          "</table></div>"
        : "<p>Nenhum lead ainda.</p>");
    [].forEach.call(document.querySelectorAll("[data-i]"), function (s) {
      s.onchange = function () {
        L[s.dataset.i].status = s.value;
        localStorage.setItem("hb_leads", JSON.stringify(L));
      };
    });
    [].forEach.call(document.querySelectorAll("[data-d]"), function (b) {
      b.onclick = function () {
        if (confirm("Excluir lead?")) {
          L.splice(b.dataset.d, 1);
          localStorage.setItem("hb_leads", JSON.stringify(L));
          leadsV();
        }
      };
    });
    $("#ex").onclick = function () {
      dl(
        "leads.csv",
        "Data;Nome;Telefone;Email;Veiculo;Servico;Mensagem;Status\n" +
          L.map(function (l) {
            return [
              l.data,
              l.nome,
              l.telefone,
              l.email,
              l.veiculo,
              l.servico,
              l.mensagem,
              l.status,
            ]
              .map(function (x) {
                return '"' + String(x || "").replace(/"/g, '""') + '"';
              })
              .join(";");
          }).join("\n"),
        "text/csv",
      );
    };
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function prodsV() {
    var P = J("hb_prods", null);
    var go = function (P) {
      $("#v").innerHTML =
        '<p class="mu">Edições ficam salvas neste navegador. Clique em <b>Exportar products.json</b> e substitua o arquivo no servidor para publicar para todos.</p><div class="fl"><button id="ad">+ Novo produto</button><button id="ex">Exportar products.json</button></div><div style="overflow:auto"><table><tr><th>Produto</th><th>Categoria</th><th>Preço (R$)</th><th>Estoque</th><th></th></tr>' +
        P.map(function (p, i) {
          return (
            '<tr><td><input data-k="nome" data-i="' +
            i +
            '" value="' +
            esc(p.nome) +
            '"></td><td><input data-k="cat" data-i="' +
            i +
            '" value="' +
            esc(p.cat) +
            '"></td><td><input data-k="preco" data-i="' +
            i +
            '" value="' +
            esc(p.preco) +
            '" size="6"></td><td><input type="number" min="0" data-k="estoque" data-i="' +
            i +
            '" value="' +
            p.estoque +
            '" style="width:80px' +
            (+p.estoque < 3 ? ";border-color:#ff4757" : "") +
            '"></td><td><button data-d="' +
            i +
            '">✕</button></td></tr>'
          );
        }).join("") +
        '</table></div><p class="mu">Borda vermelha = estoque baixo (menos de 3).</p>';
      var sv = function () {
        localStorage.setItem("hb_prods", JSON.stringify(P));
      };
      [].forEach.call(document.querySelectorAll("input[data-k]"), function (e) {
        e.onchange = function () {
          P[e.dataset.i][e.dataset.k] =
            e.dataset.k === "estoque" ? +e.value : e.value;
          sv();
        };
      });
      [].forEach.call(document.querySelectorAll("[data-d]"), function (b) {
        b.onclick = function () {
          if (confirm("Excluir produto?")) {
            P.splice(b.dataset.d, 1);
            sv();
            go(P);
          }
        };
      });
      $("#ad").onclick = function () {
        P.push({
          id: Date.now(),
          nome: "Novo produto",
          cat: "Peças elétricas",
          preco: "",
          estoque: 0,
          img: "img/pecas.webp",
          desc: "",
        });
        sv();
        go(P);
      };
      $("#ex").onclick = function () {
        dl("products.json", JSON.stringify(P, null, 1), "application/json");
      };
    };
    P
      ? go(P)
      : fetch("products.json")
          .then(function (r) {
            return r.json();
          })
          .then(go);
  }
  app();
})();
