# For production
0. su - girand // под root не далать
1. git pull
2. yarn clear
3. yarn install
4. yarn build
5. NODE_ENV=production pm2 start start.config.json

# For development
1. yarn start
