python manage.py makemigrations
python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn facturasApi.wsgi/application --bind :8000