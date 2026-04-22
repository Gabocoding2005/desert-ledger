#!/bin/bash

echo "Inicializando la base de datos..."
python init_db.py

echo "Sembrando categorías por defecto..."
python seed_data.py

echo "Iniciando la aplicación Flask..."
python run.py
