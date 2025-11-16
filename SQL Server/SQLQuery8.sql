WITH ProductosRankeados AS (
	SELECT
		Name,
		Color,
		ListPrice,
		ROW_NUMBER() OVER(PARTITION BY Color ORDER BY ListPrice DESC) AS #
	FROM Production.Product
	WHERE Color IS NOT NULL
)
SELECT #, Color, ListPrice
FROM ProductosRankeados
WHERE # <= 10

