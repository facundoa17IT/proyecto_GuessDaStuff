import React from "react";

export const renderListItemDetails = (selectedItem) => {
	return (
		<div style={{padding:'0.5rem', boxSizing:'border-box', border:'2px solid var(--border-color)', borderRadius:'8px', width:'100%'}}>
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
