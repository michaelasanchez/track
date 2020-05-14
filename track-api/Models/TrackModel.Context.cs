﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace track_api.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class TrackContext : DbContext
    {
        public TrackContext()
            : base("name=TrackContext")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Dataset> Datasets { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<Property> Properties { get; set; }
        public virtual DbSet<Record> Records { get; set; }
        public virtual DbSet<Series> Series { get; set; }
        public virtual DbSet<User> Users { get; set; }
    
        public virtual int AddProperty(Nullable<int> recordId, string label, string value)
        {
            var recordIdParameter = recordId.HasValue ?
                new ObjectParameter("RecordId", recordId) :
                new ObjectParameter("RecordId", typeof(int));
    
            var labelParameter = label != null ?
                new ObjectParameter("Label", label) :
                new ObjectParameter("Label", typeof(string));
    
            var valueParameter = value != null ?
                new ObjectParameter("Value", value) :
                new ObjectParameter("Value", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("AddProperty", recordIdParameter, labelParameter, valueParameter);
        }
    
        public virtual int AddSeries(Nullable<int> datasetId, Nullable<int> typeId, string label, string unit)
        {
            var datasetIdParameter = datasetId.HasValue ?
                new ObjectParameter("DatasetId", datasetId) :
                new ObjectParameter("DatasetId", typeof(int));
    
            var typeIdParameter = typeId.HasValue ?
                new ObjectParameter("TypeId", typeId) :
                new ObjectParameter("TypeId", typeof(int));
    
            var labelParameter = label != null ?
                new ObjectParameter("Label", label) :
                new ObjectParameter("Label", typeof(string));
    
            var unitParameter = unit != null ?
                new ObjectParameter("Unit", unit) :
                new ObjectParameter("Unit", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("AddSeries", datasetIdParameter, typeIdParameter, labelParameter, unitParameter);
        }
    
        public virtual int ArchiveDataset(Nullable<int> datasetId, Nullable<bool> archive)
        {
            var datasetIdParameter = datasetId.HasValue ?
                new ObjectParameter("DatasetId", datasetId) :
                new ObjectParameter("DatasetId", typeof(int));
    
            var archiveParameter = archive.HasValue ?
                new ObjectParameter("Archive", archive) :
                new ObjectParameter("Archive", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ArchiveDataset", datasetIdParameter, archiveParameter);
        }
    
        public virtual int CreateDataset(Nullable<int> userId, string label)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("UserId", userId) :
                new ObjectParameter("UserId", typeof(int));
    
            var labelParameter = label != null ?
                new ObjectParameter("Label", label) :
                new ObjectParameter("Label", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("CreateDataset", userIdParameter, labelParameter);
        }
    
        public virtual int CreateRecord(Nullable<int> datasetId, Nullable<System.DateTime> dateTime, string note)
        {
            var datasetIdParameter = datasetId.HasValue ?
                new ObjectParameter("DatasetId", datasetId) :
                new ObjectParameter("DatasetId", typeof(int));
    
            var dateTimeParameter = dateTime.HasValue ?
                new ObjectParameter("DateTime", dateTime) :
                new ObjectParameter("DateTime", typeof(System.DateTime));
    
            var noteParameter = note != null ?
                new ObjectParameter("Note", note) :
                new ObjectParameter("Note", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("CreateRecord", datasetIdParameter, dateTimeParameter, noteParameter);
        }
    
        public virtual ObjectResult<GetDatasets_Result> GetDatasets()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetDatasets_Result>("GetDatasets");
        }
    
        public virtual ObjectResult<GetRecords_Result> GetRecords(Nullable<int> id)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("Id", id) :
                new ObjectParameter("Id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetRecords_Result>("GetRecords", idParameter);
        }
    
        public virtual ObjectResult<GetSeries_Result> GetSeries(Nullable<int> datasetId)
        {
            var datasetIdParameter = datasetId.HasValue ?
                new ObjectParameter("DatasetId", datasetId) :
                new ObjectParameter("DatasetId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<GetSeries_Result>("GetSeries", datasetIdParameter);
        }
    
        public virtual int UpdateDataset(Nullable<int> datasetId, string label)
        {
            var datasetIdParameter = datasetId.HasValue ?
                new ObjectParameter("DatasetId", datasetId) :
                new ObjectParameter("DatasetId", typeof(int));
    
            var labelParameter = label != null ?
                new ObjectParameter("Label", label) :
                new ObjectParameter("Label", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("UpdateDataset", datasetIdParameter, labelParameter);
        }
    
        public virtual int UpdateSeries(Nullable<int> seriesId, string label, string color)
        {
            var seriesIdParameter = seriesId.HasValue ?
                new ObjectParameter("SeriesId", seriesId) :
                new ObjectParameter("SeriesId", typeof(int));
    
            var labelParameter = label != null ?
                new ObjectParameter("Label", label) :
                new ObjectParameter("Label", typeof(string));
    
            var colorParameter = color != null ?
                new ObjectParameter("Color", color) :
                new ObjectParameter("Color", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("UpdateSeries", seriesIdParameter, labelParameter, colorParameter);
        }
    }
}
