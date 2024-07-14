FROM python:latest

RUN apt-get update && \
    apt-get -y install netcat-traditional dos2unix tzdata && \
    apt-get clean

RUN mkdir camunda_diagram

COPY bpmn/ /camunda_diagram

ENV TZ=Europe/Rome
RUN date=$(date -d "+5 minutes" '+%Y-%m-%dT%H:%M:%S') && \
    sed -i "s/{{date}}/$date/" /camunda_diagram/VerificaGiornaliera.bpmn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

RUN dos2unix entrypoint.sh

CMD ["./entrypoint.sh"]
