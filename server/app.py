import os
from flask import Flask, redirect, url_for, session, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_dance.contrib.google import make_google_blueprint, google
from dotenv import load_dotenv
from models import db, User, Comparison, OAuth

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "super-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# CORS setup - adjust as needed for production
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"])

# Google OAuth setup
google_bp = make_google_blueprint(
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    scope=["profile", "email"],
    offline=True,
    redirect_to="auth_success"
)
app.register_blueprint(google_bp, url_prefix="/login")

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/auth/success")
def auth_success():
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    if not google.authorized:
        return redirect(frontend_url)
    
    resp = google.get("/oauth2/v2/userinfo")
    if resp.ok:
        info = resp.json()
        user = User.query.filter_by(google_id=info["id"]).first()
        if not user:
            user = User(
                google_id=info["id"],
                email=info["email"],
                name=info["name"],
                avatar_url=info.get("picture")
            )
            db.session.add(user)
            db.session.commit()
        
        # If they had a free try in session, migrate it
        if session.get('pending_comparison'):
            comp_data = session.pop('pending_comparison')
            new_comp = Comparison(
                user_id=user.id,
                type=comp_data['type'],
                ppt1_name=comp_data['ppt1_name'],
                ppt2_name=comp_data['ppt2_name'],
                score=comp_data['score'],
                summary=comp_data['summary'],
                full_result=comp_data['full_result']
            )
            db.session.add(new_comp)
            db.session.commit()
            
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    return redirect(f"{frontend_url}/history")

@app.route("/api/auth/status")
def auth_status():
    if google.authorized:
        resp = google.get("/oauth2/v2/userinfo")
        if resp.ok:
            info = resp.json()
            user = User.query.filter_by(google_id=info["id"]).first()
            if user:
                return jsonify({"logged_in": True, "user": {"name": user.name, "email": user.email, "avatar": user.avatar_url}})
    
    return jsonify({"logged_in": False, "free_try_used": session.get('free_try_used', False)})

@app.route("/api/save_comparison", methods=["POST"])
def save_comparison():
    data = request.json
    
    # Check if user is logged in
    user = None
    if google.authorized:
        resp = google.get("/oauth2/v2/userinfo")
        if resp.ok:
            info = resp.json()
            user = User.query.filter_by(google_id=info["id"]).first()

    if not user:
        if session.get('free_try_used'):
            return jsonify({"error": "Free try already used. Please login to save more."}), 403
        
        # Mark free try as used and store in session temporarily
        session['free_try_used'] = True
        session['pending_comparison'] = data
        return jsonify({"message": "Comparison completed as free try.", "free_try": True})

    # Save to DB for logged in user
    new_comp = Comparison(
        user_id=user.id,
        type=data.get('type'),
        ppt1_name=data.get('ppt1_name'),
        ppt2_name=data.get('ppt2_name'),
        score=data.get('score'),
        summary=data.get('summary'),
        full_result=data.get('full_result')
    )
    db.session.add(new_comp)
    db.session.commit()
    return jsonify({"message": "Comparison saved to history.", "id": new_comp.id})

@app.route("/api/history")
def get_history():
    if not google.authorized:
        return jsonify({"error": "Unauthorized"}), 401
    
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return jsonify({"error": "Failed to fetch user info"}), 401
    
    info = resp.json()
    user = User.query.filter_by(google_id=info["id"]).first()
    if not user:
        return jsonify([])

    comps = Comparison.query.filter_by(user_id=user.id).order_by(Comparison.created_at.desc()).all()
    return jsonify([{
        "id": c.id,
        "type": c.type,
        "ppt1_name": c.ppt1_name,
        "ppt2_name": c.ppt2_name,
        "score": c.score,
        "summary": c.summary,
        "created_at": c.created_at.isoformat(),
        "full_result": c.full_result
    } for c in comps])

@app.route("/api/history/<int:comparison_id>", methods=["DELETE"])
def delete_history_item(comparison_id):
    if not google.authorized:
        return jsonify({"error": "Unauthorized"}), 401

    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return jsonify({"error": "Failed to fetch user info"}), 401

    info = resp.json()
    user = User.query.filter_by(google_id=info["id"]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    comp = Comparison.query.filter_by(id=comparison_id, user_id=user.id).first()
    if not comp:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(comp)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})


@app.route("/logout")
def logout():
    session.clear()
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    return redirect(frontend_url)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
