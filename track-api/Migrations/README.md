# Existing Database
Enable-Migrations -ContextTypeName ModelContext -Verbose


# Update Database
Update-Database -ConnectionStringName ModelContext -Verbose

# Add Migration
Add-Migration "MigrationName" -ConnectionStringName ModelContext

# Revert Migration
Update-Database -ConnectionStringName ModelContext -TargetMigration "202006071840364_InitialCreate" -Verbose