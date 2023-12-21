import React, { useState } from "react";

import LoginForm from "../components/login/loginForm";
import ForgotForm from "../components/login/forgotForm";

import { FormContext } from "../components/context/FormContext";

export default function LoginPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// True for Login False for Forgot Password
	const [formStatus, setFormStatus] = useState(true);

	return (
		<div className="h-screen flex justify-center items-center bg-[#3081D0]">
			<FormContext.Provider
				value={{
					formData,
					setFormData,
					setFormStatus,
				}}
			>
				{formStatus ? <LoginForm /> : <ForgotForm />}
			</FormContext.Provider>
		</div>
	);
}
