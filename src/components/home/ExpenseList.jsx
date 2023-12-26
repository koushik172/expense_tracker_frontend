import { useState, useEffect, useContext } from "react";

import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";

import { FormContext } from "../context/FormContext";

export default function ExpenseList() {
	let navigate = useNavigate();

	const { formStatus, setFromStatus } = useContext(FormContext);

	// ALL EXPENSES FOLLOWED BY TODAY, WEEKLY, MONTHLY, YEARLY
	const [expenses, setExpenses] = useState(""); // all expenses
	const [dailyExpenses, setDailyExpenses] = useState("");
	const [monthlyExpenses, setMonthlyExpenses] = useState("");
	const [yearlyExpenses, setYearlyExpenses] = useState("");

	// STATES TO HANDLE SORTING
	const [sortOptions, setSortOptions] = useState(localStorage.getItem("sort"));

	// HOLDS TOTAL EXPENSE
	const [totalExpense, setTotalExpense] = useState("");

	// PAGINATION
	const [rows, setRows] = useState(localStorage.getItem("rows") ? localStorage.getItem("rows") : 10);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState("");

	function handleSort(e) {
		let option = e.target.value;
		setSortOptions(option);
		localStorage.setItem("sort", option);
	}

	function handleRows(e) {
		setRows(e.target.value);
		localStorage.setItem("rows", e.target.value);
	}

	function handlePages(e) {
		if (e.target.name === "next") {
			setPage((prev) => prev + 1);
		} else if (e.target.name === "last") {
			setPage(lastPage);
		} else if (e.target.name === "prev") {
			if (page === 1) return;
			setPage((prev) => prev - 1);
		} else if (e.target.name === "first") {
			setPage(1);
		}
	}

	async function getExpenses() {
		try {
			let res = await axios.get(`http://${import.meta.env.VITE_SERVER_IP}/expenses/get-expenses/${rows}/${page}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			setLastPage(Math.ceil(res.data.count / rows));
			setTotalExpense(res.data.total_expense);
			setExpenses(() => {
				format(new Date(), "dd/mm/yyyy");
				return res.data.expenses.filter((item) => {
					let itemDate = new Date(item.createdAt);
					item.createdAt = `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}`;
					return itemDate;
				});
			});
			setDailyExpenses(() => {
				let now = new Date();
				return res.data.expenses.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return (
						itemDate.getDay() === now.getDay() && itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
					);
				});
			});
			setMonthlyExpenses(() => {
				let now = new Date();
				return res.data.expenses.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
				});
			});
			setYearlyExpenses(() => {
				let now = new Date();
				return res.data.expenses.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return itemDate.getFullYear() === now.getFullYear();
				});
			});
		} catch (err) {
			console.log(err.message);
			navigate("/login");
		}
	}

	async function deleteExpense(e) {
		let id = e.target.id;
		let li = e.target.closest("li");
		let amount = li.querySelectorAll("p")[2].textContent;
		try {
			await axios.delete(`http://${import.meta.env.VITE_SERVER_IP}/expenses/delete-expense/${id}`, {
				headers: { Authorization: localStorage.getItem("token") },
			});
			li.remove();
			setFromStatus("Expense Deleted");
			setTotalExpense((prev) => prev - parseInt(amount));
			setTimeout(() => {
				setFromStatus("");
			}, 5000);
		} catch (err) {
			console.log(err.message);
		}
	}

	async function getReport(e) {
		// if (localStorage.getItem("premium") === "false") return alert("Reqires premium");
		// try {
		// 	let response = await axios.get("http://localhost:8080/user/report/get-report", {
		// 		headers: { Authorization: localStorage.getItem("token") },
		// 	});
		// 	window.open(response.data, "_blank");
		// } catch (error) {
		// 	console.log(error);
		// }
		if (localStorage.getItem("premium") === "false") return alert("Reqires premium");
		navigate("/report");
	}

	useEffect(() => {
		localStorage.setItem("sort", "All");
		localStorage.setItem("rows", 10);
		getExpenses();
	}, []);

	useEffect(() => {
		if (formStatus === "New Expense Added") {
			getExpenses();
		}
	}, [formStatus]);

	useEffect(() => {
		getExpenses();
		console.log(rows);
	}, [page, rows]);

	return (
		<div className="bg-[#dfdd61] text-[#33689e] mx-[5%] rounded-md">
			<div className="flex justify-between px-[2%]  pt-8">
				<p className="flex justify-center text-3xl font-bold">TOTAL BALANCE : {totalExpense}</p>
				<button className="flex items-center bg-sky-400 text-[#33689e] p-2 rounded-md" onClick={getReport}>
					Get Report
				</button>
			</div>

			{expenses.length === 0 && <li className="flex justify-center text-2xl pt-8">No Records Found</li>}

			<div>
				<ol className="p-8">
					<li className="grid grid-cols-6 rounded-md border-2 ">
						<div className="grid col-span-5 grid-cols-6 justify-items-center font-bold text-3xl m-4">
							<p></p>
							<p>Date</p>
							<p>Amount</p>
							<p>Description</p>
							<p>Category</p>
							<p>Type</p>
						</div>
						<div className="m-4 flex justify-center">
							<select className="w-full h-full text-xl text-center rounded-md bg-[#f5eec9]" onChange={handleSort} value={sortOptions}>
								<option>All</option>
								<option>Today</option>
								<option>Monthly</option>
								<option>Yearly</option>
							</select>
						</div>
					</li>

					{(() => {
						if (sortOptions === "All" || sortOptions === null) return Object.values(expenses);
						if (sortOptions === "Today") return Object.values(dailyExpenses);
						if (sortOptions === "Monthly") return Object.values(monthlyExpenses);
						if (sortOptions === "Yearly") return Object.values(yearlyExpenses);
					})().map((element, key) => {
						return (
							<li className="grid grid-cols-6 py-2" id={key} key={key}>
								<div className="grid col-span-5 justify-items-center items-center grid-cols-6">
									<p className="col-start-1">{page === 1 ? key + 1 : key + 1 + rows * (page - 1)} )</p>
									<p>{element.createdAt}</p>
									{element.type === "Income" ? <p>{element.amount}</p> : <p>-{element.amount}</p>}
									<p>{element.description}</p>
									<p>{element.category}</p>
									<p>{element.type}</p>
								</div>
								<div className="space-x-4 flex justify-center">
									{/* <button className="text-xl bg-sky-400 hover:bg-sky-300 p-2 rounded-md whitespace-pre"> Edit </button> */}
									<button className="text-xl bg-red-400 hover:bg-red-300 p-2 rounded-md" id={element.id} onClick={deleteExpense}>
										Delete
									</button>
								</div>
							</li>
						);
					})}
				</ol>

				<div className="flex flex-col justify-center p-4 gap-4 ">
					<div className="flex justify-center gap-2">
						<p className="flex items-center text-2xl font-semibold">Rows : </p>
						<select className="w-fit p-2 text-center text-lg font-bold rounded-md bg-[#f5eec9]" onChange={handleRows} value={rows}>
							<option>5</option>
							<option>10</option>
							<option>15</option>
							<option>20</option>
							<option>25</option>
						</select>
					</div>
					<div className="flex justify-center p-4 gap-4">
						{/* First page */}
						<button className={`p-1 ${page > 1 ? "bg-sky-500" : ""} w-fit rounded-md`} name="first" onClick={handlePages}>
							{page > 1 ? "First Page" : ""}
						</button>

						{/* Prev Page */}
						<button className={`p-1 ${page > 1 ? "bg-sky-500" : ""} rounded-md w-12`} name="prev" onClick={handlePages}>
							{page > 1 ? page - 1 : ""}
						</button>

						{/* Current Page */}
						<button className="p-1 bg-sky-400 rounded-md w-12 scale-125">{page}</button>

						{/* Next Page */}
						<button className={`p-1 ${page < lastPage ? "bg-sky-500" : ""} rounded-md w-12`} name="next" onClick={handlePages}>
							{page < lastPage ? page + 1 : ""}
						</button>

						{/* Last Page */}
						<button className={`p-1 ${page < lastPage ? "bg-sky-500" : ""} rounded-md w-fit`} name="last" onClick={handlePages}>
							{page < lastPage ? "Last Page" : ""}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
