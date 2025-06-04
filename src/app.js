// JavaScript logic extracted from index.html

const domains = [
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

const data = {
    initialQuestion: '',
    difficulties: domains.map(() => ({ presence: false, intensity: 0 })),
    needs: domains.map(() => ({ presence: false, urgency: 0, origin: '?' })),
    priority: ''
};

let currentStep = 0;
let currentDomain = 0;
let container;

function createDomainCard(domain) {
    const div = document.createElement('div');
    div.className = 'domain-item';
    const icons = document.createElement('div');
    icons.className = 'domain-icons';
    (domain.icons || []).forEach(ic => {
        const i = document.createElement('i');
        i.className = `fa ${ic} domain-icon`;
        icons.appendChild(i);
    });
    div.appendChild(icons);
    const title = document.createElement('strong');
    title.textContent = domain.label;
    div.appendChild(title);
    return div;
}

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
    const div = createDomainCard(d);
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label class="option"><input type="radio" name="diff" value="yes"> Problème <i class="fa fa-thumbs-down problem-icon"></i></label> ` +
        `<label class="option"><input type="radio" name="diff" value="no" checked> Pas de problème <i class="fa fa-thumbs-up no-problem-icon"></i></label>`;
    div.appendChild(opts);
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
    const div = createDomainCard(d);
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="int" value="1" checked> Peu important</label> ` +
        `<label><input type="radio" name="int" value="2"> Important</label> ` +
        `<label><input type="radio" name="int" value="3"> Très important</label>`;
    div.appendChild(opts);
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
    const div = createDomainCard(d);
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="need" value="yes"> Besoin</label> ` +
        `<label><input type="radio" name="need" value="no" checked> Pas besoin</label>`;
    div.appendChild(opts);
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
    const div = createDomainCard(d);
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="urg" value="1" checked> Non urgent</label> ` +
        `<label><input type="radio" name="urg" value="2"> Moyennement urgent</label> ` +
        `<label><input type="radio" name="urg" value="3"> Urgent</label>`;
    div.appendChild(opts);
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
    const div = createDomainCard(d);
    const opts = document.createElement('div');
    opts.innerHTML =
        `<select id="orig">` +
        `<option value="P">Professionnels</option>` +
        `<option value="F">Famille</option>` +
        `<option value="E">Entourage</option>` +
        `<option value="?" selected>Non précisé</option>` +
        `</select>`;
    div.appendChild(opts);
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

function saveResults() {
    const all = JSON.parse(localStorage.getItem('eladeb-data') || '[]');
    const record = {
        id: Date.now().toString(36),
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(data))
    };
    all.push(record);
    localStorage.setItem('eladeb-data', JSON.stringify(all));
    return record.id;
}

function renderResults() {
    const div = document.createElement('div');
    div.innerHTML = '<h2>Résultats</h2>';

    const code = saveResults();
    const codeP = document.createElement('p');
    codeP.textContent = `Code anonyme : ${code}`;
    div.appendChild(codeP);

    const table = document.createElement('table');
    const header = '<tr><th>Domaine</th><th>Intensité difficulté</th><th>Urgence besoin</th><th>Origine</th></tr>';
    table.innerHTML = header + domains.map((d, i) => {
        const diff = data.difficulties[i].intensity;
        const need = data.needs[i].urgency;
        const orig = data.needs[i].origin;
        return `<tr><td>${d.label}</td><td>${diff}</td><td>${need}</td><td>${orig}</td></tr>`;
    }).join('');
    div.appendChild(table);

    const themeScores = {};
    domains.forEach((d, i) => {
        if (!themeScores[d.theme]) themeScores[d.theme] = { diff: 0, need: 0 };
        themeScores[d.theme].diff += data.difficulties[i].intensity;
        themeScores[d.theme].need += data.needs[i].urgency;
    });
    const summary = document.createElement('ul');
    Object.keys(themeScores).forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t} - Difficulté: ${themeScores[t].diff}, Besoin: ${themeScores[t].need}`;
        summary.appendChild(li);
    });
    div.appendChild(summary);

    const diffNotNeed = domains
        .filter((d, i) => data.difficulties[i].presence && !data.needs[i].presence)
        .map(d => d.label);
    const needNotDiff = domains
        .filter((d, i) => !data.difficulties[i].presence && data.needs[i].presence)
        .map(d => d.label);
    if (diffNotNeed.length || needNotDiff.length) {
        const mismatch = document.createElement('p');
        mismatch.innerHTML =
            `<strong>Difficultés sans demande d'aide :</strong> ${diffNotNeed.join(', ')}<br>` +
            `<strong>Demandes sans difficulté :</strong> ${needNotDiff.join(', ')}`;
        div.appendChild(mismatch);
    }

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

