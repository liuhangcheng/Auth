# TimeKey System

A secure time-based key generation and verification system using TOTP (Time-based One-Time Password) algorithm.

Demo: http://auth.abeliu.com

## Features

- **User Authentication**: Secure login system with hashed passwords
- **Time-Based Keys**: Generate unique 6-digit codes that change every 30 seconds
- **Public Verification**: Anyone can verify a key by providing the username and token
- **Real-time Updates**: Dashboard automatically refreshes to show current key
- **QR Code Support**: Compatible with Google Authenticator and similar apps
- **Modern UI**: Responsive design with Bootstrap and Font Awesome icons

## Installation

1. **Clone or download the project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

## Usage

### For Users (Getting Time-Based Keys)

1. **Visit the website** at `http://localhost:3000`
2. **Click "Login"** and use one of the demo accounts:
   - Username: `admin`, Password: `password123`
   - Username: `user1`, Password: `mypassword`
3. **Access your dashboard** to see your current 6-digit time-based key
4. **Share your key** with others who need to verify it (keys change every 30 seconds)

### For Verifiers (Checking Keys)

1. **Visit the verification page** at `http://localhost:3000/verify`
2. **Enter the username** of the person whose key you want to verify
3. **Enter the 6-digit key** they provided
4. **Click "Verify Key"** to check if it's valid

## Technical Details

- **TOTP Algorithm**: Uses RFC 6238 compliant time-based one-time passwords
- **30-second intervals**: Keys change every 30 seconds
- **Time tolerance**: Accepts keys from ±2 time windows (±60 seconds)
- **Secure storage**: Passwords are hashed using bcrypt
- **Session management**: Secure session handling with express-session

## API Endpoints

- `GET /` - Home page
- `GET /login` - Login form
- `POST /login` - Process login
- `GET /dashboard` - User dashboard (authenticated)
- `GET /verify` - Public verification page
- `POST /verify` - Process key verification
- `GET /api/current-token` - Get current token (authenticated)
- `POST /logout` - Logout user

## Security Features

1. **Password Hashing**: All passwords are hashed with bcrypt
2. **Session Security**: Secure session configuration
3. **Time-based Tokens**: Keys are only valid for short time windows
4. **Input Validation**: Proper validation of all user inputs
5. **TOTP Standard**: Uses industry-standard TOTP algorithm

## Development

### Adding New Users

To add new users, modify the `sampleUsers` array in `server.js`:

```javascript
const sampleUsers = [
    { username: 'newuser', password: 'newpassword' },
    // ... existing users
];
```

### Customization

- **Token validity window**: Modify the `window` parameter in TOTP verification
- **Token refresh interval**: Change the `step` parameter (default: 30 seconds)
- **UI styling**: Modify the CSS in `views/layout.ejs`

## Production Deployment

For production use:

1. **Change the session secret** in `server.js`
2. **Use a proper database** instead of in-memory storage
3. **Add HTTPS** for secure communication
4. **Set appropriate environment variables**
5. **Add rate limiting** for security

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Dependencies

- **express**: Web framework
- **speakeasy**: TOTP implementation
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **qrcode**: QR code generation
- **ejs**: Template engine
- **bootstrap**: UI framework

## License

MIT License 