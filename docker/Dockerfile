FROM odoo:17

USER root
RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install pyjwt
RUN mkdir -p /opt/odoo-data && chown -R odoo:odoo /opt/odoo-data

USER odoo
