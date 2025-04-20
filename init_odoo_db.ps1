# 设置变量
$DB_NAME = "odoo17_test1" # 更改数据库名称以避免连字符
$DB_USER = "odoo"
$DB_PASSWORD = "123456"
$POSTGRES_PASSWORD = "123456" # 设置为你本地 PostgreSQL 的密码

# 设置环境变量
$env:PGPASSWORD = $POSTGRES_PASSWORD

# 删除旧数据库并创建新数据库
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS $DB_NAME;" -W
psql -U postgres -h localhost -c "CREATE DATABASE $DB_NAME;" -W
psql -U postgres -h localhost -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" -W
psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" -W

# 启动 Odoo 服务
docker-compose up -d

# 初始化 Odoo 数据库
docker exec -it odoo17 bash -c "./odoo-bin -d $DB_NAME --init=all --stop-after-init"

# 重启 Odoo 容器
docker restart odoo17
