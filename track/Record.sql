USE [track]
GO

/****** Object:  Table [dbo].[Record]    Script Date: 12/22/2018 11:46:33 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Record](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DatasetId] [int] NOT NULL,
	[DateTime] [datetime] NULL,
	[Value] [float] NULL,
 CONSTRAINT [PK_Record] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

