import { useState, useEffect, useContext } from "react";

import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ReportList() {
	let navigate = useNavigate();

	// ALL EXPENSES FOLLOWED BY TODAY, WEEKLY, MONTHLY, YEARLY
	const [reports, setReports] = useState(""); // all reports
	const [dailyReports, setDailyReports] = useState("");
	const [monthlyReports, setMonthlyReports] = useState("");
	const [yearlyReports, setYearlyReports] = useState("");

	// STATES TO HANDLE SORTING
	const [sortOptions, setSortOptions] = useState(localStorage.getItem("sort"));

	function handleSort(e) {
		let option = e.target.value;
		setSortOptions(option);
		localStorage.setItem("sort", option);
	}

	async function getReports() {
		try {
			let res = await axios.get(`http://localhost:8080/user/report/get-reports`, { headers: { Authorization: localStorage.getItem("token") } });
			setReports(() => {
				format(new Date(), "dd/mm/yyyy");
				return res.data.reports.filter((item) => {
					let itemDate = new Date(item.createdAt);
					item.createdAt = `${itemDate.getDate()}/${itemDate.getMonth() + 1}/${itemDate.getFullYear()}`;
					return itemDate;
				});
			});
			setDailyReports(() => {
				let now = new Date();
				return res.data.reports.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return (
						itemDate.getDay() === now.getDay() && itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
					);
				});
			});
			setMonthlyReports(() => {
				let now = new Date();
				return res.data.reports.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
				});
			});
			setYearlyReports(() => {
				let now = new Date();
				return res.data.reports.filter((item) => {
					let itemDate = parse(item.createdAt, "dd/MM/yyyy", new Date());
					return itemDate.getFullYear() === now.getFullYear();
				});
			});
		} catch (err) {
			console.log(err, "get expense error");
			navigate("/login");
		}
	}

	async function deleteReport(e) {
		await axios.post(
			"http://localhost:8080/user/report/delete-report",
			{ filename: e.target.name },
			{
				headers: { Authorization: localStorage.getItem("token") },
			}
		);
		// try {
		// 	await axios.delete(`http://localhost:8080/expenses/delete-expense/${id}`, {
		// 		headers: { Authorization: localStorage.getItem("token") },
		// 	});
		// 	li.remove();
		// 	setFromStatus("Expense Deleted");
		// 	setTotalExpense((prev) => prev - parseInt(amount));
		// 	setTimeout(() => {
		// 		setFromStatus("");
		// 	}, 5000);
		// } catch (err) {
		// 	console.log(err);
		// }
		console.log("Comming Soon!");
	}

	async function createReport() {
		if (localStorage.getItem("premium") === "false") return alert("Reqires premium");
		try {
			let response = await axios.get("http://localhost:8080/user/report/create-report", {
				headers: { Authorization: localStorage.getItem("token") },
			});
			window.open(response.data, "_blank");
			getReports()
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (localStorage.getItem("premium") === "false") navigate("/");
		getReports();
		localStorage.setItem("sort", "All");
	}, []);

	return (
		<div className="bg-[#dfdd61] text-[#33689e] mx-[5%] rounded-md">
			<div className="flex justify-start gap-4 px-[2%]  pt-8">
				<button
					className="flex items-center bg-sky-400 text-[#33689e] p-2 rounded-md"
					onClick={() => {
						navigate("/");
					}}
				>
					Home
				</button>
				<button className="flex items-center bg-sky-400 text-[#33689e] p-2 rounded-md" onClick={createReport}>
					Create/Update Report
				</button>
			</div>

			{reports.length === 0 && <li className="flex justify-center text-2xl pt-8">No Records Found</li>}

			{
				<ol className="p-8">
					<li className="grid grid-cols-6 rounded-md border-2 mb-8">
						<div className="grid col-span-5 grid-cols-6 justify-items-center font-bold text-3xl m-4">
							<p></p>
							<p className="col-start-4">Date</p>
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
						if (sortOptions === "All" || sortOptions === null) return Object.values(reports);
						if (sortOptions === "Today") return Object.values(dailyReports);
						if (sortOptions === "Monthly") return Object.values(monthlyReports);
						if (sortOptions === "Yearly") return Object.values(yearlyReports);
					})().map((element, key) => {
						return (
							<li className="grid grid-cols-6 py-2" id={key} key={key}>
								<div className="grid col-span-5 grid-cols-6 justify-items-center items-center">
									<p>{key + 1} )</p>
									<p className="col-start-4">{element.createdAt}</p>
								</div>
								<div className="space-x-4 flex justify-center">
									<button
										className="text-xl bg-blue-400 hover:bg-blue-300 p-2 rounded-md"
										onClick={() => {
											window.open(element.fileUrl, "_blank");
										}}
									>
										Download
									</button>
									{/* <button
										className="text-xl bg-red-400 hover:bg-red-300 p-2 rounded-md"
										name={element.fileName}
										onClick={deleteReport}
									>
										Delete
									</button> */}
								</div>
							</li>
						);
					})}
				</ol>
			}
		</div>
	);
}
