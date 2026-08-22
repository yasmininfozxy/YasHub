```javascript
/* =========================================================
   DADOS PADRÃO
========================================================= */

const defaultData = {

    name: "@Yas",

    bio: "Me encontre nas minhas redes sociais",

    avatar: "",

    socials: [

        {
            type: "instagram",
            label: "Instagram",
            url: "https://www.instagram.com/"
        },

        {
            type: "twitch",
            label: "Twitch",
            url: "https://www.twitch.tv/"
        },

        {
            type: "tiktok",
            label: "TikTok",
            url: "https://www.tiktok.com/"
        },

        {
            type: "kick",
            label: "Kick",
            url: "https://kick.com/"
        }

    ],


    links: [

        {
            title: "Kick",
            subtitle: "",
            url: "https://kick.com/",
            icon: "https://cdn.simpleicons.org/kick/FFFFFF",
            iconClass: "kick"
        },

        {
            title: "Discord",
            subtitle: "Servidor • Free to join",
            url: "https://discord.com/",
            icon: "https://cdn.simpleicons.org/discord/FFFFFF",
            iconClass: "discord"
        },

        {
            title: "Twitch",
            subtitle: "",
            url: "https://www.twitch.tv/",
            icon: "https://cdn.simpleicons.org/twitch/FFFFFF",
            iconClass: "twitch"
        },

        {
            title: "Instagram",
            subtitle: "",
            url: "https://www.instagram.com/",
            icon: "https://cdn.simpleicons.org/instagram/FFFFFF",
            iconClass: "instagram"
        },

        {
            title: "TikTok Secundário",
            subtitle: "",
            url: "https://www.tiktok.com/",
            icon: "https://cdn.simpleicons.org/tiktok/FFFFFF",
            iconClass: "tiktok"
        },

        {
            title: "TikTok OFICIAL",
            subtitle: "",
            url: "https://www.tiktok.com/",
            icon: "https://cdn.simpleicons.org/tiktok/FFFFFF",
            iconClass: "tiktok"
        },

        {
            title: "X",
            subtitle: "",
            url: "https://x.com/",
            icon: "https://cdn.simpleicons.org/x/FFFFFF",
            iconClass: "x"
        }

    ]

};


/* =========================================================
   FUNÇÕES DE SEGURANÇA DOS DADOS
========================================================= */

function cloneDefaultData() {

    return JSON.parse(
        JSON.stringify(defaultData)
    );

}


function normalizeData(saved) {

    const base = cloneDefaultData();

    if (!saved || typeof saved !== "object") {
        return base;
    }


    return {

        ...base,

        name:
            typeof saved.name === "string"
                ? saved.name
                : base.name,

        bio:
            typeof saved.bio === "string"
                ? saved.bio
                : base.bio,

        avatar:
            typeof saved.avatar === "string"
                ? saved.avatar
                : base.avatar,

        socials:
            Array.isArray(saved.socials)
                ? saved.socials
                    .filter(
                        social =>
                            social &&
                            typeof social === "object"
                    )
                    .map(social => ({
                        type:
                            String(
                                social.type || ""
                            ).toLowerCase(),

                        label:
                            String(
                                social.label || "Rede social"
                            ),

                        url:
                            String(
                                social.url || ""
                            )
                    }))
                : base.socials,

        links:
            Array.isArray(saved.links)
                ? saved.links
                    .filter(
                        link =>
                            link &&
                            typeof link === "object"
                    )
                    .map(link => {

                        const title =
                            String(
                                link.title || "Novo link"
                            );

                        return {

                            title,

                            subtitle:
                                String(
                                    link.subtitle || ""
                                ),

                            url:
                                String(
                                    link.url || ""
                                ),

                            icon:
                                String(
                                    link.icon || ""
                                ),

                            iconClass:
                                getIconClass(title)

                        };

                    })
                : base.links

    };

}


/* =========================================================
   CARREGAMENTO
========================================================= */

let data;

try {

    const savedData =
        localStorage.getItem("my-link-page");


    if (savedData) {

        const parsed =
            JSON.parse(savedData);

        data =
            normalizeData(parsed);

    }
    else {

        data =
            cloneDefaultData();

    }

}
catch (error) {

    console.warn(
        "Não foi possível carregar os dados salvos.",
        error
    );

    data =
        cloneDefaultData();

}


/* =========================================================
   ESTADO
========================================================= */

let editingIndex = null;

let editingProfile = false;

let toastTimer;


/* =========================================================
   ELEMENTOS
========================================================= */

const linksEl =
    document.getElementById("links");

const socialsEl =
    document.getElementById("socials");

const nameEl =
    document.getElementById("profileName");

const bioEl =
    document.getElementById("profileBio");

const avatarEl =
    document.querySelector(".avatar");

const avatarImage =
    document.getElementById("avatarImage");

const avatarPlaceholder =
    document.getElementById("avatarPlaceholder");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalTitle =
    document.getElementById("modalTitle");

const modalContent =
    document.getElementById("modalContent");

const toast =
    document.getElementById("toast");


/* =========================================================
   SALVAR
========================================================= */

function saveData() {

    try {

        localStorage.setItem(
            "my-link-page",
            JSON.stringify(data)
        );

    }
    catch (error) {

        console.warn(
            "Não foi possível salvar os dados.",
            error
        );

        showToast(
            "Não foi possível salvar as alterações."
        );

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    clearTimeout(toastTimer);

    toast.textContent =
        message;

    toast.classList.add("show");


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   URL
========================================================= */

function normalizeUrl(url) {

    const value =
        String(url || "").trim();


    if (!value) {
        return "#";
    }


    if (
        value.startsWith("https://") ||
        value.startsWith("http://")
    ) {

        return value;

    }


    if (
        value.startsWith("//")
    ) {

        return "https:" + value;

    }


    return "https://" + value;

}


/* =========================================================
   ÍCONES
========================================================= */

const iconUrls = {

    instagram:
        "https://cdn.simpleicons.org/instagram/111217",

    twitch:
        "https://cdn.simpleicons.org/twitch/111217",

    tiktok:
        "https://cdn.simpleicons.org/tiktok/111217",

    kick:
        "https://cdn.simpleicons.org/kick/111217",

    discord:
        "https://cdn.simpleicons.org/discord/111217",

    x:
        "https://cdn.simpleicons.org/x/111217"

};


function socialIcon(type) {

    const normalizedType =
        String(type || "")
            .toLowerCase()
            .trim();


    const icon =
        iconUrls[normalizedType];


    if (!icon) {

        return `
            <span
                class="icon-fallback"
                aria-hidden="true"
            >
                •
            </span>
        `;

    }


    return `
        <img
            src="${icon}"
            alt=""
            aria-hidden="true"
            loading="lazy"
            onerror="this.style.display='none';"
        >
    `;

}


/* =========================================================
   IDENTIFICAÇÃO DO ÍCONE DO LINK
========================================================= */

function getIconClass(title) {

    const value =
        String(title || "")
            .toLowerCase()
            .trim();


    if (
        value.includes("kick")
    ) {

        return "kick";

    }


    if (
        value.includes("discord")
    ) {

        return "discord";

    }


    if (
        value.includes("twitch")
    ) {

        return "twitch";

    }


    if (
        value.includes("instagram")
    ) {

        return "instagram";

    }


    if (
        value.includes("tiktok")
    ) {

        return "tiktok";

    }


    if (
        value === "x" ||
        value.startsWith("x ") ||
        value.includes(" twitter") ||
        value.includes("twitter")
    ) {

        return "x";

    }


    return "generic";

}


/* =========================================================
   ÍCONE AUTOMÁTICO
========================================================= */

function getAutomaticIcon(title) {

    const iconClass =
        getIconClass(title);


    const colors = {

        kick:
            "https://cdn.simpleicons.org/kick/FFFFFF",

        discord:
            "https://cdn.simpleicons.org/discord/FFFFFF",

        twitch:
            "https://cdn.simpleicons.org/twitch/FFFFFF",

        instagram:
            "https://cdn.simpleicons.org/instagram/FFFFFF",

        tiktok:
            "https://cdn.simpleicons.org/tiktok/FFFFFF",

        x:
            "https://cdn.simpleicons.org/x/FFFFFF"

    };


    return {

        icon:
            colors[iconClass] || "",

        iconClass

    };

}


/* =========================================================
   AVATAR
========================================================= */

function renderAvatar() {

    const avatar =
        String(data.avatar || "").trim();


    if (!avatar) {

        avatarImage.removeAttribute("src");

        avatarEl.classList.remove(
            "has-image"
        );

        avatarPlaceholder.textContent =
            "♡";

        return;

    }


    avatarImage.src =
        normalizeUrl(avatar);

    avatarEl.classList.add(
        "has-image"
    );


    avatarImage.onerror = () => {

        avatarImage.removeAttribute(
            "src"
        );

        avatarEl.classList.remove(
            "has-image"
        );

        avatarPlaceholder.textContent =
            "♡";

    };

}


/* =========================================================
   RENDERIZAR REDES SOCIAIS
========================================================= */

function renderSocials() {

    const socials =
        Array.isArray(data.socials)
            ? data.socials
            : [];


    socialsEl.innerHTML =
        socials
            .map(social => {

                const label =
                    String(
                        social.label ||
                        "Rede social"
                    );


                return `

                    <a
                        class="social-link"
                        href="${escapeHtml(
                            normalizeUrl(social.url)
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="${escapeHtml(label)}"
                        aria-label="${escapeHtml(label)}"
                    >

                        ${socialIcon(social.type)}

                    </a>

                `;

            })
            .join("");

}


/* =========================================================
   RENDERIZAR LINKS
========================================================= */

function renderLinks() {

    const links =
        Array.isArray(data.links)
            ? data.links
            : [];


    linksEl.innerHTML =

        links
            .map((link, index) => {

                const title =
                    String(
                        link.title ||
                        "Novo link"
                    );


                const subtitle =
                    String(
                        link.subtitle ||
                        ""
                    );


                const iconClass =
                    getIconClass(title);


                const icon =
                    String(
                        link.icon ||
                        ""
                    );


                return `

                    <article
                        class="link-card"
                        data-index="${index}"
                    >

                        <div
                            class="link-icon ${escapeHtml(
                                iconClass
                            )}"
                        >

                            ${
                                icon
                                    ?
                                    `
                                        <img
                                            src="${escapeHtml(
                                                normalizeUrl(icon)
                                            )}"
                                            alt=""
                                            loading="lazy"
                                            onerror="
                                                this.style.display='none';
                                                this.nextElementSibling.style.display='block';
                                            "
                                        >

                                        <span
                                            class="icon-fallback"
                                            style="display:none;"
                                            aria-hidden="true"
                                        >
                                            ↗
                                        </span>
                                    `
                                    :
                                    `
                                        <span
                                            class="icon-fallback"
                                            aria-hidden="true"
                                        >
                                            ↗
                                        </span>
                                    `
                            }

                        </div>


                        <a
                            class="link-info"
                            href="${escapeHtml(
                                normalizeUrl(link.url)
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="${escapeHtml(title)}"
                        >

                            <span class="link-title">
                                ${escapeHtml(title)}
                            </span>


                            ${
                                subtitle
                                    ?
                                    `
                                        <span class="link-subtitle">
                                            ${escapeHtml(subtitle)}
                                        </span>
                                    `
                                    :
                                    ""
                            }

                        </a>


                        <button
                            class="dots"
                            type="button"
                            data-edit-index="${index}"
                            aria-label="Editar ${escapeHtml(title)}"
                            title="Editar link"
                        >
                            ⋮
                        </button>

                    </article>

                `;

            })
            .join("");


    linksEl.insertAdjacentHTML(

        "beforeend",

        `
            <button
                class="add-link"
                id="addLinkBtn"
                type="button"
            >
                + Adicionar novo link
            </button>
        `

    );


    document
        .querySelectorAll("[data-edit-index]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const index =
                        Number(
                            button.dataset.editIndex
                        );


                    openLinkEditor(index);

                }
            );

        });


    document
        .getElementById("addLinkBtn")
        ?.addEventListener(
            "click",
            addNewLink
        );

}


/* =========================================================
   RENDER GERAL
========================================================= */

function render() {

    nameEl.textContent =
        data.name || "@Yas";


    bioEl.textContent =
        data.bio || "";


    renderAvatar();

    renderSocials();

    renderLinks();

}


/* =========================================================
   EDITAR PERFIL
========================================================= */

function openProfileEditor() {

    editingProfile = true;

    editingIndex = null;


    modalTitle.textContent =
        "Editar perfil";


    modalContent.innerHTML = `

        <div class="field">

            <label for="fName">
                Nome / @usuário
            </label>

            <input
                id="fName"
                type="text"
                value="${escapeHtml(data.name)}"
                autocomplete="off"
            >

        </div>


        <div class="field">

            <label for="fBio">
                Descrição
            </label>

            <input
                id="fBio"
                type="text"
                value="${escapeHtml(data.bio)}"
                autocomplete="off"
            >

        </div>


        <div class="field">

            <label for="fAvatar">
                URL da foto de perfil
            </label>

            <input
                id="fAvatar"
                type="url"
                value="${escapeHtml(data.avatar || "")}"
                placeholder="https://..."
                autocomplete="off"
            >

        </div>

    `;


    removeDeleteButton();

    openModal();

}


/* =========================================================
   EDITAR LINK
========================================================= */

function openLinkEditor(index) {

    editingProfile = false;

    editingIndex = index;


    const link =
        data.links[index];


    if (!link) {

        showToast(
            "Esse link não existe mais."
        );

        return;

    }


    modalTitle.textContent =
        "Editar link";


    modalContent.innerHTML = `

        <div class="field">

            <label for="fTitle">
                Título
            </label>

            <input
                id="fTitle"
                type="text"
                value="${escapeHtml(link.title)}"
                autocomplete="off"
            >

        </div>


        <div class="field">

            <label for="fSubtitle">
                Descrição
            </label>

            <input
                id="fSubtitle"
                type="text"
                value="${escapeHtml(
                    link.subtitle || ""
                )}"
                autocomplete="off"
            >

        </div>


        <div class="field">

            <label for="fUrl">
                URL do link
            </label>

            <input
                id="fUrl"
                type="url"
                value="${escapeHtml(link.url)}"
                placeholder="https://..."
                autocomplete="off"
            >

        </div>


        <div class="field">

            <label for="fIcon">
                URL do ícone
            </label>

            <input
                id="fIcon"
                type="url"
                value="${escapeHtml(
                    link.icon || ""
                )}"
                placeholder="https://..."
                autocomplete="off"
            >

        </div>

    `;


    addDeleteButton();

    openModal();

}


/* =========================================================
   ADICIONAR NOVO LINK
========================================================= */

function addNewLink() {

    const automatic =
        getAutomaticIcon("Novo link");


    data.links.push({

        title:
            "Novo link",

        subtitle:
            "",

        url:
            "https://",

        icon:
            automatic.icon,

        iconClass:
            automatic.iconClass

    });


    saveData();

    render();


    const newIndex =
        data.links.length - 1;


    openLinkEditor(newIndex);

}


/* =========================================================
   EXCLUIR LINK
========================================================= */

function deleteCurrentLink() {

    if (
        editingIndex === null
    ) {

        return;

    }


    const link =
        data.links[editingIndex];


    if (!link) {

        return;

    }


    const confirmed =
        confirm(
            `Excluir "${link.title}"?`
        );


    if (!confirmed) {

        return;

    }


    data.links.splice(
        editingIndex,
        1
    );


    saveData();

    closeModal();

    render();

    showToast(
        "Link excluído"
    );

}


/* =========================================================
   BOTÃO EXCLUIR
========================================================= */

function addDeleteButton() {

    removeDeleteButton();


    const actions =
        document.querySelector(
            ".modal-actions"
        );


    if (!actions) {
        return;
    }


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "btn danger";


    deleteButton.textContent =
        "Excluir";


    deleteButton.addEventListener(
        "click",
        deleteCurrentLink
    );


    actions.prepend(
        deleteButton
    );

}


function removeDeleteButton() {

    document
        .querySelector(
            ".modal-actions .danger"
        )
        ?.remove();

}


/* =========================================================
   MODAL
========================================================= */

function openModal() {

    modalBackdrop.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        modalContent
            .querySelector("input")
            ?.focus();

    }, 50);

}


function closeModal() {

    modalBackdrop.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";


    removeDeleteButton();


    editingIndex =
        null;

    editingProfile =
        false;

}


/* =========================================================
   SALVAR ALTERAÇÕES
========================================================= */

function saveChanges() {

    if (editingProfile) {

        const nameInput =
            document.getElementById("fName");

        const bioInput =
            document.getElementById("fBio");

        const avatarInput =
            document.getElementById("fAvatar");


        if (
            !nameInput ||
            !bioInput ||
            !avatarInput
        ) {

            return;

        }


        data.name =
            nameInput.value.trim()
            || "@Yas";


        data.bio =
            bioInput.value.trim();


        data.avatar =
            avatarInput.value.trim();

    }


    else if (
        editingIndex !== null
    ) {

        const link =
            data.links[editingIndex];


        if (!link) {

            return;

        }


        const titleInput =
            document.getElementById("fTitle");

        const subtitleInput =
            document.getElementById("fSubtitle");

        const urlInput =
            document.getElementById("fUrl");

        const iconInput =
            document.getElementById("fIcon");


        if (
            !titleInput ||
            !subtitleInput ||
            !urlInput ||
            !iconInput
        ) {

            return;

        }


        link.title =
            titleInput.value.trim()
            || "Novo link";


        link.subtitle =
            subtitleInput.value.trim();


        link.url =
            normalizeUrl(
                urlInput.value
            );


        link.icon =
            iconInput.value.trim();


        link.iconClass =
            getIconClass(
                link.title
            );


        /*
            Se o campo de ícone ficar vazio,
            tenta colocar automaticamente
            o ícone correspondente ao título.
        */

        if (!link.icon) {

            const automatic =
                getAutomaticIcon(
                    link.title
                );


            link.icon =
                automatic.icon;

            link.iconClass =
                automatic.iconClass;

        }

    }


    saveData();

    render();

    closeModal();

    showToast(
        "Alterações salvas!"
    );

}


/* =========================================================
   BOTÕES
========================================================= */

document
    .getElementById("editProfileBtn")
    ?.addEventListener(
        "click",
        openProfileEditor
    );


document
    .getElementById("cancelBtn")
    ?.addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("closeModalBtn")
    ?.addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("saveBtn")
    ?.addEventListener(
        "click",
        saveChanges
    );


/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

modalBackdrop.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalBackdrop
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   ESC FECHA MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modalBackdrop.classList.contains(
                "open"
            )
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   COMPARTILHAR
========================================================= */

document
    .getElementById("shareBtn")
    ?.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    data.name || "Yas | Links",

                text:
                    data.bio ||
                    "Me encontre nas minhas redes sociais",

                url:
                    window.location.href

            };


            try {

                if (
                    typeof navigator.share ===
                    "function"
                ) {

                    await navigator.share(
                        shareData
                    );

                    return;

                }


                if (
                    navigator.clipboard &&
                    typeof navigator.clipboard.writeText ===
                    "function"
                ) {

                    await navigator
                        .clipboard
                        .writeText(
                            window.location.href
                        );


                    showToast(
                        "Link copiado!"
                    );


                    return;

                }


                /* FALLBACK */

                const textarea =
                    document.createElement(
                        "textarea"
                    );


                textarea.value =
                    window.location.href;


                textarea.setAttribute(
                    "readonly",
                    ""
                );


                textarea.style.position =
                    "fixed";

                textarea.style.opacity =
                    "0";


                document.body.appendChild(
                    textarea
                );


                textarea.select();


                const copied =
                    document.execCommand(
                        "copy"
                    );


                textarea.remove();


                if (copied) {

                    showToast(
                        "Link copiado!"
                    );

                }
                else {

                    showToast(
                        "Não foi possível copiar."
                    );

                }

            }


            catch (error) {

                /*
                    Se o usuário simplesmente cancelar
                    o compartilhamento, não mostramos
                    uma mensagem de erro.
                */

                if (
                    error?.name !==
                    "AbortError"
                ) {

                    console.warn(
                        "Erro ao compartilhar.",
                        error
                    );

                    showToast(
                        "Não foi possível compartilhar."
                    );

                }

            }

        }
    );


/* =========================================================
   INICIAR
========================================================= */

render();
```
