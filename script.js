/* =========================================================
   GRADE 12 BERZELIUS CLASSROOM PORTAL
   Main JavaScript
   ========================================================= */

"use strict";


/* ==================== STORAGE ==================== */

const STORAGE_KEY = "berzelius_classroom_memories";


/* ==================== SAMPLE DATA ==================== */

const sampleMemories = [
    {
        id: "sample-1",
        title: "Welcome to Grade 12",
        uploader: "Class Archive",
        month: "August",
        type: "photo",
        source:
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80",
        sample: true
    },

    {
        id: "sample-2",
        title: "Classroom Moments",
        uploader: "Class Archive",
        month: "August",
        type: "photo",
        source:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
        sample: true
    },

    {
        id: "sample-3",
        title: "A Day Together",
        uploader: "Class Archive",
        month: "September",
        type: "photo",
        source:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80",
        sample: true
    }
];


/* ==================== DOM ELEMENTS ==================== */

const memoryGrid =
    document.getElementById("memoryGrid");

const emptyState =
    document.getElementById("emptyState");

const uploadForm =
    document.getElementById("uploadForm");

const uploaderName =
    document.getElementById("uploaderName");

const memoryMonth =
    document.getElementById("memoryMonth");

const memoryTitle =
    document.getElementById("memoryTitle");

const memoryFile =
    document.getElementById("memoryFile");

const filePreview =
    document.getElementById("filePreview");

const formMessage =
    document.getElementById("formMessage");

const mediaModal =
    document.getElementById("mediaModal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const modalClose =
    document.getElementById("modalClose");

const modalMedia =
    document.getElementById("modalMedia");

const modalTitle =
    document.getElementById("modalTitle");

const modalMonth =
    document.getElementById("modalMonth");

const modalUploader =
    document.getElementById("modalUploader");

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");


/* ==================== STATE ==================== */

let currentFilter = "all";

let currentMonth = "all";

let uploadedMemories = [];

let previewUrl = null;


/* ==================== INITIALIZATION ==================== */

document.addEventListener("DOMContentLoaded", () => {

    loadMemories();

    setupNavigation();

    setupFilters();

    setupMonths();

    setupUpload();

    setupModal();

    setupScrollReveal();

    setupSmoothNavigation();

});


/* ==================== LOAD MEMORIES ==================== */

function loadMemories() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            uploadedMemories =
                JSON.parse(saved);

        }

    } catch (error) {

        console.error(
            "Unable to load saved memories:",
            error
        );

        uploadedMemories = [];

    }

    renderMemories();

}


/* ==================== SAVE MEMORIES ==================== */

function saveMemories() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(uploadedMemories)
        );

    } catch (error) {

        console.error(
            "Unable to save memories:",
            error
        );

        showMessage(
            "The memory could not be saved. Your browser may have reached its storage limit.",
            true
        );

    }

}


/* ==================== GET ALL MEMORIES ==================== */

function getAllMemories() {

    return [
        ...sampleMemories,
        ...uploadedMemories
    ];

}


/* ==================== RENDER MEMORIES ==================== */

function renderMemories() {

    const memories =
        getAllMemories().filter(memory => {

            const matchesType =
                currentFilter === "all" ||
                memory.type === currentFilter;

            const matchesMonth =
                currentMonth === "all" ||
                memory.month === currentMonth;

            return (
                matchesType &&
                matchesMonth
            );

        });


    memoryGrid.innerHTML = "";


    if (memories.length === 0) {

        emptyState.hidden = false;

        return;

    }


    emptyState.hidden = true;


    memories.forEach(
        (memory, index) => {

            const card =
                createMemoryCard(
                    memory,
                    index
                );

            memoryGrid.appendChild(card);

        }
    );

}


/* ==================== CREATE MEMORY CARD ==================== */

function createMemoryCard(memory, index) {

    const card =
        document.createElement("article");

    card.className =
        "memory-card";

    card.style.animationDelay =
        `${index * 70}ms`;

    card.setAttribute(
        "tabindex",
        "0"
    );

    card.setAttribute(
        "role",
        "button"
    );

    const media =
        document.createElement("div");

    media.className =
        "memory-media";


    if (memory.type === "video") {

        const video =
            document.createElement("video");

        video.src =
            memory.source;

        video.muted = true;

        video.preload = "metadata";

        media.appendChild(video);

    } else {

        const image =
            document.createElement("img");

        image.src =
            memory.source;

        image.alt =
            memory.title;

        image.loading =
            "lazy";

        image.onerror = () => {

            image.style.display =
                "none";

        };

        media.appendChild(image);

    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "memory-overlay";


    const type =
        document.createElement("div");

    type.className =
        "memory-type";

    type.textContent =
        memory.type === "video"
            ? "VIDEO"
            : "PHOTO";


    const title =
        document.createElement("h3");

    title.textContent =
        memory.title;


    const details =
        document.createElement("p");

    details.textContent =
        `${memory.month} · ${memory.uploader}`;


    overlay.appendChild(type);

    overlay.appendChild(title);

    overlay.appendChild(details);


    card.appendChild(media);

    card.appendChild(overlay);


    card.addEventListener(
        "click",
        () => openModal(memory)
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openModal(memory);

            }

        }
    );


    return card;

}


/* ==================== FILTERS ==================== */

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                currentFilter =
                    button.dataset.filter;

                renderMemories();

            }
        );

    });

}


/* ==================== MONTHS ==================== */

