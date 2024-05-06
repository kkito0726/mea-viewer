cd ~/Workspace/mea-viewer
docker-compose up -d
echo alias mea-viewer="docker-compose -f ~/Workspace/mea-viewer/docker-compose.yml up -d && open http://localhost:4173/" >> ~/.bashrc
source ~/.bashrc
