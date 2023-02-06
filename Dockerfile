FROM python:3.11

COPY ./ /app/

WORKDIR /app

RUN pip3 install -r requirements.txt

ENTRYPOINT python3.11 main.py