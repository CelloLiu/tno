using System.ComponentModel.DataAnnotations.Schema;

namespace TNO.Entities;

public abstract class AuditColumns : ISaveChanges
{
    [Column("created_by_id")]
    public Guid CreatedById { get; set; }

    [Column("created_by")]
    public string CreatedBy { get; set; } = "";

    [Column("created_on")]
    public DateTime CreatedOn { get; set; }

    [Column("updated_by_id")]
    public Guid UpdatedById { get; set; }

    [Column("updated_by")]
    public string UpdatedBy { get; set; } = "";

    [Column("updated_on")]
    public DateTime UpdatedOn { get; set; }

    /// <summary>
    /// get/set - The concurrency version value for the row.
    /// </summary>
    [Column("version")]
    public long Version { get; set; }

    public void OnAdded(User user)
    {
        this.CreatedById = user.Key;
        this.CreatedBy = user.Username;
        this.CreatedOn = DateTime.UtcNow;
        this.Version = 0;
    }

    public void OnModified(User user)
    {
        this.UpdatedById = user.Key;
        this.UpdatedBy = user.Username;
        this.UpdatedOn = DateTime.UtcNow;
        this.Version++;
    }
}
