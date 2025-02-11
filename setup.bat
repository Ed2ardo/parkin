@echo off
echo Instalando dependencias del backend...
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo Aplicando migraciones...
python manage.py migrate

echo Instalando dependencias del frontend...
cd frontend
npm install
cd ..

echo Configuración completada!
pause