function setupMonths() {

    const monthCards =
        document.querySelectorAll(
            ".month-card"
        );


    monthCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const month =
                    card.dataset.month;

                currentMonth =
                    month;

                currentFilter =
                    "all";


                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(button => {

                        button.classList.remove(
                            "active"
                        );

                        if (
                            button.dataset.filter ===
                            "all"
                        ) {

                            button.classList.add(
                                "active"
                            );

                        }

                    });


                renderMemories();


                document
                    .getElementById("gallery")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });

}


/* ==================== UPLOAD ==================== */

function setupUpload() {

    memoryFile.addEventListener(
        "change",
        previewSelectedFile
    );


    uploadForm.addEventListener(
        "submit",
        handleUpload
    );

}


/* ==================== FILE PREVIEW ==================== */

function previewSelectedFile() {

    const file =
        memoryFile.files[0];


    filePreview.innerHTML = "";


    if (!file) {

        filePreview.hidden = true;

        return;

    }


    if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
    ) {

        filePreview.hidden = true;

        showMessage(
            "Please select an image or video.",
            true
        );

        memoryFile.value = "";

        return;

    }


    if (previewUrl) {

        URL.revokeObjectURL(
            previewUrl
        );

    }


    previewUrl =
        URL.createObjectURL(file);


    if (file.type.startsWith("video/")) {

        const video =
            document.createElement("video");

        video.src =
            previewUrl;

        video.controls =
            true;

        video.muted =
            true;

        filePreview.appendChild(
            video
        );

    } else {

        const image =
            document.createElement("img");

        image.src =
            previewUrl;

        image.alt =
            "Selected file preview";

        filePreview.appendChild(
            image
        );

    }


    filePreview.hidden = false;

    clearMessage();

}


/* ==================== HANDLE UPLOAD ==================== */

function handleUpload(event) {

    event.preventDefault();


    const name =
        uploaderName.value.trim();

    const month =
        memoryMonth.value;

    const title =
        memoryTitle.value.trim();

    const file =
        memoryFile.files[0];


    if (
        !name ||
        !month ||
        !title ||
        !file
    ) {

        showMessage(
            "Please complete all fields.",
            true
        );

        return;

    }


    const isImage =
        file.type.startsWith(
            "image/"
        );

    const isVideo =
        file.type.startsWith(
            "video/"
        );


    if (!isImage && !isVideo) {

        showMessage(
            "Only photos and videos are allowed.",
            true
        );

        return;

    }


    /*
       NOTE:

       The file itself cannot safely be stored in
       localStorage. Therefore this demo stores the
       object URL for the current browser session.

       A real shared classroom portal needs a backend
       such as Firebase or Supabase.
    */


    const memory = {

        id:
            `memory-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        title:
            title,

        uploader:
            name,

        month:
            month,

        type:
            isVideo
                ? "video"
                : "photo",

        source:
            URL.createObjectURL(file),

        sample:
            false

    };


    uploadedMemories.unshift(
        memory
    );


    /*
       Save only the information that can be
       serialized safely.

       The actual uploaded file remains available
       for this page session through its object URL.
    */

    try {

        const serializable =
            uploadedMemories.map(item => ({
                id: item.id,
                title: item.title,
                uploader: item.uploader,
                month: item.month,
                type: item.type,
                source: item.source,
                sample: false
            }));

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(serializable)
        );

    } catch (error) {

        console.warn(
            "Local storage could not save the file reference.",
            error
        );

    }


    renderMemories();


    uploadForm.reset();

    filePreview.innerHTML = "";

    filePreview.hidden = true;


    if (previewUrl) {

        URL.revokeObjectURL(
            previewUrl
        );

        previewUrl = null;

    }


    currentMonth = "all";


    showMessage(
        "Your memory has been added to this browser's archive."
    );


    document
        .getElementById("gallery")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ==================== MESSAGE ==================== */

function showMessage(
    message,
    isError = false
) {

    formMessage.textContent =
        message;

    formMessage.style.color =
        isError
            ? "#c34a4a"
            : "#1671a8";

}


function clearMessage() {

    formMessage.textContent =
        "";

}


/* ==================== MODAL ==================== */

function setupModal() {

    modalClose.addEventListener(
        "click",
        closeModal
    );


    modalBackdrop.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mediaModal.classList.contains(
                    "open"
                )
            ) {

                closeModal();

            }

        }
    );

}


/* ==================== OPEN MODAL ==================== */

function openModal(memory) {

    modalMedia.innerHTML = "";


    if (memory.type === "video") {

        const video =
            document.createElement("video");

        video.src =
            memory.source;

        video.controls =
            true;

        video.autoplay =
            true;

        video.playsInline =
            true;

        modalMedia.appendChild(
            video
        );

    } else {

        const image =
            document.createElement("img");

        image.src =
            memory.source;

        image.alt =
            memory.title;

        modalMedia.appendChild(
            image
        );

    }


    modalTitle.textContent =
        memory.title;

    modalMonth.textContent =
        memory.month;

    modalUploader.textContent =
        `Added by ${memory.uploader}`;


    mediaModal.classList.add(
        "open"
    );

    mediaModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    modalClose.focus();

}


/* ==================== CLOSE MODAL ==================== */

function closeModal() {

    mediaModal.classList.remove(
        "open"
    );

    mediaModal.setAttribute(
        "aria-hidden",
        "true"
    );


    modalMedia.innerHTML = "";


    document.body.style.overflow =
        "";

}


/* ==================== NAVIGATION ==================== */

function setupNavigation() {

    menuButton.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "open"
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "open"
                    );

                }
            );

        });

}


/* ==================== SMOOTH NAVIGATION ==================== */

function setupSmoothNavigation() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });

}


/* ==================== SCROLL REVEAL ==================== */

function setupScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );

}
