import React, { useState, useRef, useContext } from "react";

import axios from "axios";

import { FormContext } from "../context/FormContext";

export default function ForgotForm() {
	const submitRef = useRef(null);

	const { formData, setFormData, setFormStatus } = useContext(FormContext);

	const emailRegex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

	const [formMessage, setFormMessage] = useState("");

	async function handleSubmit(e) {
		submitRef.current.disabled = true;
		e.preventDefault();
		setFormMessage("");

		if (!formData.email) {
			setFormMessage("Please fill in all fields.");
			return;
		}

		if (!emailRegex.test(formData.email)) {
			setFormMessage("Invalid Email !!!");
			return;
		}

		try {
			await axios.post("http://localhost:8080/user/forgot-password", { email: formData.email });
			setFormMessage("Password reset link sent.");
		} catch (err) {
			console.log(err);
			setFormMessage("Email doesn't exixt.");
		} finally {
			submitRef.current.disabled = false;
		}
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
				<p className="text-2xl font-bold underline w-full flex justify-center">WELCOME BACK!!!</p>
				<div className="flex flex-col gap-1">
					<label htmlFor="name">Email</label>
					<input
						className="bg-[#f5eec9] p-1 rounded-md"
						type="email"
						name="email"
						required={true}
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				{formMessage && <p className="flex justify-center text-slate-600 underline">{formMessage}</p>}
				<div className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md">
					<input type="submit" value="Send Email" ref={submitRef} onClick={handleSubmit} />
				</div>

				<button
					className="underline"
					onClick={() => {
						setFormStatus(true);
					}}
				>
					Login.
				</button>
				<p>
					New User?{"  "}
					<a className="underline" href="/signup">
						SignUp.
					</a>
				</p>
			</form>
		</div>
	);
}
