export function drawCharts(canvas, themeCanvas, domains, data, themeLabels, themeDiff, themeNeed) {
    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: domains.map(d => d.label),
            datasets: [
                {
                    label: 'Difficult\u00e9',
                    backgroundColor: '#4CAF50',
                    data: domains.map((d, i) => data.difficulties[i].intensity)
                },
                {
                    label: 'Besoin',
                    backgroundColor: '#2196F3',
                    data: domains.map((d, i) => data.needs[i].urgency)
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
                { label: 'Difficult\u00e9', backgroundColor: '#4CAF50', data: themeDiff },
                { label: 'Besoin', backgroundColor: '#2196F3', data: themeNeed }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}
