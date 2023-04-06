using TNO.API.Models;
using System.Text.Json;

namespace TNO.API.Areas.Admin.Models.Source;

/// <summary>
/// SourceModel class, provides a model that represents an source.
/// </summary>
public class SourceModel : BaseTypeWithAuditColumnsModel<int>
{
    #region Properties
    /// <summary>
    /// get/set -
    /// </summary>
    public string Code { get; set; } = "";

    /// <summary>
    /// get/set -
    /// </summary>
    public string ShortName { get; set; } = "";

    /// <summary>
    /// get/set -
    /// </summary>
    public int LicenseId { get; set; }

    /// <summary>
    /// get/set - The license.
    /// </summary>
    public LicenseModel? License { get; set; }

    /// <summary>
    /// get/set -
    /// </summary>
    public int? OwnerId { get; set; }

    /// <summary>
    /// get/set - The default user who owns the content for this data source..
    /// </summary>
    public UserModel? Owner { get; set; }

    /// <summary>
    /// get/set -
    /// </summary>
    public int? ProductId { get; set; }

    /// <summary>
    /// get/set - Whether content should be automatically transcribed.
    /// </summary>
    public bool AutoTranscribe { get; set; }

    /// <summary>
    /// get/set - Whether content should not be allowed to be requested for transcription.
    /// </summary>
    public bool DisableTranscribe { get; set; }

    /// <summary>
    /// get/set - Whether to show the topics on the content form.
    /// </summary>
    public bool UseInTopics { get; set; }

    /// <summary>
    /// get/set -
    /// </summary>
    public Dictionary<string, object> Configuration { get; set; } = new Dictionary<string, object>();

    /// <summary>
    /// get/set -
    /// </summary>
    public IEnumerable<SourceMetricModel> Metrics { get; set; } = Array.Empty<SourceMetricModel>();
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of an SourceModel.
    /// </summary>
    public SourceModel() { }

    /// <summary>
    /// Creates a new instance of an SourceModel, initializes with specified parameter.
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="options"></param>
    public SourceModel(Entities.Source entity, JsonSerializerOptions options) : base(entity)
    {
        this.Id = entity.Id;
        this.Code = entity.Code;
        this.Name = entity.Name;
        this.ShortName = entity.ShortName;
        this.Description = entity.Description;
        this.IsEnabled = entity.IsEnabled;
        this.SortOrder = entity.SortOrder;
        this.LicenseId = entity.LicenseId;
        this.License = entity.License != null ? new LicenseModel(entity.License) : null;
        this.OwnerId = entity.OwnerId;
        this.ProductId = entity.ProductId;
        this.Owner = entity.Owner != null ? new UserModel(entity.Owner) : null;
        this.AutoTranscribe = entity.AutoTranscribe;
        this.DisableTranscribe = entity.DisableTranscribe;
        this.UseInTopics = entity.UseInTopics;
        this.Configuration = JsonSerializer.Deserialize<Dictionary<string, object>>(entity.Configuration, options) ?? new Dictionary<string, object>();

        this.Metrics = entity.MetricsManyToMany.Select(m => new SourceMetricModel(m));
    }
    #endregion

    #region Methods
    /// <summary>
    /// Creates a new instance of a Source object.
    /// </summary>
    /// <returns></returns>
    public Entities.Source ToEntity(JsonSerializerOptions options)
    {
        var entity = (Entities.Source)this;
        entity.Configuration = JsonDocument.Parse(JsonSerializer.Serialize(this.Configuration, options));
        return entity;
    }

    /// <summary>
    /// Explicit conversion to entity.
    /// </summary>
    /// <param name="model"></param>
    public static explicit operator Entities.Source(SourceModel model)
    {
        var entity = new Entities.Source(model.Name, model.Code, model.LicenseId)
        {
            Id = model.Id,
            ShortName = model.ShortName,
            Description = model.Description,
            IsEnabled = model.IsEnabled,
            OwnerId = model.OwnerId,
            SortOrder = model.SortOrder,
            ProductId = model.ProductId,
            AutoTranscribe = model.AutoTranscribe,
            DisableTranscribe = model.DisableTranscribe,
            UseInTopics = model.UseInTopics,
            Configuration = JsonDocument.Parse(JsonSerializer.Serialize(model.Configuration)),
            Version = model.Version ?? 0
        };

        entity.MetricsManyToMany.AddRange(model.Metrics.Select(m => m.ToEntity(entity.Id)));

        return entity;
    }
    #endregion
}
