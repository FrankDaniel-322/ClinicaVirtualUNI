WITH VentasMensuales AS (
	SELECT
		EOMONTH(OrderDate) AS FinDeMes, -- EOMONTH sirve para agrupar por el ultimo dia del mes
		SUM(TotalDue) AS VentaTotalDelMes
	FROM Sales.SalesOrderHeader
	GROUP BY EOMONTH(OrderDate)
)
SELECT
	FinDeMes,
	LAG(VentaTotalDelMes, 1, 0) OVER(ORDER BY FinDeMes) AS VentaMesAnterior, -- 1 = proximidad ; 0 = Llena vacio 
	VentaTotalDelMes,
	LEAD(VentaTotalDelMes) OVER(ORDER BY FinDeMes) AS VentaMesPosterior
FROM VentasMensuales

