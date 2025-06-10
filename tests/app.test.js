const { createDomainCard, saveResults, data } = require('../src/app.js');

describe('createDomainCard', () => {
  test('creates card with label and progress', () => {
    const domain = { label: 'Foo', icons: ['fa-star'] };
    const card = createDomainCard(domain, '1/3');
    expect(card.className).toContain('domain-item');
    expect(card.querySelector('.progress-overlay').textContent).toBe('1/3');
    expect(card.querySelector('strong').textContent).toBe('Foo');
    expect(card.querySelectorAll('.domain-icon').length).toBe(1);
  });
});

describe('saveResults', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('stores results in localStorage', () => {
    data.difficulties[0].intensity = 2;
    const record = saveResults();
    const stored = JSON.parse(localStorage.getItem('eladeb-data'));
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(record.id);
  });
});
