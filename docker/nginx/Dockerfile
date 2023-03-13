FROM nginx:1.15
ARG server_uid=1000

ADD nginx.conf /etc/nginx/nginx.conf

#RUN usermod -u $server_uid www-data

#COPY --from=public /public/dist /web/
#COPY --from=admin /public-admin/dist /web/admin

EXPOSE 80 443

