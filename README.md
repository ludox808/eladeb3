# ELADEB-R Self-Assessment Demo

This repository contains a very small demo web application implementing the basic principles of the ELADEB-R card sorting evaluation. It is written in vanilla HTML/JavaScript and stores data only in the browser.

The results page summarises scores by thematic domain and stores each evaluation in `localStorage` with an anonymous code so you can track multiple sessions locally. It now also presents interactive charts using [Chart.js](https://www.chartjs.org/) to visualise difficulties and needs.

## Running

Open `index.html` in any modern browser. No build step is required.

## Python visualisation

A standalone script `plot_eladeb.py` can generate a horizontal bar chart of the
domain scores using `matplotlib`. The script reproduces the "Évaluation ELADEB-R"
visualisation with coloured bars, numeric values and thematic groupings.

Run it with:

```bash
python plot_eladeb.py
```

This will create `eladeb_bar_chart.png` in the repository root and display the
chart if a graphical environment is available.

A second script `plot_axes_scores.py` visualises aggregated psychosocial scores by major thematic axis. It plots side-by-side bars for Difficulty (0-5) and Need (0-15).

Run it with:

```bash
python plot_axes_scores.py
```

This generates `axes_scores_chart.png` in the repository root and shows the chart if possible.
