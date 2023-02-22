using System.Net;
using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;
using TNO.API.Areas.Services.Models.Content;
using TNO.API.Config;
using TNO.API.Models;
using TNO.API.Models.SignalR;
using TNO.API.SignalR;
using TNO.DAL.Config;
using TNO.DAL.Models;
using TNO.DAL.Services;
using TNO.Entities;
using TNO.Kafka;
using TNO.Kafka.Models;

namespace TNO.API.Areas.Services.Controllers;

/// <summary>
/// ContentController class, provides Content endpoints for the api.
/// </summary>
// [ClientRoleAuthorize(ClientRole.Administrator)]
[Authorize]
[ApiController]
[Area("services")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[area]/contents")]
[Route("api/[area]/contents")]
[Route("v{version:apiVersion}/[area]/contents")]
[Route("[area]/contents")]
[ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.Unauthorized)]
[ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.Forbidden)]
public class ContentController : ControllerBase
{
    #region Variables
    private readonly IContentService _contentService;
    private readonly IFileReferenceService _fileReferenceService;
    private readonly IUserService _userService;
    private readonly StorageOptions _storageOptions;
    private readonly IKafkaMessenger _kafkaMessenger;
    private readonly KafkaOptions _kafkaOptions;
    private readonly IHubContext<WorkOrderHub> _hub;
    private readonly ILogger _logger;
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a ContentController object, initializes with specified parameters.
    /// </summary>
    /// <param name="contentService"></param>
    /// <param name="fileReferenceService"></param>
    /// <param name="userService"></param>
    /// <param name="hub"></param>
    /// <param name="kafkaMessenger"></param>
    /// <param name="kafkaOptions"></param>
    /// <param name="storageOptions"></param>
    /// <param name="logger"></param>
    public ContentController(
        IContentService contentService,
        IFileReferenceService fileReferenceService,
        IUserService userService,
        IHubContext<WorkOrderHub> hub,
        IKafkaMessenger kafkaMessenger,
        IOptions<KafkaOptions> kafkaOptions,
        IOptions<StorageOptions> storageOptions,
        ILogger<ContentController> logger)
    {
        _contentService = contentService;
        _fileReferenceService = fileReferenceService;
        _userService = userService;
        _hub = hub;
        _kafkaMessenger = kafkaMessenger;
        _kafkaOptions = kafkaOptions.Value;
        _storageOptions = storageOptions.Value;
        _logger = logger;
    }
    #endregion

    #region Endpoints
    /// <summary>
    /// Find content for the specified 'id'.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ContentModel), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public IActionResult FindById(long id)
    {
        var result = _contentService.FindById(id);
        if (result == null) return new NoContentResult();
        return new JsonResult(new ContentModel(result));
    }

    /// <summary>
    /// Find content for the specified 'uid' and 'source'.
    /// </summary>
    /// <param name="uid"></param>
    /// <param name="source"></param>
    /// <returns></returns>
    [HttpGet("find")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ContentModel), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public IActionResult FindByUid([FromQuery] string uid, [FromQuery] string? source)
    {
        var result = _contentService.FindByUid(uid, source);
        if (result == null) return new NoContentResult();
        return new JsonResult(new ContentModel(result));
    }

