using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using TNO.Core.Data;

namespace TNO.Entities;

/// <summary>
/// ReportTemplate class, provides a DB model to manage different types of report templates.
/// </summary>
[Cache("report_template")]
[Table("report_template")]
public class ReportTemplate : BaseType<int>
{
    #region Properties
    /// <summary>
    /// get/set - The Razor subject template to generate the report.
    /// </summary>
    [Column("subject")]
    public string Subject { get; set; } = "";

    /// <summary>
    /// get/set - The Razor body template to generate the report.
    /// </summary>
    [Column("body")]
    public string Body { get; set; } = "";

    /// <summary>
    /// get/set - The report template settings.
    /// </summary>
    [Column("settings")]
    public JsonDocument Settings { get; set; } = JsonDocument.Parse("{}");

    /// <summary>
    /// get - Collection of reports that use this template.
    /// </summary>
    public virtual List<Report> Reports { get; } = new List<Report>();

    /// <summary>
    /// get - Collection of chart templates that use this report template.
    /// </summary>
    public virtual List<ChartTemplate> ChartTemplates { get; } = new List<ChartTemplate>();

    /// <summary>
    /// get - Collection of chart templates that use this report template (many-to-many).
    /// </summary>
    public virtual List<ReportTemplateChartTemplate> ChartTemplatesManyToMany { get; } = new List<ReportTemplateChartTemplate>();
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a ReportTemplate object.
    /// </summary>
    protected ReportTemplate() : base() { }

    /// <summary>
    /// Creates a new instance of a ReportTemplate object, initializes with specified parameters.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="subjectTemplate"></param>
    /// <param name="bodyTemplate"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public ReportTemplate(string name, string subjectTemplate, string bodyTemplate) : base(name)
    {
        this.Subject = subjectTemplate ?? throw new ArgumentNullException(nameof(subjectTemplate));
        this.Body = bodyTemplate ?? throw new ArgumentNullException(nameof(bodyTemplate));
    }

    /// <summary>
    /// Creates a new instance of a ReportTemplate object, initializes with specified parameters.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="name"></param>
    /// <param name="subjectTemplate"></param>
    /// <param name="bodyTemplate"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public ReportTemplate(int id, string name, string subjectTemplate, string bodyTemplate) : base(id, name)
    {
        this.Subject = subjectTemplate ?? throw new ArgumentNullException(nameof(subjectTemplate));
        this.Body = bodyTemplate ?? throw new ArgumentNullException(nameof(bodyTemplate));
    }
    #endregion
}
