import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

# Domain scores on a 0-3 scale
DATA = {
    "Lieu de vie": 1,
    "Finances": 0,
    "Travail": 0,
    "Droit & justice": 0,
    "Temps libre": 0,
    "Tâches administratives": 0,
    "Entretien du ménage": 2,
    "Déplacements": 0,
    "Fréquentation des lieux publics": 0,
    "Connaissances et amitiés": 0,
    "Famille": 0,
    "Enfants": 0,
    "Relations sentimentales": 0,
    "Alimentation": 0,
    "Hygiène personnelle": 0,
    "Santé physique": 0,
    "Santé psychique": 0,
    "Addiction": 0,
    "Traitement": 0,
    "Spiritualité & croyances": 0,
    "Sexualité": 0
}

# Optional thematic grouping similar to the web demo
THEMES = {
    "Lieu de vie": "Conditions de vie",
    "Finances": "Conditions de vie",
    "Travail": "Conditions de vie",
    "Droit & justice": "Conditions de vie",
    "Temps libre": "Pragmatique du quotidien",
    "Tâches administratives": "Pragmatique du quotidien",
    "Entretien du ménage": "Pragmatique du quotidien",
    "Déplacements": "Pragmatique du quotidien",
    "Fréquentation des lieux publics": "Pragmatique du quotidien",
    "Connaissances et amitiés": "Relations",
    "Famille": "Relations",
    "Enfants": "Relations",
    "Relations sentimentales": "Relations",
    "Alimentation": "Santé",
    "Hygiène personnelle": "Santé",
    "Santé physique": "Santé",
    "Santé psychique": "Santé",
    "Addiction": "Santé",
    "Traitement": "Santé",
    "Spiritualité & croyances": "Santé",
    "Sexualité": "Santé"
}

GROUP_ORDER = [
    "Conditions de vie",
    "Pragmatique du quotidien",
    "Relations",
    "Santé",
]

# Sort domains by theme so they appear grouped
sorted_domains = [
    d for theme in GROUP_ORDER for d in DATA if THEMES[d] == theme
]
scores = [DATA[d] for d in sorted_domains]

# Colors from green (0) to red (3)
cmap = plt.cm.get_cmap("RdYlGn_r")
colors = [cmap(score / 3) for score in scores]

fig, ax = plt.subplots(figsize=(10, 8))

positions = range(len(sorted_domains))
bar_container = ax.barh(positions, scores, color=colors)
ax.set_yticks(positions)
ax.set_yticklabels(sorted_domains)
ax.invert_yaxis()
ax.set_xlabel("Score (0-3)")
ax.set_xlim(0, 3)
ax.set_title("Évaluation ELADEB-R")

# Display numeric value to the right of each bar
for bar, score in zip(bar_container, scores):
    ax.text(
        bar.get_width() + 0.05,
        bar.get_y() + bar.get_height() / 2,
        str(score),
        va="center"
    )

# Draw horizontal lines to separate themes
idx = 0
for theme in GROUP_ORDER:
    count = sum(1 for d in DATA if THEMES[d] == theme)
    if idx > 0:
        ax.axhline(idx - 0.5, color="grey", linewidth=0.5)
    idx += count

fig.tight_layout()
# Save to file instead of showing directly
fig.savefig("eladeb_bar_chart.png", dpi=300)

if __name__ == "__main__":
    plt.show()
