using System.ComponentModel.DataAnnotations.Schema;
using TNO.Core.Data;

namespace TNO.Entities;

[Cache("tone_pools", "lookups")]
[Table("tone_pool")]
public class TonePool : BaseType<int>
{
    #region Properties
    [Column("owner_id")]
    public int OwnerId { get; set; }

    public virtual User? Owner { get; set; }


    [Column("is_public")]
    public bool IsPublic { get; set; } = false;

    public virtual List<Content> Contents { get; } = new List<Content>();

    public virtual List<ContentTonePool> ContentsManyToMany { get; } = new List<ContentTonePool>();
    #endregion

    #region Constructors
    protected TonePool() { }

    public TonePool(string name, User owner) : base(name)
    {
        if (owner != null) this.OwnerId = owner.Id;
        this.Owner = owner;
    }

    public TonePool(string name, int ownerId) : base(name)
    {
        this.OwnerId = ownerId;
    }
    #endregion
}
