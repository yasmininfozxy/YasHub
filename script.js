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
            url: "https://www.twitch.tv/eimonttel"
        },
        {
            type: "tiktok",
            label: "TikTok",
            url: "https://www.tiktok.com/"
        },
        {
            type: "kick",
            label: "Kick",
            url: "https://kick.com/eimonttel"
        }
    ],

    links: [
        {
            title: "Kick",
            subtitle: "",
            url: "https://kick.com/eimonttel",
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
            url: "https://www.instagram.com/eimonttel?igsi=dmt1cnZqNWk3Z3Nj",
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

let data;

try {
    const savedData = localStorage.getItem("my-link-page");
    data = savedData ? JSON.parse(savedData) : structuredClone(defaultData);
} catch {
    data = structuredClone(defaultData);
}

data.socials = Array.isArray(data.socials) ? data.socials : structuredClone(defaultData.socials);
data.links = Array.isArray(data.links) ? data.links : structuredClone(defaultData.links);

let editingIndex = null;
let editingProfile = false;
let toastTimer;

const linksEl = document.getElementById("links");
const socialsEl = document.getElementById("socials");
const nameEl = document.getElementById("profileName");
const bioEl = document.getElementById("profileBio");
const avatarEl = document.querySelector(".avatar");
const avatarImage = document.getElementById("avatarImage");
const avatarPlaceholder = document.getElementById("avatarPlaceholder");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

function saveData() {
    localStorage.setItem("my-link-page", JSON.stringify(data));
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeUrl(url) {
    const value = String(url || "").trim();

    if (!value) {
        return "#";
    }

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    return "https://" + value;
}

function socialIcon(type) {
    const icons = {
        instagram: "https://cdn.simpleicons.org/instagram/111217",
        twitch: "https://cdn.simpleicons.org/twitch/111217",
        tiktok: "https://cdn.simpleicons.org/tiktok/111217",
        kick: "https://cdn.simpleicons.org/kick/111217"
    };

    const icon = icons[type];

    if (!icon) {
        return "•";
    }

    return `
        <img
            src="${icon}"
            alt=""
            aria-hidden="true"
        >
    `;
}

function getIconClass(title) {
    const value = String(title || "").toLowerCase().trim();

    if (value.includes("kick")) return "kick";
    if (value.includes("discord")) return "discord";
    if (value.includes("twitch")) return "twitch";
    if (value.includes("instagram")) return "instagram";
    if (value.includes("tiktok")) return "tiktok";
    if (value === "x" || value.includes("twitter")) return "x";

    return "x";
}

function renderAvatar() {
    const avatar = String(data.avatar || "").trim();

    if (!avatar) {
        avatarImage.removeAttribute("src");
        avatarEl.classList.remove("has-image");
        return;
    }

    avatarImage.src = avatar;
    avatarEl.classList.add("has-image");

    avatarImage.onerror = () => {
        avatarImage.removeAttribute("src");
        avatarEl.classList.remove("has-image");
        showToast("Não foi possível carregar a foto.");
    };
}

function render() {
    nameEl.textContent = data.name || "@Yas";
    bioEl.textContent = data.bio || "";

    renderAvatar();

    socialsEl.innerHTML = data.socials
        .map(social => `
            <a
                class="social-link"
                href="${escapeHtml(normalizeUrl(social.url))}"
                target="_blank"
                rel="noopener noreferrer"
                title="${escapeHtml(social.label)}"
                aria-label="${escapeHtml(social.label)}"
            >
                ${socialIcon(social.type)}
            </a>
        `)
        .join("");

    linksEl.innerHTML = data.links
        .map((link, index) => `
            <article class="link-card" data-index="${index}">

                <div class="link-icon ${escapeHtml(link.iconClass || "x")}">

                    ${
                        link.icon
                            ? `
                                <img
                                    src="${escapeHtml(link.icon)}"
                                    alt=""
                                    loading="lazy"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                                >

                                <span class="icon-fallback" style="display:none;">
                                    ↗
                                </span>
                            `
                            : `
                                <span class="icon-fallback">
                                    ↗
                                </span>
                            `
                    }

                </div>

                <a
                    class="link-info"
                    href="${escapeHtml(normalizeUrl(link.url))}"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="${escapeHtml(link.title)}"
                >
                    <span class="link-title">
                        ${escapeHtml(link.title)}
                    </span>

                    ${
                        link.subtitle
                            ? `
                                <span class="link-subtitle">
                                    ${escapeHtml(link.subtitle)}
                                </span>
                            `
                            : ""
                    }
                </a>

                <button
                    class="dots"
                    type="button"
                    data-edit-index="${index}"
                    aria-label="Editar ${escapeHtml(link.title)}"
                    title="Editar link"
                >
                    ⋮
                </button>

            </article>
        `)
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

    document.querySelectorAll("[data-edit-index]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openLinkEditor(Number(button.dataset.editIndex));
        });
    });

    document.getElementById("addLinkBtn").addEventListener("click", addNewLink);
}

