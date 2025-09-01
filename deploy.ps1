# 🚀 ASCEND App Vercel Deployment Script (PowerShell)
# This script automates the deployment process for Windows

Write-Host "🚀 Starting ASCEND App deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if user is logged in
try {
    $user = vercel whoami
    Write-Host "✅ Logged in as: $user" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📱 Your app should be live in a few minutes." -ForegroundColor Cyan
Write-Host "🔗 Check your Vercel dashboard for the deployment status." -ForegroundColor Cyan
