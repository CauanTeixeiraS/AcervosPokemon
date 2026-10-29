
document.addEventListener("DOMContentLoaded", () => {
    const campo = document.getElementById("campoPesquisa");
    const botao = document.getElementById("botaoPesquisar");
    const limpar = document.getElementById("limparPesquisa");
    const mensagem = document.getElementById("mensagemPesquisa");

    const cards = Array.from(
        document.querySelectorAll(".lista_acervos .card")
    );

    const avatarPadrao = "imagens/avatar-padrao.png";

    function obterUsuario(card) {
        const links = Array.from(card.querySelectorAll("a[href]"));

        // Primeiro tenta identificar o usuário pelo endereço do perfil.
        for (const link of links) {
            try {
                const url = new URL(link.href);

                if (
                    (url.hostname === "x.com" ||
                     url.hostname === "www.x.com" ||
                     url.hostname === "twitter.com" ||
                     url.hostname === "www.twitter.com")
                ) {
                    const partes = url.pathname
                        .split("/")
                        .filter(Boolean);

                    if (
                        partes.length > 0 &&
                        !["home", "explore", "search", "i"].includes(
                            partes[0].toLowerCase()
                        )
                    ) {
                        return partes[0].replace(/^@/, "");
                    }
                }
            } catch (erro) {
                console.warn("Link inválido:", link.href);
            }
        }

        // Alternativa: usa o @usuario escrito no próprio card.
        for (const link of links) {
            const texto = link.textContent.trim();
            const resultado = texto.match(/^@([A-Za-z0-9_]{1,15})$/);

            if (resultado) {
                return resultado[1];
            }
        }

        return null;
    }

    function criarNomeArquivo(nome) {
        return nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function carregarAvatarLocal(card) {
        const areaAvatar = card.querySelector(".icone");
        const titulo = card.querySelector("h2");

        if (!areaAvatar || !titulo) return;

        const nomeArquivo = criarNomeArquivo(
            titulo.textContent.trim()
        );

        const imagem = document.createElement("img");

        imagem.className = "foto-acervo";
        imagem.alt = `Foto do acervo ${titulo.textContent.trim()}`;
        imagem.loading = "lazy";

        imagem.onerror = () => {
            imagem.onerror = null;
            imagem.src = "imagens/avatar-padrao.png";
        };

        imagem.src = `imagens/acervos/${nomeArquivo}.jpg`;

        areaAvatar.replaceChildren(imagem);
    }

document.querySelectorAll(".lista_acervos .card")
    .forEach(carregarAvatarLocal);

    // Carrega as fotos dos acervos.
    cards.forEach(carregarAvatar);

    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function pesquisarAcervos() {
        const termo = normalizar(campo.value.trim());
        let encontrados = 0;

        cards.forEach((card) => {
            const corresponde =
                normalizar(card.textContent).includes(termo);

            card.hidden = !corresponde;

            if (corresponde) encontrados++;
        });

        if (termo === "") {
            mensagem.textContent =
                `Exibindo todos os ${cards.length} acervos.`;
        } else if (encontrados === 0) {
            mensagem.textContent =
                "Nenhum acervo encontrado. Tente outro nome ou usuário.";
        } else {
            mensagem.textContent =
                `${encontrados} acervo(s) encontrado(s).`;
        }
    }

    function limparPesquisa() {
        campo.value = "";
        pesquisarAcervos();
        campo.focus();
    }

    botao.addEventListener("click", pesquisarAcervos);
    limpar.addEventListener("click", limparPesquisa);
    campo.addEventListener("input", pesquisarAcervos);

    campo.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") pesquisarAcervos();
        if (evento.key === "Escape") limparPesquisa();
    });

    pesquisarAcervos();
});
