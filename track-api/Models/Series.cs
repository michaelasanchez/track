//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class Series
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Series()
        {
            this.Properties = new HashSet<Property>();
        }
    
        public int Id { get; set; }
        public int DatasetId { get; set; }
        public int TypeId { get; set; }
        public string Label { get; set; }
        public string Color { get; set; }
        public string Unit { get; set; }
    
        public virtual Dataset Dataset { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Property> Properties { get; set; }
        public virtual SeriesType SeriesType { get; set; }
    }
}