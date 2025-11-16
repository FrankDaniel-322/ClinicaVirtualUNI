USE [master]
GO


CREATE DATABASE [empresa]

 ON  PRIMARY 
(
	NAME = N'empresa_dat',
	FILENAME = N'C:\SQL\DataBase\empresa_dat.mdf' ,
	SIZE = 30720KB , MAXSIZE = 51200KB , FILEGROWTH = 10240KB
)

 LOG ON 
(
	NAME = N'empresa_log',
	FILENAME = N'C:\SQL\DataBase\empresa_log.ldf' ,
	SIZE = 10240KB , MAXSIZE = 102400KB ,
	FILEGROWTH = 10%
)
GO
