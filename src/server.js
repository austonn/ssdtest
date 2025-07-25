const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// XSS validation function
function isXSSAttack(input) {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi,
        /<img[^>]+src[^>]*=/gi,
        /alert\s*\(/gi,
        /eval\s*\(/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
}

// SQL injection validation function
function isSQLInjection(input) {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        /(\b(OR|AND)\b.*=.*)/gi,
        /(--|#|\/\*|\*\/)/gi,
        /('|('')|";|";--|';)/gi,
        /(\b(1=1|1=0)\b)/gi,
        /(\bSLEEP\s*\()/gi,
        /(\bWAITFOR\s+DELAY)/gi
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
}

// Home page route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Search Application</title>
        </head>
        <body>
            <h1>Search Application</h1>
            <form method="POST" action="/search">
                <label for="searchTerm">Enter search term:</label><br><br>
                <input type="text" id="searchTerm" name="searchTerm" required><br><br>
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>
    `);
});

// Search processing route
app.post('/search', (req, res) => {
    const searchTerm = req.body.searchTerm || '';
    
    // Check for XSS attack
    if (isXSSAttack(searchTerm)) {
        return res.redirect('/');
    }
    
    // Check for SQL injection attack
    if (isSQLInjection(searchTerm)) {
        return res.redirect('/');
    }
    
    // If input is valid, display search term
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Search Results</title>
        </head>
        <body>
            <h1>Search Results</h1>
            <p>You searched for: ${searchTerm}</p>
            <br>
            <a href="/">
                <button>Return to Home Page</button>
            </a>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});