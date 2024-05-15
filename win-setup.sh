cd ~/Workspace/mea-viewer
docker-compose up -d
echo 'alias mea-viewer="docker-compose -f ~/Workspace/mea-viewer/docker-compose.yml up -d && start http://localhost:4173/"' >> ~/.bashrc
