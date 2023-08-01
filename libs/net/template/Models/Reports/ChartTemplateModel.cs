﻿using RazorEngineCore;
using TNO.API.Models.Settings;

namespace TNO.TemplateEngine.Models.Reports;

/// <summary>
/// ChartTemplateModel class, provides a model to pass to the razor engine for a chart.
/// </summary>
public class ChartTemplateModel : RazorEngineTemplateBase
{
    #region Properties
    /// <summary>
    /// get/set - An array of content.
    /// </summary>
    public IEnumerable<ContentModel> Content { get; set; }

    /// <summary>
    /// get/set - A dictionary with each section.
    /// </summary>
    public Dictionary<string, ReportSectionModel> Sections { get; set; } = new();

    /// <summary>
    /// get/set - The chart settings.
    /// </summary>
    public ChartSettingsModel Settings { get; set; } = new();
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a ChartTemplateModel.
    /// </summary>
    public ChartTemplateModel()
    {
        this.Content = Array.Empty<ContentModel>();
    }

    /// <summary>
    /// Creates a new instance of a ChartTemplateModel, initializes with specified parameters.
    /// </summary>
    /// <param name="content"></param>
    /// <param name="settings"></param>
    public ChartTemplateModel(IEnumerable<ContentModel> content, ChartSettingsModel settings)
    {
        this.Content = content.ToArray();
        this.Settings = settings;
    }

    /// <summary>
    /// Creates a new instance of a ChartTemplateModel, initializes with specified parameters.
    /// </summary>
    /// <param name="sections"></param>
    /// <param name="settings"></param>
    /// <param name="uploadPath"></param>
    public ChartTemplateModel(Dictionary<string, ReportSectionModel> sections, ChartSettingsModel settings)
    {
        this.Sections = sections;
        this.Settings = settings;

        // Reference all section content in the root Content collection.
        this.Content = sections.SelectMany(s => s.Value.Content).GroupBy(c => c.Id).Select(c => c.First());
    }
    #endregion
}
