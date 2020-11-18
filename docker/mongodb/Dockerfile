FROM mongo:4.0.18

ARG server_uid

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list 

RUN apt-get update && apt-get install -y \
    sudo

EXPOSE 27017