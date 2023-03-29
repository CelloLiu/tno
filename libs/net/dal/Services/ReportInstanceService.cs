using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TNO.Entities;

namespace TNO.DAL.Services;

public class ReportInstanceService : BaseService<ReportInstance, int>, IReportInstanceService
{
    #region Properties
    #endregion

    #region Constructors
    public ReportInstanceService(TNOContext dbContext, ClaimsPrincipal principal, IServiceProvider serviceProvider, ILogger<ReportInstanceService> logger) : base(dbContext, principal, serviceProvider, logger)
    {
    }
    #endregion

    #region Methods
    #endregion
}
