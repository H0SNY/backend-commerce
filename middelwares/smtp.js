import nodemailer from 'nodemailer';
export async function sendEmail(req, res) {
	// async..await is not allowed in global scope, must use a wrapper
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	const {user , confirmation , token} = req.query;

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'jlamkiluser587@gmail.com',
			pass: "}}ANN8Q+#XXbEeb/j}j`P>6QHt$KH%mV.+Y9vp=/v7xm=Lh_>Yw}+8_Xr3@6ZP%7tM;BrzW!6=GX%8",
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: "Me 👻", // sender address
		to: user.email, // list of receivers
		subject: 'Hello ✔', // Subject line
		text: `Confirmation Code : ${confirmation}`, // plain text body
		html: '<b>Hello world?</b>', // html body
	});

	console.log('send info: %s', info);
	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	res.status(200).send({valid : true , token : token});
}
