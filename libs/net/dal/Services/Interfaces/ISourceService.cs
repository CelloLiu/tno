
using TNO.Entities;
using TNO.Entities.Models;
using TNO.Models.Filters;

namespace TNO.DAL.Services;

public interface ISourceService : IBaseService<Source, int>
{
    IEnumerable<Source> FindAll();
    IPaged<Source> Find(SourceFilter filter);
    Source? FindByCode(string code);
    Source UpdateAndSave(Source entity, bool updateChildren = false);
}
