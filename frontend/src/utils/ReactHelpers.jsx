import React from "react";

export const renderListItemDetails = (selectedItem) => {
	return (
		<div style={{width:'100%', height:'100%', overflowY:'auto'}}>
			{selectedItem && (
				<ul style={{ textAlign: "left" }}>
					{Object.entries(selectedItem).map(([key, value]) => (
						<li key={key}>
							{key === "urlPerfil" ? (
								<span>
									<strong>{key}:</strong>
									{typeof value === "string" && !value.includes("urlDoMacaco") ? (
										<img
											src={value}
											alt={key}
											style={{ width: "30px", height: "30px", marginLeft: "10px" }}
										/>
									) : (
										<span style={{ marginLeft: "10px", fontSize: "16px" }}>
											Default
										</span>
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
