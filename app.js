const translations = {
  fr: {
    title: 'ELADEB-R Auto-évaluation',
    initialQuestion: 'Quel est pour vous le problème le plus important actuellement ?',
    next: 'Suivant',
    finish: 'Terminer',
    diffPresenceTitle: 'Difficultés : ces domaines posent-ils problème ?',
    problem: 'Problème',
    noProblem: 'Pas de problème',
    diffIntensityTitle: 'Difficultés : importance des problèmes',
    low: 'Peu important',
    medium: 'Important',
    high: 'Très important',
    needPresenceTitle: "Besoin d'aide supplémentaire ?",
    need: 'Besoin',
    noneed: 'Pas besoin',
    needUrgencyTitle: "Urgence de l'aide souhaitée",
    notUrgent: 'Non urgent',
    somewhatUrgent: 'Moyennement urgent',
    urgent: 'Urgent',
    needOriginTitle: "Origine de l'aide souhaitée",
    professionals: 'Professionnels',
    family: 'Famille',
    entourage: 'Entourage',
    unspecified: 'Non précisé',
    priorityTitle: 'Besoin prioritaire',
    priorityQuestion: "Si on ne pouvait faire qu'une seule chose pour vous, laquelle choisiriez-vous ?",
    results: 'Résultats',
    tableHeaderDomain: 'Domaine',
    tableHeaderDiff: 'Intensité difficulté',
    tableHeaderNeed: 'Urgence besoin',
    tableHeaderOrigin: 'Origine',
    domains: [
      'Lieu de vie', 'Finances', 'Travail', 'Droit & justice',
      'Temps libre', 'Tâches administratives', 'Entretien du ménage', 'Déplacements', 'Fréquentation des lieux publics',
      'Connaissances et amitiés', 'Famille', 'Enfants', 'Relations sentimentales',
      'Alimentation', 'Hygiène personnelle', 'Santé physique', 'Santé psychique',
      'Addiction', 'Traitement', 'Spiritualité & croyances', 'Sexualité'
    ]
  },
  en: {
    title: 'ELADEB-R Self-Assessment',
    initialQuestion: 'What is currently your most important problem?',
    next: 'Next',
    finish: 'Finish',
    diffPresenceTitle: 'Difficulties: do these areas cause problems?',
    problem: 'Problem',
    noProblem: 'No problem',
    diffIntensityTitle: 'Difficulties: importance of the problems',
    low: 'Minor',
    medium: 'Important',
    high: 'Very important',
    needPresenceTitle: 'Need additional help?',
    need: 'Need help',
    noneed: 'No need',
    needUrgencyTitle: 'Urgency of the desired help',
    notUrgent: 'Not urgent',
    somewhatUrgent: 'Somewhat urgent',
    urgent: 'Urgent',
    needOriginTitle: 'Source of the desired help',
    professionals: 'Professionals',
    family: 'Family',
    entourage: 'Friends',
    unspecified: 'Unspecified',
    priorityTitle: 'Priority need',
    priorityQuestion: 'If we could do only one thing for you, what would you choose?',
    results: 'Results',
    tableHeaderDomain: 'Domain',
    tableHeaderDiff: 'Difficulty intensity',
    tableHeaderNeed: 'Need urgency',
    tableHeaderOrigin: 'Source',
    domains: [
      'Housing', 'Finances', 'Work', 'Law & justice',
      'Free time', 'Administrative tasks', 'Housekeeping', 'Mobility', 'Public places attendance',
      'Acquaintances and friendships', 'Family', 'Children', 'Romantic relationships',
      'Food', 'Personal hygiene', 'Physical health', 'Mental health',
      'Addiction', 'Treatment', 'Spirituality & beliefs', 'Sexuality'
    ]
  },
  ar: {
    title: 'التقييم الذاتي لـ ELADEB-R',
    initialQuestion: 'ما هي أهم مشكلة لديك حالياً؟',
    next: 'التالي',
    finish: 'إنهاء',
    diffPresenceTitle: 'الصعوبات: هل تشكل هذه المجالات مشكلة؟',
    problem: 'مشكلة',
    noProblem: 'لا مشكلة',
    diffIntensityTitle: 'الصعوبات: أهمية المشكلات',
    low: 'قليل الأهمية',
    medium: 'مهم',
    high: 'مهم جداً',
    needPresenceTitle: 'هل تحتاج إلى مساعدة إضافية؟',
    need: 'حاجة',
    noneed: 'لا حاجة',
    needUrgencyTitle: 'مدى إلحاح المساعدة المطلوبة',
    notUrgent: 'غير عاجل',
    somewhatUrgent: 'عاجل إلى حد ما',
    urgent: 'عاجل',
    needOriginTitle: 'مصدر المساعدة المطلوبة',
    professionals: 'المختصون',
    family: 'العائلة',
    entourage: 'المعارف',
    unspecified: 'غير محدد',
    priorityTitle: 'الحاجة ذات الأولوية',
    priorityQuestion: 'إذا استطعنا القيام بشيء واحد فقط من أجلك، ماذا تختار؟',
    results: 'النتائج',
    tableHeaderDomain: 'المجال',
    tableHeaderDiff: 'شدة الصعوبة',
    tableHeaderNeed: 'إلحاح الحاجة',
    tableHeaderOrigin: 'المصدر',
    domains: [
      'مكان السكن', 'المال', 'العمل', 'القانون والعدالة',
      'وقت الفراغ', 'المهام الإدارية', 'تنظيف المنزل', 'التنقل', 'التردد على الأماكن العامة',
      'المعارف والصداقات', 'العائلة', 'الأطفال', 'العلاقات العاطفية',
      'الغذاء', 'النظافة الشخصية', 'الصحة الجسدية', 'الصحة النفسية',
      'الإدمان', 'العلاج', 'الروحانيات والمعتقدات', 'الجنس'
    ]
  }
};

