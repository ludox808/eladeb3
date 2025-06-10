import { domains, infoMessages, state } from './state.js';
import { drawCharts } from './charts.js';

let container;
let needColumns;
const needCards = [];

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[c]));
}

function transition(action) {
    const h = container.offsetHeight;
    container.style.minHeight = `${h}px`;
    container.classList.add('fade-out');
    let ended = false;
    const onEnd = () => {
        if (ended) return;
        ended = true;
        container.removeEventListener('transitionend', onEnd);
        action();
        container.classList.remove('fade-out');
        requestAnimationFrame(() => {
            container.style.minHeight = '';
        });
    };
    container.addEventListener('transitionend', onEnd, { once: true });
    const durStr = getComputedStyle(container).transitionDuration.split(',')[0].trim();
    const duration = durStr.includes('ms') ? parseFloat(durStr) : parseFloat(durStr) * 1000;
    setTimeout(onEnd, duration + 50);
}

function recordState() {
    state.historyStack.push({ step: state.currentStep, domain: state.currentDomain });
}

function showStepInfo() {
    const msg = infoMessages[state.currentStep];
    if (msg && !state.infoShown[state.currentStep]) {
        state.infoShown[state.currentStep] = true;
        const div = document.createElement('div');
        div.innerHTML = `<p>${msg}</p><button id="continue">Commencer</button>`;
        container.appendChild(div);
        document.getElementById('continue').onclick = () => transition(render);
        return true;
    }
    return false;
}

