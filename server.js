// routes
app.use('/api', require('./app/routes/auth'));
app.use('/api', require('./app/routes/profile'));
app.use('/api', require('./app/routes/change-password'));
app.use('/api', require('./app/routes/inventory'));
app.use('/api', require('./app/routes/cart'));

// root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// start server ← always last
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));