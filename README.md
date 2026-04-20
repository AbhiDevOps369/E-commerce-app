

⸻

✅ CLEAN FLOW (FRESH INSTANCE ONLY)

🔥 1. Connect

ssh -i key.pem ubuntu@IP

⸻

🔥 2. Update + install Node 20

sudo apt update -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

⸻

🔥 3. Verify

node -v
npm -v

⸻

🔥 4. Clone project

cd ~
git clone https://github.com/AbhiDevOps369/E-commerce-app.git
cd E-commerce-app

⸻

🔥 5. Install backend

npm install

⸻

🔥 6. Build frontend

cd client
npm install
npm run build
cd ..

⸻

🔥 7. Create env

nano .env

Paste:

MONGO_URI=your_atlas_url
PORT=3000

⸻

🔥 8. Run

nohup node server.js &

⸻

🔥 9. Open

http://PUBLIC_IP:3000


