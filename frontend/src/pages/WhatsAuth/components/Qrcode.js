import React from "react";
import QRCode from "qrcode.react";
import Typography from "@material-ui/core/Typography";

const Qrcode = ({ qrCode }) => {
	return (
		<div>
			<Typography component="h2" variant="h6" color="primary" gutterBottom>
				Leia o QrCode para iniciar a sessão
			</Typography>
			<QRCode value={qrCode} size={256} />
		</div>
	);
};

export default Qrcode;