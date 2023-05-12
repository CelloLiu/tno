﻿using TNO.API.Areas.Services.Models.Content;
using TNO.Services.Notification.Config;

namespace TNO.Services.Notification.Models;

/// <summary>
/// TemplateModel class, provides a model to pass to the razor engine.
/// </summary>
public class TemplateModel
{
    #region Properties
    /// <summary>
    /// get/set - The content model.
    /// </summary>
    public ContentModel Content { get; }

    /// <summary>
    /// get - Notification options.
    /// </summary>
    public NotificationOptions NotificationOptions { get; }
    #endregion

    #region Constructors
    /// <summary>
    /// Creates a new instance of a TemplateModel, initializes with specified parameters.
    /// </summary>
    /// <param name="content"></param>
    /// <param name="options"></param>
    public TemplateModel(ContentModel content, NotificationOptions options)
    {
        this.Content = content;
        this.NotificationOptions = options;
    }
    #endregion
}
