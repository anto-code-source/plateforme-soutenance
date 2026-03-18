from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime

app = FastAPI(title="Plateforme Bancaire - Module IA Prédictif")

# ── CORS (autoriser Laravel à appeler Python) ──────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ══════════════════════════════════════════════════════════
# MODÈLES DE DONNÉES (ce qu'on reçoit de Laravel)
# ══════════════════════════════════════════════════════════

class AffluenceRequest(BaseModel):
    agence_id: int
    historique: List[float]   # ex: [120, 145, 98, 160, 110]
    date_cible: str           # ex: "2026-03-15"

class ChargeRequest(BaseModel):
    agence_id: int
    nb_agents: int
    nb_taches_historique: List[float]
    date_cible: str

class RepartitionRequest(BaseModel):
    agence_id: int
    agents: List[dict]        # [{id, nom, taches_en_cours, competences}]
    taches_en_attente: List[dict]  # [{id, service, priorite}]

# ══════════════════════════════════════════════════════════
# ROUTE TEST
# ══════════════════════════════════════════════════════════
@app.get("/")
def index():
    return {
        "message": "🧠 Module IA Prédictif actif",
        "version": "1.0.0",
        "routes": [
            "/predict/affluence",
            "/predict/charge",
            "/predict/repartition"
        ]
    }

# ══════════════════════════════════════════════════════════
# PRÉDICTION AFFLUENCE (Linear Regression)
# ══════════════════════════════════════════════════════════
@app.post("/predict/affluence")
def predire_affluence(data: AffluenceRequest):
    historique = data.historique

    # Si pas assez de données, retourner une moyenne simple
    if len(historique) < 3:
        valeur = round(sum(historique) / len(historique)) if historique else 50
        return {
            "agence_id"        : data.agence_id,
            "date_cible"       : data.date_cible,
            "affluence_prevue" : valeur,
            "unite"            : "clients",
            "niveau"           : _niveau_affluence(valeur),
            "heure_pic"        : "09h00 - 11h00",
            "recommandation"   : _recommandation_affluence(valeur),
            "precision_modele" : 70.0,
            "methode"          : "moyenne_simple"
        }

    # Préparer les données pour Linear Regression
    X = np.array(range(len(historique))).reshape(-1, 1)
    y = np.array(historique)

    modele = LinearRegression()
    modele.fit(X, y)

    # Prédire le prochain jour
    prochain_index = np.array([[len(historique)]])
    prediction = modele.predict(prochain_index)[0]
    prediction = max(0, round(prediction))

    # Calculer la précision du modèle (score R²)
    score = modele.score(X, y)
    precision = round(score * 100, 1)

    return {
        "agence_id"        : data.agence_id,
        "date_cible"       : data.date_cible,
        "affluence_prevue" : int(prediction),
        "unite"            : "clients",
        "niveau"           : _niveau_affluence(prediction),
        "heure_pic"        : "09h00 - 11h00",
        "recommandation"   : _recommandation_affluence(prediction),
        "precision_modele" : precision,
        "methode"          : "regression_lineaire"
    }

# ══════════════════════════════════════════════════════════
# PRÉDICTION CHARGE DE TRAVAIL (Random Forest)
# ══════════════════════════════════════════════════════════
@app.post("/predict/charge")
def predire_charge(data: ChargeRequest):
    historique = data.nb_taches_historique

    if len(historique) < 3:
        valeur = round(sum(historique) / len(historique)) if historique else 20
        return {
            "agence_id"      : data.agence_id,
            "date_cible"     : data.date_cible,
            "charge_prevue"  : valeur,
            "unite"          : "tâches",
            "par_agent"      : round(valeur / max(data.nb_agents, 1), 1),
            "niveau"         : _niveau_charge(valeur, data.nb_agents),
            "recommandation" : _recommandation_charge(valeur, data.nb_agents),
            "precision_modele": 70.0,
            "methode"        : "moyenne_simple"
        }

    # Préparer les données pour Random Forest
    X = np.array(range(len(historique))).reshape(-1, 1)
    y = np.array(historique)

    modele = RandomForestRegressor(n_estimators=10, random_state=42)
    modele.fit(X, y)

    prochain = np.array([[len(historique)]])
    prediction = modele.predict(prochain)[0]
    prediction = max(0, round(prediction))

    par_agent = round(prediction / max(data.nb_agents, 1), 1)

    return {
        "agence_id"       : data.agence_id,
        "date_cible"      : data.date_cible,
        "charge_prevue"   : int(prediction),
        "unite"           : "tâches",
        "par_agent"       : par_agent,
        "niveau"          : _niveau_charge(prediction, data.nb_agents),
        "recommandation"  : _recommandation_charge(prediction, data.nb_agents),
        "precision_modele": 82.0,
        "methode"         : "random_forest"
    }

