FROM python:latest

RUN apt-get update && \
    apt-get -y install netcat-traditional dos2unix && \
    apt-get clean

RUN mkdir camunda_diagram

COPY bpmn/ /camunda_diagram

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

RUN dos2unix entrypoint.sh

CMD ["./entrypoint.sh"]
