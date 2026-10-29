
document.addEventListener("DOMContentLoaded", () => {
    const campo = document.getElementById("campoPesquisa");
    const botao = document.getElementById("botaoPesquisar");
    const limpar = document.getElementById("limparPesquisa");
    const mensagem = document.getElementById("mensagemPesquisa");

    const cards = Array.from(
        document.querySelectorAll(".lista_acervos .card")
    );

    // Verifica se os elementos da pesquisa existem.
    if (!campo || !botao || !limpar || !mensagem) {
        console.error(
            "Erro: confira os IDs dos elementos da pesquisa no index.html."
        );
        return;
    }

    // Normaliza o texto para ignorar acentos e maiúsculas.
    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // Cria o nome do arquivo da foto a partir do título do card.
    function criarNomeArquivo(nome) {
        return nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    // Carrega a foto salva localmente.
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

    // Carrega as fotos sem interferir na pesquisa.
    cards.forEach(carregarAvatarLocal);

    // Pesquisa pelo nome do Pokémon ou pelo usuário do X.
    function pesquisarAcervos() {
        const termo = normalizar(campo.value);
        let encontrados = 0;

        cards.forEach((card) => {
            const textoCard = normalizar(card.textContent);
            const corresponde = textoCard.includes(termo);

            card.hidden = !corresponde;

            if (corresponde) {
                encontrados++;
            }
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

    // Limpa a pesquisa e volta a exibir todos os cards.
    function limparPesquisa() {
        campo.value = "";
        pesquisarAcervos();
        campo.focus();
    }

    // Eventos dos controles.
    botao.addEventListener("click", pesquisarAcervos);
    limpar.addEventListener("click", limparPesquisa);

    campo.addEventListener("input", pesquisarAcervos);

    campo.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            pesquisarAcervos();
        }

        if (evento.key === "Escape") {
            limparPesquisa();
        }
    });

    // Exibe todos os acervos ao abrir o site.
    pesquisarAcervos();
});
