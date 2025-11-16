WITH ComprarPorVendedor AS (
	SELECT
		VendorID,
		COUNT(*) AS CantidadDeOrdenes,
		SUM(TotalDue) AS TotalComprado
	FROM Purchasing.PurchaseOrderHeader
	GROUP BY VendorID
)

SELECT
	VendorID,
	CantidadDeOrdenes,
	TotalComprado,
	RANK() OVER(
		ORDER BY
			TotalComprado DESC
	) AS RankDelVendedor
FROM ComprarPorVendedor
ORDER BY RankDelVendedor
