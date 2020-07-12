# Existing Database
Enable-Migrations -ContextTypeName ModelContext -Verbose

# Revert Migration
Update-Database -ConnectionStringName ModelContext -TargetMigration "MigrationName" -Verbose



# Add Migration
Add-Migration "MigrationName" -ConnectionStringName ModelContext

# Update Database
Update-Database -ConnectionStringName ModelContext -Verbose