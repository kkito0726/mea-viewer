from flask import Blueprint

from model.FigRequest import decode_request
from usecase.FigUseCase import FigUseCase

figure = Blueprint("figure", __name__)


@figure.route("/draw", methods=["POST"])
def draw():
    fig_request = decode_request()
    return FigUseCase(fig_request).create_fig()
