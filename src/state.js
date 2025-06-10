export const domains = [
    { label: "Lieu de vie", theme: "Conditions de vie", icons: ["fa-home", "fa-bed", "fa-tree"] },
    { label: "Finances", theme: "Conditions de vie", icons: ["fa-euro-sign", "fa-wallet", "fa-money-bill"] },
    { label: "Travail", theme: "Conditions de vie", icons: ["fa-briefcase", "fa-users", "fa-chart-line"] },
    { label: "Droit & justice", theme: "Conditions de vie", icons: ["fa-gavel", "fa-balance-scale", "fa-file-contract"] },
    { label: "Temps libre", theme: "Pragmatique du quotidien", icons: ["fa-clock", "fa-futbol", "fa-book"] },
    { label: "Tâches administratives", theme: "Pragmatique du quotidien", icons: ["fa-file-alt", "fa-envelope", "fa-folder-open"] },
    { label: "Entretien du ménage", theme: "Pragmatique du quotidien", icons: ["fa-broom", "fa-soap", "fa-trash"] },
    { label: "Déplacements", theme: "Pragmatique du quotidien", icons: ["fa-bus", "fa-car", "fa-bicycle"] },
    { label: "Fréquentation des lieux publics", theme: "Pragmatique du quotidien", icons: ["fa-store", "fa-shopping-cart", "fa-landmark"] },
    { label: "Connaissances et amitiés", theme: "Relations", icons: ["fa-user-friends", "fa-handshake", "fa-users"] },
    { label: "Famille", theme: "Relations", icons: ["fa-house-user", "fa-people-roof", "fa-children"] },
    { label: "Enfants", theme: "Relations", icons: ["fa-child", "fa-baby", "fa-school"] },
    { label: "Relations sentimentales", theme: "Relations", icons: ["fa-heart", "fa-ring", "fa-kiss-wink-heart"] },
    { label: "Alimentation", theme: "Santé", icons: ["fa-utensils", "fa-carrot", "fa-apple-alt"] },
    { label: "Hygiène personnelle", theme: "Santé", icons: ["fa-shower", "fa-soap", "fa-tooth"] },
    { label: "Santé physique", theme: "Santé", icons: ["fa-heartbeat", "fa-stethoscope", "fa-dumbbell"] },
    { label: "Santé psychique", theme: "Santé", icons: ["fa-brain", "fa-face-smile", "fa-comment-dots"] },
    { label: "Addiction", theme: "Santé", icons: ["fa-wine-bottle", "fa-smoking", "fa-cannabis"] },
    { label: "Traitement", theme: "Santé", icons: ["fa-pills", "fa-syringe", "fa-prescription-bottle-medical"] },
    { label: "Spiritualité & croyances", theme: "Santé", icons: ["fa-pray", "fa-place-of-worship", "fa-book-bible"] },
    { label: "Sexualité", theme: "Santé", icons: ["fa-venus-mars", "fa-heart", "fa-kiss"] }
];

export const infoMessages = {
    2: "Cette application applique les principes de l'évaluation par tri de cartes ELADEB-R. Vous allez maintenant évaluer l'importance de chaque problème identifié.",
    3: "Vous allez maintenant indiquer si une aide supplémentaire est souhaitée.",
    4: "Vous allez maintenant préciser l'urgence de l'aide.",
    5: "Vous allez maintenant choisir l'origine de l'aide souhaitée.",
    6: "Enfin, vous pourrez préciser l'action prioritaire à mener."
};

export const state = {
    currentStep: 0,
    currentDomain: 0,
    historyStack: [],
    infoShown: {},
    data: {
        initialQuestion: '',
        difficulties: domains.map(() => ({ presence: false, intensity: 0 })),
        needs: domains.map(() => ({ presence: false, urgency: 0, origin: '?', detail: '' })),
        priority: ''
    }
};
