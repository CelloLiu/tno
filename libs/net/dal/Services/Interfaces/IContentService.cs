
using TNO.DAL.Models;
using TNO.Entities;
using TNO.Entities.Models;

namespace TNO.DAL.Services;

public interface IContentService : IBaseService<Content, long>
{
    IPaged<Content> FindWithDatabase(ContentFilter filter, bool asNoTracking = true);
    Task<IPaged<Content>> FindWithElasticsearchAsync(ContentFilter filter);
    Content? FindByUid(string uid, string? source);

    /// <summary>
    /// Get all the notification instances for the specified 'contentId'.
    /// </summary>
    /// <param name="contentId"></param>
    /// <returns></returns>
    IEnumerable<NotificationInstance> GetNotificationsFor(long contentId);
}
