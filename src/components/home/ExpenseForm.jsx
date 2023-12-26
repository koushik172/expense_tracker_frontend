import { useContext, useEffect } from "react";

import axios from "axios";

import { FormContext } from "../context/FormContext";
import BuyPremium from "./BuyPremiun";

export default function ExpenseForm() {
	const { formStatus, setFromStatus, formData, setFormData } = useContext(FormContext);

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	async function addExpense(e) {
		setFromStatus("");
		e.preventDefault();

		if (!formData.amount || !formData.description || !formData.type || !formData.category) {
			setFromStatus("Please fill in all fields.");
			setTimeout(() => {
				setFromStatus("");
			}, 5000);
			return;
		}

		try {
			await axios.post(`http://${import.meta.env.VITE_SERVER_IP}/expenses/add-expense/`, formData, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			setFromStatus("New Expense Added");
		} catch (err) {
			console.log(err.message);
		} finally {
			setTimeout(() => {
				setFromStatus("");
			}, 5000);
		}
	}

	return (
		<form className="flex flex-col bg-[#dfdd61] text-[#33689e] mt-[2%] mx-[5%] rounded-md">
			{/* USERNAME AND PREMUIM STATE */}
			<div className="flex items-center justify-center">
				<p className="p-4 font-bold text-4xl flex">Welcome {localStorage.getItem("username")}</p>
				<BuyPremium />
			</div>

			{/* LABELS AND INPUTS */}
			<div className="text-xl flex justify-evenly gap-4 px-8 md:px-0 py-4 flex-col md:flex-row w-full">
				<div className="flex flex-col lg:flex-row gap-2">
					<label htmlFor="amount" className="p-1 font-semibold">
						Amount
					</label>
					<input className="p-1 rounded-md bg-[#f5eec9]" type="number" name="amount" value={formData.amount} onChange={handleChange} />
				</div>

				<div className="flex flex-col lg:flex-row gap-2">
					<label htmlFor="description" className="p-1 font-semibold">
						Description
					</label>
					<input
						className="p-1 rounded-md bg-[#f5eec9]"
						type="text"
						name="description"
						value={formData.description}
						onChange={handleChange}
					/>
				</div>

				<div className="flex flex-col lg:flex-row gap-2">
					<label htmlFor="category" className="p-1 font-semibold">
						Category
					</label>
					<select
						className="p-1 rounded-md bg-[#f5eec9] items-center"
						name="category"
						id="category"
						value={formData.category}
						onChange={handleChange}
					>
						<option>Food</option>
						<option>Entertainment</option>
						<option>Clothes</option>
						<option>Travel</option>
						<option>Medical</option>
						<option>Education</option>
						<option>Salary</option>
						<option>Other Income</option>
					</select>
				</div>

				<div className="flex flex-col lg:flex-row gap-2">
					<label htmlFor="type" className="p-1 font-semibold">
						Tpye
					</label>
					<select className="p-1 rounded-md bg-[#f5eec9] items-center" name="type" id="type" value={formData.type} onChange={handleChange}>
						<option>Expense</option>
						<option>Income</option>
					</select>
				</div>
			</div>

			{/* FORMSTATUS */}
			<div>
				<p className="flex justify-center text-xl text-slate-500 underline whitespace-pre">{formStatus}</p>
			</div>

			{/* ADD EXPENSE BUTTON */}
			<div className="flex justify-center">
				<input className="bg-sky-400 hover:bg-sky-300 p-2 rounded-md my-4" type="submit" value="Add Expense" onClick={addExpense} />
			</div>
		</form>
	);
}