    /// <summary>
    /// Add new content to the database.
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ContentModel), (int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.BadRequest)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public async Task<IActionResult> AddAsync(ContentModel model)
    {
        var content = _contentService.AddAndSave((Content)model);

        if (!String.IsNullOrWhiteSpace(_kafkaOptions.IndexingTopic))
        {
            if (content.Status == ContentStatus.Publish || content.Status == ContentStatus.Published)
                await _kafkaMessenger.SendMessageAsync(_kafkaOptions.IndexingTopic, new IndexRequestModel(content.Id, IndexAction.Publish));
            else
                await _kafkaMessenger.SendMessageAsync(_kafkaOptions.IndexingTopic, new IndexRequestModel(content.Id, IndexAction.Index));
        }
        else
            _logger.LogWarning("Kafka indexing topic not configured.");

        return new JsonResult(new ContentModel(content));

        // TODO: Figure out how to return a 201 for a route in a different controller.
        // return CreatedAtRoute("EditorContentFindById", new { id = content.Id }, new ContentModel(content));
        // return CreatedAtRoute("EditorContentFindById", new { id = content.Id }, new ContentModel(content));
    }

    /// <summary>
    /// Upload a file and link it to the specified content.
    /// Only a single file can be linked to content, each upload will overwrite.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="version"></param>
    /// <param name="files"></param>
    /// <returns></returns>
    [HttpPost("{id}/upload")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ContentModel), (int)HttpStatusCode.Created)]
    [ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.BadRequest)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public async Task<IActionResult> UploadFile([FromRoute] long id, [FromQuery] long version, [FromForm] List<IFormFile> files)
    {
        var content = _contentService.FindById(id);
        if (content == null) return new JsonResult(new { Error = "Content does not exist" })
        {
            StatusCode = StatusCodes.Status400BadRequest
        };

        if (!files.Any()) return new JsonResult(new { Error = "No file uploaded." })
        {
            StatusCode = StatusCodes.Status400BadRequest
        };

        // If the content has a file reference, then update it.  Otherwise, add one.
        content.Version = version; // TODO: Handle concurrency before uploading the file as it will result in an orphaned file.
        if (content.FileReferences.Any()) await _fileReferenceService.UploadAsync(content, files.First(), _storageOptions.GetUploadPath());
        else await _fileReferenceService.UploadAsync(new ContentFileReference(content, files.First()), _storageOptions.GetUploadPath());

        // Send notification to user who requested the content.
        if (content.OwnerId.HasValue)
        {
            var owner = content.Owner ?? _userService.FindById(content.OwnerId.Value);
            if (owner != null)
                await _hub.Clients.User(owner.Username).SendAsync("Content", new ContentMessageModel(content));
            if (owner != null)
                await _hub.Clients.All.SendAsync("Content", new ContentMessageModel(content));
        }

        return new JsonResult(new ContentModel(content));
    }

    /// <summary>
    /// Find content for the specified 'id' and download the file it references.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}/download")]
    [Produces("application/octet-stream")]
    [ProducesResponseType(typeof(FileStreamResult), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public IActionResult DownloadFile(long id)
    {
        var fileReference = _fileReferenceService.FindByContentId(id).FirstOrDefault();

        if (fileReference == null) return new JsonResult(new { Error = "File does not exist" })
        {
            StatusCode = StatusCodes.Status400BadRequest
        };

        var stream = _fileReferenceService.Download(fileReference, _storageOptions.GetUploadPath());
        return File(stream, fileReference.ContentType);
    }

    /// <summary>
    /// Re-index all content in the database.
    /// </summary>
    /// <returns></returns>
    [HttpPost("reindex")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    [ProducesResponseType(typeof(ErrorResponseModel), (int)HttpStatusCode.BadRequest)]
    [SwaggerOperation(Tags = new[] { "Content" })]
    public async Task<IActionResult> ReindexAsync()
    {
        if (!String.IsNullOrWhiteSpace(_kafkaOptions.IndexingTopic))
        {
            var index = true;
            var filter = new ContentFilter()
            {
                Page = 0,
                Quantity = 500,
            };

            while (index)
            {
                filter.Page++;
                var results = _contentService.Find(filter, true);
                foreach (var content in results.Items)
                {
                    if (content.Status == ContentStatus.Publish || content.Status == ContentStatus.Published)
                        await _kafkaMessenger.SendMessageAsync(_kafkaOptions.IndexingTopic, new IndexRequestModel(content.Id, IndexAction.Publish));
                    else
                        await _kafkaMessenger.SendMessageAsync(_kafkaOptions.IndexingTopic, new IndexRequestModel(content.Id, IndexAction.Index));
                }

                index = results.Items.Count > 0;
            }

            return new OkResult();
        }
        else
            _logger.LogWarning("Kafka indexing topic not configured.");

        return new BadRequestResult();
    }
    #endregion
}
