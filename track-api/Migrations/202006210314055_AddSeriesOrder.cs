namespace track_api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddSeriesOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Series", "Order", c => c.Int(nullable: false));
            Sql(@"DECLARE @datasetId INT
                    DECLARE @seriesId INT
                    DECLARE @incrementValue INT
 
                    DECLARE DatasetCursor CURSOR LOCAL
                    FOR
                    SELECT Id FROM Dataset

                    OPEN DatasetCursor
 
                    FETCH NEXT  FROM DatasetCursor  INTO @datasetId
 
                    WHILE @@FETCH_STATUS = 0
                    BEGIN

	                    DECLARE SeriesCursor CURSOR LOCAL
	                    FOR
	                    SELECT series.Id from series where datasetid = @datasetId

	                    SET @incrementValue = 0

	                    OPEN SeriesCursor

	                    FETCH NEXT FROM SeriesCursor INTO @seriesId

	                    WHILE @@FETCH_STATUS = 0
	                    BEGIN

		                    update Series set [Order] = @incrementValue where [Id] = @seriesId
		                    SET @incrementValue = @incrementValue + 1

	                    FETCH NEXT FROM SeriesCursor INTO @seriesId
	                    END

	                    CLOSE SeriesCursor
	                    DEALLOCATE SeriesCursor

                      FETCH NEXT  FROM DatasetCursor  INTO @datasetId
                    END
 
                    CLOSE DatasetCursor
                    DEALLOCATE DatasetCursor
            ");
        }

        public override void Down()
        {
            DropColumn("dbo.Series", "Order");
        }
    }
}
