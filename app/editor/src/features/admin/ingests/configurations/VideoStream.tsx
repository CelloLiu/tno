import { FormikSelect, FormikText } from 'components/formik';
import { useFormikContext } from 'formik';
import { useTooltips } from 'hooks';
import { IIngestModel } from 'hooks/api-editor';
import { useFormikHelpers } from 'hooks/formik';
import React from 'react';

import { Languages, TimeZones } from './constants';
import * as styled from './styled';

export const VideoStream: React.FC = (props) => {
  const { values, setFieldValue } = useFormikContext<IIngestModel>();
  const { applyPlaceholder } = useFormikHelpers();
  useTooltips();

  React.useEffect(() => {
    if (!values.configuration.fileName) {
      setFieldValue('configuration.fileName', '{schedule.Name}.mp4');
    }
  });

  const timeZone = TimeZones.find((t) => t.value === values.configuration.timeZone);
  const language = Languages.find((t) => t.value === values.configuration.language);

  return (
    <styled.IngestType>
      <FormikText
        label="Stream URL"
        name="configuration.url"
        tooltip="URL to the source stream"
        required
      />
      <FormikSelect
        label="Timezone"
        name="configuration.timeZone"
        tooltip="Timezone of the source"
        options={TimeZones}
        value={timeZone}
      />
      <FormikSelect
        label="Language"
        name="configuration.language"
        options={Languages}
        value={language}
      />
      <FormikText label="Format" name="configuration.format" tooltip="Format of the stream" />
      <p>Use "{'{schedule.Name}'}.mp4" to name the file with the schedule name.</p>
      <FormikText
        label="Output File Name"
        name="configuration.fileName"
        tooltip="File name and output format"
        placeholder="{schedule.Name}.mp4"
        onClick={applyPlaceholder}
      />
      <FormikText
        label="Frame Rate"
        name="configuration.frameRate"
        value={values.configuration.frameRate}
      />
      <FormikText
        label="Volume"
        name="configuration.volume"
        tooltip="Volume in percent or dB (1 = 100%)"
        placeholder="1"
        onClick={applyPlaceholder}
      />
      <FormikText
        label="Other Arguments"
        name="configuration.otherArgs"
        tooltip="Any other arguments to pass to the command"
      />
    </styled.IngestType>
  );
};
