import { useState, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BuyPremium() {
	const navigate = useNavigate();

	const [premium, setPremium] = useState(false);

	function loadScript(src) {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = src;
			script.onload = () => {
				resolve(true);
			};
			script.onerror = () => {
				resolve(false);
			};
			document.body.appendChild(script);
		});
	}

	async function displayRazorpay(e) {
		e.preventDefault();

		if (premium) return alert("Already a premium user");

		const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

		if (!res) {
			alert("Razorpay SDK failed to load. Are you online?");
			return;
		}

		const result = await axios.post("http://localhost:8080/orders/new-order", {}, { headers: { Authorization: localStorage.getItem("token") } });

		if (!result) {
			alert("Server error. Are you online?");
			return;
		}

		const { amount, id: order_id, currency } = result.data;

		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
			amount: amount.toString(),
			currency: currency,
			name: "Koushik Test",
			description: "Test Transaction",
			// image: { logo },
			order_id: order_id,
			handler: async function (response) {
				const data = {
					orderCreationId: order_id,
					razorpayPaymentId: response.razorpay_payment_id,
					razorpayOrderId: response.razorpay_order_id,
					razorpaySignature: response.razorpay_signature,
				};

				const result = await axios.post("http://localhost:8080/orders/payment/success", data, {
					headers: { Authorization: localStorage.getItem("token") },
				});
				alert(result.data.msg);
				setPremium(true);
				localStorage.setItem("premium", true);
				navigate("/");
			},
			prefill: {
				name: "Koushik Rajbanshi",
				email: "krazy@example.com",
				contact: "9999999999",
			},
			notes: {
				address: "Krazy Corporate Office",
			},
			theme: {
				color: "#61dafb",
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	}

	async function isPremium() {
		let res = await axios.get("http://localhost:8080/user/is-premium", { headers: { Authorization: localStorage.getItem("token") } });
		localStorage.setItem("premium", res.data);
		setPremium(res.data);
	}

	useEffect(() => {
		isPremium();
	}, []);

	useEffect(() => {}, [premium]);

	return (
		<button
			onClick={displayRazorpay}
			className="bg-gradient-to-br from-sky-400 to-yellow-500 hover:bg-gradient-to-tl hover:from-sky-400 hover:to-yellow-500 bg- transition-all duration-1000 h-fit p-1 rounded-lg border-4 border-green-600"
		>
			{!premium ? "Get Premium" : "Premium User"}
		</button>
	);
}
