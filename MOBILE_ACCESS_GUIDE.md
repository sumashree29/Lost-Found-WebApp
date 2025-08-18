# Mobile Access Troubleshooting Guide

## Primary URLs to Try:
1. **Network URL**: http://192.168.1.33:5173/
2. **Local URL**: http://localhost:5173/ (desktop only)

## Step-by-Step Mobile Access Setup:

### 1. Check Network Connection
- Ensure your mobile device is connected to the **same WiFi network** as your computer
- WiFi network name should match on both devices

### 2. Windows Firewall Settings
If you get a Windows Firewall prompt:
- Click **"Allow access"** when prompted
- Or manually add exception:
  1. Open Windows Firewall settings
  2. Click "Allow an app through firewall"
  3. Add Node.js or allow port 5173

### 3. Alternative Methods if Network URL Doesn't Work:

#### Method A: Use ngrok (Recommended)
1. Install ngrok: Download from https://ngrok.com/
2. Extract and run: `ngrok http 5173`
3. Use the provided HTTPS URL on mobile

#### Method B: Use Mobile Hotspot
1. Create mobile hotspot on your phone
2. Connect your computer to the mobile hotspot
3. Find your computer's new IP address
4. Access the new IP:5173 from mobile browser

#### Method C: Build and Deploy
1. Run `npm run build`
2. Use a simple HTTP server to serve the dist folder
3. Deploy to Netlify, Vercel, or GitHub Pages

### 4. Testing QR Codes:
- Open your phone's camera app
- Point at the QR code on your computer screen
- Tap the notification to open the link
- Should open directly to the Lost & Found app

### 5. Common Issues & Solutions:

**Issue**: "Can't reach this page" error
**Solution**: 
- Check if both devices are on same WiFi
- Try disabling Windows Firewall temporarily
- Restart the development server

**Issue**: QR code doesn't scan
**Solution**:
- Ensure good lighting when scanning
- QR code should be clear and not pixelated
- Try scanning from different distances

**Issue**: Website loads but looks broken on mobile
**Solution**:
- Clear mobile browser cache
- Try different mobile browser (Chrome, Safari, Firefox)
- Check if JavaScript is enabled

### 6. Verify Connection:
From your mobile device, try accessing:
- http://192.168.1.33:5173/ (main app)
- http://192.168.1.33:5173/items (items page)

## If All Else Fails:
1. Use the computer browser to test all features
2. Deploy to a cloud service for true mobile access
3. Contact network administrator if on corporate WiFi
