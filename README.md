# Cloud Computing Lab Practical: MERN E-Commerce Deployment

This is a complete, deployable sample full-stack MERN (MongoDB, Express, React, Node.js) web application. It features a Node.js/Express backend, MongoDB database connection, and a premium-designed React frontend built with Vite.

It is specifically engineered to be extremely easy to deploy on an AWS EC2 instance for lab demonstrations, using a single command to build and start the entire stack.

## 🚀 AWS EC2 Deployment Guide (Ubuntu)

Follow these exact steps to deploy this application on a fresh Ubuntu EC2 instance.

### Step 1: Connect to your EC2 Instance
SSH into your instance using your key pair:
\`\`\`bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
\`\`\`

### Step 2: Install Node.js, npm, and MongoDB
Run these commands to install the necessary runtime environments:
\`\`\`bash
# Update packages
sudo apt update

# Install Node.js & npm
sudo apt install -y nodejs npm

# Install MongoDB
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
\`\`\`

### Step 3: Transfer / Clone the Code
If you are using Git, clone your repository. Otherwise, use \`scp\` to transfer this folder to the server.
\`\`\`bash
# Example if using git:
git clone <your-repository-url>
cd <repository-folder>
\`\`\`
*(Make sure you are inside the root folder containing the main `package.json` before proceeding).*

### Step 4: Install Dependencies & Build React App
Run the standard install command. A special `postinstall` script in `package.json` will automatically install the React client dependencies and build the static frontend.
\`\`\`bash
npm install
\`\`\`

### Step 5: Port Forwarding (Crucial for Web Access)
By default, Node.js runs on port 3000. For users to access your app simply via the IP address (port 80), route traffic from port 80 to 3000 using iptables:
\`\`\`bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
\`\`\`
*Note: Make sure your EC2 Security Group allows inbound traffic on HTTP (Port 80).*

### Step 6: Start the Application
Run the single command to start the server. It will automatically connect to MongoDB, seed sample products if the database is empty, and serve the compiled React frontend!
\`\`\`bash
npm start
\`\`\`

*(Optional: For a production-grade background process, use `pm2` instead: `sudo npm install -g pm2 && pm2 start server.js`)*

## 🛠 Architecture Details
- **Frontend (React)**: React 18 built with Vite. No heavy Webpack configs. Uses the modern Outfit font and premium CSS techniques (shadows, micro-animations, toast notifications). Compiles to static files in `client/dist`.
- **Backend (Express)**: Express.js serving REST API endpoints (`/api/products`, `/api/purchase`) and serving the `client/dist` directory statically.
- **Database (MongoDB)**: Mongoose ORM. Automatically seeds sample products on the first run. Uses local MongoDB instance (`mongodb://127.0.0.1:27017/ecommerce`) by default.
