document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card").forEach((card) => {
    const links = [...card.querySelectorAll('a[href*="x.com/"]')];

    const usuarios = links
      .map((link) => {
        try {
          const url = new URL(link.href);
          if (url.hostname !== "x.com" &&
            url.hostname !== "www.x.com") {
            return null;
          }

          return url.pathname.split("/").filter(Boolean)[0] || null;
        } catch {
          return null;
        }
      })
      .filter((usuario, index, lista) =>
        usuario &&
        usuario.toLowerCase() !== "home" &&
        lista.indexOf(usuario) === index
      );

    const areaIcone = card.querySelector(".icone");
    if (!areaIcone || usuarios.length === 0) return;

    areaIcone.replaceChildren();

    usuarios.forEach((usuario) => {
      const img = document.createElement("img");

      img.src = `https://avatarsapi.com/x/${encodeURIComponent(usuario)}`;
      img.alt = `Foto de perfil de @${usuario}`;
      img.title = `@${usuario}`;
      img.loading = "lazy";

      img.onerror = () => {
        img.onerror = null;
        img.src = "imagens/avatar-padrao.png";
        img.alt = `Foto indisponível de @${usuario}`;
      };

      areaIcone.appendChild(img);
    });

    areaIcone.classList.toggle("multiplos", usuarios.length > 1);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const campo = document.getElementById("campoPesquisa");
  const botao = document.getElementById("botaoPesquisar");
  const mensagem = document.getElementById("mensagemPesquisa");
  const cards = document.querySelectorAll(".lista_acervos .card");

  if (!campo || !botao || !mensagem) return;

  function pesquisarAcervos() {
    const termo = campo.value
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    let encontrados = 0;

    cards.forEach((card) => {
      const conteudo = card.textContent
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const corresponde = conteudo.includes(termo);

      card.hidden = !corresponde;

      if (corresponde) encontrados++;
    });

    if (termo === "") {
      mensagem.textContent = "";
    } else if (encontrados === 0) {
      mensagem.textContent = "Nenhum acervo encontrado.";
    } else {
      mensagem.textContent =
        `${encontrados} acervo(s) encontrado(s).`;
    }
  }

  botao.addEventListener("click", pesquisarAcervos);

  campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      pesquisarAcervos();
    }
  });

  campo.addEventListener("input", pesquisarAcervos);
});