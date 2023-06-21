using TNO.Services.Config;

namespace TNO.Services.ContentMigration.Config;

/// <summary>
/// ContentMigrationOptions class, configuration options for Import
/// </summary>
public class ContentMigrationOptions : IngestServiceOptions
{
    #region Properties

    /// <summary>
    /// get/set - The path to the local mapped volume.
    /// </summary>
    public string VolumePath { get; set; } = "";

    /// <summary>
    /// get/set - Settings to connect to the TNO 1.0 database.
    /// </summary>
    public OracleConnectionSettings? OracleConnection { get; set; } = null;

    /// <summary>
    /// get/set - The maximum number of records to retrieve from the TNO 1.0 db at a time
    /// </summary>
    public int MaxRecordsPerRetrieval { get; set; } = 20;

    /// <summary>
    /// Mapping for "action type" to Name in the db
    /// Only need to add a mapping here, if the name in the db is different to the Action Type enum string
    /// </summary>
    public Dictionary<ActionType,string> ActionNameMappings {get; set; } = new Dictionary<ActionType,string>();

    #endregion
}