let currentLang = 'fr';
let domains = translations[currentLang].domains;
const data = {
  initialQuestion: '',
  difficulties: domains.map(() => ({presence:false, intensity:0})),
  needs: domains.map(() => ({presence:false, urgency:0, origin:'?'})),
  priority:''
};
let currentStep = 0;
const container = document.getElementById('step-container');
const titleEl = document.getElementById('title');

document.getElementById('lang-select').addEventListener('click', e => {
  if (e.target.dataset.lang) {
    setLanguage(e.target.dataset.lang);
  }
});

function setLanguage(lang){
  currentLang = lang;
  domains = translations[currentLang].domains;
  document.documentElement.lang = lang;
  titleEl.textContent = translations[currentLang].title;
  render();
}

function nextStep() {
  currentStep++;
  render();
}

function render() {
  container.innerHTML = '';
  titleEl.textContent = translations[currentLang].title;
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
  const t = translations[currentLang];
  const div = document.createElement('div');
  div.innerHTML = `<p>${t.initialQuestion}</p>` +
    '<textarea id="question" rows="3" cols="60"></textarea><br>' +
    `<button id="next">${t.next}</button>`;
  container.appendChild(div);
  document.getElementById('next').onclick = () => {
    data.initialQuestion = document.getElementById('question').value;
    nextStep();
  };
}

function renderDifficultyPresence() {
  const t = translations[currentLang];
  const form = document.createElement('div');
  form.innerHTML = `<h2>${t.diffPresenceTitle}</h2>`;
  domains.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<strong>${d}</strong> ` +
      `<label><input type="radio" name="diff${i}" value="yes"> ${t.problem}</label> ` +
      `<label><input type="radio" name="diff${i}" value="no" checked> ${t.noProblem}</label>`;
    form.appendChild(div);
  });
  const btn = document.createElement('button');
  btn.textContent = t.next;
  btn.onclick = () => {
    domains.forEach((d, i) => {
      const val = document.querySelector(`input[name=diff${i}]:checked`).value;
      data.difficulties[i].presence = val === 'yes';
      if (!data.difficulties[i].presence) data.difficulties[i].intensity = 0;
    });
    nextStep();
  };
  form.appendChild(btn);
  container.appendChild(form);
}

function renderDifficultyIntensity() {
  const t = translations[currentLang];
  const form = document.createElement('div');
  form.innerHTML = `<h2>${t.diffIntensityTitle}</h2>`;
  domains.forEach((d, i) => {
    if (!data.difficulties[i].presence) return;
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<strong>${d}</strong> ` +
      `<label><input type="radio" name="int${i}" value="1" checked> ${t.low}</label> ` +
      `<label><input type="radio" name="int${i}" value="2"> ${t.medium}</label> ` +
      `<label><input type="radio" name="int${i}" value="3"> ${t.high}</label>`;
    form.appendChild(div);
  });
  const btn = document.createElement('button');
  btn.textContent = t.next;
  btn.onclick = () => {
    domains.forEach((d, i) => {
      if (!data.difficulties[i].presence) return;
      const val = document.querySelector(`input[name=int${i}]:checked`).value;
      data.difficulties[i].intensity = parseInt(val, 10);
    });
    nextStep();
  };
  form.appendChild(btn);
  container.appendChild(form);
}

