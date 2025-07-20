#!/bin/bash

# Step 1: Stop the running Docker containers
echo "Stopping the Docker containers..."
docker-compose down -v

# Step 2: Remove the existing Docker volumes (this will remove all data!)
echo "Removing existing Docker volumes..."
docker volume rm $(docker volume ls -q)

# Step 3: Rebuild the Docker images (including pyjwt installation)
echo "Rebuilding Docker images..."
docker-compose build

# Step 4: Recreate the Docker containers and start them
echo "Starting the Docker containers..."
docker-compose up -d

# Step 5: Trigger Odoo to update and rebuild assets (web module)
echo "Triggering Odoo asset compilation..."
docker exec -it odoo17 bash -c "odoo -d odoo17_dev -u web --stop-after-init"

# Step 6: Restart the Odoo container
echo "Restarting the Odoo container..."
docker restart odoo17

# Step 7: Clean browser cache (suggested for users to do manually)

echo "Setup complete. Please clear your browser cache and restart your browser."
