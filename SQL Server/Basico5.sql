SELECT
	ListPrice,
	CAST(ListPrice AS INT) AS Precio_entero

FROM Production.Product
WHERE ListPrice != '0,00'
ORDER BY ListPrice ASC
