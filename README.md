
# Facturas App

Aplicación web para el registro de Facturas con anlaizador XML





## Requisitos

**Node.js** versión utilizada **v20.12.2** 

**Python** versión utilizada **v3.12.3** 

**MYSQL** versión utilizada **v9.1** 





## Configurar MYSQL

Descargar, instalar y configurar la instancia

```bash
  Configurar usuario y contraseña root
```

Crear una base de datos

```bash
  nombrandola bd_facturas
```
Se usaran los datos para las variables de entorno

## Ejecutar la aplicación en local (Frontend)

Clone the project

```bash
  git clone https://github.com/AndyJhoao/facturas-app.git
```

Go to the project directory

```bash
  cd facturas-app
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Modificar para ejecutar en local

Modificaremos el HOST en el archivo facturasApi/facturasApi/settings.py en la linea 91
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DATABASE', 'bd_facturas'),
        'USER': os.getenv('MYSQL_USER', 'root'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD', 'adminroot'),
        'HOST': 'db',
        'PORT': '3306',
    }
}
```
Deberia verse de la siguiente manera
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DATABASE', 'bd_facturas'),
        'USER': os.getenv('MYSQL_USER', 'root'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD', 'adminroot'),
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```
Siguiente, nos dirigimos a la linea 145 del mismo archivo settings.py
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost",
    "http://0.0.0.0",
    "http://127.0.0.1",
]
```
Agregaremos el puerto que nos arroja el Frontend (normalmente es el puerto 5173)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5137"
]
```
Y por ultimo crearemos el archivo .env en la raiz del proyecto
```
MYSQL_ROOT_PASSWORD=passwordroot
MYSQL_DATABASE=bd_facturas
MYSQL_USER=user
MYSQL_PASSWORD=password
```

## Ejecutar la aplicación en local (Backend)

Go to the project directory

```bash
  cd facturasApi
```

Create virtual environment

```bash
  python -m venv venv
```

Activate virtual environment

```bash
  ./venv/Scripts/activate
```

Install dependencies in virtual environment

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python manage.py runserver
```

## Migrar tablas

En caso de requerir migrar tablas en la base de datos

```bash
  python manage.py migrate
  python manage.py makemigrations
```

## Ejecutar Docker compose

Para construir los contenedores, vamos a requerir tener instalado docker y docker-compose, no realizaremos ninguna modificacion en los archivos de settings.py como se mostro previamente.



Haremos un build de la aplicacion (Frontend)

```bash
  cd facturas-app
  npm run build
```

Regresamos a la raiz para ejecutar el docker-compose

```bash
  docker-compose up --build
```

En caso de que no levante el servicio de nginx, volveremos a reiniciar el servicio de nginx para que arranque correctamente.

```bash
  docker restart nginx
```

En caso de que no funcione correctamente el backend y mande error de tablas, ejecutaremos las migraciones correspondientes

```bash
  docker compose run backend python facturasApi/manage.py migrate
  docker compose run backend python facturasApi/manage.py collectstatics
  docker compose run backend python facturasApi/manage.py makemigrations
```

Todo esto en paralelo mientras estan corriendo los contenedores


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@AndyJhoao](https://github.com/AndyJhoao)

