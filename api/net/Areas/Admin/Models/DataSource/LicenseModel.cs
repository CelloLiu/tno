using TNO.API.Models;

namespace TNO.API.Areas.Admin.Models.DataSource;

/// <summary>
/// LicenseModel class, provides a model that represents an license.
/// </summary>
public class LicenseModel : BaseTypeWithAuditColumnsModel<int>
{
    #region Properties
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of an LicenseModel.
    /// </summary>
    public LicenseModel() { }

    /// <summary>
    /// Creates a new instance of an LicenseModel, initializes with specified parameter.
    /// </summary>
    /// <param name="entity"></param>
    public LicenseModel(Entities.License entity) : base(entity)
    {

    }
    #endregion
}
