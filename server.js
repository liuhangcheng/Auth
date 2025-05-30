const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// In-memory storage (use a database in production)
const users = new Map();
const companies = new Map();

// Initialize companies
companies.set('tax-dept', {
    id: 'tax-dept',
    name: 'Tax department',
    description: 'Government tax authority',
    color: '#28a745'
});

companies.set('insurance-company', {
    id: 'insurance-company',
    name: 'Insurance company',
    description: 'Insurance services provider',
    color: '#007bff'
});

// Sample users for testing
const sampleUsers = [
    { username: 'admin', password: 'password123', companyId: 'tax-dept' },
    { username: 'user1', password: 'mypassword', companyId: 'insurance-company' }
];

// Initialize sample users with hashed passwords
(async () => {
    for (const user of sampleUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const secret = speakeasy.generateSecret({
            name: `Agent Auth (${user.username})`,
            issuer: 'Agent Auth System'
        });
        
        users.set(user.username, {
            username: user.username,
            password: hashedPassword,
            secret: secret.base32,
            secretUrl: secret.otpauth_url,
            companyId: user.companyId
        });
    }
})();

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = users.get(username);
    if (user && await bcrypt.compare(password, user.password)) {
        const userCompany = companies.get(user.companyId);
        req.session.user = {
            username: user.username,
            secret: user.secret,
            companyId: user.companyId,
            company: userCompany
        };
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get('/dashboard', requireAuth, async (req, res) => {
    const user = users.get(req.session.user.username);
    
    // Generate current TOTP token
    const token = speakeasy.totp({
        secret: user.secret,
        encoding: 'base32',
        time: Date.now() / 1000,
        step: 30
    });
    
    // Generate QR code for secret setup (optional)
    try {
        const qrCodeUrl = await QRCode.toDataURL(user.secretUrl);
        res.render('dashboard', { 
            user: req.session.user, 
            token, 
            qrCode: qrCodeUrl,
            timeRemaining: 30 - Math.floor((Date.now() / 1000) % 30)
        });
    } catch (error) {
        res.render('dashboard', { 
            user: req.session.user, 
            token, 
            qrCode: null,
            timeRemaining: 30 - Math.floor((Date.now() / 1000) % 30)
        });
    }
});

app.get('/companies', (req, res) => {
    const companiesList = Array.from(companies.values());
    res.render('companies', { companies: companiesList, user: req.session.user });
});

app.get('/verify', (req, res) => {
    res.render('verify', { result: null });
});

app.post('/verify', (req, res) => {
    const { token, username } = req.body;
    
    if (!token || !username) {
        res.render('verify', { 
            result: { 
                success: false, 
                message: 'Please provide both token and username' 
            } 
        });
        return;
    }
    
    const user = users.get(username);
    if (!user) {
        res.render('verify', { 
            result: { 
                success: false, 
                message: 'User not found' 
            } 
        });
        return;
    }
    
    // Verify TOTP token with some time window tolerance
    const isValid = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: token,
        window: 2, // Allow 2 steps before/after current time
        time: Date.now() / 1000
    });
    
    const userCompany = companies.get(user.companyId);
    
    res.render('verify', { 
        result: { 
            success: isValid, 
            message: isValid ? 'Token is valid!' : 'Invalid token or token has expired',
            user: isValid ? { username: user.username, company: userCompany } : null
        } 
    });
});

app.get('/api/current-token', requireAuth, (req, res) => {
    const user = users.get(req.session.user.username);
    const token = speakeasy.totp({
        secret: user.secret,
        encoding: 'base32',
        time: Date.now() / 1000,
        step: 30
    });
    
    res.json({
        token,
        timeRemaining: 30 - Math.floor((Date.now() / 1000) % 30)
    });
});

app.get('/api/companies', (req, res) => {
    const companiesList = Array.from(companies.values());
    res.json(companiesList);
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nSample users for testing:');
    console.log('Username: admin, Password: password123 (Tax department)');
    console.log('Username: user1, Password: mypassword (Insurance company)');
    console.log('\nCompanies available:');
    companies.forEach(company => {
        console.log(`- ${company.name}: ${company.description}`);
    });
}); 