function renderNeedPresence() {
  const t = translations[currentLang];
  const form = document.createElement('div');
  form.innerHTML = `<h2>${t.needPresenceTitle}</h2>`;
  domains.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<strong>${d}</strong> ` +
      `<label><input type="radio" name="need${i}" value="yes"> ${t.need}</label> ` +
      `<label><input type="radio" name="need${i}" value="no" checked> ${t.noneed}</label>`;
    form.appendChild(div);
  });
  const btn = document.createElement('button');
  btn.textContent = t.next;
  btn.onclick = () => {
    domains.forEach((d, i) => {
      const val = document.querySelector(`input[name=need${i}]:checked`).value;
      data.needs[i].presence = val === 'yes';
      if (!data.needs[i].presence) { data.needs[i].urgency = 0; data.needs[i].origin = '?'; }
    });
    nextStep();
  };
  form.appendChild(btn);
  container.appendChild(form);
}

function renderNeedUrgency() {
  const t = translations[currentLang];
  const form = document.createElement('div');
  form.innerHTML = `<h2>${t.needUrgencyTitle}</h2>`;
  domains.forEach((d, i) => {
    if (!data.needs[i].presence) return;
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<strong>${d}</strong> ` +
      `<label><input type="radio" name="urg${i}" value="1" checked> ${t.notUrgent}</label> ` +
      `<label><input type="radio" name="urg${i}" value="2"> ${t.somewhatUrgent}</label> ` +
      `<label><input type="radio" name="urg${i}" value="3"> ${t.urgent}</label>`;
    form.appendChild(div);
  });
  const btn = document.createElement('button');
  btn.textContent = t.next;
  btn.onclick = () => {
    domains.forEach((d, i) => {
      if (!data.needs[i].presence) return;
      const val = document.querySelector(`input[name=urg${i}]:checked`).value;
      data.needs[i].urgency = parseInt(val, 10);
    });
    nextStep();
  };
  form.appendChild(btn);
  container.appendChild(form);
}

function renderNeedOrigin() {
  const t = translations[currentLang];
  const form = document.createElement('div');
  form.innerHTML = `<h2>${t.needOriginTitle}</h2>`;
  domains.forEach((d, i) => {
    if (!data.needs[i].presence) return;
    const div = document.createElement('div');
    div.className = 'domain-item';
    div.innerHTML = `<strong>${d}</strong> ` +
      `<select id="orig${i}">` +
      `<option value="P">${t.professionals}</option>` +
      `<option value="F">${t.family}</option>` +
      `<option value="E">${t.entourage}</option>` +
      `<option value="?" selected>${t.unspecified}</option>` +
      `</select>`;
    form.appendChild(div);
  });
  const btn = document.createElement('button');
  btn.textContent = t.next;
  btn.onclick = () => {
    domains.forEach((d, i) => {
      if (!data.needs[i].presence) return;
      const val = document.getElementById(`orig${i}`).value;
      data.needs[i].origin = val;
    });
    nextStep();
  };
  form.appendChild(btn);
  container.appendChild(form);
}

function renderPriority() {
  const t = translations[currentLang];
  const div = document.createElement('div');
  div.innerHTML = `<h2>${t.priorityTitle}</h2>` +
    `<p>${t.priorityQuestion}</p>` +
    '<textarea id="priority" rows="3" cols="60"></textarea><br>' +
    `<button id="next">${t.finish}</button>`;
  container.appendChild(div);
  document.getElementById('next').onclick = () => {
    data.priority = document.getElementById('priority').value;
    nextStep();
  };
}

function renderResults() {
  const t = translations[currentLang];
  const div = document.createElement('div');
  div.innerHTML = `<h2>${t.results}</h2>`;
  const table = document.createElement('table');
  const header = `<tr><th>${t.tableHeaderDomain}</th><th>${t.tableHeaderDiff}</th><th>${t.tableHeaderNeed}</th><th>${t.tableHeaderOrigin}</th></tr>`;
  table.innerHTML = header + domains.map((d, i) => {
    const diff = data.difficulties[i].intensity;
    const need = data.needs[i].urgency;
    const orig = data.needs[i].origin;
    return `<tr><td>${d}</td><td>${diff}</td><td>${need}</td><td>${orig}</td></tr>`;
  }).join('');
  div.appendChild(table);

  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = domains.length * 25 + 20;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eee';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  domains.forEach((d, i) => {
    const y = i*25 + 15;
    ctx.fillStyle = '#000';
    ctx.fillText(d, 10, y);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(200, y-10, data.difficulties[i].intensity*40, 10);
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(200 + 150, y-10, data.needs[i].urgency*40, 10);
  });
  div.appendChild(canvas);
  container.appendChild(div);
}

setLanguage(currentLang);
