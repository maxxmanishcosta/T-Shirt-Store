//used for loading the created environment variable into the process.env form
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//my routes
const authRoutes = require('./routes/authentication.js');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentBRoutes = require('./routes/paymentB');

//MongoDb Connection
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(function () {
		console.log('DB CONNECTED');
	});

//middlewares used for routing
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//my routes
app.use('/api', authRoutes); //authentication routes(present in routes folder)
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', paymentBRoutes);

//TODO populate study pending

app.use('/api', orderRoutes);

app.use(express.static(__dirname + '/'));
//PORT
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.send('hellos...');
});

//starting the server
app.listen(port, () => {
	console.log(`app is running at ${port}`);
});
