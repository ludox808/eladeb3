// JavaScript logic extracted from index.html

const domains = [
    { label: "Lieu de vie", icon: "fa-home" },
    { label: "Finances", icon: "fa-euro-sign" },
    { label: "Travail", icon: "fa-briefcase" },
    { label: "Droit & justice", icon: "fa-gavel" },
    { label: "Temps libre", icon: "fa-clock" },
    { label: "Tâches administratives", icon: "fa-file-alt" },
    { label: "Entretien du ménage", icon: "fa-broom" },
    { label: "Déplacements", icon: "fa-bus" },
    { label: "Fréquentation des lieux publics", icon: "fa-store" },
    { label: "Connaissances et amitiés", icon: "fa-user-friends" },
    { label: "Famille", icon: "fa-house-user" },
    { label: "Enfants", icon: "fa-child" },
    { label: "Relations sentimentales", icon: "fa-heart" },
    { label: "Alimentation", icon: "fa-utensils" },
    { label: "Hygiène personnelle", icon: "fa-shower" },
    { label: "Santé physique", icon: "fa-heartbeat" },
    { label: "Santé psychique", icon: "fa-brain" },
    { label: "Addiction", icon: "fa-wine-bottle" },
    { label: "Traitement", icon: "fa-pills" },
    { label: "Spiritualité & croyances", icon: "fa-pray" },
    { label: "Sexualité", icon: "fa-venus-mars" }
];

const data = {
    initialQuestion: '',
    difficulties: domains.map(() => ({ presence: false, intensity: 0 })),
    needs: domains.map(() => ({ presence: false, urgency: 0, origin: '?' })),
    priority: ''
};

let currentStep = 0;
let currentDomain = 0;
let container;

function nextStep() {
    currentStep++;
    currentDomain = 0;
    render();
}

function nextDomain() {
    currentDomain++;
    if (currentDomain >= domains.length) {
        nextStep();
    } else {
        render();
    }
}

function render() {
    container.innerHTML = '';
    if (currentStep === 0) renderInitialQuestion();
    else if (currentStep === 1) renderDifficultyPresence();
    else if (currentStep === 2) renderDifficultyIntensity();
    else if (currentStep === 3) renderNeedPresence();
    else if (currentStep === 4) renderNeedUrgency();
    else if (currentStep === 5) renderNeedOrigin();
    else if (currentStep === 6) renderPriority();
    else renderResults();
}

function renderInitialQuestion() {
    const div = document.createElement('div');
    div.innerHTML = '<p>Quel est pour vous le problème le plus important actuellement ?</p>' +
        '<textarea id="question" rows="3" cols="60"></textarea><br>' +
        '<button id="next">Suivant</button>';
    container.appendChild(div);
    document.getElementById('next').onclick = () => {
        data.initialQuestion = document.getElementById('question').value;
        nextStep();
    };
}

function renderDifficultyPresence() {
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[currentDomain];
    const form = document.createElement('div');
    form.innerHTML = `<h2>Difficultés</h2>`;
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<i class="fa ${d.icon} icon"></i><strong>${d.label}</strong> ` +
        `<label><input type="radio" name="diff" value="yes"> Problème</label> ` +
        `<label><input type="radio" name="diff" value="no" checked> Pas de problème</label>`;
    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=diff]:checked').value;
        data.difficulties[currentDomain].presence = val === 'yes';
        if (!data.difficulties[currentDomain].presence) data.difficulties[currentDomain].intensity = 0;
        nextDomain();
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderDifficultyIntensity() {
    while (currentDomain < domains.length && !data.difficulties[currentDomain].presence) {
        currentDomain++;
    }
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Difficultés : importance du problème</h2>';
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<i class="fa ${d.icon} icon"></i><strong>${d.label}</strong> ` +
        `<label><input type="radio" name="int" value="1" checked> Peu important</label> ` +
        `<label><input type="radio" name="int" value="2"> Important</label> ` +
        `<label><input type="radio" name="int" value="3"> Très important</label>`;
    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=int]:checked').value;
        data.difficulties[currentDomain].intensity = parseInt(val, 10);
        nextDomain();
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedPresence() {
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Besoin d\'aide supplémentaire ?</h2>';
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<i class="fa ${d.icon} icon"></i><strong>${d.label}</strong> ` +
        `<label><input type="radio" name="need" value="yes"> Besoin</label> ` +
        `<label><input type="radio" name="need" value="no" checked> Pas besoin</label>`;
    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=need]:checked').value;
        data.needs[currentDomain].presence = val === 'yes';
        if (!data.needs[currentDomain].presence) { data.needs[currentDomain].urgency = 0; data.needs[currentDomain].origin = '?'; }
        nextDomain();
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedUrgency() {
    while (currentDomain < domains.length && !data.needs[currentDomain].presence) {
        currentDomain++;
    }
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Urgence de l\'aide souhaitée</h2>';
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<i class="fa ${d.icon} icon"></i><strong>${d.label}</strong> ` +
        `<label><input type="radio" name="urg" value="1" checked> Non urgent</label> ` +
        `<label><input type="radio" name="urg" value="2"> Moyennement urgent</label> ` +
        `<label><input type="radio" name="urg" value="3"> Urgent</label>`;
    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=urg]:checked').value;
        data.needs[currentDomain].urgency = parseInt(val, 10);
        nextDomain();
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedOrigin() {
    while (currentDomain < domains.length && !data.needs[currentDomain].presence) {
        currentDomain++;
    }
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Origine de l\'aide souhaitée</h2>';
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<i class="fa ${d.icon} icon"></i><strong>${d.label}</strong> ` +
        `<select id="orig">` +
        `<option value="P">Professionnels</option>` +
        `<option value="F">Famille</option>` +
        `<option value="E">Entourage</option>` +
        `<option value="?" selected>Non précisé</option>` +
        `</select>`;
    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.getElementById('orig').value;
        data.needs[currentDomain].origin = val;
        nextDomain();
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderPriority() {
    const div = document.createElement('div');
    div.innerHTML = '<h2>Besoin prioritaire</h2>' +
        '<p>Si on ne pouvait faire qu\'une seule chose pour vous, laquelle choisiriez-vous ?</p>' +
        '<textarea id="priority" rows="3" cols="60"></textarea><br>' +
        '<button id="next">Terminer</button>';
    container.appendChild(div);
    document.getElementById('next').onclick = () => {
        data.priority = document.getElementById('priority').value;
        nextStep();
    };
}

function renderResults() {
    const div = document.createElement('div');
    div.innerHTML = '<h2>Résultats</h2>';
    const table = document.createElement('table');
    const header = '<tr><th>Domaine</th><th>Intensité difficulté</th><th>Urgence besoin</th><th>Origine</th></tr>';
    table.innerHTML = header + domains.map((d, i) => {
        const diff = data.difficulties[i].intensity;
        const need = data.needs[i].urgency;
        const orig = data.needs[i].origin;
        return `<tr><td>${d.label}</td><td>${diff}</td><td>${need}</td><td>${orig}</td></tr>`;
    }).join('');
    div.appendChild(table);

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = domains.length * 25 + 20;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eee';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    domains.forEach((d, i) => {
        const y = i * 25 + 15;
        ctx.fillStyle = '#000';
        ctx.fillText(d.label, 10, y);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(200, y - 10, data.difficulties[i].intensity * 40, 10);
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(350, y - 10, data.needs[i].urgency * 40, 10);
    });
    div.appendChild(canvas);
    container.appendChild(div);
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('step-container');
    render();
});

