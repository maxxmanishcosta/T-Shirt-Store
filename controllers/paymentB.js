const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: 'k7mt8ykgdz4cwkhh',
	publicKey: 'ch4khnjb54v9mdwq',
	privateKey: '233fca2e11e3d974812a8d0b1c56b543',
});

exports.getToken = (req, res) => {
	// console.log(req);

	gateway.clientToken.generate({}, (err, response) => {
		// pass clientToken to your front-end
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = (req, res) => {
	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheClient = req.body.amount;

	gateway.transaction.sale(
		{
			amount: '10.00',
			paymentMethodNonce: nonceFromTheClient,
			deviceData: deviceDataFromTheClient,
			options: {
				submitForSettlement: true,
			},
		},
		(err, result) => {
			if (err) {
				res.status(500).json(err);
			} else {
				res.json(result);
			}
		}
	);
};
