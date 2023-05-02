DO $$
BEGIN

UPDATE public."notification"
SET
	settings=to_json(regexp_replace('{ "subject": "
		@{
			var isTranscriptAvailable = Model.Content.ContentType == ContentType.Snippet &&
				!string.IsNullOrWhiteSpace(Model.Content.Body) && Model.Content.IsApproved;

            var transcriptIcon = isTranscriptAvailable ? "check_mark.svg" : ""; 

            var toneIcon = "face-meh.svg";
            switch (Model.Content.TonePools.FirstOrDefault()?.Value)
            {
                case -3:
                case -4:
                case -5:
                    toneIcon = "face-frown-open.svg";
                    break;
                case 3:
                case 4:
                case 5:
                    toneIcon = "face-grin-wide.svg";
                    break;
            }
		}

		<span>@Model.Content.Source?.Code: @Model.Content.Headline</span>

        @if (!string.IsNullOrEmpty(toneIcon))
        {
            <img src=@toneIcon alt="tone">
        }

        @if (!string.IsNullOrEmpty(transcriptIcon))
        {
            <img src=@transcriptIcon alt="transcript available">
        }
	" }', '\t', '', 'g')), 
	template='
        @if (Model.Content.Source != null)
        {
            <div>@Model.Content.Source.Code (@Model.Content.Source.Name)</div>
        }
        @if (!string.IsNullOrEmpty(Model.Content.Series?.Name))
        {
            <div>@Model.Content.Series.Name</div>
        }
        <div>@Model.Content.PublishedOn?.ToString("dd-MMM-yyyy hh:mm")</div>
        <div>@Model.Content.Body</div>
        <br />
        @if (!string.IsNullOrEmpty(Model.MmiaUrl))
        {
            <div><a href="@Model.MmiaUrl" target="_blank">MMIA...</a></div>
            <br />
        }
        @if (Model.Content.ContentType == ContentType.Snippet && !string.IsNullOrEmpty(Model.RequestTranscriptUrl))
        {
            <div><a href="@Model.RequestTranscriptUrl" target="_blank">Request Transcript...</a></div>
            <br />
        }
        @if (!string.IsNullOrEmpty(Model.AddToReportUrl))
        {
            <div><a href="@Model.AddToReportUrl" target="_blank">Add to Report</a></div>
            <br />
        }
        <br />
        <div style="font-size: small;">
            This e-mail is a service provided by Government Communications and Public Engagement and is only intended
            for the original addressee. All content is the copyrighted property of a third party creator of the material.
            Copying, retransmitting, redistributing, selling, licensing, or emailing the material to any third party or
            any employee of the Province who is not authorized to access the material is prohibited.
        </div>
	'
WHERE name='Basic Alert';

END $$;
