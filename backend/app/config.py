import os
from pathlib import Path

basedir = Path(__file__).resolve().parent.parent


class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:////data/desert_ledger.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS
    CORS_HEADERS = 'Content-Type'
