
using TNO.TemplateEngine.Models.Charts;

namespace TNO.API.Helpers;

/// <summary>
/// IReportHelper interface, provides helper methods to generate reports and charts.
/// </summary>
public interface IReportHelper
{
    #region Properties
    #endregion

    #region Methods
    /// <summary>
    /// Makes a request to Elasticsearch if required to fetch content.
    /// Generate the Chart JSON for the specified 'model' containing a template and content.
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    Task<ChartResultModel> GenerateJsonAsync(ChartRequestModel model);

    /// <summary>
    /// Executes the chart template provided to generate JSON, which is then sent with a request to the Charts API to generate a base 64 image.
    /// </summary>
    /// <param name="model"></param>
    /// <returns>Returns the base64 image from the Charts API.</returns>
    Task<string> GenerateBase64Async(ChartRequestModel model);
    #endregion
}
