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
    needs: domains.map(() => ({ presence: false, urgency: 0, origin: '?', detail: '' })),
    priority: ''
};

let currentStep = 0;
let currentDomain = 0;
let container;
const historyStack = [];

let needColumns;
const needCards = [];

const infoShown = {};
const infoMessages = {
    2: "Cette application applique les principes de l'évaluation par tri de cartes ELADEB-R. Vous allez maintenant évaluer l'importance de chaque problème identifié.",
    3: "Vous allez maintenant indiquer si une aide supplémentaire est souhaitée.",
    4: "Vous allez maintenant préciser l'urgence de l'aide.",
    5: "Vous allez maintenant choisir l'origine de l'aide souhaitée.",
    6: "Enfin, vous pourrez préciser l'action prioritaire à mener."
};

function transition(action) {
    const h = container.offsetHeight;
    container.style.minHeight = `${h}px`;
    container.classList.add('fade-out');
    const onEnd = () => {
        container.removeEventListener('transitionend', onEnd);
        action();
        container.classList.remove('fade-out');
        requestAnimationFrame(() => {
            container.style.minHeight = '';
        });
    };
    container.addEventListener('transitionend', onEnd, { once: true });
}

function recordState() {
    historyStack.push({ step: currentStep, domain: currentDomain });
}

function showStepInfo() {
    const msg = infoMessages[currentStep];
    if (msg && !infoShown[currentStep]) {
        infoShown[currentStep] = true;
        const div = document.createElement('div');
        div.innerHTML = `<p>${msg}</p><button id="continue">Commencer</button>`;
        container.appendChild(div);
        document.getElementById('continue').onclick = () => transition(render);
        return true;
    }
    return false;
}

function getProgressText() {
    if (currentStep === 1 || currentStep === 3) {
        return `${currentDomain + 1}/${domains.length}`;
    }
    if (currentStep === 2) {
        const total = data.difficulties.filter(d => d.presence).length;
        const idx = data.difficulties.slice(0, currentDomain + 1).filter(d => d.presence).length;
        return `${idx}/${total}`;
    }
    if (currentStep === 4 || currentStep === 5) {
        const total = data.needs.filter(n => n.presence).length;
        const idx = data.needs.slice(0, currentDomain + 1).filter(n => n.presence).length;
        return `${idx}/${total}`;
    }
    return '';
}

