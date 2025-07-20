grep -r "auth_controller" /var/lib/odoo/addons/project_extend/
ps -ef | grep odoo
ls /mnt/extra-addons/project_extend
grep -r "auth_controller" /mnt/extra-addons
odoo shell
# 注意替换数据库名
./odoo-bin -d odoo17 -u project_extend --dev=all --stop-after-init
odoo shell
odoo --config=/etc/odoo/odoo.conf -d odoo17 -u project_extend --stop-after-init
odoo --config=/etc/odoo/odoo.conf -d odoo17-dev01 -u project_extend --stop-after-init
docker restart odoo17
odoo --config=/etc/odoo/odoo.conf -d odoo17-dev01 -u project_extend --stop-after-init
odoo --config=/etc/odoo/odoo.conf -d odoo17-dev01 -u project_extend --stop-after-init
odoo shell -d odoo17-dev01
exit
