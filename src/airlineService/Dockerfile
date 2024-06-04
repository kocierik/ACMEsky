FROM golang:latest

COPY .env /app/src/.env
COPY src/ /app/src
WORKDIR /app/src/

RUN go mod download
RUN go build -o main .

EXPOSE 8085

CMD ["./main"]

