FROM mongo:4.0.18

ARG server_uid

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list 

RUN apt-get update && apt-get install -y \
    sudo

# UID пользователя
#RUN echo $server_uid + 'server uid'
#RUN usermod -u $server_uid mongodb && groupmod -g $server_uid mongodb

#ADD scripts/ /scripts/

EXPOSE 27017