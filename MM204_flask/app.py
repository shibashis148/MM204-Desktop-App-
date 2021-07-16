from implicit import implicit
from flask import Flask, request, jsonify
from explicit import explicit

app = Flask(__name__)


@app.route('/')
def index():
    return "Ok You Got It Vmro!!! comgo"


@app.route("/explicit", methods=["POST"])
def explicit_method():
    if request.method == "POST":
        data = request.get_json(force=True)
        ans1, ans2, time = explicit(data["air_jet_temp"] + 273,
                                    data["salb_temp"] + 273,
                                    data["exposure_time"])
        T_bottom_imp, T_top_imp = implicit(data["air_jet_temp"],
                                           data["salb_temp"],
                                           data["exposure_time"])

        return jsonify({
            "bottom": ans1,
            "top": ans2,
            "success": True,
            "time": list(time),
            "implicit_solution_bottom": T_bottom_imp,
            "implicit_solution_top": T_top_imp,
        })


if __name__ == '__main__':
    app.debug = True
    app.run()