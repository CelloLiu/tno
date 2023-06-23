DO $$
BEGIN

UPDATE public.report SET
  "filter" = '
    {
      "size": 500,
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "publishedOn": {
                  "gte": "now/d"
                }
              }
            },
            {
              "term": {
                "status": "Published"
              }
            },
            {
              "terms": {
                "contentType": [
                  "PrintContent",
                  "Image"
                ]
              }
            },
            {
              "terms": {
                "isHidden": [
                  false
                ]
              }
            },
            {
              "bool": {
                "should": [
                  {
                    "terms": {
                      "sourceId": [
                        91,
                        246,
                        247,
                        248,
                        249
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }'::jsonb,
    "template" = '@inherits RazorEngineCore.RazorEngineTemplateBase<TNO.Services.Reporting.Models.TemplateModel>
@using System
@using System.Linq
@using TNO.Entities
@{
    var groups = Content.GroupBy(
      c => $"{c.Source?.SortOrder}-{c.Source?.Name}",
      c => c,
      (k, c) => new { Key = k, Content = c }).OrderBy(c => c.Key);
    var content = Content.ToArray();
    var frontPages = content.Where(x => x.ContentType == ContentType.Image);
    var today = System.DateTime.Now.ToString("dd-MMMM-yyyy");
}
<h2 id="top">Today''s News Online - Morning Report</h2>
<div style="color:red;">DO NOT FORWARD THIS EMAIL TO ANYONE</div>
<br />
<div>@System.DateTime.Now.ToString("dddd, MMMM d, yyyy")</div>
<br />
<h3>Table of Contents</h3>
<ul>
    <li><a href="#front-pages">Front pages</a></li>
</ul>
@foreach (var group in groups)
{
    <ul>
        <li><b>@group.Key.Split("-").LastOrDefault()</b></li>
        @foreach (var c in group.Content)
        {
            var byline = !System.String.IsNullOrWhiteSpace(c.Byline) ? $" - {c.Byline}" : "";
            var key = "item-" + c.Id;
            <li><a href="#@key">@c.Headline @byline - @group.Key - @today</a></li>
        }
    </ul>
}
<hr />
<a id="front-pages" href="#top">top</a>
<h3 style="margin-top: 0.5rem;">Front Pages</h3>
@foreach (var frontPage in frontPages)
{
    if (!string.IsNullOrEmpty(frontPage.ImageContent))
    {
        var src = $"data:{frontPage.ContentType};base64," + frontPage.ImageContent;
        <img src="@src" alt="@frontPage.FileReferences.FirstOrDefault()?.FileName" />
    }
}
@for (var i = 0; i < content.Length; i++)
{
    var item = content[i];
    var hasPrev = i > 0;
    var prev = hasPrev ? content[i - 1].Id : 0;
    var hasNext = (i + 1) < content.Length;
    var next = hasNext ? content[i + 1].Id : 0;
    <div id="item-@item.Id" style="display: flex; align-items: center;">
        <hr style="width: 40%; display: inline-block;" />
        <span style="width: 60%;">@item.Source?.Name</span>
    </div>
    <a href="#top">top</a>
    <a href="#item-@prev">previous</a>
    <a href="#item-@next">next</a>
    <br />
    <br />
    <h3>@item.Headline</h3>
    <div>@item.Source?.Name</div>
    <div>@item.PublishedOn?.ToString("dddd, MMMM d, yyyy")</div>
    @if (!string.IsNullOrWhiteSpace(@item.Page))
    {
        <div>Page @item.Page</div>
    }
    @if (!string.IsNullOrWhiteSpace(@item.Byline))
    {
        <div>By @item.Byline</div>
    }
    <br />
    <div>@item.Body</div>
}
<br />
<a href="#top">top</a>
<p style="font-size: 9pt; margin-top: 0.5rem;">
    Terms of Use - This summary is a service provided by Government Communications and Public Engagement and is only intended for original addressee. All content is the copyrighted property of a third party creator of the material.
    Copying, retransmitting, archiving, redistributing, selling, licensing, or emailing the material to any third party or any employee of the Province who is not authorized to access the material is prohibited.
</p>
}'
WHERE "name" = 'Morning Report';

END $$;
