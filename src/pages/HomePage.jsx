import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { FormContext } from "../components/context/FormContext";

import ExpenseList from "../components/home/ExpenseList";
import Leaderboard from "../components/home/Leaderboard";
import ExpenseForm from "../components/home/ExpenseForm";

export default function HomePage() {
	const navigate = useNavigate();

	// To show Erros and Other Messages
	const [formStatus, setFromStatus] = useState("");

	// To handle Form Data
	const [formData, setFormData] = useState({
		amount: "",
		description: "",
		category: "Food",
		type: "Expense",
	});

	function logout() {
		localStorage.clear();
		navigate("/login");
	}

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
	}, []);

	return (
		<FormContext.Provider value={{ formData, setFormData, formStatus, setFromStatus }}>
			<div className="flex flex-col bg-[#3081D0] h-screen">
				<ExpenseForm />

				<Leaderboard />

				<ExpenseList />

				<div className="flex justify-center items-center">
					<button className="text-xl text-red-900 bg-red-400 hover:bg-red-300 p-2 w-fit rounded-md m-4" onClick={logout}>
						Logout
					</button>
				</div>

				<p className="whitespace-pre"> </p>
			</div>
		</FormContext.Provider>
	);
}