function openProfileEditor() {
    editingProfile = true;
    editingIndex = null;

    modalTitle.textContent = "Editar perfil";

    modalContent.innerHTML = `
        <div class="field">
            <label for="fName">Nome / @usuário</label>
            <input
                id="fName"
                type="text"
                value="${escapeHtml(data.name)}"
                autocomplete="off"
            >
        </div>

        <div class="field">
            <label for="fBio">Descrição</label>
            <input
                id="fBio"
                type="text"
                value="${escapeHtml(data.bio)}"
                autocomplete="off"
            >
        </div>

        <div class="field">
            <label for="fAvatar">URL da foto de perfil</label>
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

function openLinkEditor(index) {
    editingProfile = false;
    editingIndex = index;

    const link = data.links[index];

    if (!link) {
        return;
    }

    modalTitle.textContent = "Editar link";

    modalContent.innerHTML = `
        <div class="field">
            <label for="fTitle">Título</label>
            <input
                id="fTitle"
                type="text"
                value="${escapeHtml(link.title)}"
                autocomplete="off"
            >
        </div>

        <div class="field">
            <label for="fSubtitle">Descrição</label>
            <input
                id="fSubtitle"
                type="text"
                value="${escapeHtml(link.subtitle || "")}"
                autocomplete="off"
            >
        </div>

        <div class="field">
            <label for="fUrl">URL do link</label>
            <input
                id="fUrl"
                type="url"
                value="${escapeHtml(link.url)}"
                placeholder="https://..."
                autocomplete="off"
            >
        </div>

        <div class="field">
            <label for="fIcon">URL do ícone</label>
            <input
                id="fIcon"
                type="url"
                value="${escapeHtml(link.icon || "")}"
                placeholder="https://..."
                autocomplete="off"
            >
        </div>
    `;

    addDeleteButton();
    openModal();
}

function addNewLink() {
    data.links.push({
        title: "Novo link",
        subtitle: "",
        url: "https://",
        icon: "https://cdn.simpleicons.org/link/FFFFFF",
        iconClass: "x"
    });

    saveData();
    render();

    openLinkEditor(data.links.length - 1);
}

function deleteCurrentLink() {
    if (editingIndex === null) {
        return;
    }

    const link = data.links[editingIndex];

    if (!link) {
        return;
    }

    if (!confirm(`Excluir "${link.title}"?`)) {
        return;
    }

    data.links.splice(editingIndex, 1);

    saveData();
    closeModal();
    render();

    showToast("Link excluído");
}

function addDeleteButton() {
    removeDeleteButton();

    const actions = document.querySelector(".modal-actions");
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "btn danger";
    deleteButton.textContent = "Excluir";

    deleteButton.addEventListener("click", deleteCurrentLink);

    actions.prepend(deleteButton);
}

function removeDeleteButton() {
    document.querySelector(".modal-actions .danger")?.remove();
}

function openModal() {
    modalBackdrop.classList.add("open");

    setTimeout(() => {
        modalContent.querySelector("input")?.focus();
    }, 50);
}

function closeModal() {
    modalBackdrop.classList.remove("open");

    removeDeleteButton();

    editingIndex = null;
    editingProfile = false;
}

function saveChanges() {
    if (editingProfile) {
        data.name =
            document.getElementById("fName").value.trim() || "@Yas";

        data.bio =
            document.getElementById("fBio").value.trim();

        data.avatar =
            document.getElementById("fAvatar").value.trim();
    }

    else if (editingIndex !== null) {
        const link = data.links[editingIndex];

        if (!link) {
            return;
        }

        link.title =
            document.getElementById("fTitle").value.trim() || "Novo link";

        link.subtitle =
            document.getElementById("fSubtitle").value.trim();

        link.url =
            normalizeUrl(
                document.getElementById("fUrl").value
            );

        link.icon =
            document.getElementById("fIcon").value.trim();

        link.iconClass =
            getIconClass(link.title);
    }

    saveData();
    render();
    closeModal();

    showToast("Alterações salvas!");
}

document
    .getElementById("editProfileBtn")
    .addEventListener("click", openProfileEditor);

document
    .getElementById("cancelBtn")
    .addEventListener("click", closeModal);

document
    .getElementById("closeModalBtn")
    .addEventListener("click", closeModal);

document
    .getElementById("saveBtn")
    .addEventListener("click", saveChanges);

modalBackdrop.addEventListener("click", event => {
    if (event.target === modalBackdrop) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        modalBackdrop.classList.contains("open")
    ) {
        closeModal();
    }
});

document
    .getElementById("shareBtn")
    .addEventListener("click", async () => {
        const shareData = {
            title: data.name,
            text: data.bio,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copiado!");
                return;
            }

            const textarea = document.createElement("textarea");

            textarea.value = window.location.href;

            document.body.appendChild(textarea);
            textarea.select();

            document.execCommand("copy");

            textarea.remove();

            showToast("Link copiado!");
        }

        catch {
            showToast("Não foi possível compartilhar.");
        }
    });

render();
