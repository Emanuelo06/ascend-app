# 🚀 Demo Account Debug Guide

## 🔍 **Debugging Steps**

### **1. Check Console Logs**
When you click the demo button, you should see these logs in the browser console:

```
🚀 Creating demo user with data: {id: "demo-user-123", ...}
🚀 Demo account loaded successfully
🚀 Demo mode set: true
🚀 Demo user data: {"id":"demo-user-123",...}
```

### **2. Check Auth Context Logs**
After the page reloads, you should see:

```
🔍 Auth check - demo mode: {isDemoMode: true, hasDemoUserData: true, ...}
🚀 Demo mode detected - loading demo user data
🚀 Demo user loaded: {id: "demo-user-123", ...}
```

### **3. Check UserFlowManager Logs**
You should see:

```
🔍 Demo user check: {userIsDemoUser: true, localStorageDemoMode: "true", isDemoUser: true, ...}
🚀 Demo user detected - allowing direct dashboard access
```

## 🛠️ **Manual Debug Steps**

### **Step 1: Clear Browser Data**
1. Open browser dev tools (F12)
2. Go to Application tab
3. Clear all localStorage data
4. Refresh the page

### **Step 2: Test Demo Button**
1. Go to `/login`
2. Click "🚀 Try Demo Account"
3. Check console for logs
4. Should redirect to dashboard

### **Step 3: Check localStorage**
After clicking demo button, check localStorage:
```javascript
// In browser console
console.log('Demo mode:', localStorage.getItem('ascend-demo-mode'));
console.log('Demo user:', localStorage.getItem('ascend_user_data'));
console.log('Demo token:', localStorage.getItem('ascend_auth_token'));
```

## 🔧 **If Still Not Working**

### **Alternative Solution: Direct Demo Route**
If the demo account still doesn't work, we can create a direct demo route that bypasses all auth checks.

### **Quick Fix: Manual Demo Mode**
You can manually set demo mode in browser console:
```javascript
localStorage.setItem('ascend-demo-mode', 'true');
localStorage.setItem('ascend_auth_token', 'demo-token-123');
window.location.href = '/dashboard';
```

## 📋 **Expected Behavior**

1. **Click Demo Button** → Console logs appear
2. **Page Reloads** → Auth context detects demo mode
3. **UserFlowManager** → Detects demo user and allows access
4. **Dashboard Loads** → Shows demo data (habits, goals, recommendations)

## 🚨 **Common Issues**

1. **localStorage not set**: Demo button didn't execute properly
2. **Auth context not detecting**: Demo mode flag not set correctly
3. **UserFlowManager redirecting**: Demo user detection failing
4. **Dashboard not loading demo data**: Demo data loading logic not working

## 🎯 **Next Steps**

If the demo account still doesn't work after these fixes, we can:
1. Create a simpler demo route that bypasses auth entirely
2. Add more aggressive demo detection
3. Create a dedicated demo page with hardcoded data

Let me know what console logs you see when you click the demo button!
