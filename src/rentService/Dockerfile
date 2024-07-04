FROM jolielang/jolie:1.9.0

COPY . /app

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

EXPOSE 8030
EXPOSE 8000

WORKDIR /app

RUN chmod 777 init.sh

CMD ["./init.sh"]