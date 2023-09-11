using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TNO.API.Models.Settings;
using TNO.Core.Exceptions;
using TNO.Core.Extensions;
using TNO.DAL.Models;
using TNO.Elastic;
using TNO.Entities;

namespace TNO.DAL.Services;

public class ReportService : BaseService<Report, int>, IReportService
{
    #region Variables
    private readonly ITNOElasticClient _client;
    private readonly JsonSerializerOptions _serializerOptions;
    #endregion

    #region Constructors
    public ReportService(
        TNOContext dbContext,
        ClaimsPrincipal principal,
        ITNOElasticClient client,
        IServiceProvider serviceProvider,
        IOptions<JsonSerializerOptions> serializerOptions,
        ILogger<ReportService> logger) : base(dbContext, principal, serviceProvider, logger)
    {
        _client = client;
        _serializerOptions = serializerOptions.Value;
    }
    #endregion

    #region Methods
    /// <summary>
    /// Find all the reports.
    /// </summary>
    /// <returns></returns>
    public IEnumerable<Report> FindAll()
    {
        return this.Context.Reports
            .AsNoTracking()
            .Include(r => r.Owner)
            .Include(r => r.Template).ThenInclude(t => t!.ChartTemplates)
            .Include(r => r.Sections)
            .Include(r => r.SubscribersManyToMany).ThenInclude(s => s.User)
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name).ToArray();
    }

    /// <summary>
    /// Find all the public reports.
    /// </summary>
    /// <returns></returns>
    public IEnumerable<Report> GetPublic()
    {
        return this.Context.Reports
            .AsNoTracking()
            .Include(r => r.Owner)
            .Include(r => r.Template).ThenInclude(t => t!.ChartTemplates)
            .Include(r => r.Sections)
            .Include(r => r.SubscribersManyToMany).ThenInclude(s => s.User)
            .Where(r => r.IsPublic == true)
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name).ToArray();
    }

    /// <summary>
    /// Find all reports that match the filter.
    /// </summary>
    /// <param name="filter"></param>
    /// <returns></returns>
    public IEnumerable<Report> Find(ReportFilter filter)
    {
        var query = this.Context.Reports
            .AsNoTracking();

        if (filter.IsPublic.HasValue)
            query = query.Where(r => r.IsPublic);

        if (filter.OwnerId.HasValue && filter.IsPublicOrOwner == true)
            query = query.Where(r => r.OwnerId == filter.OwnerId || r.IsPublic);
        else if (filter.OwnerId.HasValue)
            query = query.Where(r => r.OwnerId == filter.OwnerId);

        if (!String.IsNullOrWhiteSpace(filter.Name))
            query = query.Where(r => EF.Functions.Like(r.Name, $"%{filter.Name}%"));

        return query.ToArray();
    }

    /// <summary>
    /// Find the report for the specified 'id'.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public override Report? FindById(int id)
    {
        return this.Context.Reports
            .Include(r => r.Owner)
            .Include(r => r.Template).ThenInclude(t => t!.ChartTemplates)
            .Include(r => r.Sections).ThenInclude(s => s.Filter)
            .Include(r => r.Sections).ThenInclude(s => s.Folder)
            .Include(r => r.Sections).ThenInclude(s => s.ChartTemplatesManyToMany).ThenInclude(c => c.ChartTemplate)
            .Include(r => r.SubscribersManyToMany).ThenInclude(s => s.User)
            .Include(r => r.Schedules).ThenInclude(s => s.Schedule)
            .FirstOrDefault(r => r.Id == id);
    }


    /// <summary>
    /// Find the reports for the specified user.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public IEnumerable<Report> FindMyReports(int userId)
    {
        return this.Context.Reports
            .Include(f => f.Owner)
            .Include(r => r.Template).ThenInclude(t => t!.ChartTemplates)
            .Include(r => r.Sections)
            .Include(r => r.SubscribersManyToMany).ThenInclude(s => s.User)
            .Where(f => f.OwnerId == userId)
            .OrderBy(r => r.SortOrder).ThenBy(r => r.Name).ToArray();
    }


    /// <summary>
    /// Add the new report to the database.
    /// Add subscribers to the report.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    public override Report Add(Report entity)
    {
        this.Context.AddRange(entity.SubscribersManyToMany);
        if (entity.Template != null)
        {
            if (entity.Template.Id == 0)
            {
                this.Context.Add(entity.Template);
                this.Context.Add(entity.Template.ChartTemplates);
                this.Context.Add(entity.Template.ChartTemplatesManyToMany);
            }
            else
            {
                this.Context.Entry(entity.Template).State = EntityState.Modified;
            }
        }
        this.Context.AddRange(entity.Sections);

        entity.Schedules.ForEach(schedule =>
        {
            if (schedule.Schedule != null)
            {
                this.Context.Add(schedule.Schedule);
                this.Context.Add(schedule);
            }
        });
        return base.Add(entity);
    }

    /// <summary>
    /// Update the report in the database.
    /// Update subscribers of the report.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    /// <exception cref="NoContentException"></exception>
    public override Report Update(Report entity)
    {
        var original = FindById(entity.Id) ?? throw new NoContentException("Entity does not exist");

        // Add/Update/Delete report subscribers.
        var originalSubscribers = original.SubscribersManyToMany.ToArray();
        originalSubscribers.Except(entity.SubscribersManyToMany).ForEach(s =>
        {
            this.Context.Entry(s).State = EntityState.Deleted;
        });
        entity.SubscribersManyToMany.ForEach(s =>
        {
            var originalSubscriber = originalSubscribers.FirstOrDefault(rs => rs.UserId == s.UserId);
            if (originalSubscriber == null)
                original.SubscribersManyToMany.Add(s);
        });

        var originalSchedules = original.Schedules.ToArray();
        originalSchedules.Except(entity.Schedules).ForEach(schedule =>
        {
            this.Context.Entry(schedule).State = EntityState.Deleted;
        });
        entity.Schedules.ForEach(schedule =>
        {
            var originalSchedule = originalSchedules.FirstOrDefault(s => s.Id == schedule.Id);
            if (originalSchedule == null)
                original.Schedules.Add(schedule);
            else
            {
                originalSchedule.Name = schedule.Name;
                originalSchedule.Description = schedule.Description;
                originalSchedule.IsEnabled = schedule.IsEnabled;
                originalSchedule.RequestSentOn = schedule.RequestSentOn;
                originalSchedule.LastRanOn = schedule.LastRanOn;
                originalSchedule.EventType = schedule.EventType;
                originalSchedule.Settings = schedule.Settings;
                originalSchedule.ReportId = schedule.ReportId;
                originalSchedule.NotificationId = schedule.NotificationId;
                originalSchedule.ScheduleId = schedule.ScheduleId;
                if (originalSchedule.Schedule != null && schedule.Schedule != null)
                {
                    originalSchedule.Schedule.Name = schedule.Schedule.Name;
                    originalSchedule.Schedule.Description = schedule.Schedule.Description;
                    originalSchedule.Schedule.IsEnabled = schedule.Schedule.IsEnabled;
                    originalSchedule.Schedule.DelayMS = schedule.Schedule.DelayMS;
                    originalSchedule.Schedule.RunOn = schedule.Schedule.RunOn;
                    originalSchedule.Schedule.StartAt = schedule.Schedule.StartAt;
                    originalSchedule.Schedule.StopAt = schedule.Schedule.StopAt;
                    originalSchedule.Schedule.RunOnlyOnce = schedule.Schedule.RunOnlyOnce;
                    originalSchedule.Schedule.Repeat = schedule.Schedule.Repeat;
                    originalSchedule.Schedule.RunOnWeekDays = schedule.Schedule.RunOnWeekDays;
                    originalSchedule.Schedule.RunOnMonths = schedule.Schedule.RunOnMonths;
                    originalSchedule.Schedule.DayOfMonth = schedule.Schedule.DayOfMonth;
                    originalSchedule.Schedule.RequestedById = schedule.Schedule.RequestedById;
                }
            }
        });

        // Add/Update the report template.
        if (entity.Template != null)
        {
            if (entity.Template.Id == 0)
            {
                // A new template has been provided.
                this.Context.Add(entity.Template);
                original.Template = entity.Template;
            }
            else
            {
                if (original.Template == null)
                {
                    // A different template has been assigned.
                    if (original.TemplateId == entity.TemplateId)
                        this.Context.Entry(entity.Template).State = EntityState.Modified;
                    else
                        this.Context.Entry(entity.Template).State = EntityState.Added;

                    original.Template = entity.Template;
                }
                else if (original.TemplateId == entity.TemplateId)
                {
                    // Update the existing template.
                    original.Template.Name = entity.Template.Name;
                    original.Template.Description = entity.Template.Description;
                    original.Template.SortOrder = entity.Template.SortOrder;
                    original.Template.IsEnabled = entity.Template.IsEnabled;
                    original.Template.Subject = entity.Template.Subject;
                    original.Template.Body = entity.Template.Body;
                    original.Template.Settings = entity.Template.Settings;
                    original.Template.Version = entity.Template.Version;
                }
                else
                {
                    // A different template is now associated to this report.
                    this.Context.Entry(entity.Template).State = EntityState.Modified;
                    original.Template = entity.Template;
                }
            }
        }

        // Add/Update/Delete report sections.
        var originalSections = original.Sections.ToArray();
        originalSections.Except(entity.Sections).ForEach(s =>
        {
            this.Context.Entry(s).State = EntityState.Deleted;
        });
        entity.Sections.ForEach(updatedSection =>
        {
            var originalSection = originalSections.FirstOrDefault(rs => rs.Id == updatedSection.Id);
            if (originalSection == null || updatedSection.Id == 0)
            {
                original.Sections.Add(updatedSection);
                this.Context.AddRange(updatedSection.ChartTemplatesManyToMany);
            }
            else
            {
                originalSection.Name = updatedSection.Name;
                originalSection.Description = updatedSection.Description;
                originalSection.IsEnabled = updatedSection.IsEnabled;
                originalSection.SortOrder = updatedSection.SortOrder;
                originalSection.Settings = updatedSection.Settings;
                originalSection.ReportId = updatedSection.ReportId;
                originalSection.FilterId = updatedSection.FilterId;
                originalSection.FolderId = updatedSection.FolderId;
                originalSection.Version = updatedSection.Version;

                // Add/Update/Delete report section chart templates.
                var originalChartTemplates = originalSection.ChartTemplatesManyToMany.ToArray();
                originalChartTemplates.Except(updatedSection.ChartTemplatesManyToMany).ForEach(c =>
                {
                    this.Context.Entry(c).State = EntityState.Deleted;
                });
                updatedSection.ChartTemplatesManyToMany.ForEach(ct =>
                {
                    var originalChartTemplate = originalChartTemplates.FirstOrDefault(m => m.ChartTemplateId == ct.ChartTemplateId);
                    if (originalChartTemplate == null || originalChartTemplate.ChartTemplateId == 0)
                        this.Context.Add(ct);
                    else
                    {
                        originalChartTemplate.SortOrder = ct.SortOrder;
                        originalChartTemplate.Settings = ct.Settings;
                    }
                });
            }
        });

        original.Name = entity.Name;
        original.Description = entity.Description;
        original.IsEnabled = entity.IsEnabled;
        original.SortOrder = entity.SortOrder;
        original.IsPublic = entity.IsPublic;
        original.TemplateId = entity.TemplateId;
        original.OwnerId = entity.OwnerId;
        original.Settings = entity.Settings;
        original.Version = entity.Version;

        return base.Update(original);
    }

    /// <summary>
    /// Make a request to Elasticsearch to find content for the specified 'report'.
    /// Makes a request for each section.
    /// If the section also references a folder it will make a request for the folder content too.
    /// </summary>
    /// <param name="index"></param>
    /// <param name="report"></param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task<Dictionary<string, Elastic.Models.SearchResultModel<API.Areas.Services.Models.Content.ContentModel>>> FindContentWithElasticsearchAsync(string index, Report report)
    {
        var results = new Dictionary<string, Elastic.Models.SearchResultModel<API.Areas.Services.Models.Content.ContentModel>>();
        var reportSettings = JsonSerializer.Deserialize<ReportSettingsModel>(report.Settings.ToJson(), _serializerOptions) ?? new();

        // Fetch the current instance of this report to exclude any content within it.
        var excludeHistoricalContentIds = reportSettings.Content.ExcludeHistorical ? this.GetReportInstanceContentToExclude(report.Id) : Array.Empty<long>();

        // Fetch other reports to exclude any content within them.
        var excludeReportContentIds = reportSettings.Content.ExcludeReports.Any()
            ? reportSettings.Content.ExcludeReports.SelectMany(this.GetReportInstanceContentToExclude).Distinct()
            : Array.Empty<long>();

        var excludeContentIds = excludeHistoricalContentIds.AppendRange(excludeReportContentIds).Distinct();
        var excludeAboveSectionContentIds = new List<long>();

        foreach (var section in report.Sections)
        {
            var sectionSettings = JsonSerializer.Deserialize<ReportSectionSettingsModel>(section.Settings.ToJson(), _serializerOptions) ?? new();

            // Content in a folder is added first.
            if (section.FolderId.HasValue)
            {
                var content = this.Context.FolderContents
                    .Include(fc => fc.Content)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Source)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Series)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Product)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Contributor)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Owner)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Labels)
                    .Include(fc => fc.Content).ThenInclude(c => c!.FileReferences)
                    .Include(fc => fc.Content).ThenInclude(c => c!.TimeTrackings)
                    .Include(fc => fc.Content).ThenInclude(c => c!.Tags)
                    .Include(fc => fc.Content).ThenInclude(c => c!.ActionsManyToMany).ThenInclude(t => t.Action)
                    .Include(fc => fc.Content).ThenInclude(c => c!.ActionsManyToMany).ThenInclude(t => t.Action)
                    .Include(fc => fc.Content).ThenInclude(c => c!.TopicsManyToMany).ThenInclude(t => t.Topic)
                    .Include(fc => fc.Content).ThenInclude(c => c!.TonePoolsManyToMany).ThenInclude(t => t.TonePool)
                    .Where(fc => fc.FolderId == section.FolderId
                        && !excludeContentIds.Contains(fc.ContentId)
                        && (!sectionSettings.RemoveDuplicates || !excludeAboveSectionContentIds.Contains(fc.ContentId)))
                    .OrderBy(fc => fc.SortOrder)
                    .ToArray();
                var folderContent = new Elastic.Models.SearchResultModel<API.Areas.Services.Models.Content.ContentModel>();
                folderContent.Hits.Hits = content
                    .Select(c => new Elastic.Models.HitModel<API.Areas.Services.Models.Content.ContentModel>()
                    {
                        Source = new API.Areas.Services.Models.Content.ContentModel(c.Content!)
                    });
                results.Add(section.Name, folderContent);
                excludeAboveSectionContentIds.AddRange(content.Select(c => c.ContentId).ToArray());
            }
            // Content in a filter is added second.
            if (section.FilterId.HasValue)
            {
                if (section.Filter == null) throw new InvalidOperationException($"Section '{section.Name}' filter is missing from report object.");

                // Modify the query to exclude content.
                var query = excludeContentIds.Any() ? AddExcludeContent(section.Filter.Query, excludeContentIds) : section.Filter.Query;

                var content = await _client.SearchAsync<API.Areas.Services.Models.Content.ContentModel>(index, query);
                content.Hits.Hits = content.Hits.Hits.Where(c => !excludeContentIds.Contains(c.Source.Id)
                    && (!sectionSettings.RemoveDuplicates || !excludeAboveSectionContentIds.Contains(c.Source.Id)));
                results.Add(section.Name, content);
                excludeAboveSectionContentIds.AddRange(content.Hits.Hits.Select(c => c.Source.Id).ToArray());
            }
        }

        return results;
    }

    /// <summary>
    /// Get the content from the current report instance for the specified 'reportId'.
    /// </summary>
    /// <param name="reportId"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    public IEnumerable<long> GetReportInstanceContentToExclude(int reportId)
    {
        var instance = this.Context.ReportInstances
            .Include(i => i.ContentManyToMany)
            .OrderByDescending(i => i.Id)
            .Where(i => i.ReportId == reportId)
            .FirstOrDefault();

        return instance?.ContentManyToMany.Select(c => c.ContentId).ToArray() ?? Array.Empty<long>();
    }

    /// <summary>
    /// Get the content from the related report instances for the specified 'reportId'.
    /// </summary>
    /// <param name="reportId"></param>
    /// <returns></returns>
    /// <exception cref="NoContentException"></exception>
    public IEnumerable<long> GetRelatedReportInstanceContentToExclude(int reportId)
    {
        var report = this.Context.Reports.FirstOrDefault(r => r.Id == reportId) ?? throw new NoContentException("Report does not exist.");
        var relatedReportIds = report.Settings.GetElementValue("instance.excludeReports", Array.Empty<int>())!;

        var contentIds = new List<long>();
        relatedReportIds.ForEach(id =>
        {
            // Get the current instance of each related report and extract the content in it.
            contentIds.AddRange(this.Context.ReportInstances
                .Include(i => i.ContentManyToMany)
                .OrderByDescending(i => i.Id)
                .Where(i => i.ReportId == id)
                .SelectMany(i => i.ContentManyToMany.Select(c => c.ContentId))
                .ToArray());
        });

        return contentIds.Distinct().ToArray();
    }

    /// <summary>
    /// Clears all content from all folders in any section of the specified 'report'.
    /// </summary>
    /// <param name="report"></param>
    /// <returns></returns>
    public Report? ClearFoldersInReport(Report report)
    {
        report.Sections.Where(s => s.Folder != null).ForEach(section =>
        {
            var folderContent = this.Context.FolderContents.Where(fc => fc.FolderId == section.FolderId).ToArray();
            this.Context.RemoveRange(folderContent);
        });

        this.Context.SaveChanges();

        return FindById(report.Id);
    }

    /// <summary>
    /// Modify the Elasticsearch 'query' and add a 'must_not' filter to exclude the specified 'contentIds'.
    /// </summary>
    /// <param name="query"></param>
    /// <param name="contentIds"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    private static JsonDocument AddExcludeContent(JsonDocument query, IEnumerable<long> contentIds)
    {
        var json = JsonNode.Parse(query.ToJson())?.AsObject();
        if (json == null) return query;

        var jMustNotTerms = JsonNode.Parse($"{{ \"terms\": {{ \"id\": [{String.Join(',', contentIds)}] }}}}")?.AsObject() ?? throw new InvalidOperationException("Failed to parse JSON");
        Console.WriteLine(json.ToJsonString());

        if (json.TryGetPropertyValue("query", out JsonNode? jQuery))
        {
            if (jQuery?.AsObject().TryGetPropertyValue("bool", out JsonNode? jQueryBool) == true)
            {
                if (jQueryBool?.AsObject().TryGetPropertyValue("must_not", out JsonNode? jQueryBoolMustNot) == true)
                {
                    jQueryBoolMustNot?.AsArray().Add(jMustNotTerms);
                }
                else
                {
                    jQueryBool?.AsObject().Add("must_not", JsonNode.Parse($"[ {jMustNotTerms.ToJsonString()} ]"));
                }
            }
            else
            {
                jQuery?.AsObject().Add("bool", JsonNode.Parse($"{{ \"must_not\": [ {jMustNotTerms.ToJsonString()} ]}}"));
            }
        }
        else
        {
            json.Add("query", JsonNode.Parse($"{{ \"bool\": {{ \"must_not\": [ {jMustNotTerms.ToJsonString()} ] }}}}"));
        }
        return JsonDocument.Parse(json.ToJsonString());
    }
    #endregion
}
