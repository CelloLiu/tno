using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TNO.API.Areas.Editor.Models.SourceAction;
using TNO.API.Models;
using TNO.DAL.Services;

namespace TNO.API.Areas.Editor.Controllers;

/// <summary>
/// SourceActionController class, provides SourceAction endpoints for the api.
/// </summary>
[Authorize]
[ApiController]
[Area("editor")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[area]/source/actions")]
[Route("api/[area]/source/actions")]
[Route("v{version:apiVersion}/[area]/source/actions")]
[Route("[area]/source/actions")]
[ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.Unauthorized)]
[ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.Forbidden)]
public class SourceActionController : ControllerBase
{
    #region Variables
    private readonly ISourceActionService _service;
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a SourceActionController object, initializes with specified parameters.
    /// </summary>
    /// <param name="service"></param>
    public SourceActionController(ISourceActionService service)
    {
        _service = service;
    }
    #endregion

    #region Endpoints
    /// <summary>
    /// Return an array of SourceSourceAction.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<SourceActionModel>), (int)HttpStatusCode.OK)]
    [SwaggerOperation(Tags = new[] { "SourceAction" })]
    public IActionResult FindAll()
    {
        return new JsonResult(_service.FindAll().Select(c => new SourceActionModel(c)));
    }
    #endregion
}