function createDomainCard(domain, progress) {
    const div = document.createElement('div');
    div.className = 'domain-item';
    if (progress) {
        const p = document.createElement('div');
        p.className = 'progress-overlay';
        p.textContent = progress;
        div.appendChild(p);
    }
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

function createSummaryCard(domain) {
    const div = document.createElement('div');
    div.className = 'summary-card';
    const icon = document.createElement('i');
    icon.className = `fa ${domain.icons[0]} domain-icon`;
    div.appendChild(icon);
    const span = document.createElement('span');
    span.textContent = domain.label;
    div.appendChild(span);
    return div;
}

function buildSummaryContainer() {
    const cont = document.createElement('div');
    cont.className = 'summary-container';
    const probCol = document.createElement('div');
    probCol.className = 'summary-column';
    const probTitle = document.createElement('h3');
    probTitle.textContent = 'Problème';
    probCol.appendChild(probTitle);
    const noProbCol = document.createElement('div');
    noProbCol.className = 'summary-column';
    const noProbTitle = document.createElement('h3');
    noProbTitle.textContent = 'Pas de problème';
    noProbCol.appendChild(noProbTitle);
    for (let i = 0; i < currentDomain; i++) {
        const card = createSummaryCard(domains[i]);
        if (data.difficulties[i].presence) probCol.appendChild(card);
        else noProbCol.appendChild(card);
    }
    cont.appendChild(probCol);
    cont.appendChild(noProbCol);
    return cont;
}

function nextStep() {
    recordState();
    currentStep++;
    currentDomain = 0;
    render();
}

function nextDomain() {
    recordState();
    currentDomain++;
    if (currentDomain >= domains.length) {
        nextStep();
    } else {
        render();
    }
}

function goBack() {
    const prev = historyStack.pop();
    if (!prev) return;
    transition(() => {
        currentStep = prev.step;
        currentDomain = prev.domain;
        render();
    });
}

function render() {
    container.innerHTML = '';
    if (historyStack.length) {
        const back = document.createElement('button');
        back.id = 'back';
        back.innerHTML = '\u2190';
        back.onclick = goBack;
        container.appendChild(back);
    }
    if (showStepInfo()) return;
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

    const textarea = document.getElementById('question');
    textarea.value = data.initialQuestion || '';

    document.getElementById('next').onclick = () => {
        data.initialQuestion = textarea.value;
        transition(nextStep);
    };
}

function renderDifficultyPresence() {
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }

    // Header
    const form = document.createElement('div');
    form.innerHTML = `<h2>Difficultés</h2>`;

    // Card currently being evaluated
    const d = domains[currentDomain];
    const div = createDomainCard(d, getProgressText());
    const buttons = document.createElement('div');
    buttons.className = 'diff-buttons';

    const probBtn = document.createElement('button');
    probBtn.className = 'diff-btn diff-problem';
    probBtn.textContent = 'Problème';
    probBtn.onclick = () => {
        data.difficulties[currentDomain].presence = true;
        div.classList.add('chosen-problem');
        transition(nextDomain);
    };

    const noProbBtn = document.createElement('button');
    noProbBtn.className = 'diff-btn diff-no-problem';
    noProbBtn.textContent = 'Pas de problème';
    noProbBtn.onclick = () => {
        data.difficulties[currentDomain].presence = false;
        data.difficulties[currentDomain].intensity = 0;
        div.classList.add('chosen-no-problem');
        transition(nextDomain);
    };

    buttons.appendChild(probBtn);
    buttons.appendChild(noProbBtn);
    div.appendChild(buttons);

    if (data.difficulties[currentDomain].presence) {
        div.classList.add('chosen-problem');
    } else if (!data.difficulties[currentDomain].presence &&
               data.difficulties[currentDomain].intensity === 0) {
        div.classList.add('chosen-no-problem');
    }
    form.appendChild(div);

    // Columns showing already sorted cards
    const cols = document.createElement('div');
    cols.id = 'diff-columns';

    const colProb = document.createElement('div');
    colProb.id = 'col-problem';
    colProb.innerHTML = '<h3>Problème</h3>';

    const colOk = document.createElement('div');
    colOk.id = 'col-ok';
    colOk.innerHTML = '<h3>Pas de problème</h3>';

    // Append cards from previous answers
    for (let i = 0; i < currentDomain; i++) {
        const card = createDomainCard(domains[i]);
        if (data.difficulties[i].presence) {
            card.classList.add('chosen-problem');
            colProb.appendChild(card);
        } else {
            card.classList.add('chosen-no-problem');
            colOk.appendChild(card);
        }
    }

    cols.appendChild(colProb);
    cols.appendChild(colOk);
    form.appendChild(cols);
    container.appendChild(form);
    container.appendChild(buildSummaryContainer());
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
    const div = createDomainCard(d, getProgressText());
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="int" value="1"> Peu important</label> ` +
        `<label><input type="radio" name="int" value="2"> Important</label> ` +
        `<label><input type="radio" name="int" value="3"> Très important</label>`;
    div.appendChild(opts);

    const intVal = data.difficulties[currentDomain].intensity;
    if (intVal > 0) {
        opts.querySelector(`input[name=int][value="${intVal}"]`).checked = true;
    } else {
        opts.querySelector('input[name=int][value="1"]').checked = true;
    }

    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=int]:checked').value;
        data.difficulties[currentDomain].intensity = parseInt(val, 10);
        transition(nextDomain);
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedPresence() {
    if (currentDomain >= domains.length) {
        nextStep();
        return;
    }
    if (!needColumns) {
        needColumns = document.createElement('div');
        needColumns.id = 'need-columns';
        const yesCol = document.createElement('div');
        yesCol.id = 'need-yes';
        yesCol.innerHTML = '<h3>Besoin</h3>';
        const noCol = document.createElement('div');
        noCol.id = 'need-no';
        noCol.innerHTML = '<h3>Pas besoin</h3>';
        needColumns.appendChild(yesCol);
        needColumns.appendChild(noCol);
    }

    const d = domains[currentDomain];
    let card = needCards[currentDomain];
    if (!card) {
        card = createDomainCard(d, getProgressText());
        needCards[currentDomain] = card;
    } else {
        const prog = card.querySelector('.progress-overlay');
        if (prog) prog.textContent = getProgressText();
    }
    if (card.parentElement) card.parentElement.removeChild(card);

    const form = document.createElement('div');
    form.innerHTML = '<h2>Besoin d\'aide supplémentaire ?</h2>';
    const buttons = document.createElement('div');
    buttons.className = 'diff-buttons';
    const yesBtn = document.createElement('button');
    yesBtn.className = 'diff-btn diff-problem';
    yesBtn.textContent = 'Besoin';
    yesBtn.onclick = () => {
        const need = data.needs[currentDomain];
        need.presence = true;
        document.getElementById('need-yes').appendChild(card);
        transition(nextDomain);
    };
    const noBtn = document.createElement('button');
    noBtn.className = 'diff-btn diff-no-problem';
    noBtn.textContent = 'Pas besoin';
    noBtn.onclick = () => {
        const need = data.needs[currentDomain];
        need.presence = false;
        need.urgency = 0;
        need.origin = '?';
        need.detail = '';
        document.getElementById('need-no').appendChild(card);
        transition(nextDomain);
    };
    buttons.appendChild(yesBtn);
    buttons.appendChild(noBtn);
    card.appendChild(buttons);
    form.appendChild(card);
    container.appendChild(form);
    container.appendChild(needColumns);
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
    const div = createDomainCard(d, getProgressText());
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="urg" value="1"> Non urgent</label> ` +
        `<label><input type="radio" name="urg" value="2"> Moyennement urgent</label> ` +
        `<label><input type="radio" name="urg" value="3"> Urgent</label>`;
    div.appendChild(opts);

    const urgVal = data.needs[currentDomain].urgency;
    if (urgVal > 0) {
        opts.querySelector(`input[name=urg][value="${urgVal}"]`).checked = true;
    } else {
        opts.querySelector('input[name=urg][value="1"]').checked = true;
    }

    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.querySelector('input[name=urg]:checked').value;
        data.needs[currentDomain].urgency = parseInt(val, 10);
        transition(nextDomain);
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
    const div = createDomainCard(d, getProgressText());
    const opts = document.createElement('div');
    opts.innerHTML =
        `<select id="orig">` +
        `<option value="P">Professionnels</option>` +
        `<option value="F">Famille</option>` +
        `<option value="E">Entourage</option>` +
        `<option value="?">Non précisé</option>` +
        `</select>` +
        `<input id="origDetail" type="text" placeholder="Précisions" style="margin-left:10px">`;
    div.appendChild(opts);

    const select = opts.querySelector('#orig');
    select.value = data.needs[currentDomain].origin;
    opts.querySelector('#origDetail').value = data.needs[currentDomain].detail || '';

    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.getElementById('orig').value;
        const detail = document.getElementById('origDetail').value;
        data.needs[currentDomain].origin = val;
        data.needs[currentDomain].detail = detail;
        transition(nextDomain);
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
    const textarea = document.getElementById('priority');
    textarea.value = data.priority || '';
    document.getElementById('next').onclick = () => {
        data.priority = textarea.value;
        transition(nextStep);
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
    return record;
}

function renderResults() {
    const div = document.createElement('div');
    div.className = 'results';
    div.innerHTML = '<h2>R\xE9sultats d\xE9taill\xE9s</h2>';

    const record = saveResults();
    const codeP = document.createElement('p');
    codeP.textContent = `Code anonyme : ${record.id}`;
    div.appendChild(codeP);

    const dateP = document.createElement('p');
    const recordDate = new Date(record.timestamp);
    const dateStr = recordDate.toLocaleDateString('fr-FR');
    const timeStr = recordDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    dateP.textContent = `Date : ${dateStr} - Heure : ${timeStr}`;
    div.appendChild(dateP);

    // Afficher les réponses aux questions ouvertes
    if (data.initialQuestion) {
        const initialP = document.createElement('p');
        initialP.innerHTML = `<strong>Problème principal :</strong> ${data.initialQuestion}`;
        div.appendChild(initialP);
    }
    if (data.priority) {
        const priorityP = document.createElement('p');
        priorityP.innerHTML = `<strong>Action prioritaire souhaitée :</strong> ${data.priority}`;
        div.appendChild(priorityP);
    }

    const table = document.createElement('table');
    const header = '<tr><th>Domaine</th><th>Intensit\xE9 difficult\xE9</th><th>Urgence besoin</th><th>Origine</th><th>Précisions</th></tr>';

    const maxUrg = Math.max(...data.needs.map(n => n.urgency));

    table.innerHTML = header + domains.map((d, i) => {
        const diff = data.difficulties[i].intensity;
        const need = data.needs[i].urgency;
        const orig = data.needs[i].origin;
        const detail = data.needs[i].detail || '';
        const rowCls = (diff >= 3 || need >= 3) ? ' class="high"' : '';

        const diffCls = diff > 0 ? ` class="val-${diff}"` : '';
        const needClasses = [];
        if (need > 0) needClasses.push(`val-${need}`);
        if (need === maxUrg && need > 0) needClasses.push('high-urgency');
        const needCls = needClasses.length ? ` class="${needClasses.join(' ')}"` : '';
        const needDisplay = data.needs[i].presence ? need : '—';

        return `<tr${rowCls}><td>${d.label}</td><td${diffCls}>${diff}</td><td${needCls}>${needDisplay}</td><td>${orig}</td><td><input type="text" data-index="${i}" class="origin-detail" value="${detail}"></td></tr>`;
    }).join('');
    div.appendChild(table);
    table.querySelectorAll('.origin-detail').forEach(input => {
        input.addEventListener('input', e => {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            data.needs[idx].detail = e.target.value;
        });
    });

    const themeScores = {};
    domains.forEach((d, i) => {
        if (!themeScores[d.theme]) themeScores[d.theme] = { diff: 0, need: 0 };
        themeScores[d.theme].diff += data.difficulties[i].intensity;
        themeScores[d.theme].need += data.needs[i].urgency;
    });
    const summary = document.createElement('ul');
    const themeLabels = [];
    const themeDiff = [];
    const themeNeed = [];
    Object.keys(themeScores).forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${t}</strong> - Difficulté : ${themeScores[t].diff}, Besoin : ${themeScores[t].need}`;
        summary.appendChild(li);
        themeLabels.push(t);
        themeDiff.push(themeScores[t].diff);
        themeNeed.push(themeScores[t].need);
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
    canvas.id = 'resultChart';
    div.appendChild(canvas);
    const themeCanvas = document.createElement('canvas');
    themeCanvas.id = 'themeChart';
    div.appendChild(themeCanvas);

    const printBtn = document.createElement('button');
    printBtn.textContent = 'Imprimer la synthèse';
    printBtn.onclick = () => window.print();
    div.appendChild(printBtn);

    container.appendChild(div);

    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: domains.map(d => d.label),
            datasets: [
                {
                    label: 'Difficult\xE9',
                    backgroundColor: '#4CAF50',
                    data: domains.map((d,i) => data.difficulties[i].intensity)
                },
                {
                    label: 'Besoin',
                    backgroundColor: '#2196F3',
                    data: domains.map((d,i) => data.needs[i].urgency)
                }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 3 } }
        }
    });

    new Chart(themeCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: themeLabels,
            datasets: [
                { label: 'Difficult\xE9', backgroundColor: '#4CAF50', data: themeDiff },
                { label: 'Besoin', backgroundColor: '#2196F3', data: themeNeed }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    container = document.getElementById('step-container');
    render();
});