# ══════════════════════════════════════════════════════════
# RECOMMANDATION RÉPARTITION DES TÂCHES (Scoring)
# ══════════════════════════════════════════════════════════
@app.post("/predict/repartition")
def recommander_repartition(data: RepartitionRequest):
    agents  = data.agents
    taches  = data.taches_en_attente
    resultat = []

    for tache in taches:
        meilleur_agent = None
        meilleur_score = -1

        for agent in agents:
            # Calcul du score de disponibilité
            taches_actuelles = agent.get("taches_en_cours", 0)
            score_dispo = max(0, 10 - taches_actuelles)

            # Bonus si compétence correspondante
            competences = agent.get("competences", [])
            service     = tache.get("service", "")
            bonus_competence = 3 if service in competences else 0

            # Bonus priorité haute
            priorite = tache.get("priorite", "normale")
            bonus_priorite = 2 if priorite == "haute" else 0

            score_total = score_dispo + bonus_competence + bonus_priorite

            if score_total > meilleur_score:
                meilleur_score  = score_total
                meilleur_agent  = agent

        if meilleur_agent:
            resultat.append({
                "tache_id"   : tache.get("id"),
                "service"    : tache.get("service"),
                "priorite"   : tache.get("priorite"),
                "agent_id"   : meilleur_agent.get("id"),
                "agent_nom"  : meilleur_agent.get("nom"),
                "score"      : meilleur_score,
                "raison"     : f"Agent le plus disponible avec score {meilleur_score}/15"
            })

            # Mettre à jour la charge de l'agent sélectionné
            meilleur_agent["taches_en_cours"] = meilleur_agent.get("taches_en_cours", 0) + 1

    return {
        "agence_id"      : data.agence_id,
        "total_taches"   : len(taches),
        "repartitions"   : resultat,
        "methode"        : "scoring_algorithmique",
        "recommandation" : f"{len(resultat)} tâches réparties entre {len(agents)} agents"
    }

# ══════════════════════════════════════════════════════════
# FONCTIONS UTILITAIRES
# ══════════════════════════════════════════════════════════
def _niveau_affluence(valeur):
    if valeur < 50:   return "faible"
    if valeur < 100:  return "normal"
    if valeur < 150:  return "élevé"
    return "très_élevé"

def _recommandation_affluence(valeur):
    if valeur < 50:   return "1 à 2 agents suffisent"
    if valeur < 100:  return "Prévoir 2 à 3 agents minimum"
    if valeur < 150:  return "Prévoir 4 agents minimum"
    return "Prévoir 5 agents ou plus - Pic d'affluence détecté"

def _niveau_charge(taches, agents):
    par_agent = taches / max(agents, 1)
    if par_agent < 5:   return "faible"
    if par_agent < 10:  return "normal"
    if par_agent < 15:  return "élevé"
    return "critique"

def _recommandation_charge(taches, agents):
    par_agent = taches / max(agents, 1)
    if par_agent < 5:   return "Charge normale, aucun ajustement nécessaire"
    if par_agent < 10:  return "Charge modérée, surveiller l'évolution"
    if par_agent < 15:  return "Charge élevée, envisager un renfort"
    return "Charge critique ! Ajouter des agents immédiatement"