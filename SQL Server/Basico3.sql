USE master
GO
SELECT *
FROM sysdatabases
WHERE name NOT IN
(
	'master',
	'model',
	'msdb',
	'tempdb'
)