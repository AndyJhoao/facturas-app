
FROM python:3.12

ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r ./requirements.txt

COPY . /app

CMD [ "gunicorn", "-c", "gunicorn/conf.py", "--bind", ":8000", "--chdir", "facturasApi", "facturasApi.wsgi:application"]
