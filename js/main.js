/* =====================================================
   AMIRATEX - ACHAT TEXTILE
===================================================== */


/* =====================================================
   MOBILE MENU
===================================================== */

const boutonMenu = document.getElementById("boutonMenu");
const navigationPrincipale = document.getElementById("navigationPrincipale");

if (boutonMenu && navigationPrincipale) {

    boutonMenu.addEventListener("click", () => {

        navigationPrincipale.classList.toggle("actif");

        if (navigationPrincipale.classList.contains("actif")) {

            boutonMenu.innerHTML = "✕";

        } else {

            boutonMenu.innerHTML = "☰";

        }

    });


    /* Fermer le menu après avoir cliqué sur un lien */

    const navLinks =
        navigationPrincipale.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navigationPrincipale.classList.remove("actif");

            boutonMenu.innerHTML = "☰";

        });

    });

}


/* =====================================================
   ANIMATION AU SCROLL
===================================================== */

const elementsAnimes =
    document.querySelectorAll(
        ".carte-achat, .element-partenaire, .etape"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach((entry, index) => {

                if (entry.isIntersecting) {

                    setTimeout(() => {

                        entry.target.classList.add("visible");

                    }, index * 80);

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


elementsAnimes.forEach(element => {

    observer.observe(element);

});


/* =====================================================
   FORMULAIRE
===================================================== */


(function() {
    emailjs.init({
      publicKey: "5d5VenwMkyf6Wq4tz", //  clé publique visible dans compte EmailJS
    });
})();

const form = document.getElementById("formulaireAchat");
const messageFormulaire = document.getElementById("messageFormulaire");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le rechargement par défaut de la page

        if (messageFormulaire) {
            messageFormulaire.style.display = "block";
            messageFormulaire.textContent = "Votre demande est en cours d'envoi. Merci pour votre proposition.";
            messageFormulaire.style.color = "orange";
        }

        // qvs1l2o:ID de template (ex: template_cntri8v)
        // clé publique EmailJS (disponible dans le profil Account)
        emailjs.sendForm('service_kcwe5xq', 'template_qvs1l2o', this)
            .then(function() {
                if (messageFormulaire) {
                    messageFormulaire.textContent = "Votre proposition a été envoyée avec succès ! Nous vous contacterons rapidement.";
                    messageFormulaire.style.color = "green";
                }
                form.reset(); // Vide le formulaire après l'envoi
            }, function(error) {
                const champFichiers = form.querySelector('input[type="file"]');
                const contientFichiers = champFichiers && champFichiers.files.length > 0;

                if (messageFormulaire) {
                    messageFormulaire.textContent = contientFichiers
                        ? "L'envoi des fichiers a échoué. Dans EmailJS, ajoutez une pièce jointe « Form File Attachment » avec le paramètre photos-videos. Les pièces jointes nécessitent un forfait payant."
                        : "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
                    messageFormulaire.style.color = "red";
                }
                console.error('Erreur EmailJS:', error?.status, error?.text || error);
            });
    });
}
/* =====================================================
   ANNÉE FOOTER
===================================================== */

const annee =
    document.getElementById("annee");

if (annee) {

    annee.textContent =
        new Date().getFullYear();

}


/* =====================================================
   SCROLL DOUX
===================================================== */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener("click", function(e) {

        const identifiantCible =
            this.getAttribute("href");

        const target =
            document.querySelector(identifiantCible);

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});
/* =====================================================
   PHOTOS + VIDÉOS MULTIPLES
   Les fichiers restent sélectionnés même après
   plusieurs clics sur "Parcourir..."
===================================================== */

const champMedias = document.getElementById("medias");
const apercuMedias = document.getElementById("apercuMedias");

let fichiersSelectionnes = [];


if (champMedias) {

    champMedias.addEventListener("change", function () {

        /*
         * Ajouter les nouveaux fichiers à la liste
         * au lieu de remplacer les anciens.
         */

        const newFiles = Array.from(this.files);

        newFiles.forEach(file => {

            /*
             * Évite d'ajouter deux fois exactement
             * le même fichier.
             */

            const alreadyExists = fichiersSelectionnes.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
            );

            if (!alreadyExists) {
                fichiersSelectionnes.push(file);
            }

        });


        /*
         * Reconstruit la liste réelle des fichiers
         * envoyés avec le formulaire.
         */

        const dataTransfer = new DataTransfer();

        fichiersSelectionnes.forEach(file => {
            dataTransfer.items.add(file);
        });

        champMedias.files = dataTransfer.files;


        /*
         * Affiche la liste des fichiers sélectionnés.
         */

        afficherFichiersSelectionnes();

    });

}


/* =====================================================
   AFFICHAGE DES FICHIERS
===================================================== */

function afficherFichiersSelectionnes() {

    if (!apercuMedias) return;

    apercuMedias.innerHTML = "";

    fichiersSelectionnes.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "fichier-media";


        /* Icône selon le type */

        const icon = file.type.startsWith("video/")
            ? "🎥"
            : "📷";


        /* Taille */

        const sizeMB = (file.size / 1024 / 1024).toFixed(1);


        item.innerHTML = `
            <div class="infos-fichier-media">

                <span class="icone-fichier-media">
                    ${icon}
                </span>

                <div class="nom-fichier-media">

                    <strong>
                        ${file.name}
                    </strong>

                    <small>
                        ${sizeMB} Mo
                    </small>

                </div>

            </div>

            <button
                type="button"
                class="supprimer-media"
                data-index="${index}"
                aria-label="Supprimer ${file.name}"
            >
                ×
            </button>
        `;


        apercuMedias.appendChild(item);

    });


    /*
     * Boutons supprimer
     */

    document.querySelectorAll(".supprimer-media").forEach(button => {

        button.addEventListener("click", function () {

            const index = Number(this.dataset.index);

            fichiersSelectionnes.splice(index, 1);


            /*
             * Mettre à jour le champ input
             */

            const dataTransfer = new DataTransfer();

            fichiersSelectionnes.forEach(file => {
                dataTransfer.items.add(file);
            });

            champMedias.files = dataTransfer.files;


            afficherFichiersSelectionnes();

        });

    });

}