FROM node:10.8.0

ARG server_uid

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list 

RUN apt-get update && apt-get install -y \
    sudo

# UID пользователя
RUN echo $server_uid + 'server uid'
RUN usermod -u $server_uid node && groupmod -g $server_uid node

ADD scripts/ /scripts/

EXPOSE 8111