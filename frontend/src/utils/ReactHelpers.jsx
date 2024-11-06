import React from "react";

export const renderListItemDetails = (selectedItem) => {
	return (
		<div>
			{selectedItem && (
				<ul style={{ textAlign: "left" }}>
					{Object.entries(selectedItem).map(([key, value]) => (
						<li key={key}>
							{key === "icon" ? (
								<span>
									<strong>{key}:</strong>
									{typeof value === "string" && value.endsWith(".png") ? (
										<img
											src={value}
											alt={key}
											style={{ width: "30px", height: "30px", marginLeft: "10px" }}
										/>
									) : (
										React.createElement(value, { style: { marginLeft: "10px", fontSize: "30px" } })
									)}
								</span>
							) : (
								<span>
									<strong>{key}:</strong>{" "}
									{typeof value === "object" && value !== null ? (
										<ul style={{ paddingLeft: "15px" }}>
											{Object.entries(value).map(([nestedKey, nestedValue]) => (
												<li key={nestedKey}>
													<strong>{nestedKey}:</strong> {String(nestedValue)}
												</li>
											))}
										</ul>
									) : (
										String(value)
									)}
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
