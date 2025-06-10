import matplotlib.pyplot as plt

# Psychosocial evaluation data by thematic axis
DATA = {
    "Conditions de vie": {"Difficulté": 4, "Besoin": 10},
    "Pragmatique du quotidien": {"Difficulté": 4, "Besoin": 5},
    "Relations": {"Difficulté": 2, "Besoin": 0},
    "Santé": {"Difficulté": 0, "Besoin": 0},
}

def create_axes_chart(filename: str = "axes_scores_chart.png", show: bool = False):
    """Create the axes chart and save it to ``filename``."""
    axes = list(DATA.keys())
    difficulties = [DATA[a]["Difficulté"] for a in axes]
    needs = [DATA[a]["Besoin"] for a in axes]

    x = range(len(axes))
    width = 0.35

    fig, ax = plt.subplots(figsize=(8, 5))

    # Bars for difficulties and needs side by side
    ax.bar([xi - width / 2 for xi in x], difficulties, width, color="#f44336", label="Difficulté")
    ax.bar([xi + width / 2 for xi in x], needs, width, color="#2196F3", label="Besoin")

    ax.set_xticks(list(x))
    ax.set_xticklabels(axes, rotation=15, ha="right")
    ax.set_ylabel("Score")
    ax.set_ylim(0, 15)
    ax.set_title("Évaluation psychosociale par grand axe")
    ax.legend()

    # Display numeric value above each bar
    for xi, diff, need in zip(x, difficulties, needs):
        ax.text(xi - width / 2, diff + 0.2, str(diff), ha="center", va="bottom")
        ax.text(xi + width / 2, need + 0.2, str(need), ha="center", va="bottom")

    fig.tight_layout()
    fig.savefig(filename, dpi=300)
    if show:
        plt.show()
    return fig


if __name__ == "__main__":
    create_axes_chart(show=True)
