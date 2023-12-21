import React, { useState } from "react";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPasswordPage() {
	let navigate = useNavigate();

	const { token } = useParams();

	const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

	const [formMessage, setFormMessage] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();

		if (!formData.password || !formData.confirmPassword) {
			setFormMessage("Please fill in all fields.");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setFormMessage("Passwords do not match");
			return;
		}

		try {
			await axios.post(`http://localhost:8080/user/reset-password/${token}`, formData);
		} catch (error) {
			setFormMessage(error.response.data);
			return;
		}

		setFormMessage("Password Changed Sucessfully!");
		console.log(token);
	}

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<div className="h-screen flex justify-center items-center bg-[#3081D0]">
			<form className="flex flex-col text-xl items-center gap-4 bg-[#dfdd61] p-4 rounded-md  text-[#33689e]">
				<p className="text-2xl font-bold underline w-full flex justify-center">SET NEW PASSWORD</p>

				<div className="flex flex-col gap-1">
					<label htmlFor="password">New Password</label>
					<input
						className="bg-[#f5eec9] p-1 rounded-md"
						type="password"
						name="password"
						required={true}
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						className="bg-[#f5eec9] p-1 rounded-md"
						type="password"
						name="confirmPassword"
						required={true}
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
				</div>
				{formMessage && <p className="flex justify-center text-slate-600 underline">{formMessage}</p>}
				<div className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md">
					<input type="submit" value="Confirm" onClick={handleSubmit} />
				</div>
				<p>
					<a className="underline" href="/login">
						Login
					</a>
					/
					<a className="underline" href="/signup">
						SignUp
					</a>
				</p>
			</form>
		</div>
	);
}
