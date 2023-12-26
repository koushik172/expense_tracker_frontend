import axios from "axios";
import { useEffect, useState } from "react";

export default function Leaderboard() {
	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const [leaderboard, setleaderboard] = useState("");

	async function getLeaderboard() {
		await axios
			.get(`http://${import.meta.env.VITE_SERVER_IP}/user/leaderboard`, { headers: { Authorization: localStorage.getItem("token") } })
			.then((res) => {
				setleaderboard(res.data);
			})
			.catch((err) => console.log(err));
	}

	async function handleLeaderboardClick() {
		setShowLeaderboard(!showLeaderboard);
	}

	useEffect(() => {
		if (localStorage.getItem("premium") === "true") getLeaderboard();
	}, []);

	return (
		<div className="flex  bg-sky-500 text-[#3c566f] mx-[5%] my-[1%] rounded-md">
			<button className="bg-[#dfdd61]  p-2 rounded-r-lg rounded-l-md font-bold" onClick={handleLeaderboardClick}>
				{!showLeaderboard ? "Show" : "Hide"} LeaderBoard
			</button>
			<div></div>
			{showLeaderboard && (
				<ol className="flex flex-col w-full px-[10%] py-[2%] md:text-xl gap-2">
					{leaderboard.length === 0 && <li className="flex justify-center">Requires Premium</li>}
					{Object.values(leaderboard).map((element, key) => {
						return (
							<li className="flex justify-between" key={key}>
								<p>
									{key + 1}) {element.name}
								</p>
								<p>{element.total_expense}</p>
							</li>
						);
					})}
				</ol>
			)}
			{showLeaderboard && leaderboard && (
				<button className="bg-[#dfdd61]  p-2 rounded-r-lg rounded-l-md font-bold" onClick={getLeaderboard}>
					Refresh
				</button>
			)}
		</div>
	);
}
