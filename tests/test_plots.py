import os
import matplotlib
matplotlib.use('Agg')
import plot_eladeb
import plot_axes_scores


def test_create_bar_chart(tmp_path):
    out = tmp_path / 'bar.png'
    fig = plot_eladeb.create_bar_chart(filename=str(out))
    assert out.exists()
    assert fig is not None


def test_create_axes_chart(tmp_path):
    out = tmp_path / 'axes.png'
    fig = plot_axes_scores.create_axes_chart(filename=str(out))
    assert out.exists()
    assert fig is not None
