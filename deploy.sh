cd /home/ec2-user/hairkey-bot
pm2 stop hairkey-bot
git pull origin main
npm install
npx tsc
pm2 start dist/bot.js --name hairkey-bot
pm2 status