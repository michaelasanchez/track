# Update Database
Update-Database -ConnectionStringName ModelContext -Verbose

# Add Migration
Add-Migration RemoveStringLengths -ConnectionStringName ModelContext

Enable-Migrations -ContextTypeName ModelContext -Verbose

Add-Migration InitialCreate –IgnoreChanges