function getProgressText() {
    if (state.currentStep === 1 || state.currentStep === 3) {
        return `${state.currentDomain + 1}/${domains.length}`;
    }
    if (state.currentStep === 2) {
        const total = state.data.difficulties.filter(d => d.presence).length;
        const idx = state.data.difficulties.slice(0, state.currentDomain + 1).filter(d => d.presence).length;
        return `${idx}/${total}`;
    }
    if (state.currentStep === 4 || state.currentStep === 5) {
        const total = state.data.needs.filter(n => n.presence).length;
        const idx = state.data.needs.slice(0, state.currentDomain + 1).filter(n => n.presence).length;
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
    for (let i = 0; i < state.currentDomain; i++) {
        const card = createSummaryCard(domains[i]);
        if (state.data.difficulties[i].presence) probCol.appendChild(card);
        else noProbCol.appendChild(card);
    }
    cont.appendChild(probCol);
    cont.appendChild(noProbCol);
    return cont;
}

function nextStep() {
    recordState();
    state.currentStep++;
    state.currentDomain = 0;
    render();
}

function nextDomain() {
    recordState();
    state.currentDomain++;
    if (state.currentDomain >= domains.length) {
        nextStep();
    } else {
        render();
    }
}

function goBack() {
    const prev = state.historyStack.pop();
    if (!prev) return;
    transition(() => {
        state.currentStep = prev.step;
        state.currentDomain = prev.domain;
        render();
    });
}

function render() {
    container.innerHTML = '';
    if (state.historyStack.length) {
        const back = document.createElement('button');
        back.id = 'back';
        back.innerHTML = '\u2190';
        back.onclick = goBack;
        container.appendChild(back);
    }
    if (showStepInfo()) return;
    if (state.currentStep === 0) renderInitialQuestion();
    else if (state.currentStep === 1) renderDifficultyPresence();
    else if (state.currentStep === 2) renderDifficultyIntensity();
    else if (state.currentStep === 3) renderNeedPresence();
    else if (state.currentStep === 4) renderNeedUrgency();
    else if (state.currentStep === 5) renderNeedOrigin();
    else if (state.currentStep === 6) renderPriority();
    else renderResults();
}

function renderInitialQuestion() {
    const div = document.createElement('div');
    div.innerHTML = '<p>Quel est pour vous le problème le plus important actuellement ?</p>' +
        '<textarea id="question" rows="3" cols="60"></textarea><br>' +
        '<button id="next">Suivant</button>';
    container.appendChild(div);

    const textarea = document.getElementById('question');
    textarea.value = state.data.initialQuestion || '';

    document.getElementById('next').onclick = () => {
        state.data.initialQuestion = textarea.value;
        transition(nextStep);
    };
}

function renderDifficultyPresence() {
    if (state.currentDomain >= domains.length) {
        nextStep();
        return;
    }

    const form = document.createElement('div');
    form.innerHTML = `<h2>Difficultés</h2>`;

    const d = domains[state.currentDomain];
    const div = createDomainCard(d, getProgressText());
    const buttons = document.createElement('div');
    buttons.className = 'diff-buttons';

    const probBtn = document.createElement('button');
    probBtn.className = 'diff-btn diff-problem';
    probBtn.textContent = 'Problème';
    probBtn.onclick = () => {
        state.data.difficulties[state.currentDomain].presence = true;
        div.classList.add('chosen-problem');
        transition(nextDomain);
    };

    const noProbBtn = document.createElement('button');
    noProbBtn.className = 'diff-btn diff-no-problem';
    noProbBtn.textContent = 'Pas de problème';
    noProbBtn.onclick = () => {
        state.data.difficulties[state.currentDomain].presence = false;
        state.data.difficulties[state.currentDomain].intensity = 0;
        div.classList.add('chosen-no-problem');
        transition(nextDomain);
    };

    buttons.appendChild(probBtn);
    buttons.appendChild(noProbBtn);
    div.appendChild(buttons);

    if (state.data.difficulties[state.currentDomain].presence) {
        div.classList.add('chosen-problem');
    } else if (!state.data.difficulties[state.currentDomain].presence &&
               state.data.difficulties[state.currentDomain].intensity === 0) {
        div.classList.add('chosen-no-problem');
    }
    form.appendChild(div);

    const cols = document.createElement('div');
    cols.id = 'diff-columns';

    const colProb = document.createElement('div');
    colProb.id = 'col-problem';
    colProb.innerHTML = '<h3>Problème</h3>';

    const colOk = document.createElement('div');
    colOk.id = 'col-ok';
    colOk.innerHTML = '<h3>Pas de problème</h3>';

    for (let i = 0; i < state.currentDomain; i++) {
        const card = createDomainCard(domains[i]);
        if (state.data.difficulties[i].presence) {
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
    while (state.currentDomain < domains.length && !state.data.difficulties[state.currentDomain].presence) {
        state.currentDomain++;
    }
    if (state.currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[state.currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Difficultés : importance du problème</h2>';
    const div = createDomainCard(d, getProgressText());
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="int" value="1"> Peu important</label> ` +
        `<label><input type="radio" name="int" value="2"> Important</label> ` +
        `<label><input type="radio" name="int" value="3"> Très important</label>`;
    div.appendChild(opts);

    const intVal = state.data.difficulties[state.currentDomain].intensity;
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
        state.data.difficulties[state.currentDomain].intensity = parseInt(val, 10);
        transition(nextDomain);
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedPresence() {
    if (state.currentDomain >= domains.length) {
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

    const d = domains[state.currentDomain];
    let card = needCards[state.currentDomain];
    if (!card) {
        card = createDomainCard(d, getProgressText());
        needCards[state.currentDomain] = card;
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
        const need = state.data.needs[state.currentDomain];
        need.presence = true;
        document.getElementById('need-yes').appendChild(card);
        transition(nextDomain);
    };
    const noBtn = document.createElement('button');
    noBtn.className = 'diff-btn diff-no-problem';
    noBtn.textContent = 'Pas besoin';
    noBtn.onclick = () => {
        const need = state.data.needs[state.currentDomain];
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
    while (state.currentDomain < domains.length && !state.data.needs[state.currentDomain].presence) {
        state.currentDomain++;
    }
    if (state.currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[state.currentDomain];
    const form = document.createElement('div');
    form.innerHTML = '<h2>Urgence de l\'aide souhaitée</h2>';
    const div = createDomainCard(d, getProgressText());
    const opts = document.createElement('div');
    opts.innerHTML =
        `<label><input type="radio" name="urg" value="1"> Non urgent</label> ` +
        `<label><input type="radio" name="urg" value="2"> Moyennement urgent</label> ` +
        `<label><input type="radio" name="urg" value="3"> Urgent</label>`;
    div.appendChild(opts);

    const urgVal = state.data.needs[state.currentDomain].urgency;
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
        state.data.needs[state.currentDomain].urgency = parseInt(val, 10);
        transition(nextDomain);
    };
    form.appendChild(btn);
    container.appendChild(form);
}

function renderNeedOrigin() {
    while (state.currentDomain < domains.length && !state.data.needs[state.currentDomain].presence) {
        state.currentDomain++;
    }
    if (state.currentDomain >= domains.length) {
        nextStep();
        return;
    }
    const d = domains[state.currentDomain];
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
    select.value = state.data.needs[state.currentDomain].origin;
    opts.querySelector('#origDetail').value = state.data.needs[state.currentDomain].detail || '';

    form.appendChild(div);
    const btn = document.createElement('button');
    btn.textContent = 'Suivant';
    btn.onclick = () => {
        const val = document.getElementById('orig').value;
        const detail = document.getElementById('origDetail').value;
        state.data.needs[state.currentDomain].origin = val;
        state.data.needs[state.currentDomain].detail = detail;
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
    textarea.value = state.data.priority || '';
    document.getElementById('next').onclick = () => {
        state.data.priority = textarea.value;
        transition(nextStep);
    };
}

function saveResults() {
    const all = JSON.parse(localStorage.getItem('eladeb-data') || '[]');
    const record = {
        id: Date.now().toString(36),
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(state.data))
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

    if (state.data.initialQuestion) {
        const initialP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = 'Problème principal :';
        initialP.appendChild(strong);
        initialP.append(' ');
        initialP.appendChild(document.createTextNode(state.data.initialQuestion));
        div.appendChild(initialP);
    }
    if (state.data.priority) {
        const priorityP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = 'Action prioritaire souhaitée :';
        priorityP.appendChild(strong);
        priorityP.append(' ');
        priorityP.appendChild(document.createTextNode(state.data.priority));
        div.appendChild(priorityP);
    }

    const table = document.createElement('table');
    const header = '<tr><th>Domaine</th><th>Intensit\xE9 difficult\xE9</th><th>Urgence besoin</th><th>Origine</th><th>Précisions</th></tr>';

    const maxUrg = Math.max(...state.data.needs.map(n => n.urgency));

    table.innerHTML = header + domains.map((d, i) => {
        const diff = state.data.difficulties[i].intensity;
        const need = state.data.needs[i].urgency;
        const orig = state.data.needs[i].origin;
        const detail = state.data.needs[i].detail || '';
        const rowCls = (diff >= 3 || need >= 3) ? ' class="high"' : '';

        const diffCls = diff > 0 ? ` class="val-${diff}"` : '';
        const needClasses = [];
        if (need > 0) needClasses.push(`val-${need}`);
        if (need === maxUrg && need > 0) needClasses.push('high-urgency');
        const needCls = needClasses.length ? ` class="${needClasses.join(' ')}"` : '';
        const needDisplay = state.data.needs[i].presence ? need : '—';

        return `<tr${rowCls}><td>${d.label}</td><td${diffCls}>${diff}</td><td${needCls}>${needDisplay}</td><td>${orig}</td><td><input type="text" data-index="${i}" class="origin-detail" value="${escapeHTML(detail)}"></td></tr>`;
    }).join('');
    div.appendChild(table);
    table.querySelectorAll('.origin-detail').forEach(input => {
        input.addEventListener('input', e => {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            state.data.needs[idx].detail = e.target.value;
        });
    });

    const themeScores = {};
    domains.forEach((d, i) => {
        if (!themeScores[d.theme]) themeScores[d.theme] = { diff: 0, need: 0 };
        themeScores[d.theme].diff += state.data.difficulties[i].intensity;
        themeScores[d.theme].need += state.data.needs[i].urgency;
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
        .filter((d, i) => state.data.difficulties[i].presence && !state.data.needs[i].presence)
        .map(d => d.label);
    const needNotDiff = domains
        .filter((d, i) => !state.data.difficulties[i].presence && state.data.needs[i].presence)
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

    drawCharts(canvas, themeCanvas, domains, state.data, themeLabels, themeDiff, themeNeed);
}

export function init() {
    container = document.getElementById('step-container');
    render();
}
