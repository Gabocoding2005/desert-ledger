"""
Script para inicializar la base de datos en Docker
"""
import time
from app import create_app, db

def init_database():
    """Inicializa la base de datos y crea las tablas"""
    app = create_app()

    with app.app_context():
        # Esperar a que la base de datos esté lista
        max_retries = 30
        retry_count = 0

        while retry_count < max_retries:
            try:
                # Intentar conectar a la base de datos
                db.engine.connect()
                print("✓ Conexión a la base de datos exitosa")
                break
            except Exception as e:
                retry_count += 1
                print(f"Esperando a que la base de datos esté lista... ({retry_count}/{max_retries})")
                time.sleep(2)

        if retry_count == max_retries:
            print("✗ No se pudo conectar a la base de datos")
            return False

        # Crear todas las tablas
        try:
            db.create_all()
            print("✓ Tablas creadas exitosamente")
            return True
        except Exception as e:
            print(f"✗ Error al crear las tablas: {e}")
            return False

if __name__ == '__main__':
    init_database()
